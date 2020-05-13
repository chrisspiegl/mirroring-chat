process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:redis`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:redis:error`)

const redis = require('redis')
const Promise = require('bluebird')

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

const newRedisClient = () => redis.createClient(config.database.redis)

const redisClient = newRedisClient()
const redisSubscriber = newRedisClient()

redisClient.unref()

redisClient.on('error', (err) => error(err))

module.exports = {
  redis,
  redisClient,
  client: redisClient,
  redisSubscriber,
  subscriber: redisSubscriber,
  newRedisClient,
}
