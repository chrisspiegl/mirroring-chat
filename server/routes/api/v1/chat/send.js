process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:send`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:send:error`)

const asyncHandler = require('express-async-handler')

const RedisPubSubManager = require('server/redisPubSubManager')
const redisKeyGenerator = require('server/redisKeyGenerator')

const rpsm = new RedisPubSubManager()

module.exports = asyncHandler(async (req, res) => {
  const { text, provider } = req.body

  rpsm.publish(redisKeyGenerator.events, {
    event: redisKeyGenerator.event.CHAT_MESSAGE_SENT,
    data: {
      provider,
      text,
    },
  })

  // TODO: improve this to be acknowledge based?!

  return res.json({ message: 'Message scheduled to be sent.' })
})
