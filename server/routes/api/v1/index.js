/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:router:index`)
log.log = console.log.bind(console)
const error = debug(`${config.slug}:router:index:error`)

const express = require('express')
// const csurf = require('csurf')

const {
  ensureLogin,
} = require('server/middleware')

const router = express.Router()
router.get('/chat/messages/:channelName', require('./chat/messages'))

module.exports = router
