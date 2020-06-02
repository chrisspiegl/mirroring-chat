/* eslint-disable no-shadow */
import Vue from 'vue'

import { apiCall } from '@/utils/api'

const DEFAULT_USER_SETTING_VALUE = false

export const state = {
  status: '',
  ready: false,
  hasLoadedOnce: false,
  userSettings: [],
}

export const getters = {
  getUserSettingValueByKey: (state, getters) => ({ key, defaultValue }) => {
    console.log('key', key)
    const element = getters.getUserSettingByKey({ key })
    console.log('element', element)
    if (element) return getters.getUserSettingByKey({ key }).value
    return defaultValue || DEFAULT_USER_SETTING_VALUE
  },
  getUserSettingByKey: (state) => ({ key }) => {
    const index = state.userSettings.findIndex((item) => item.key === key)
    return state.userSettings[index]
  },
}

export const mutations = {
  SET_USER_SETTINGS(state, userSettings) {
    userSettings.forEach((userSetting) => {
      state.userSettings.push(userSetting)
    })
    state.status = 'success'
    state.ready = true
    state.hasLoadedOnce = true
    return userSettings
  },
  ADD_USER_SETTING(state, userSetting) {
    state.userSettings.push(userSetting)
  },
  REMOVE_USER_SETTING(state, userSetting) {
    state.userSettings.splice(state.userSettings.findIndex((item) => item.idUserSetting === userSetting.idUserSetting || item.key === userSetting.key), 1)
  },
  UPDATE_USER_SETTING(state, userSetting) {
    const index = state.userSettings.findIndex((item) => item.idUserSetting === userSetting.idUserSetting)
    if (index === -1) return
    Vue.set(state.userSettings, index, userSetting)
  },
}

export const actions = {
  init({ commit }) {},
  fetchUserSettings({ commit, state }) {
    if (state.ready) return state.userSettings
    return apiCall({
      url: '/v1/userSettings',
      method: 'get',
    })
      .then((userSettings) => {
        commit('SET_USER_SETTINGS', userSettings)
      })
      .catch((err) => {
        throw new Error(`loadUserSettings ${err}`)
      })
  },
  // async fetchUserSettingByKey({ state, dispatch, getters }, { key, defaultValue }) {
  //   if (Object.keys(state.userSettings).length === 0) await dispatch('fetchUserSettings')
  //   const userSetting = getters.getUserSettingByKey({ key })
  //   if (userSetting) return userSetting
  //   return dispatch('createUserSetting', {
  //     key,
  //     value: defaultValue || false,
  //   })
  // },
  createUserSetting({ commit }, newUserSetting) {
    apiCall({
      url: '/v1/userSetting',
      method: 'post',
      data: newUserSetting,
    })
      .then((userSetting) => {
        commit('ADD_USER_SETTING', userSetting)
      })
      .catch((err) => {
        throw new Error(`createUserSetting ${err}`)
      })
  },
  updateUserSettingByKey({ dispatch, getters }, { key, value }) {
    const userSetting = getters.getUserSettingByKey({ key })
    if (userSetting) {
      dispatch('updateUserSetting', { ...userSetting, value })
    } else {
      dispatch('createUserSetting', { key, value })
    }
  },
  updateUserSetting({ commit }, userSetting) {
    apiCall({
      url: `/v1/userSetting/${userSetting.idUserSetting}`,
      method: 'put',
      data: userSetting,
    })
      .then((userSetting) => {
        console.log('updateUserSetting -> userSetting', userSetting)
        commit('UPDATE_USER_SETTING', userSetting)
      })
      .catch((err) => {
        throw new Error(`updateUserSetting ${err}`)
      })
  },
}
