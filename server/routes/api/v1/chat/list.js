/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:list`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:list:error`)

const asyncHandler = require('express-async-handler')
const models = require('database/models')

module.exports = asyncHandler(async (req, res) => {
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'ChatList',
    description: '',
    data: {},
  }

  const { idUser } = req.params
  response.data.chats = await models.Chat.findAll({
    where: {
      idUser,
    },
  })

  return res.set('Content-Type', 'application/json').send(response)
})
