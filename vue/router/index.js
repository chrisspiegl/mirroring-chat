import Vue from 'vue'
import VueRouter from 'vue-router'
// https://github.com/declandewet/vue-meta
import VueMeta from 'vue-meta'
// Adds a loading bar at the top during page loads.
import NProgress from 'nprogress/nprogress'
import store from '@/state/store'
import routes from './routes'

Vue.use(VueRouter)
Vue.use(VueMeta, {
  // The component option name that vue-meta looks for meta info on.
  keyName: 'page',
})

const router = new VueRouter({
  routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: 'history',
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
})

// Before each route evaluates...
router.beforeEach(async (routeTo, routeFrom, next) => {
  function redirectToLogin() {
    // Pass the original route to the login component
    next({ name: 'login', query: { redirectFrom: routeTo.fullPath } })
  }

  // If this isn't an initial page load...
  if (routeFrom.name !== null) {
    // Start the route progress bar.
    NProgress.start()
  }

  // Check if auth is required on this route
  // (including nested routes).
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired)

  // If auth isn't required for the route, just continue.
  if (!authRequired) return next()

  // If auth is required and the user is not logged in...
  if (!store.getters['auth/loggedIn']) return redirectToLogin()

  // Validate the local user token...
  const validUser = await store.dispatch('auth/validate')
  // Redirect to the login if invalid token
  if (!validUser) return redirectToLogin()

  await store.dispatch('userSettings/fetchUserSettings')

  // Check if activated account is required on this route:
  const activationRequired = routeTo.matched.some((route) => route.meta.activationRequired)
  // If activation is not required move forward to the requested page
  if (!activationRequired) return next()

  // If activation is required...
  if (!store.getters['auth/activated']) return next({ name: 'notActivated', replace: true })

  return next()
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  // Create a `beforeResolve` hook, which fires whenever
  // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // allows us to ensure data is fetched even when params change,
  // but the resolved route does not. We put it in `meta` to
  // indicate that it's a hook we created, rather than part of
  // Vue Router (yet?).
  try {
    // For each matched route...
    // eslint-disable-next-line no-restricted-syntax
    for (const route of routeTo.matched) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve, reject) => {
        // If a `beforeResolve` hook is defined, call it with
        // the same arguments as the `beforeEnter` hook.
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            // If the user chose to redirect...
            if (args.length) {
              // If redirecting to the same route we're coming from...
              if (routeFrom.name === args[0].name) {
                // Complete the animation of the route progress bar.
                NProgress.done()
              }
              // Complete the redirect.
              next(...args)
              reject(new Error('redirected'))
            } else {
              resolve()
            }
          })
        } else {
          // Otherwise, continue resolving the route.
          resolve()
        }
      })
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch (err) {
    if (err.message !== 'redirected') Vue.$log.error('beforeResolve hook error: ', err)
    return
  }

  // If we reach this point, continue resolving the route.
  next()
})

// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
