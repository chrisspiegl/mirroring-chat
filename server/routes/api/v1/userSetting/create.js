/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:userSetting:create`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:userSetting:create:error`)

const asyncHandler = require('express-async-handler')
const models = require('database/models')

module.exports = asyncHandler(async (req, res) => {
  const { idUser } = req.user
  const { body } = req

  body.idUser = body.idUser || idUser

  console.log(body)


  if (idUser !== body.idUser) return res.boom.unauthorized('you can only update your own user settings')

  const response = await models.UserSetting.create({ ...body })

  return res.json(response)
})
