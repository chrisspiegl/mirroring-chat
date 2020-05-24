process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:messagesStore`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:messagesStore:error`)

const redisClient = require('server/redis').client
const { subscriber: redisSubscriber } = require('server/redis')
const redisKeyGenerator = require('server/redisKeyGenerator')
const models = require('database/models')

const ttl = 60 * 60 * 24 * 7/* seconds */ // 7 days

const messageSubscribers = {}

const messageEncode = (message) => {
  const messageEncoded = {
    // condensed variable names to have less redis storage needs
    // Possibly could upgrade to https://www.npmjs.com/package/protobufjs or https://www.npmjs.com/package/msgpack
    id: message.id,
    idCMP /* idChatMessageProvider */: message.idChatMessageProvider,
    idC /* channel */: message.idChat,
    idU /* channel */: message.idUser,
    p /* provider */: message.provider,
    at /* timestamp */: message.sentAt,
    dn /* displayName */: message.displayName,
    m /* message */: message.message,
    po /* providerObject */: message.providerObject,
  }
  return JSON.stringify(messageEncoded)
}

const messageDecode = (message) => {
  const messageDecoded = JSON.parse(message)
  // Remapping condensed json for redis storage back to readable code version.
  return {
    id: messageDecoded.id,
    idChatMessageProvider: messageDecoded.idCMP,
    idChat: messageDecoded.idC,
    idUser: messageDecoded.idU,
    provider: messageDecoded.p,
    sentAt: messageDecoded.at,
    displayName: messageDecoded.dn,
    message: messageDecoded.m,
    providerObject: messageDecoded.po,
  }
}

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
  await redisClient.publish(redisKeyGenerator.messages.stream(message.idUser), messageEncode(message))
  return true
}

const isSubscribed = (idUser) => !!messageSubscribers[idUser]

const subscribe = (idUser, callback) => {
  if (isSubscribed(idUser)) return 'already-subscribed'
  messageSubscribers[idUser] = (keyRedis, message) => callback(keyRedis, messageDecode(message))
  const redisKey = redisKeyGenerator.messages.stream(idUser)
  redisSubscriber.on('message', messageSubscribers[idUser])
  redisSubscriber.subscribe(redisKey)
  return 'subscribed'
}

const unsubscribe = (idUser) => {
  if (!messageSubscribers[idUser]) return 'not-subscribed'
  redisSubscriber.removeListener('message', messageSubscribers[idUser])
  return 'unsubscribed'
}

module.exports = {
  addMessage,
  fetchByUser,
  fetchByChat,
  messageEncode,
  messageDecode,
  subscribe,
  unsubscribe,
  isSubscribed,
  messageSubscribe: subscribe,
  messageUnsubscribe: unsubscribe,
}
