/* eslint-disable no-shadow */
import Vue from 'vue'

import { apiCall } from '@/utils/api'


export const state = {
  status: '',
  ready: false,
  hasLoadedOnce: false,
  chats: [],
}

export const getters = {
  chatsActiveOrPermanent: (state) => state.chats.filter((chat) => !!chat.isPermanent || chat.status === 'active'),
  chatsUpcoming: (state) => state.chats.filter((chat) => chat.status === 'upcoming'),
  chatsPast: (state) => state.chats.filter((chat) => !['upcoming', 'permanent', 'live', 'active'].includes(chat.status)),
}

export const mutations = {
  SET_CHATS(state, chats) {
    chats.forEach((chat) => {
      state.chats.push(chat)
    })
    state.status = 'success'
    state.ready = true
    state.hasLoadedOnce = true
    return chats
  },
  UPDATE_CHAT(state, chat) {
    const index = state.chats.findIndex((item) => item.idChat === chat.idChat)
    if (index === -1) return
    Vue.set(state.chats, index, chat)
  },
}

export const actions = {
  init({ commit }) {},
  fetchChats({ commit, state }) {
    if (state.ready) return state.chats
    return apiCall({
      url: '/v1/chats',
      method: 'get',
    })
      .then((chats) => {
        commit('SET_CHATS', chats)
      })
      .catch((err) => {
        throw new Error(`load chats ${err}`)
      })
  },
  updateChat({ commit }, { chat, changes }) {
    console.log('updateChat -> changes', changes)
    const chatUpdated = { ...chat, ...changes }
    console.log('updateChat -> changes', chatUpdated.isTracked)

    apiCall({
      url: `/v1/chat/${chat.idChat}`,
      method: 'put',
      data: chatUpdated,
    })
      .then((chat) => {
        commit('UPDATE_CHAT', chat)
      })
      .catch((err) => {
        throw new Error(`updateChat ${err}`)
      })
  },
}
