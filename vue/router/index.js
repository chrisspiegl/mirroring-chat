import Vue from 'vue'
import VueRouter from 'vue-router'
// import axios from 'axios'
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


// NOTE: Good idea but right now I feel like my logic is flawed
// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (localStorage.getItem('jwt') == null || localStorage.getItem('jwt') === '') {
//       // if user has no JWT token, ask the api if the user is logged in and get the token
//       axios.get('/api/v1/jwt').then((response) => {
//         if (response.data && response.data.jwt !== '') {
//           const token = response.data.jwt
//           const { user } = response.data
//           localStorage.setItem('jwt', token)
//           localStorage.setItem('user', JSON.stringify(user))
//           // user is logged in with a session and got a token from the server
//           return next()
//         }
//         // user is not logged in and did not get a token from the server sending to login
//         return next({
//           path: '/auth/login',
//           params: {
//             nextUrl: to.fullPath,
//           },
//         })
//       })
//     }
//     // user already has jwt token in local storage
//     const user = JSON.parse(localStorage.getItem('user'))
//     if (to.matched.some((record) => record.meta.is_admin)) {
//       // user needs to be admin for this route.
//       if (user.is_admin === 1) {
//         // route requires admin and user is admin
//         return next()
//       }
//       // route requires admin and user is not admin
//       return next({
//         name: 'dashboard',
//       })
//     }
//     // user is logged and authorized for this route
//     return next()
//   } if (to.matched.some((record) => record.meta.guest)) {
//     if (localStorage.getItem('jwt') == null) {
//       // only guests can see this page
//       return next()
//     }
//     // logged in users are redirected to dashboard
//     return next({
//       name: 'dashboard',
//     })
//   }
//   return next()
// })

export default router

console.log('router initialized')
