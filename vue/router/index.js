import Vue from 'vue'
import VueRouter from 'vue-router'


import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import LoginSuccess from '@/views/LoginSuccess.vue'
import LoginFailed from '@/views/LoginFailed.vue'
import Logout from '@/views/Logout.vue'
import NotFound from '@/views/404.vue'
import store from '@/store'

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

const routes = [{
  path: '/',
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
  path: '/account',
  name: 'Account',
  component() {
    // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
    return import(/* webpackChunkName: "dashboard" */ '@/views/Account.vue')
  },
  beforeEnter: ifAuthenticated,
},
{
  path: '/dashboard',
  name: 'Dashboard',
  component() {
    // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
    return import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  },
  beforeEnter: ifAuthenticated,
},
{
  path: '/chat',
  name: 'Chat',
  component() {
    // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
    return import(/* webpackChunkName: "chat" */ '@/views/Chat.vue')
  },
  beforeEnter: ifAuthenticated,
},
{
  path: '/admin',
  name: 'Admin',
  component() {
    // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
    return import(/* webpackChunkName: "chat" */ '@/views/Admin.vue')
  },
  beforeEnter: ifAuthenticated,
},
{
  path: '/about',
  name: 'About',
  component() {
    // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
    return import(/* webpackChunkName: "about" */ '@/views/About.vue')
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

console.log('router initialized')
