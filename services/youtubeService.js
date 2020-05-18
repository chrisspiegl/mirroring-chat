process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:youtubeService`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:youtubeService:error`)

const { google } = require('googleapis')

const { redisClient } = require('server/redis')
const { refreshTokenAccess } = require('server/passportRefresh')

const { OAuth2 } = google.auth
const youtube = google.youtube('v3')

const { clientId, clientSecret } = config.passport.google
const youtubeService = {}

const auth = new OAuth2(clientId, clientSecret)

youtubeService.authorize = async (userProviderParam) => {
  // Refresh oauth tokens for user
  const userProvider = await refreshTokenAccess('google', userProviderParam).catch((err) => {
    error(`Error while refreshing the tokens for youtube ${userProvider.displayName}/${userProvider.idUserProvider}: `, err)
  })
  const tokens = {
    refresh_token: userProvider.tokenRefresh,
    access_token: userProvider.tokenAccess,
  }
  auth.setCredentials(tokens)
  log(`successfully set credentials tokens for ${userProvider.displayName}/${userProvider.idUserProvider}`)
}

youtubeService.findActiveChat = async () => {
  // IMPROVE: may be able to improve and only do one request (or make them happen at the same time)
  const responseUpcoming = await youtube.liveBroadcasts.list({
    auth,
    part: 'snippet', // id, snippet, contentDetails, and status.
    broadcastStatus: 'upcoming',
    // mine: 'true', == broadcastStatus: 'all'
  })
  const responseActive = await youtube.liveBroadcasts.list({
    auth,
    part: 'snippet', // id, snippet, contentDetails, and status.
    broadcastStatus: 'active',
    // mine: 'true', == broadcastStatus: 'all'
  })
  const liveActive = responseActive.data.items
  const liveUpcoming = responseUpcoming.data.items
  const liveBroadcasts = liveActive.concat(liveUpcoming)
  return liveBroadcasts
}

youtubeService.trackingChatActive = false
youtubeService.startTrackingChat = (broadcast, tracking, listener) => {
  log(`startTrackingChat for ${broadcast.snippet.title}`)
  youtubeService.trackingChatActive = tracking

  const getChatMessages = async () => {
    log(`getChatMessages for ${broadcast.snippet.title}`)
    const redisKey = `${config.slugShort}:${config.envShort}:youtube:broadcast:nextpage:${broadcast.etag}`
    const nextPage = await redisClient.getAsync(redisKey) || ''
    const response = await youtube.liveChatMessages.list({
      auth,
      part: 'snippet,authorDetails',
      liveChatId: broadcast.snippet.liveChatId,
      pageToken: nextPage,
    })
    const { data } = response
    const newMessages = data.items
    redisClient.set(redisKey, data.nextPageToken, (err, results) => {
      log('redis:set:nextPage', { err, results })
    })
    log(`received new messages and instructed to poll again in ${data.pollingIntervalMillis / 1000} seconds`)
    // if (youtubeService.trackingChatActive) setTimeout(getChatMessages, data.pollingIntervalMillis)
    if (youtubeService.trackingChatActive) setTimeout(getChatMessages, 1000 * 60) // polling once per minute
    if (newMessages.length > 0) listener(newMessages)
  }
  getChatMessages()
  // setInterval(getChatMessages, 5000) // could use standard interval, currently relying on suggested interval based on youtube reply
}

youtubeService.stopTrackingChat = () => {
  youtubeService.trackingChatActive = false
}

youtubeService.insertMessage = (broadcast, messageText) => {
  youtube.liveChatMessages.insert({
    auth,
    part: 'snippet',
    resource: {
      snippet: {
        type: 'textMessageEvent',
        liveChatId: broadcast.snippet.liveChatId,
        textMessageDetails: {
          messageText,
        },
      },
    },
  },
  () => {
    log('sent message to youtube')
  })
}

module.exports = youtubeService
