process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botTwitch`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botTwitch:error`)

const tmi = require('tmi.js')

const { refreshTokenAccess } = require('server/passportRefresh')
const models = require('database/models')
const { diskCache: cache } = require('server/cacheManager')
const messagesStore = require('server/messagesStore')

// Define configuration options

const init = async (userProviderParam = null) => {
  await models.init()
  let userProvider = userProviderParam
  if (userProvider === null) {
    userProvider = await models.UserTwitch.findOne({
      where: {
        username: config.passport.twitch.botname,
      },
    })
  }

  // Refresh oauth tokens for bot
  userProvider = await refreshTokenAccess('twitch', userProvider).catch((err) => {
    error('Error while refreshing the tokens for the mirroringbot on Twitch: ', err)
  })

  // Get all active users channels
  // TODO: needs to be limited at a later time (user must have been active in the past 7 days, channel must be enabled)
  // LATER: may also make sense to separate channels from users in the database
  const users = await models.UserTwitch.findAll({})
  const channels = users.map((user) => (user.displayName))

  const opts = {
    options: {
      clientId: config.passport.twitch.clientId,
      debug: true,
    },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: userProvider.username,
      password: `oauth:${userProvider.tokenAccess}`,
    },
    channels,
  }
  // Create a client with our options
  const client = new tmi.Client(opts)

  // Register our event handlers (defined below)

  // Connect to Twitch:
  client.connect().catch((err) => {
    error('Twitch Client Error: ', err)
  })

  // Called every time a message comes in
  function onMessageHandler(channel, context, msg, self) {
    // Ignore messages from the bot
    if (self) return
    // Ignore all messages that are not type chat for now
    if (context['message-type'] !== 'chat') return
    // Remove whitespace from chat message
    const msgCleaned = msg.trim()
    const channelName = channel.substring(1) // remove the # sign
    const userProviderForMessage = await models.UserTwitch.findOne({
      where: {
        username: channelName,
      },
    })
    messagesStore.add(userProviderForMessage.idUser, {
      id: context.id,
      provider: 'twitch',
      timestamp: parseInt(context['tmi-sent-ts']),
      username: context.username,
      displayName: context['display-name'],
      message: msgCleaned,
      providerObject: {
        channel,
        context,
        message: msg,
      },
    })
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    log(`connected-to:${addr}:${port}`)
  }

  function sendMessage(channel, username, message) {
    // TODO: Implement a way (maybe RSMQ) to relay messages form other platforms as well as the admin to this platform
    log(`sending-message-to:${channel}:via:mirroringbot`)
    // channel needs to be in format #channelname (the `#` at the start is important!)
    client.say(channel, `[${username}] ${message}`)
  }

  client.on('message', onMessageHandler)
  client.on('connected', onConnectedHandler)
}
init()
