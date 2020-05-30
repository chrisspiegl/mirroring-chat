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
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'UserSettingUpdate',
    description: '',
    data: {},
  }

  const { idUser, idUserSetting } = req.params
  const { body } = req

  const userSetting = await models.UserSetting.findOne({
    where: {
      idUser,
      idUserSetting,
    },
  })

  body.idUser = idUser

  if (userSetting) {
    response.data = await models.UserSetting.update({ ...body }, {
      where: {
        idUserSetting,
        idUser,
      },
    })
  } else {
    response.data = await models.UserSetting.create({ ...body })
  }


  return res.set('Content-Type', 'application/json').send(response)
})
