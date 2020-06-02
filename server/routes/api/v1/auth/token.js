/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:auth:token`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:auth:token:error`)

const jwt = require('jsonwebtoken')

const asyncHandler = require('express-async-handler')

const tokenGenerator = (obj) => jwt.sign({ ...obj }, config.secrets.jwt, { expiresIn: 2592000 }) // expires in 30 days in seconds
const currentUserObject = (user) => {
  const response = {
    user: {
      ...user.toJSON(),
      UserDiscord: user.UserDiscord,
      UserFacebook: user.UserFacebook,
      UserGoogle: user.UserGoogle,
      UserTelegram: user.UserTelegram,
      UserTwitch: user.UserTwitch,
    },
    token: tokenGenerator({ idUser: user.idUser }),
  }
  return response
}

// NOTE: validate that the token used to login is still valid.
// route already has "ensureLogin" so user only arrives if session or jwt or similar
const validate = asyncHandler(async (req, res) => res
  .status(200)
  .json(currentUserObject(req.user)))

// NOTE: log in the user, this may be need in the future as oauth moves to the frontend (potentially)
// if loign needed, verify whatever is used to login, and send a jwt back.
const logIn = asyncHandler(async (req, res) => res
  .status(200)
  .json(currentUserObject(req.user)))

module.exports = {
  validate,
  logIn,
}
