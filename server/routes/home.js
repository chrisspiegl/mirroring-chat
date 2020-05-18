process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:router:home`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:router:home:error`)

const path = require('path')
const express = require('express')

const asyncHandler = require('express-async-handler')

module.exports = () => {
  const router = express.Router()
  router.get('/', asyncHandler(async (req, res) => {
    res.sendFile(path.join(config.root, 'public/index.html'))
  }))

  return router
}
