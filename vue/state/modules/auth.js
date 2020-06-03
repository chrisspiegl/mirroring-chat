/* eslint-disable no-shadow */
import Vue from 'vue'
import { subMinutes, isAfter } from 'date-fns'

import dispatchActionForAllModules from '@/utils/dispatch-action-for-all-modules'
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
  userTokenLastValidation: null,
  userTokenWasValidatedOnce: false,
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
  SET_LAST_VALIDATION(state, newValue) {
    state.userTokenLastValidation = newValue
    state.userTokenWasValidatedOnce = (!!newValue)
  },
}

export const getters = {
  loggedIn(state) {
    return !!state.userToken && !!state.userCurrent
  },
  activated(state) {
    return !!state.userCurrent.activatedAt
  },
  loggedInAndActivated(state, getters) {
    return getters.loggedIn && getters.activated
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  async init({ state, dispatch, getters }) {
    setDefaultAuthHeaders(state.userToken)
    await dispatch('validate')
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
  logOut({ dispatch }) {
    apiCall({
      method: 'get',
      url: '/v1/auth/logout',
    }).then((data) => {
      dispatch('invalidate')
      dispatchActionForAllModules('afterAuthLogOut')
      console.log('LOGOUT INVALIDATION API REQUEST RESPONSE: ', data)
    })
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate({
    commit, dispatch, getters, state,
  }) {
    Vue.$log.debug('LOGGED IN :', getters.loggedIn)
    if (!getters.loggedIn) return Promise.resolve(false)
    if (isAfter(state.userTokenLastValidation, subMinutes(new Date(), 5))) return Promise.resolve(true)
    Vue.$log.debug('VALIDATION HAS NOT HAPPENED OR EXPIRED')
    return apiCall({
      url: '/v1/auth/token',
      method: 'get',
    })
      .then((data) => {
        if (!state.userTokenWasValidatedOnce) dispatchActionForAllModules('afterAuth')
        commit('SET_CURRENT_USER', data.user)
        commit('SET_CURRENT_USER_TOKEN', data.token)
        commit('SET_LAST_VALIDATION', new Date())
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch('invalidate')
        } else {
          Vue.$log.warn(error)
        }
        return Promise.resolve(false)
      })
  },
  invalidate({ commit, getters, state }) {
    Vue.$log.debug('USER TOKEN EXPIRED OR NOT VALID')
    commit('SET_CURRENT_USER', null)
    commit('SET_CURRENT_USER_TOKEN', null)
    commit('SET_LAST_VALIDATION', null)
  },
}
