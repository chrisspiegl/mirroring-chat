/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:index`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:index:error`)

const express = require('express')

const {
  ensureJwtAuth,
} = require('server/middleware')

const passport = require('server/passport')

const router = express.Router()
router.get('/chat/messages/:channelName', ensureJwtAuth, require('./chat/messages'))
router.get('/user/me', ensureJwtAuth, require('./user/me'))
router.get('/auth/token', require('./auth/token'))
router.post('/auth/token', require('./auth/token'))
router.get('/auth/:provider/unlink', ensureJwtAuth, require('./auth/unlink'))
router.post('/auth/:provider/unlink', ensureJwtAuth, require('./auth/unlink'))

module.exports = router
