/* eslint-disable no-shadow */
import Vue from 'vue'
import { apiCall, setDefaultAuthHeaders } from '@/utils/api'

// Mixing: https://blog.sqreen.com/authentication-best-practices-vue/ and https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/router/views/login.vue

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  if (state) {
    return window.localStorage.setItem(key, JSON.stringify(state))
  }
  return window.localStorage.removeItem(key)
}

// ==
// Auth Module
// ==

export const state = {
  userCurrent: getSavedState('auth.userCurrent'),
  userToken: getSavedState('auth.userToken'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.userCurrent = newValue
    saveState('auth.userCurrent', state.userCurrent)
  },
  SET_CURRENT_USER_TOKEN(state, newValue) {
    state.userToken = newValue
    saveState('auth.userToken', state.userToken)
    setDefaultAuthHeaders(state.userToken)
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) { return !!state.userToken && !!state.userCurrent },
  activated(state) { return !!state.userCurrent.activatedAt },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  async init({ state, dispatch }) {
    setDefaultAuthHeaders(state.userToken)
    await dispatch('validate')
    await dispatch('userSettings/fetchUserSettings', {}, { root: true })
  },

  // Logs in the current user.
  logIn({ commit, dispatch, getters } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return apiCall({
      url: '/v1/auth/token',
      method: 'post',
      data: {},
    })
      .then((data) => {
        commit('SET_CURRENT_USER', data.user)
        commit('SET_CURRENT_USER_TOKEN', data.token)
        return data
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          commit('SET_CURRENT_USER', null)
          commit('SET_CURRENT_USER_TOKEN', null)
        } else {
          Vue.$log.warn(error)
        }
        return null
      })
  },

  // Logs out the current user.
  logOut({ commit }) {
    commit('SET_CURRENT_USER', null)
    commit('SET_CURRENT_USER_TOKEN', null)
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate({ commit, getters }) {
    console.log('VALIDATING')
    console.log('logged in : ', getters.loggedIn)


    if (!getters.loggedIn) return Promise.resolve(null)

    return apiCall({
      url: '/v1/auth/token',
      method: 'get',
    })
      .then((data) => {
        commit('SET_CURRENT_USER', data.user)
        commit('SET_CURRENT_USER_TOKEN', data.token)
        setDefaultAuthHeaders(state.userToken)
        return data
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          commit('SET_CURRENT_USER', null)
          commit('SET_CURRENT_USER_TOKEN', null)
        } else {
          Vue.$log.warn(error)
        }
        return null
      })
  },
}
