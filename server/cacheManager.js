process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:cacheManager`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:cacheManager:error`)

// https://github.com/BryanDonovan/node-cache-manager
const cacheManager = require('cache-manager')
// https://www.npmjs.com/package/cache-manager-fs-hash
const fsStore = require('cache-manager-fs-hash')
// https: //www.npmjs.com/package/cache-manager-redis-store
const redisStore = require('cache-manager-redis-store')

const memoryCache = cacheManager.caching({
  store: 'memory',
  max: 100,
  ttl: 60,
})

const diskCache = cacheManager.caching({
  store: fsStore,
  options: {
    path: config.database.path, // path for cached files
    ttl: 60 * 60, /* seconds */
    subdirs: true, // create subdirectories to reduce the files in a single dir (default: false)
    zip: true, // zip files to save diskspace (default: false)
  },
})

const redisCache = cacheManager.caching({
  store: redisStore,
  host: config.database.redis.host,
  port: config.database.redis.port,
  auth_pass: config.database.redis.options.auth_pass || '',
  db: config.database.redis.options.db || 0,
  ttl: 600, /* seconds */
})

const multiCache = cacheManager.multiCaching([memoryCache, redisCache])


module.exports = {
  redisCache,
  redis: redisCache,
  diskCache,
  fs: diskCache,
  memoryCache,
  memory: memoryCache,
  multiCache,
}
