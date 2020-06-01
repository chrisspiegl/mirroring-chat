/* eslint-disable global-require */
import store from '@/state/store'
import lazyLoadView from './helpers/lazyLoadView'

export default [
  {
    path: '/',
    name: 'base',
    beforeResolve: (to, from, next) => {
      // If the user is already logged in
      if (store.getters['auth/loggedIn']) {
        return next({ name: 'dashboard' })
      }
      return next('/home')
    },
  },
  {
    path: '/home',
    name: 'home',
    component: () => lazyLoadView(import('@/views/Home')),
  },
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@/views/Login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'dashboard' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/login/success',
    name: 'loginSuccess',
    component: () => lazyLoadView(import('@/views/LoginSuccess')),
  },
  {
    path: '/login/failed',
    name: 'loginFailed',
    component: () => lazyLoadView(import('@/views/LoginFailed')),
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store.dispatch('auth/logOut')
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) => route.meta.authRequired)
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
      },
    },
  },
  {
    path: '/not-activated',
    name: 'notActivated',
    component: () => lazyLoadView(import('@/views/NotActivated')),
    meta: {
      authRequired: true,
      beforeResolve: (to, from, next) => {
        // If the user is already logged in and activated
        if (store.getters['auth/activated']) {
          return next({ name: 'dashboard' })
        }
        return next()
      },
    },
  },
  {
    path: '/account',
    name: 'account',
    component: () => lazyLoadView(import('@/views/Account')),
    meta: {
      authRequired: true,
      activationRequired: true,
    },
  },
  {
    path: '/account/telegram',
    name: 'accountTelegram',
    component: () => lazyLoadView(import('@/views/AccountTelegram')),
    meta: {
      authRequired: true,
      activationRequired: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => lazyLoadView(import('@/views/Dashboard')),
    meta: {
      authRequired: true,
      activationRequired: true,
    },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => lazyLoadView(import('@/views/Chat')),
    meta: {
      authRequired: true,
      activationRequired: true,
      keepAlive: true,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => lazyLoadView(import('@/views/Admin')),
    meta: {
      authRequired: true,
      activationRequired: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => lazyLoadView(import('@/views/About')),
  },
  {
    path: '/support',
    name: 'support',
    component: () => lazyLoadView(import('@/views/Support')),
  },

  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => lazyLoadView(import('@/views/profile')),
  //   meta: {
  //     authRequired: true,
  //   },
  //   props: (route) => ({ user: store.state.auth.currentUser || {} }),
  // },
  // {
  //   path: '/profile/:username',
  //   name: 'username-profile',
  //   component: () => lazyLoadView(import('@/views/profile')),
  //   meta: {
  //     authRequired: true,
  //     beforeResolve(routeTo, routeFrom, next) {
  //       store
  //         // Try to fetch the user's information by their username
  //         .dispatch('users/fetchUser', { username: routeTo.params.username })
  //         .then((user) => {
  //           // Add the user to the route params, so that it can
  //           // be provided as a prop for the view component below.
  //           routeTo.params.user = user
  //           // Continue to the route.
  //           next()
  //         })
  //         .catch(() => {
  //           // If a user with the provided username could not be
  //           // found, redirect to the 404 page.
  //           next({ name: '404', params: { resource: 'User' } })
  //         })
  //     },
  //   },
  //   // Set the user from the route params, once it's set in the
  //   // beforeResolve route guard.
  //   props: (route) => ({ user: route.params.user }),
  // },

  {
    path: '/404',
    name: '404',
    component: require('@/views/404').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
]
