process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')

const debug = require('debug')
const log = debug(`${config.slug}:messagesStore`)
log.log = console.log.bind(console)
const error = debug(`${config.slug}:messagesStore:error`)

const redisClient = require('server/redis').redisClient

// const ttl = 60/*seconds*/
const ttl = 60*60*24/*seconds*/

const fetch = (channel) => {
  // TODO: Make the key not depend on the channel name but instead make it map to a userId so that all the chats for a person can be in one redis key
  // TODO: Figure out what storage method would be best suited to expire old messages and yet request a bunch of them at the same time
  const key = `${config.slugShort}:${config.envShort}:messages:${channel}`
  return new Promise((resolve, reject) => {
    redisClient.lrangeAsync(key, 0, -1).then(
        (messages) => {
          messages = messages.map((message) => JSON.parse(message))
          resolve(messages)
        }, (err) => {
          reject(err)
        }
      )
    }, (err) => {
      reject("Redis connection failed: " + err)
    }
  )
}

const add = (channel, message) => {
  const key = `${config.slugShort}:${config.envShort}:messages:${channel}`
  return new Promise((resolve, reject) => {
    redisClient.multi().rpush(key, message).expire(key, ttl)
        .execAsync()
        .then((res) => {
            resolve(res)
          }, (err) => {
            reject(err)
          }
        )
    }, (err) => {
      reject("Redis connection failed: " + err)
    }
  )
}

module.exports = {
  add,
  fetch,
}