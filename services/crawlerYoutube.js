process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botYoutube`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botYoutube:error`)

const moment = require('moment-timezone')

const messagesStore = require('server/messagesStore')
const models = require('database/models')
const youtubeService = require('./youtubeService')

// Lot's of notes taken from: https://medium.com/@jonnykalambay/doing-it-live-learn-youtubes-api-by-making-a-chatbot-d55e2156715f
// TODO: improve polling to include error handling, get inspiration from: https://github.com/JamesFrost/youtube-stream/tree/20291650f92bb7ed2acd52d9c4773843bb7bb155

const init = async () => {
  await models.init()

  const userProvider = await models.UserGoogle.findByPk('104111025133854439780')

  await youtubeService.authorize(userProvider)
  // TODO: Scan for new active live streams with chats in a certain interval instead of just once.
  const liveBroadcasts = await youtubeService.findActiveChat()
  liveBroadcasts.forEach((broadcast) => {
    youtubeService.startTrackingChat(broadcast, true, (messages) => {
      messages.forEach((message) => {
        messagesStore.add(userProvider.idUser, {
          id: message.etag,
          provider: 'youtube',
          timestamp: moment(message.snippet.publishedAt).unix(),
          username: message.authorDetails.displayName,
          displayName: message.authorDetails.displayName,
          message: message.snippet.textMessageDetails.messageText,
          providerObject: message,
        })
      })
    })
  })
  // await youtubeService.stopTrackingChat()
}
init()
