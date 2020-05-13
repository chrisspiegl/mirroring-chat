process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:messages`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:messages:error`)

const middleware = require('server/middleware')
const messagesStore = require('server/messagesStore')

module.exports = middleware.catchErrors(async (req, res) => {
  const response = {
    status: 200,
    apiVersion: 1,
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
