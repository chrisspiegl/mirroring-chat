/* eslint-disable no-shadow */

// Inspired by: https://cushionapp.com/journal/reactive-time-with-vuejs/

import {
  UPDATE_TIME,
} from '../actions/time'

const state = {
  now: new Date(),
}

const actions = {
  start({ commit }) {
    setInterval(() => {
      commit(UPDATE_TIME)
    }, 1000)
  },
}

const mutations = {
  [UPDATE_TIME]: (state) => {
    state.now = new Date()
  },
}

export default {
  state,
  actions,
  mutations,
}
