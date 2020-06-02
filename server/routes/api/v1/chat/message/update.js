process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:message:update`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:message:update:error`)

const asyncHandler = require('express-async-handler')
const models = require('database/models')

module.exports = asyncHandler(async (req, res) => {
  const { idChatMessage } = req.params
  const { body: message } = req
  log(`updating message ${idChatMessage} by ${message.displayName} on ${message.provider}`)
  await models.ChatMessage.update(message, {
    where: {
      idChatMessage,
    },
  })
  const response = await models.ChatMessage.findByPk(message.idChatMessage)
  return res.json(response)
})
