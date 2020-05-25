import Vue from 'vue'
import Vuex from 'vuex'

import packageJson from '@/../package.json'

import user from './modules/user'
import auth from './modules/auth'
import time from './modules/time'

Vue.use(Vuex)

// TODO: make config / NODE_ENV available to the frontend
const debug = process.env.NODE_ENV !== 'production'

const mainStore = new Vuex.Store({
  modules: {
    user,
    auth,
    time,
  },
  strict: debug,
  state: {
    isMobile: false,
    windowHeight: 450,
    windowWidth: 450,
    version: packageJson.version,
  },
  mutations: {
    CHANGE_IS_MOBILE(state, payload) {
      state.windowHeight = payload.height
      state.windowWidth = payload.width
      state.isMobile = (payload.width < 500)
    },
  },
  actions: {
  },
})

mainStore.dispatch('start')

export default mainStore
