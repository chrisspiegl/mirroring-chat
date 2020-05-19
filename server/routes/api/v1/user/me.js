/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:user:me`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:user:me:error`)

const asyncHandler = require('express-async-handler')

module.exports = asyncHandler(async (req, res) => {
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'UserInfoMe',
    description: 'Information about the logged in user profile.',
    data: {},
  }

  if (req.isAuthenticated()) {
    response.data = req.user.toJSON()
    response.data.UserDiscord = req.user.UserDiscord
    response.data.UserFacebook = req.user.UserFacebook
    response.data.UserGoogle = req.user.UserGoogle
    response.data.UserTelegram = req.user.UserTelegram
    response.data.UserTwitch = req.user.UserTwitch
  } else {
    response.data.message = 'not logged in'
  }

  return res.set('Content-Type', 'application/json').send(response)
})
