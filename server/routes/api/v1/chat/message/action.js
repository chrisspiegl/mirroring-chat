process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:message:action`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:message:action:error`)

const asyncHandler = require('express-async-handler')

module.exports = asyncHandler(async (req, res) => {
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'ChatMessageAction',
    description: 'Ban, Timeout, or similar methods.',
    data: {},
  }

  const { idChatMessage, action } = req.params
  const { message } = req.body

  console.log(req.body)

  console.log(message)


  switch (action) {
    case 'ban':
      // TODO: implement banning of users
      // needs to send a notification through redis because it gets handled by the respective crawlers
      response.message = `User ${message.displayName} was banned on ${message.provider}.`
      break
    case 'timeout':
      // TODO: implement banning of users
      // needs to send a notification through redis because it gets handled by the respective crawlers
      response.message = `User ${message.displayName} was sent into timeout on ${message.provider}.`
      break
    default:
      response.ok = false
      response.status = 501
      response.message = `The action ${action} is not implemented.`
      break
  }


  return res.set('Content-Type', 'application/json').send(response)
})
