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
const redisKeyGenerator = require('server/redisKeyGenerator')

const { OAuth2 } = google.auth
const youtube = google.youtube('v3')

const { clientId, clientSecret } = config.passport.google

module.exports = class YouTubeService {
  constructor(userProvider) {
    this.userProvider = userProvider
  }

  async authorize() {
    this.auth = new OAuth2(clientId, clientSecret)
    // Refresh oauth tokens for user
    this.userProvider = await refreshTokenAccess('google', this.userProvider).catch((err) => {
      error(`Error while refreshing the tokens for youtube ${this.userProvider.displayName}/${this.userProvider.idUserProvider}: `, err)
    })
    const tokens = {
      refresh_token: this.userProvider.tokenRefresh,
      access_token: this.userProvider.tokenAccess,
    }
    this.auth.setCredentials(tokens)
    log(`successfully set credentials tokens for ${this.userProvider.displayName}/${this.userProvider.idUserProvider}`)
  }

  async findBroadcasts(broadcastStatus = 'active') {
    // TODO: make it so that eTags are used for caching
    // Caching can be achieved by storing the youtube.liveBroadcasts.list etag which is in 'response.data.etag'
    // This is done by: redis key for broadcast list etag, request the list without the "snippet" part, and check if the etag is different, if it is, request with 'snippet' if it is not, then do not request new data.
    const response = await youtube.liveBroadcasts.list({
      auth: this.auth,
      part: 'snippet', // id, snippet, contentDetails, and status.
      broadcastStatus,
      maxResults: 50, // TODO: pagination for requesting live streams
      // mine: true, // == broadcastStatus: 'all'
    })
    const broadcasts = response.data.items
    return broadcasts
  }


  async getChatMessages(broadcast) {
    log(`getChatMessages for ${broadcast.snippet.title}`)
    const redisKey = redisKeyGenerator.youtube.broadcast.nextPage(broadcast.id)
    const nextPage = await redisClient.getAsync(redisKey) || ''
    const response = await youtube.liveChatMessages.list({
      auth: this.auth,
      part: 'snippet,authorDetails',
      liveChatId: broadcast.snippet.liveChatId,
      maxResults: 2000,
      pageToken: nextPage,
    })
    const { data } = response
    const newMessages = data.items
    redisClient.set(redisKey, data.nextPageToken, (err, results) => {
      log('redis:set:nextPage', { err, results })
    })
    log(`received new messages and instructed to poll again in ${data.pollingIntervalMillis / 1000} seconds`)
    return newMessages
  }

  insertMessage(broadcast, messageText) {
    youtube.liveChatMessages.insert({
      auth: this.auth,
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
}
