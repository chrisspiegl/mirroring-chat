import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
    },
  },
  {
    path: '/chat',
    name: 'Chat',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "chat" */ '@/views/Chat.vue')
    },
  },
  {
    path: '/about',
    name: 'About',
    component() {
      // route level code-splitting this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

console.log('router initialized')
