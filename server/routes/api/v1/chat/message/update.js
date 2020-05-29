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
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'ChatMessageUpdate',
    description: 'Update a chat message.',
    data: {},
  }

  const { idChatMessage } = req.params
  const { message } = req.body

  log(`updating message ${idChatMessage} by ${message.displayName} on ${message.provider}`)

  const updatedMessage = await models.ChatMessage.update(message, {
    where: {
      idChatMessage,
    },
  })
  response.data.message = updatedMessage

  return res.set('Content-Type', 'application/json').send(response)
})
