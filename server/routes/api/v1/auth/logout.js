/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:auth:logout`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:auth:logout:error`)

const asyncHandler = require('express-async-handler')

module.exports = asyncHandler(async (req, res) => {
  req.session.regenerate((err) => {
    req.logout()
    return res.json('logged out')
  })
})
