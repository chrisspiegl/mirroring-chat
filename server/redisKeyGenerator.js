process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:redisKeyGenerator`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:redisKeyGenerator:error`)

const baseKey = `${config.slugShort}:${config.envShort}`

module.exports = {
  messages: {
    store: (channel) => `${baseKey}:messages:store:${channel || '*'}`,
    stream: (channel) => `${baseKey}:messages:stream:${channel || '*'}`,
  },
  sessions: () => `${baseKey}:sess:`,
  youtube: {
    broadcast: {
      nextPage: (broadcastEtag) => `${baseKey}:youtube:broadcast:nextpage:${broadcastEtag}`,
    },
  },
}
