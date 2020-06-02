process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:messages`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:messages:error`)

const asyncHandler = require('express-async-handler')
const messagesStore = require('server/messagesStore')

module.exports = asyncHandler(async (req, res) => {
  const { idUser } = req.user
  const response = await messagesStore.fetchByUser(idUser)
  return res.json(response)
})
