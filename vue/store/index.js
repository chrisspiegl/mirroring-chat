import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import auth from './modules/auth'

Vue.use(Vuex)

// TODO: make config / NODE_ENV available to the frontend
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    auth,
  },
  strict: debug,
  state: {
  },
  mutations: {
  },
  actions: {
  },
})
