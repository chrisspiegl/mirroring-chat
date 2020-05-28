process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botTelegram:authentication`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botTelegram:authentication:error`)

const jwt = require('jsonwebtoken')

const models = require('database/models')
const chatSecretGenerator = require('./telegramChatSecretGenerator')

const generateTokenAuth = (idUserProvider) => jwt.sign({
  idUserProvider,
}, config.secrets.jwt, {
  expiresIn: '15m',
})

const authByChatId = function* (msg) {
  try {
    // Create or Update UserTelegram and User Database Entries
    let userTelegram = yield models.UserTelegram.findByPk(msg.from.id, {
      include: [models.User],
    })
    const userTelegramObj = {
      idUserProvider: msg.from.id,
      nameFirst: msg.from.first_name,
      nameLast: msg.from.last_name,
      username: msg.from.username,
      languageCode: msg.from.language_code,
      lastLogin: new Date(),
      deactivatedAt: null, // set to null whenever user interacts with the bot to make sure the bot is reactivated when activity is seen
    }
    if (!userTelegram) {
      log(`new user ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username} / ${msg.from.language_code} / ${msg.chat.id}).`)
      userTelegram = yield models.UserTelegram.create(userTelegramObj)
    } else {
      log(`updating user details ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username} / ${msg.from.language_code} / ${msg.chat.id}).`)
      yield userTelegram.update(userTelegramObj)
    }

    // Create or Update the Chat in the Database
    let chat = yield models.ChannelTelegram.findByPk(msg.chat.id, {
      include: [{
        model: models.UserTelegram,
        include: [models.User],
      }],
    })
    const chatObj = {
      idChannelProvider: msg.chat.id,
      title: msg.chat.title,
      idUserProvider: userTelegram.idUserProvider,
      type: msg.chat.type,
      lastCommandAt: new Date(),
      deactivatedAt: null, // set to null whenever user interacts with the bot to make sure the user is reactivated when activity is seen
    }
    if (!chat) {
      log(`new chat \`${(msg.chat.title) ? msg.chat.title : 'direct'}\` started bot by ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username} / ${msg.from.language_code} / ${msg.chat.id}).`)
      const generatedSecret = chatSecretGenerator.generate(chatObj.chatId)
      chatObj.secret = generatedSecret.secret
      chatObj.salt = generatedSecret.salt
      yield models.ChannelTelegram.create(chatObj)
    } else {
      log(`updating chat \`${(msg.chat.title) ? msg.chat.title : 'direct'}\` by ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username} / ${msg.from.language_code} / ${msg.chat.id}).`)
      yield chat.update(chatObj)
    }
    chat = yield models.ChannelTelegram.findByPk(msg.chat.id, {
      include: [{
        model: models.UserTelegram,
        include: [models.User],
      }],
    })
    userTelegram = chat.UserTelegram
    const user = userTelegram.User
    return {
      chat,
      user,
      userTelegram,
    }
  } catch (err) {
    error('authConnection error', err)
    msg.quickResponse('Sorry - internal bot error. Please contact @FirmwareNotificationsGroup to debug this.')
  }
}

const createAuthMiddleware = function createAuthMiddleware(bot) {
  return function* authMiddleware() {
    this.msg.bot = bot
    this.msg.quickResponse = function quickResponse(text, options = {}) {
      // eslint-disable-next-line no-param-reassign
      options.disable_web_page_preview = true
      return bot.sendMessage(this.msg.chat.id, text, options)
    }.bind(this)
    this.msg.auth = yield authByChatId(this.msg)
  }
}

const checkIfMessageIsInGroup = async (msg) => {
  const chatInfo = await msg.bot.getChat(msg.chat.id)
  return (chatInfo.type !== 'private') ? chatInfo : false
}

const checkIfUserIsPrivateOrGroupAdmin = async (msg) => {
  const chatInfo = await msg.bot.getChat(msg.chat.id)

  if (chatInfo.type === 'private' || chatInfo.all_members_are_administrators === true) {
    // This is either a group where everybody is admin
    // Or it's a one on one chat between user and bot
    return true
  }
  if (chatInfo.type === 'group' || chatInfo.type === 'supergroup') {
    const groupAdmins = await msg.bot.getChatAdministrators(msg.chat.id)
    for (let i = groupAdmins.length - 1; i >= 0; i--) {
      if (groupAdmins[i].user.id === msg.from.id) {
        // The user is set as admin and is allowed to run the command
        return true
      }
    }
  }
  return false
}

const onlyGroupAdmin = function* onlyGroupAdmin(msg) {
  const isGroupAdmin = yield checkIfUserIsPrivateOrGroupAdmin(msg)
  if (!isGroupAdmin) {
    log(`user ${msg.auth.userTelegram.username} tried to use admin only command`)
    msg.quickResponse('This command is only allowed for admins.')
    this.stop()
  }
}

const onlyPrivate = function* onlyPrivate(msg) {
  const isGroupChat = yield checkIfMessageIsInGroup(msg)
  if (isGroupChat) {
    msg.quickResponse(`This command is only allowed in private chats. Please talk to @${config.passport.telegram.username} directly.`)
    this.stop()
  }
}

module.exports = {
  generateTokenAuth,
  createAuthMiddleware,
  checkIfMessageIsInGroup,
  checkIfUserIsPrivateOrGroupAdmin,
  onlyGroupAdmin,
  onlyPrivate,
}
