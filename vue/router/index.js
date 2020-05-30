import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import LoginSuccess from '@/views/LoginSuccess.vue'
import LoginFailed from '@/views/LoginFailed.vue'
import Logout from '@/views/Logout.vue'
import NotFound from '@/views/404.vue'
import NotActivated from '@/views/NotActivated.vue'
import store from '@/store'

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticatedAndActivated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next('/login')
    return
  }
  if (!store.getters.isActivated) {
    next('/not-activated')
    return
  }
  next()
}

const routes = [
  {
    path: '/',
    name: 'Root',
    beforeEnter: (to, from, next) => {
      if (store.getters.isAuthenticated) {
        return next('/dashboard')
      }
      return next('/home')
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/login/success',
    name: 'LoginSuccess',
    component: LoginSuccess,
  },
  {
    path: '/login/failed',
    name: 'LoginFailed',
    component: LoginFailed,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/not-activated',
    name: 'NotActivated',
    component: NotActivated,
  },
  {
    path: '/account',
    name: 'Account',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "dashboard" */ '@/views/Account.vue')
    },
    beforeEnter: ifAuthenticatedAndActivated,
  },
  {
    path: '/account/telegram',
    name: 'AccountTelegram',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "dashboard" */ '@/views/AccountTelegram.vue')
    },
    beforeEnter: ifAuthenticatedAndActivated,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
    },
    beforeEnter: ifAuthenticatedAndActivated,
  },
  {
    path: '/chat',
    name: 'Chat',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "chat" */ '@/views/Chat.vue')
    },
    beforeEnter: ifAuthenticatedAndActivated,
  },
  {
    path: '/admin',
    name: 'Admin',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "chat" */ '@/views/Admin.vue')
    },
    beforeEnter: ifAuthenticatedAndActivated,
  },
  {
    path: '/about',
    name: 'About',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
  },
  {
    path: '/support',
    name: 'Support',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "about" */ '@/views/Support.vue')
    },
  },
  // Separated into two routes so that you can also programmatically
  // direct the user to the /404 if missing some data, etc.
  {
    path: '/404',
    component: NotFound,
  },
  {
    path: '*',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

Vue.$log.debug('router.js initialized')
