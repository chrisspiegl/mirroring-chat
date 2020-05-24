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

const fetchByUser = (idUser, limit = 25, offset = 0) => {
  log('fetchForUser -> idUser', idUser)
  return models.ChatMessage.findAll({
    where: {
      idUser,
    },
    order: ['sentAt'],
    limit,
    offset,
  })
}

const fetchByChat = (idChat, limit = 25, offset = 0) => {
  log('fetchForChat -> idChat', idChat)
  return models.ChatMessage.findAll({
    where: {
      idChat,
    },
    order: ['sentAt'],
    limit,
    offset,
  })
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

const isSubscribed = (idUser) => !!messageSubscribers[idUser]

const subscribe = (idUser, callback) => {
  if (isSubscribed(idUser)) return 'already-subscribed'
  messageSubscribers[idUser] = (key, message) => callback(key, message)
  rpsm.subscribe(redisKeyGenerator.messages.stream(idUser), messageSubscribers[idUser])
  return 'subscribed'
}

const unsubscribe = (idUser) => {
  if (!messageSubscribers[idUser]) return 'not-subscribed'
  rpsm.unsubscribe(redisKeyGenerator.messages.stream(idUser), messageSubscribers[idUser])
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
