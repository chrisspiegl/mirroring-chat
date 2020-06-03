/* eslint-disable no-shadow */
import Vue from 'vue'

import vm from '@/main.js'
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
  ADD_CHAT_MESSAGE(state, chatMessage) {
    state.chatMessages.push(chatMessage)
    state.chatMessagesLastUpdated = new Date()
  },
  REMOVE_CHAT_MESSAGE(state, chatMessage) {
    state.chatMessages.splice(
      state.chatMessages.findIndex((item) => item.idChatMessage === chatMessage.idChatMessage),
      1,
    )
  },
}

export const actions = {
  init({ commit }) {},
  afterAuth({ dispatch, rootGetters }) {
    if (rootGetters['auth/loggedInAndActivated']) {
      dispatch('fetchChatMessages')
      dispatch('CONNECT_CHAT_SOCKET')
    }
  },
  afterAuthLogOut({ dispatch }) {
    dispatch('DISCONNECT_CHAT_SOCKET')
  },
  fetchChatMessages({ commit, dispatch, state }) {
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
    apiCall({
      url: `/v1/chat/message/${chatMessage.idChatMessage}`,
      method: 'PUT',
      data: { ...chatMessage, ...{ doneAt: new Date() } },
    }).then((chatMessage) => {
      commit('UPDATE_CHAT_MESSAGE', chatMessage)
    })
  },
  async timeoutChatMessage({ dispatch }, chatMessage) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `/v1/chat/message/${chatMessage.idChatMessage}/timeout`,
        method: 'POST',
        data: chatMessage,
      })
        .then((data) => {
          dispatch('removeChatMessagesByAuthor', chatMessage)
          resolve(data)
        })
        .catch((err) => reject(err))
    })
  },
  async banChatMessage({ dispatch }, chatMessage) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `/v1/chat/message/${chatMessage.idChatMessage}/ban`,
        method: 'POST',
        data: chatMessage,
      })
        .then((data) => {
          dispatch('removeChatMessagesByAuthor', chatMessage)
          resolve(data)
        })
        .catch((err) => reject(err))
    })
  },
  CONNECT_CHAT_SOCKET({ rootState }) {
    Vue.$log.debug('CONNECT_CHAT_SOCKET')
    vm.$socket.emit('CHAT_CONNECT', {
      idUser: rootState.auth.userCurrent.idUser,
    })
  },
  removeChatMessagesByAuthor({ commit, state }, chatMessage) {
    const { idAuthorProvider } = chatMessage
    const chatMessages = state.chatMessages.filter((m) => m.idAuthorProvider === idAuthorProvider)
    chatMessages.forEach((chatMessage) => commit('REMOVE_CHAT_MESSAGE', chatMessage))
  },
  DISCONNECT_CHAT_SOCKET({ rootState }) {
    Vue.$log.debug('DISCONNECT_CHAT_SOCKET')
    vm.$socket.emit('CHAT_DISCONNECT')
  },
  SOCKET_CHAT_CONNECTED({ commit }, message) {
    Vue.$log.debug('SOCKET_CHAT_CONNECTED -> message', message)
  },
  SOCKET_CHAT_DISCONNECTED({ commit }, message) {
    Vue.$log.debug('SOCKET_CHAT_DISCONNECTED -> message', message)
  },
  SOCKET_ADD_CHAT_MESSAGE({ commit }, message) {
    Vue.$log.debug('SOCKET_ADD_CHAT_MESSAGE -> message', message)
    commit('ADD_CHAT_MESSAGE', message.data)
  },
}
