/* eslint-disable global-require */
import store from '@/state/store'
import lazyLoadView from './helpers/lazyLoadView'

export default [
  {
    // Show homepage for not logged in,
    // have a backup `/home` route for when logged in and still want to get to the home page,
    // redirect all `/` requests to dashboard for those who are logged in.
    path: '/home',
    alias: '/',
    name: 'home',
    component: () => lazyLoadView(import('@/views/Home')),
    meta: {
      beforeResolve: async (to, from, next) => {
        if (to.path !== '/home' && store.getters['auth/loggedIn']) return next({ name: 'dashboard' })
        return next()
      },
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@/views/Login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) return next({ name: 'dashboard' })
        return next()
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
        return next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
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
        if (store.getters['auth/activated']) return next({ name: 'dashboard' })
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
  {
    // Redirect any unmatched routes to the 404 page. This may
    // require some server configuration to work in production:
    // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
    path: '/404',
    alias: '*',
    name: '404',
    component: require('@/views/404').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
]
