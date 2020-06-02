/* eslint-disable no-shadow */
import Vue from 'vue'

import { apiCall } from '@/utils/api'

export const state = {
  status: '',
  ready: false,
  hasLoadedOnce: false,
  chatMessages: [],
  chatMessagesLastUpdated: {},
}

export const getters = {
  chatMessagesUndone: (state) => state.chatMessages.filter((m) => !m.doneAt && !m.message.startsWith('!drop')),
  chatMessagesReversed: (state) => state.chatMessages.slice().reverse(),
}

export const mutations = {
  SET_CHAT_MESSAGES(state, chatMessages) {
    chatMessages.forEach((chatMessage) => {
      state.chatMessages.push(chatMessage)
    })
    state.status = 'success'
    state.ready = true
    state.hasLoadedOnce = true
    state.chatMessagesLastUpdated = new Date()
    return chatMessages
  },
  UPDATE_CHAT_MESSAGE(state, chatMessage) {
    const index = state.chatMessages.findIndex((item) => item.idChatMessage === chatMessage.idChatMessage)
    if (index === -1) return
    Vue.set(state.chatMessages, index, chatMessage)
    state.chatMessagesLastUpdated = new Date()
  },
}

export const actions = {
  init({ commit }) {},
  fetchChatMessages({ commit, state }) {
    if (state.ready) return state.chatMessages
    return apiCall({
      url: '/v1/chat/messages',
      method: 'get',
    })
      .then((chatMessages) => commit('SET_CHAT_MESSAGES', chatMessages))
      .catch((err) => {
        throw new Error(`load chatMessages ${err}`)
      })
  },
  async markChatMessageDone({ commit }, chatMessage) {
    console.log('markChatMessageDone -> chatMessage', chatMessage)
    apiCall({
      url: `/v1/chat/message/${chatMessage.idChatMessage}`,
      method: 'PUT',
      data: { ...chatMessage, ...{ doneAt: new Date() } },
    }).then((chatMessage) => {
      console.log('markChatMessageDone -> chatMessage', chatMessage)
      commit('UPDATE_CHAT_MESSAGE', chatMessage)
    })
  },
  async timeoutChatMessage({ commit }, chatMessage) {
    // TODO: send timeout request to api & destroy all messages by this user (make chat table permanent so that this is reversible)
    // apiCall({
    //   url: `/v1/chat/message/${message.idChatMessage}/timeout`,
    //   method: 'POST',
    //   data: { message },
    // })
  },
  async banChatMessage({ commit }, chatMessage) {
    // TODO: send ban request to api & destroy all messages by this user (make chat table permanent so that this is reversible)
    // apiCall({
    //   url: `/v1/chat/message/${message.idChatMessage}/ban`,
    //   method: 'POST',
    //   data: { message },
    // })

  },
}
