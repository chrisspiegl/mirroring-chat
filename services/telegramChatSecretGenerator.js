process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botTelegram:chatSecret`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botTelegram:chatSecret:error`)

const crypto = require('crypto')

function generate(chatId) {
  const salt = crypto.randomBytes(20).toString('hex')
  const secret = crypto.createHmac('sha1', salt).update(`${chatId}`).digest('hex')
  return {
    secret,
    salt,
  }
}

module.exports = {
  generate,
}
