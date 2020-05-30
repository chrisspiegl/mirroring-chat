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

const router = express.Router()

router.get('/chats/:idUser', ensureJwtAuth, require('./chat/list'))
router.put('/chats/:idUser/:idChat', ensureJwtAuth, require('./chat/update'))

router.get('/chat/messages/:channelName', ensureJwtAuth, require('./chat/messages'))
router.put('/chat/message/:idChatMessage', ensureJwtAuth, require('./chat/message/update'))
router.post('/chat/message/:idChatMessage/:action', ensureJwtAuth, require('./chat/message/action'))
router.post('/chat/reply', ensureJwtAuth, require('./chat/reply'))

router.get('/user/me', ensureJwtAuth, require('./user/me'))

router.get('/usersettings/:idUser', ensureJwtAuth, require('./userSetting/list'))
router.get('/usersetting/:idUser/:idUserSetting', ensureJwtAuth, require('./userSetting/one'))
router.post('/usersetting/:idUser/:idUserSetting', ensureJwtAuth, require('./userSetting/create'))
router.put('/usersetting/:idUser/:idUserSetting', ensureJwtAuth, require('./userSetting/update'))
router.delete('/usersetting/:idUser/:idUserSetting', ensureJwtAuth, require('./userSetting/delete'))

router.get('/auth/token', require('./auth/token'))
router.post('/auth/token', require('./auth/token'))
router.get('/auth/:provider/unlink', ensureJwtAuth, require('./auth/unlink'))
router.post('/auth/:provider/unlink', ensureJwtAuth, require('./auth/unlink'))

module.exports = router
