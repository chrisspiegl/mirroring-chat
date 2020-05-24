process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botYoutube`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botYoutube:error`)

const pnotice = require('pushnotice')(`${config.slug}:botYoutube`, {
  env: config.env,
  chat: config.pushnotice.chat,
  debug: true,
  disabled: config.pushnotice.disabled,
})

const moment = require('moment-timezone')
const { CronJob } = require('cron')

const messagesStore = require('server/messagesStore')
const models = require('database/models')
const RedisPubSubManager = require('server/redisPubSubManager')
const redisKeyGenerator = require('server/redisKeyGenerator')
const YoutubeService = require('./youtubeService')

const rpsm = new RedisPubSubManager()

// Lot's of notes taken from: https://medium.com/@jonnykalambay/doing-it-live-learn-youtubes-api-by-making-a-chatbot-d55e2156715f
// TODO: improve polling to include error handling, get inspiration from: https://github.com/JamesFrost/youtube-stream/tree/20291650f92bb7ed2acd52d9c4773843bb7bb155

const crawlUserBroadcasts = async (userProvider, broadcastStatus) => {
  // TODO: needs to be updated to mark no longer existing streams to be set to not track and status = past
  log(`${userProvider.displayName}: crawlUserBroadcasts for ${broadcastStatus} broadcasts`)
  const youtubeService = new YoutubeService(userProvider)
  await youtubeService.authorize()
  const broadcasts = await youtubeService.findBroadcasts(broadcastStatus)
  log(`${userProvider.displayName}: found ${broadcasts.length} ${broadcastStatus} broadcasts`)
  broadcasts.forEach(async (broadcast) => {
    const broadcastOptions = {
      idChatProvider: broadcast.id,
      idUser: userProvider.idUser,
      provider: 'youtube',
      title: broadcast.snippet.title,
      providerObject: broadcast,
      status: (broadcast.snippet.isDefaultBroadcast) ? 'permanent' : broadcastStatus,
      isPermanent: broadcast.snippet.isDefaultBroadcast,
      isTracked: true,
    }
    let broadcastInDatabase = await models.Chat.findOne({
      where: {
        idChatProvider: broadcastOptions.idChatProvider,
      },
    })

    if (broadcastInDatabase) {
      broadcastInDatabase = await broadcastInDatabase.update(broadcastOptions)
      log(`${userProvider.displayName}: updating broadcast ${broadcastOptions.title}`)
      rpsm.publish(redisKeyGenerator.events, {
        event: redisKeyGenerator.event.CHAT_UPDATED,
        chat: broadcastInDatabase,
      })
    } else {
      broadcastInDatabase = await models.Chat.create(broadcastOptions)
      log(`${userProvider.displayName}: creating broadcast ${broadcastOptions.title}`)
      rpsm.publish(redisKeyGenerator.events, {
        event: redisKeyGenerator.event.CHAT_CREATED,
        chat: broadcastInDatabase,
      })
    }
  })
}

const runCrawlUserBroadcasts = (broadcastStatus) => {
  log(`init crawler for ${broadcastStatus} user broadcasts`)
  return async () => {
    log(`run crawler for ${broadcastStatus} user broadcasts`)
    const users = await models.UserGoogle.findAll()
    await users.forEach(async (userProvider) => {
      await crawlUserBroadcasts(userProvider, broadcastStatus)
    })
    log(`finished crawler for ${broadcastStatus} user broadcasts`)
  }
}

const runCrawlChats = async () => {
  const chats = await models.Chat.findAll({
    where: {
      provider: 'youtube',
      isTracked: true,
    },
    include: [
      {
        model: models.User,
        include: [models.UserGoogle],
      },
    ],
  })
  log(`run chat crawler for ${chats.length} broadcasts`)
  await chats.forEach(async (chat) => {
    const userProvider = chat.User.UserGoogle
    log(`${userProvider.displayName}: crawl chat ${chat.title} for new messages`)
    const youtubeService = new YoutubeService(userProvider)
    await youtubeService.authorize()

    const newMessages = await youtubeService.getChatMessages(chat.providerObject)
    log(`${userProvider.displayName}: found ${newMessages.length} new messages for chat ${chat.title}`)
    newMessages.forEach((message) => {
      console.log('runCrawlChats -> message', message)
      messagesStore.addMessage({
        idChatMessageProvider: message.id,
        idChat: chat.idChat,
        idUser: userProvider.idUser,
        displayName: message.authorDetails.displayName,
        message: message.snippet.displayMessage,
        provider: 'youtube',
        providerObject: message,
        sentAt: moment(message.snippet.publishedAt),
      })
    })
  })
}

const init = async () => {
  await models.init()
  const jobUserBroadcastsActive = new CronJob('0 */5 * * * *', runCrawlUserBroadcasts('active'), () => log('Cron jobUserBroadcastsActive Finished'), true, 'UTC', this, true)
  const jobUserBroadcastsUpcoming = new CronJob('0 0 * * * *', runCrawlUserBroadcasts('upcoming'), () => log('Cron jobUserBroadcastsUpcoming Finished'), true, 'UTC', this, true)
  const jobChat = new CronJob('0 * * * * *', runCrawlChats, () => log('Cron jobChat Finished'), true, 'UTC', this, true)
}

process.on('unhandledRejection', async (reason, promise) => {
  error('unhandledRejection', reason.stack || reason, promise)
  pnotice(`unhandledRejection:\n${JSON.stringify(reason)}`, 'ERROR')
})

// Run the init method if the file was called directly and not through 'require'
if (require.main === module) {
  init()
}
