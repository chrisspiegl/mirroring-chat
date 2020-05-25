process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botTelegram:listener`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botTelegram:listener:error`)

const pnotice = require('pushnotice')(`${config.slug}:botTelegram:listener`, {
  env: config.env,
  chat: config.pushnotice.chat,
  debug: true,
  disabled: config.pushnotice.disabled,
})

const BotTelegram = require('node-telegram-bot-api')
const botTelegramMiddleware = require('node-telegram-bot-api-middleware')
const moment = require('moment-timezone')

const models = require('database/models')
const messageStore = require('server/messagesStore')
const redisKeyGenerator = require('server/redisKeyGenerator')
const {
  generateTokenAuth,
  createAuthMiddleware,
  onlyPrivate,
  onlyGroupAdmin,
} = require('./telegramAuthentication')

moment.tz.setDefault('UTC')

// Mapping the use to a variable here - very useful
const { use } = botTelegramMiddleware

// Be aware of the all encapsulating init method.
const init = async () => {
  // Be aware of the all encapsulating init method.
  await models.init() // Loading Database Initialization

  const botConfig = config.passport.telegram
  const webHook = (botConfig.webHook === false) ? false : {
    host: botConfig.webHook.host,
    port: botConfig.webHook.port,
    autoOpen: false, // open manually to log messages
  }
  const bot = new BotTelegram(botConfig.tokenAuth, {
    polling: botConfig.polling,
    webHook,
  })

  if (botConfig.polling) {
    log('polling is activated')
  }

  bot.on('polling_error', (err) => {
    error('polling_error', err) // => 'EPARSE'
  })

  // TODO: Check how it all works with webHook

  // Handle Promise Rejections:
  process.on('unhandledRejection', (reason, promise) => {
    error('unhandledRejection', reason.stack || reason, promise)
  })

  const response = use(createAuthMiddleware(bot))

  /**
   * =============================================================================
   * Sending Chat Messages to the Telegram Bot
   * TODO: this needs to be done in it's own service at some point.
   * Future implementation of the redis/messagestore notifications:
   * - messageStore should have startListening(idUser, callback) method which calls the callback with each new message
   * - messageStore should have stopListening(idUser) so that the redis subscribers can be deactivated again and not left behind
   */

  const activeRedisMessageListeners = {}

  const onNewMessage = (userProvider) => (key, message) => {
    if (key !== redisKeyGenerator.messages.stream(userProvider.idUser)) return // only handle messages which are specifically for this user
    log('on:redis:message for: ', key)
    let dateOrNoDate = ''
    if (moment().subtract(1, 'minute').isAfter(moment(message.sentAt))) {
      dateOrNoDate = ` at ${moment(message.sentAt).format('YYYY-MM-DD HH:mm:ss')}`
    }
    bot.sendMessage(userProvider.idUserProvider,
      `${message.displayName} on ${message.provider}${dateOrNoDate}:\n${message.message}`, {
        parse_mode: 'markdown',
        disable_web_page_preview: true,
      })
  }

  /**
   * =============================================================================
   * Utilities
   */

  const chatSubscribe = (userProvider) => messageStore.subscribe(`telegram-${userProvider.idUserProvider}`, userProvider.idUser, onNewMessage(userProvider))

  const chatUnsubscribe = (userProvider) => messageStore.unsubscribe(`telegram-${userProvider.idUserProvider}`)

  /**
   * =============================================================================
   * Listen for new messages for all Telegram Users
   */
  // TODO: make this available as a setting so people can disable their telegram messenger chat stream by default.
  const userProviderTelegram = await models.UserTelegram.findAll({})
  userProviderTelegram.forEach(chatSubscribe)

  /**
   * =============================================================================
   * Bot Command Listening Stuff
   */

  /**
   * =============================================================================
   * /link
   */
  bot.onText(/\/(link)(@[A-z0-9._-]*)?$/i, response.use(onlyPrivate)(async (msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    if (msg.auth.user) {
      // TODO: implement unlink command
      return msg.quickResponse('You are already linked to a mirroring.chat account at this time. If you would like to unlink this telegram chat, please contact support.')
    }
    const token = `${generateTokenAuth(msg.auth.userTelegram.idUserProvider)}`
    const link = `${config.server.protocolPublic}://${config.server.hostname}${config.server.portPublic === '' ? '' : `:${config.server.portPublic}`}/auth/telegram/${token}`
    return msg.quickResponse(`🔑 Click or copy the link to link this chat to your mirroring.chat account on the website [link expires in 15 minutes]: 🔑\n${link}`)
  }))

  bot.onText(/\/(startChat)(@[A-z0-9._-]*)?$/i, response.use(onlyPrivate)(async (msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    if (!msg.auth.user) {
      return msg.quickResponse('You are not linked to an account please run /link to do so before trying to start the chat.')
    }
    const result = chatSubscribe(msg.auth.userTelegram)
    if (result !== true) log(`start chat with result: ${result}`)
    return msg.quickResponse('Started streaming chat messages…')
  }))

  bot.onText(/\/(stopChat)(@[A-z0-9._-]*)?$/i, response.use(onlyPrivate)(async (msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    if (!msg.auth.user) {
      return msg.quickResponse('You are not linked to an account please run /link to do so before trying to start the chat.')
    }
    const result = chatUnsubscribe(msg.auth.userTelegram)
    if (result !== true) log(`stop chat with result: ${result}`)
    return msg.quickResponse('Stopped streaming chat messages…')
  }))


  /**
   * =============================================================================
   * /help or /start
   */
  bot.onText(/\/(help|start)(@[A-z0-9._-]*)?$/i, response(async (msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    msg.quickResponse(`Hey ${msg.from.first_name},
I am 🤖 @${botConfig.username} 👋, I am here to give you notifications about your live chats on YouTube, Twitch, and Facebook. All delivered to this chat.

/help - Helpful info on how to use me
/link - Login on the website
/feedback - Send feedback to @MirroringChat

To stay up to day with me, and know when I change the way I work, please join the @MirroringChat.
`, {
      parse_mode: 'markdown',
    })
  }))

  /**
   * =============================================================================
   * /testOnlyGroupAdmin : test command was received by a group admin
   */
  bot.onText(/\/testOnlyGroupAdmin(@[A-z0-9._-]*)?$/i, response.use(onlyGroupAdmin)((msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    msg.quickResponse('SUCCESS: This was only sent [to the group] because you are a group admin.')
  }))

  /**
   * =============================================================================
   * /testOnlyPrivate : test message was sent by a users private chat
   */
  bot.onText(/\/testOnlyPrivate(@[A-z0-9._-]*)?$/i, response.use(onlyPrivate)((msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    msg.quickResponse('SUCCESS: You can only read this if you are chatting with the bot in private.')
  }))

  /**
   * =============================================================================
   * /feedback : tells user how to get help.
   */
  bot.onText(/\/feedback(@[A-z0-9._-]*)?$/i, response((msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    msg.quickResponse(`To send feedback, please join the @MirroringChat group for feature discussions, usage ideas, and to get future updates.
Thank You 😊`)
  }))

  /**
   * =============================================================================
   * /echo : replies with what was sent
   */
  bot.onText(/\/echo (.+)/, response((msg, match) => {
    log(`command found in message ${msg.text} from user ${msg.from.id} in chat ${msg.chat.id}`)
    const resp = match[1] // the captured "whatever"
    msg.quickResponse(resp)
  }))

  /**
   * =============================================================================
   * Listen for any kind of message. There are different kinds of messages.
   * Don't do 'authConnection(function () => {})' here because it would duplicate the work done by the server
   */
  bot.on('message', (msg) => {
    log(`message received "${msg.text}" from {idUserProvider: ${msg.from.id}, idChatTelegram: ${msg.chat.id}, username: ${msg.from.username}, title: ${msg.chat.title}, date: ${new Date(msg.date)}}`)
  })

  // Be aware of the all encapsulating init method.
}
// Run the init method if the file was called directly and not through 'require'
if (require.main === module) {
  init()
}
// Be aware of the all encapsulating init method.
