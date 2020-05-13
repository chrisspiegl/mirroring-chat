process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:passport:refresh`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:passport:refresh:error`)

const refresh = require('passport-oauth2-refresh')

/**
 * Refresh TokenAccess if the user has not logged in in a while
 * Necessary for example to login the bot every so often because the oauth token actually expires
 * Passport Plugin is from: https://github.com/fiznool/passport-oauth2-refresh
 */
const refreshTokenAccess = async (provider, userProvider) => new Promise((resolve, reject) => {
  log(`login:${provider}:${userProvider.idUserProvider}:refreshing-access-token`)
  try {
    return refresh.requestNewAccessToken(provider, userProvider.tokenRefresh, async (err, tokenAccess, tokenRefresh) => {
      const userProviderOptions = {
        tokenAccess,
        tokenRefresh,
      }
      await userProvider.update(userProviderOptions)
      log(`login:${provider}:${userProvider.idUserProvider}:refreshed-access-token-stored`)
      return resolve(userProvider)
    })
  } catch (err) {
    return reject(err)
  }
})

module.exports = {
  refreshTokenAccess,
}
