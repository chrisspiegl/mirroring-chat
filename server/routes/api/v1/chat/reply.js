process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:reply`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:reply:error`)

const asyncHandler = require('express-async-handler')

module.exports = asyncHandler(async (req, res) => {
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'ChatMessageReply',
    description: 'Reply one one or multiple platforms.',
    data: {},
  }

  const { text, provider } = req.body

  // TODO: reply message implementation missing
  // needs to send a notification through redis because it gets handled by the respective crawlers

  return res.json(response)
})
