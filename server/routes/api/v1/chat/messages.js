process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:messages`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:messages:error`)

const asyncHandler = require('express-async-handler')
const messagesStore = require('server/messagesStore')

module.exports = asyncHandler(async (req, res) => {
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'ChatMessages',
    description: 'Last chat messages for requested channel (up to 150 messages).',
    data: {},
  }

  const {
    channelName,
  } = req.params
  console.log('channelName', channelName)

  response.data.channelName = channelName
  response.data.messages = await messagesStore.fetch(channelName)

  return res.set('Content-Type', 'application/json').send(response)
})
