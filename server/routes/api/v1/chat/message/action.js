process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:message:action`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:message:action:error`)

const asyncHandler = require('express-async-handler')

const RedisPubSubManager = require('server/redisPubSubManager')
const redisKeyGenerator = require('server/redisKeyGenerator')
const models = require('database/models')

const rpsm = new RedisPubSubManager()

module.exports = asyncHandler(async (req, res) => {
  const { idChatMessage, action } = req.params
  const { body: message } = req

  switch (action) {
    case 'ban':
      models.ChatMessage.destroy({
        where: {
          idAuthorProvider: message.idAuthorProvider,
        },
      })
      rpsm.publish(redisKeyGenerator.events, {
        event: redisKeyGenerator.event.CHAT_MESSAGE_BAN,
        data: message,
      })
      return res.json({
        message: `User ${message.displayName} was banned on ${message.provider}.`,
      })
    case 'timeout':
      models.ChatMessage.destroy({
        where: {
          idAuthorProvider: message.idAuthorProvider,
        },
      })
      rpsm.publish(redisKeyGenerator.events, {
        event: redisKeyGenerator.event.CHAT_MESSAGE_TIMEOUT,
        data: message,
      })
      return res.json({
        message: `User ${message.displayName} was sent into timeout on ${message.provider}.`,
      })
    case 'send':
      rpsm.publish(redisKeyGenerator.events, {
        event: redisKeyGenerator.event.CHAT_MESSAGE_SENT,
        data: message,
      })
      return res.json({
        message: `Message sent to ${message.provider}.`,
      })
    default:
      return res.boom.notImplemented(`The action ${action} is not implemented.`)
  }
})
