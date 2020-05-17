/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:user:me`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:user:me:error`)

const middleware = require('server/middleware')
const models = require('database/models')

module.exports = middleware.catchErrors(async (req, res) => {
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
    response.data.UserTwitch = await req.user.UserTwitch
    response.data.UserFacebook = await req.user.UserFacebook
    response.data.UserGoogle = await req.user.UserGoogle
    response.data.UserDiscord = await req.user.UserDiscord
  } else {
    response.data.message = 'not logged in'
  }

  return res.set('Content-Type', 'application/json').send(response)
})
