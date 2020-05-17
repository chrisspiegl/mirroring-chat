/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:auth:token`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:auth:token:error`)

const jwt = require('jsonwebtoken')

const middleware = require('server/middleware')

module.exports = middleware.catchErrors(async (req, res) => {
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'AuthToken',
    description: 'Returning a JsonWebToken for the logged in user.',
    data: {},
  }

  if (req.isAuthenticated()) {
    // TODO: Automatically attach a new token to each request? Or have the frontend renew the tokens in a certain timeframe?
    const token = jwt.sign(
      {
        idUser: req.user.idUser,
      },
      config.secrets.jwt,
      {
        expiresIn: 2592000, // expires in 30 days in seconds
      },
    )
    response.tokenUser = token
  } else {
    response.ok = false
    response.status = 401
    response.message = 'Login failed, not authenticated.'
  }

  return res.status(response.status).set('Content-Type', 'application/json').send(response)
})
