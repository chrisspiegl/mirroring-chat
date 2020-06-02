/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:index`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:index:error`)

const express = require('express')

const { ensureJwtAuth, ensureLogin } = require('server/middleware')

const router = express.Router()

router.get('/chats', ensureJwtAuth, require('./chat/list'))
router.put('/chat/:idChat', ensureJwtAuth, require('./chat/update'))

router.get('/chat/messages', ensureJwtAuth, require('./chat/messages'))
router.put('/chat/message/:idChatMessage', ensureJwtAuth, require('./chat/message/update'))
// router.post('/chat/message/:idChatMessage/:action', ensureJwtAuth, require('./chat/message/action'))
// router.post('/chat/reply', ensureJwtAuth, require('./chat/reply'))

router.get('/usersettings', ensureJwtAuth, require('./userSetting/list'))
router.post('/usersetting', ensureJwtAuth, require('./userSetting/create'))
// router.get('/usersetting/:idUserSetting', ensureJwtAuth, require('./userSetting/one'))
router.put('/usersetting/:idUserSetting', ensureJwtAuth, require('./userSetting/update'))
// router.delete('/usersetting/:idUserSetting', ensureJwtAuth, require('./userSetting/delete'))

router.post('/auth/token', ensureLogin, require('./auth/token').logIn)
router.get('/auth/token', ensureJwtAuth, require('./auth/token').validate)
router.get('/auth/:provider/unlink', ensureJwtAuth, require('./auth/unlink'))
router.post('/auth/:provider/unlink', ensureJwtAuth, require('./auth/unlink'))

module.exports = router
