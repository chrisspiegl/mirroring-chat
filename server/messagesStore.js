process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:messagesStore`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:messagesStore:error`)

const redisClient = require('server/redis').client
const redisKeyGenerator = require('server/redisKeyGenerator')
const models = require('database/models')

const ttl = 60 * 60 * 24 * 7/* seconds */ // 7 days

const messageEncode = (message) => {
  const messageEncoded = {
    // condensed variable names to have less redis storage needs
    // Possibly could upgrade to https://www.npmjs.com/package/protobufjs or https://www.npmjs.com/package/msgpack
    id: message.id,
    c /* channel */: message.channel,
    p /* provider */: message.provider,
    t /* timestamp */: message.timestamp,
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
    channel: messageDecoded.c,
    provider: messageDecoded.p,
    timestamp: messageDecoded.t,
    displayName: messageDecoded.dn,
    message: messageDecoded.m,
    providerObject: messageDecoded.po,
  }
}

const fetchForUser = (idUser, limit = 25, offset = 0) => {
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

const fetchForChat = (idChat, limit = 25, offset = 0) => {
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

module.exports = {
  addMessage,
  fetchForChat,
  fetchForUser,
  messageEncode,
  messageDecode,
}
