process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:passport:refresh`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:passport:refresh:error`)

// const { promisify } = require('util')
const refresh = require('passport-oauth2-refresh')

// eslint-disable-next-line no-unused-vars
const passport = require('./passport') // necessary since refresh otherwise does not find the used strategies.

const requestNewAccessToken = (provider, refreshToken) => new Promise((resolve, reject) => {
  log('starting request new access token')
  return refresh.requestNewAccessToken(provider, refreshToken, (err, tokenAccess, tokenRefresh) => {
    log('received new access token')
    if (err) reject(new Error(`${provider} error while token refresh ${userProvider.idUserProvider}: ${err}`))
    if (!tokenAccess) reject(new Error(`${provider} did not provide new tokenAccess for ${userProvider.idUserProvider}: ${err}`))
    return resolve({ tokenAccess, tokenRefresh })
  })
})

/**
 * Refresh TokenAccess if the user has not logged in in a while
 * Necessary for example to login the bot every so often because the oauth token actually expires
 * Passport Plugin is from: https://github.com/fiznool/passport-oauth2-refresh
 */
const refreshTokenAccess = async (provider, userProvider) => {
  log(`${provider}:${userProvider.idUserProvider}:refreshing-access-token`)
  try {
    const { tokenAccess, tokenRefresh } = await requestNewAccessToken(provider, userProvider.tokenRefresh)
    const userProviderOptions = {
      tokenAccess: tokenAccess || undefined,
      tokenRefresh: tokenRefresh || undefined,
    }
    log(`${provider}:${userProvider.idUserProvider}:refreshed-access-token-stored`)
    return userProvider.update(userProviderOptions)
  } catch (err) {
    throw new Error('error while refreshing the access token', err)
  }
}

module.exports = {
  refreshTokenAccess,
}
