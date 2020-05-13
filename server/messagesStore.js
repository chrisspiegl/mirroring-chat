process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:messagesStore`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:messagesStore:error`)

const redisClient = require('server/redis').client

const ttl = 60 * 60 * 24 * 7/* seconds */ // 7 days
const keyListBase = `${config.slugShort}:${config.envShort}:messages:store:`
const keyStreamBase = `${config.slugShort}:${config.envShort}:messages:stream:`

const messageEncode = (message) => {
  const messageEncoded = {
    // condensed variable names to have less redis storage needs
    // Possibly could upgrade to https://www.npmjs.com/package/protobufjs or https://www.npmjs.com/package/msgpack
    id: message.id,
    p /* provider */: message.provider,
    t /* timestamp */: message.timestamp,
    cn /* channel */: message.channelName,
    u /* username */: message.username,
    dn /* displayName */: message.displayName,
    m /* message */: message.message,
  }
  return JSON.stringify(messageEncoded)
}

const messageDecode = (message) => {
  const messageDecoded = JSON.parse(message)
  // Remapping condensed json for redis storage back to readable code version.
  return {
    id: messageDecoded.id,
    provider: messageDecoded.p,
    timestamp: messageDecoded.t,
    channelName: messageDecoded.cn,
    username: messageDecoded.u,
    displayName: messageDecoded.dn,
    message: messageDecoded.m,
  }
}

const fetch = (channel) => {
  const keyList = keyListBase + channel
  // TODO: Make the key not depend on the channel name but instead make it map to a userId so that all the chats for a person can be in one redis key
  // TODO: Figure out what storage method would be best suited to expire old messages and yet request a bunch of them at the same time
  return new Promise((resolve, reject) => {
    redisClient.lrangeAsync(keyList, 0, -1).then(
      (messages) => {
        const messagesDecoded = messages.reverse().map(messageDecode)
        return resolve(messagesDecoded)
      },
    ).catch((err) => {
      error(`Redis connection failed: ${err}`)
      return reject(err)
    })
  })
}

const add = (channel, message) => new Promise((resolve, reject) => {
  const messageEncoded = messageEncode(message)
  const keyList = keyListBase + message.channelName
  const keyStream = keyStreamBase + message.channelName
  console.log('add -> keyStream', keyStream)
  // possible use of `.expire(key, ttl)` to expire the whole key after a certain amount of time (after the last rpush)
  redisClient.multi().lpush(keyList, messageEncoded).expire(keyList, ttl)
    .publish(keyStream, messageEncoded)
    .execAsync()
    .then((resMulti) => {
      const trimAt = 120
      const trimTo = 100
      if (resMulti[0] > trimAt) {
        log(`found over ${trimAt} messages in the channel, trimming to ${trimTo}`)
        redisClient.ltrimAsync(keyList, 0, trimTo).then((resLtrim) => {
          log(`trimmed ${message.channelName} to ${trimTo} messages with ${resLtrim}`)
        })
      }
      return resolve(resMulti)
    })
    .catch((err) => {
      error(`Redis connection failed: ${err}`)
      return reject(err)
    })
})

module.exports = {
  add,
  fetch,
  messageEncode,
  messageDecode,
}
