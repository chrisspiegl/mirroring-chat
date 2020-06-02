/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:chat:update`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:chat:update:error`)

const asyncHandler = require('express-async-handler')
const models = require('database/models')

module.exports = asyncHandler(async (req, res) => {
  const { idUser } = req.user
  const { idChat } = req.params
  const { body } = req

  console.log('body', body)

  body.idUser = body.idUser || idUser

  if (idUser !== body.idUser) return res.boom.unauthorized('you can only update your own chats')

  const chat = await models.Chat.findOne({
    where: {
      idChat,
      idUser,
    },
  })

  if (!chat) return res.boom.notFound('chat not found. use create instead.')

  await models.Chat.update(
    { ...body },
    {
      where: {
        idChat,
        idUser,
      },
    },
  )
  const response = await models.Chat.findByPk(chat.idChat)
  return res.json(response)
})
