process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')

const debug = require('debug')
const log = debug(`${config.slug}:passport:refresh`)
log.log = console.log.bind(console)
const error = debug(`${config.slug}:passport:refresh:error`)

const passport = require('server/passport')
const refresh = require("passport-oauth2-refresh")

/**
 * Refresh TokenAccess if the user has not logged in in a while
 * Necessary for example to login the bot every so often because the oauth token actually expires
 * Passport Plugin is from: https://github.com/fiznool/passport-oauth2-refresh
 */
const refreshTokenAccess = async (provider, userProvider) => {
  return new Promise((resolve, reject) => {
    log(`login:${provider}:${userProvider.idUserProvider}:refreshing-access-token`)
    refresh.requestNewAccessToken(provider, userProvider.tokenRefresh, async (err, tokenAccess, tokenRefresh) => {
      userProviderOptions = {
        tokenAccess: tokenAccess,
        tokenRefresh: tokenRefresh,
      }
      userProvider = await userProvider.update(userProviderOptions)
      log(`login:${provider}:${userProvider.idUserProvider}:refreshed-access-token-stored`)
      return resolve(userProvider)
    })
  })
}

module.exports = {
  refreshTokenAccess
}