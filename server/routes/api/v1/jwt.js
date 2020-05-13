/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:jwt`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:jwt:error`)

const jwt = require('jsonwebtoken')

const middleware = require('server/middleware')

module.exports = middleware.catchErrors(async (req, res) => {
  const response = {
    status: 200,
    apiVersion: 1,
    data: {},
  }

  if (req.isAuthenticated()) {
    const token = jwt.sign(
      {
        idUser: req.user.idUser,
      },
      config.secrets.jwt,
      {
        expiresIn: 2592000, // expires in 30 days in seconds
      },
    )
    response.data.jwt = token
    response.data.user = req.user.toJSON()
    response.data.user.userTwitch = await req.user.UserTwitch
    response.data.user.userFacebook = await req.user.UserFacebook
    response.data.user.userGoogle = await req.user.UserGoogle
    response.data.user.userDiscord = await req.user.UserDiscord
  } else {
    response.data.message = 'not logged in'
  }

  return res.set('Content-Type', 'application/json').send(response)
})
