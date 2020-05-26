process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botTwitch`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botTwitch:error`)

const TwitchListener = require('services/TwitchListener')

// Define configuration options

const init = async (userProviderParam = null) => {
  const twitchListener = new TwitchListener()
  twitchListener.start()
}

// Run the init method if the file was called directly and not through 'require'
if (require.main === module) {
  init()
}
