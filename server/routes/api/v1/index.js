/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:index`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:index:error`)

const express = require('express')
// const csurf = require('csurf')

const {
  ensureLogin,
} = require('server/middleware')

const router = express.Router()
router.get('/chat/messages/:channelName', ensureLogin, require('./chat/messages'))
router.get('/jwt', require('./jwt'))

module.exports = router
