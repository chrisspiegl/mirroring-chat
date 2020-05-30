/* eslint-disable no-shadow */
import Vue from 'vue'
import apiCall from '@/utils/api'
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
} from '../actions/auth'

const state = {
  tokenUser: localStorage.getItem('tokenUser') || '',
  status: '',
  hasLoadedOnce: false,
}

const getters = {
  isAuthenticated: (state) => !!state.tokenUser,
  authStatus: (state) => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({
    commit,
    dispatch,
  }) => new Promise((resolve, reject) => {
    commit(AUTH_REQUEST)
    apiCall({
      url: '/v1/auth/token',
      method: 'POST',
    })
      .then((resp) => {
        commit(AUTH_SUCCESS, resp)
        Vue.$log.debug(`${AUTH_REQUEST} - user login ${AUTH_SUCCESS}`)
        resolve(resp)
      })
      .catch((err) => {
        commit(AUTH_ERROR, err)
        Vue.$log.debug(`${AUTH_REQUEST} - user login ${AUTH_ERROR}`)
        localStorage.removeItem('tokenUser')
        reject(err)
      })
  }),
  [AUTH_LOGOUT]: ({
    commit,
  }) => new Promise((resolve) => {
    commit(AUTH_LOGOUT)
    Vue.$log.debug(`${AUTH_LOGOUT} - remove tokenUser from local storage`)
    localStorage.removeItem('tokenUser')
    resolve()
  }),
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.tokenUser = resp.tokenUser
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.tokenUser = ''
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
