/* eslint-disable import/no-cycle */
import Vue from 'vue'
import Vuex from 'vuex'

import packageJson from '@/../package.json'
import dispatchActionForAllModules from '@/utils/dispatch-action-for-all-modules'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
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
      state.isMobile = payload.width < 500
    },
  },
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production',
})

export default store

// Automatically run the `init` action for every module, if one exists.
dispatchActionForAllModules('init')
