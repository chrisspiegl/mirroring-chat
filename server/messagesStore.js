process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:messagesStore`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:messagesStore:error`)

const RedisPubSubManager = require('server/redisPubSubManager')
const redisKeyGenerator = require('server/redisKeyGenerator')
const models = require('database/models')

const messageSubscribers = {}
const rpsm = new RedisPubSubManager()

const fetchByUser = (idUser, limit = 50, offset = 0) => {
  log('fetchForUser -> idUser', idUser)
  let messages = await models.ChatMessage.findAll({
    where: {
      idUser,
    },
    order: [['sentAt', 'DESC']],
    limit,
    offset,
  })
  messages = messages.reverse()
  return messages
}

const fetchByChat = async (idChat, limit = 50, offset = 0) => {
  log('fetchForChat -> idChat', idChat)
  let messages = await models.ChatMessage.findAll({
    where: {
      idChat,
    },
    order: [['sentAt', 'DESC']],
    limit,
    offset,
  })
  messages = messages.reverse()
  return messages
}

const addMessage = async (message) => {
  log('addNewMessage -> message', message)
  await models.ChatMessage.create(message)
  rpsm.publish(redisKeyGenerator.messages.stream(message.idUser), message)
  rpsm.publish(redisKeyGenerator.events, {
    event: redisKeyGenerator.event.CHAT_MESSAGE_RECEIVED,
    message,
  })
  return true
}

const isSubscribed = (idSubscriber) => !!messageSubscribers[idSubscriber]

const subscribe = (idSubscriber, idUser, callback) => {
  if (isSubscribed(idSubscriber)) return 'already-subscribed'
  messageSubscribers[idSubscriber] = {
    idUser,
    key: redisKeyGenerator.messages.stream(idUser),
    callback: (key, message) => callback(key, message),
  }
  rpsm.subscribe(messageSubscribers[idSubscriber].key, messageSubscribers[idSubscriber].callback)
  return 'subscribed'
}

const unsubscribe = (idSubscriber, idUser) => {
  if (!messageSubscribers[idSubscriber]) return 'not-subscribed'
  rpsm.unsubscribe(messageSubscribers[idSubscriber].key, messageSubscribers[idSubscriber].callback)
  delete messageSubscribers[idSubscriber]
  return 'unsubscribed'
}

module.exports = {
  addMessage,
  fetchByUser,
  fetchByChat,
  subscribe,
  unsubscribe,
  isSubscribed,
  messageSubscribe: subscribe,
  messageUnsubscribe: unsubscribe,
}
