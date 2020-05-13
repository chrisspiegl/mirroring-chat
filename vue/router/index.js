import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
    },
  },
  {
    path: '/chat',
    name: 'chat',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "chat" */ '@/views/Chat.vue')
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "chat" */ '@/views/Admin.vue')
    },
    meta: {
      requiresAuth: true,
      is_admin: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
  },
  // Separated into two routes so that you can also programmatically
  // direct the user to the /404 if missing some data, etc.
  { path: '/404', component: NotFound },
  { path: '*', component: NotFound },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

console.log('router initialized')
