/* eslint-disable no-shadow */
import Vue from 'vue'
import apiCall from '@/utils/api'

import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
} from '../actions/user'
import {
  AUTH_LOGOUT,
} from '../actions/auth'

const state = {
  status: '',
  profile: JSON.parse(localStorage.getItem('profileUser') || '{}'),
}

const getters = {
  getProfile: (state) => state.profile,
  isProfileLoaded: (state) => !!state.profile.idUser,
}

const actions = {
  [USER_REQUEST]: ({
    commit,
    dispatch,
  }) => {
    commit(USER_REQUEST)
    apiCall({
      url: '/v1/user/me',
    })
      .then((resp) => {
        commit(USER_SUCCESS, resp)
      })
      .catch(() => {
        commit(USER_ERROR)
        // if resp is unauthorized, logout, to
        dispatch(AUTH_LOGOUT)
      })
  },
}

const mutations = {
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    localStorage.setItem('profileUser', JSON.stringify(resp.data))
    Vue.set(state, 'profile', resp.data)
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: (state) => {
    state.profile = {}
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
