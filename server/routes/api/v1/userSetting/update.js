/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:userSetting:update`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:userSetting:update:error`)

const asyncHandler = require('express-async-handler')
const models = require('database/models')

module.exports = asyncHandler(async (req, res) => {
  const { idUser } = req.user
  const { idUserSetting } = req.params
  const { body } = req

  body.idUser = body.idUser || idUser

  if (idUser !== body.idUser) return res.boom.unauthorized('you can only update your own user settings')

  const userSetting = await models.UserSetting.findOne({
    where: {
      idUser,
      idUserSetting,
    },
  })

  if (!userSetting) return res.boom.notFound('user setting not found. use create instead.')

  await models.UserSetting.update({ ...body }, {
    where: {
      idUserSetting,
      idUser,
    },
  })
  const response = await models.UserSetting.findByPk(userSetting.idUserSetting)
  return res.json(response)
})
