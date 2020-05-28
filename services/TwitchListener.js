/* eslint-disable class-methods-use-this */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:botTwitch:listener`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:botTwitch:listener:error`)

const tmi = require('tmi.js')
const TwitchClient = require('twitch').default
const moment = require('moment-timezone')

const { refreshTokenAccess } = require('server/passportRefresh')
const models = require('database/models')
const { redis: cacheManager } = require('server/cacheManager')
const messagesStore = require('server/messagesStore')
const redisKeyGenerator = require('server/redisKeyGenerator')
const RedisPubSubManager = require('server/redisPubSubManager')

const rpsm = new RedisPubSubManager()
moment.tz.setDefault('UTC')

module.exports = class TwitchListener {
  constructor(userProvider = null) {
    this.username = config.passport.twitch.botname
    this.userProvider = userProvider
    this.isRunning = false
    this.twitchOptions = {
      options: {
        clientId: config.passport.twitch.clientId,
        debug: true,
      },
      connection: {
        secure: true,
        reconnect: true,
      },
    }
    this.botIsModInChannels = {}
    this.clientTmi = null
    this.clientTwitch = null
  }

  async start() {
    await models.init()
    await this.prepareLogin()
    this.chats = await this.getChatsToJoin()
    this.channels = this.chats.map((chat) => chat.idChatProvider)
    this.twitchOptions.channels = this.channels
    this.clientTwitch = TwitchClient.withClientCredentials(config.passport.twitch.clientId, config.passport.twitch.clientSecret)
    this.clientTmi = new tmi.Client(this.twitchOptions)
    this.connectHandlers()
    await this.doConnect()
    this.clientTmi.color('OrangeRed')
    // setTimeout(() => {
    //   this.doSay('#spieglio', 'I am here to test…')
    //   this.doEmoteonly('#spieglio')
    // }, 3000)
    return this
  }

  async checkIfBotIsModIn(channel, forceRealCheck) {
    if (this.botIsModInChannels[channel] && !forceRealCheck) {
      return this.botIsModInChannels[channel]
    }
    if (!this.botIsModInChannels[channel] && !forceRealCheck) {
      this.botIsModInChannels[channel] = false
    }
    const mods = await this.doMods(channel)
    const isModInChannel = mods.includes(this.username)
    this.botIsModInChannels[channel] = isModInChannel
    log(`channel:${channel}:bot-is-mod:${isModInChannel}`)
    return isModInChannel
  }

  isBotModIn(channel) {
    if (!this.botIsModInChannels[channel]) {
      this.botIsModInChannels[channel] = false
    }
    return this.botIsModInChannels[channel]
  }

  checkPrivileges(channel, userstate) {
    const { badges } = userstate
    const isAdmin = badges.admin
    const isBitsDonor = badges.bits
    const isBroadcaster = badges.broadcaster
    const isGlobalMod = badges.global_mod
    const isModerator = badges.moderator
    const isStaff = badges.staff
    const isSubscriber = badges.subscriber
    const isTurbo = badges.turbo
    const isModOrBroadcaster = isModerator || isBroadcaster
    return {
      isAdmin,
      isBitsDonor,
      isBroadcaster,
      isGlobalMod,
      isMod: isModerator,
      isModerator,
      isModOrBroadcaster,
      isStaff,
      isSubscriber,
      isTurbo,
    }
  }

  async prepareLogin() {
    if (!this.userProvider) {
      this.userProvider = await models.UserTwitch.findOne({
        where: {
          username: this.username,
        },
      })
    }

    // Refresh oauth tokens for bot
    try {
      this.userProvider = await refreshTokenAccess('twitch', this.userProvider)
    } catch (err) {
      error('Error while refreshing the tokens for the mirroringbot on Twitch: ', err)
    }

    this.twitchOptions.identity = {
      username: this.userProvider.username,
      password: `oauth:${this.userProvider.tokenAccess}`,
    }
  }

  replaceTwitchEmotes(message, userstate) {
    let messageWithEmotes = ''
    if (userstate.emotes) {
      const emoteIds = Object.keys(userstate.emotes)
      const emoteStart = emoteIds.reduce((_starts, id) => {
        const starts = { ..._starts }
        userstate.emotes[id].forEach((startEnd) => {
          const [start, end] = startEnd.split('-')
          starts[start] = {
            emoteUrl: `![](https://static-cdn.jtvnw.net/emoticons/v1/${id}/2.0)`,
            end,
          }
        })
        return starts
      }, {})
      const parts = Array.from(message)
      for (let i = 0; i < parts.length; i += 1) {
        const char = parts[i]
        const emoteInfo = emoteStart[i]
        if (emoteInfo) {
          messageWithEmotes += emoteInfo.emoteUrl
          i = emoteInfo.end
        } else {
          messageWithEmotes += char
        }
      }
    }
    return messageWithEmotes || message
  }

  // Action - Send an action message on a channel. (/me <message>)
  doAction(channel, message) {
    log(`action:action:on:${channel}:with:${message}`)
    return this.clientTmi.action(channel, message)
  }

  // Ban - Ban username on channel.
  doBan(channel, username, reason) {
    log(`action:ban:on:${channel}:with:${username}:reason:${reason}`)
    return this.clientTmi.ban(channel, username, reason)
  }

  // Clear - Clear all messages on a channel.
  doClear(channel) {
    log(`action:clear:on:${channel}`)
    return this.clientTmi.clear('channel')
  }

  // Color - Change the color of your username.
  doColor(color) {
    log(`action:color:to:${color}`)
    return this.clientTmi.color(color)
  }

  // Commercial - Run commercial on a channel for X seconds.
  doCommercial(channel, seconds) {
    log(`action:commercial:on:${channel}:for:${seconds}:seconds`)
    return this.clientTmi.commercial(channel, seconds)
  }

  // Connect - Connect to server.
  doConnect() {
    log('action:connect')
    if (!this.clientTmi) throw new Error('connect -> can not connect if client is not initialized')
    try {
      return this.clientTmi.connect()
    } catch (err) {
      this.isRunning = false
      error('Twitch IRC client error caught…', err)
      return false
    }
  }

  // Deletemessage - Delete message ID in a channel.
  doDeletemessage(channel, idMessage) {
    log(`action:deletemessage:on:${channel}:idMessage:${idMessage}`)
    return this.clientTmi.deletemessage(channel, idMessage)
  }

  // Disconnect - Disconnect from server.
  doDisconnect() {
    log('action:disconnect')
    return this.clientTmi.disconnect()
  }

  // Emoteonly - Enable emote-only on a channel.
  doEmoteonly(channel) {
    log(`action:emoteonly:on:${channel}`)
    // TODO: limit all commands that need mod status by adding the check and the update for the mod status in them so that the bot minimizes the risk of sending too many commands where it is not actually a moderator.
    if (!this.isBotModIn(channel)) {
      log(`action:emoteonly:on:${channel}:bot-is-not-mod`)
      return false
    }
    return this.clientTmi.emoteonly(channel).catch((err) => {
      switch (err) {
        case 'no_permission':
          this.botIsModInChannels[channel] = false
          break

        case 'already_emote_only_on':
          log(`action:emoteonly:on:${channel}:emoteonly-already-on`)
          break

        default:
          error(err)
          break
      }
    })
  }

  // Emoteonlyoff - Disable emote-only on a channel.
  doEmoteonlyoff(channel) {
    log(`action:emoteonlyoff:on:${channel}`)
    return this.clientTmi.emoteonlyoff(channel)
  }

  // Followersonly - Enable followers-only on a channel.
  doFollowersonly(channel) {
    log(`action:followersonly:on:${channel}`)
    return this.clientTmi.followersonly(channel, 30)
  }

  // Followersonlyoff - Disable followers-only on a channel.
  doFollowersonlyoff(channel) {
    log(`action:followersonlyoff:on:${channel}`)
    return this.clientTmi.followersonlyoff(channel)
  }

  // Host - Host a channel.
  doHost(channel, target) {
    log(`action:host:on:${channel}:target:${target}`)
    return this.clientTmi.host(channel, target)
  }

  // Join - Join a channel.
  doJoin(channel) {
    log(`action:join:on:${channel}`)
    return this.clientTmi.join(channel).then((data) => {
      if (!this.channels.includes(channel)) this.channels.push(channel)
    })
  }

  // Mod - Mod username on channel.
  doMod(channel, username) {
    log(`action:mod:on:${channel}:mod:${username}`)
    return this.clientTmi.mod(channel, username)
  }

  // Mods - Get list of mods on a channel.
  doMods(channel) {
    log(`action:mods:on:${channel}`)
    return this.clientTmi.mods(channel)
  }

  // Part - Leave a channel.
  doPart(channel) {
    log(`action:part:on:${channel}`)
    return this.clientTmi.part(channel).then((data) => {
      this.channels = this.channels.filter((channelCheck) => channelCheck !== channel)
    })
  }

  // Ping - Send a PING to the server.
  doPing() {
    log('action:ping')
    return this.clientTmi.ping()
  }

  // R9kbeta - Enable R9KBeta on a channel.
  doR9kbeta(channel) {
    log(`action:r9kbeta:on:${channel}`)
    return this.clientTmi.r9kbeta(channel)
  }

  // R9kbetaoff - Disable R9KBeta on a channel.
  doR9kbetaoff(channel) {
    log(`action:r9kbetaoff:on:${channel}`)
    return this.clientTmi.r9kbetaoff(channel)
  }

  // Raw - Send a RAW message to the server.
  doRaw(raw) {
    log(`action:raw:with:${raw}`)
    return this.clientTmi.raw(raw)
  }

  // Say - Send a message on a channel.
  doSay(_channel, message) {
    let channel = _channel
    log(`action:say:on:${channel}:message:${message}`)
    if (channel.charAt(0) !== '#') channel = `#${channel}` // add a # symbol if it is not at the start of the channel
    // TODO: upon implementing the ability to send messages, I will also have to make sure that the bot does not get locked by the rate limit which will probably be '20 messages in 30 seconds' at te start. The code below is doing exactly that by managing a throttled queue which executes as fast as possible, yet limiting to count of calls per interval.
    // const { default: PQueue } = require('p-queue')
    // const throttle = new PQueue({
    //   concurrency: 1,
    //   interval: 30 * 1000,
    //   intervalCap: 20,
    // });
    // (async () => {
    //   setInterval(async () => {
    //     const ret = await throttle.add(() => {
    //       // make a network request.
    //       const secDiff = ((Date.now() - now) / 1000).toFixed()
    //       // console.log(`x:${x}: ${secDiff}s`)
    //       return `x: ${secDiff}s`
    //     })
    //     console.log(ret)
    //   }, 1000)

    //   setInterval(() => {
    //     console.log(throttle.size)
    //   }, 1000)
    // })()

    // TODO: implement sending of messages
    log(`channel:${channel} a message: ${message}`)
    return this.clientTmi.say(channel, message)
  }

  // Slow - Enable slow mode on a channel.
  doSlow(channel, length = 300) {
    log(`action:slow:on:${channel}:length:${length}`)
    return this.clientTmi.slow(channel, length)
  }

  // Slowoff - Disable slow mode on a channel.
  doSlowoff(channel) {
    log(`action:slowoff:on:${channel}`)
    return this.clientTmi.slowoff(channel)
  }

  // Subscribers - Enable subscriber-only on a channel.
  doSubscribers(channel) {
    log(`action:subscribers:on:${channel}`)
    return this.clientTmi.subscribers(channel)
  }

  // Subscribersoff - Disable subscriber-only on a channel.
  doSubscribersoff(channel) {
    log(`action:subscribersoff:on:${channel}`)
    return this.clientTmi.subscribersoff(channel)
  }

  // Timeout - Timeout username on channel for X seconds.
  doTimeout(channel, username, length = 300, reason = 'Spamming') {
    log(`action:timeout:on:${channel}:for:${username}:length:${length}:reason:${reason}`)
    // NOTE: These could be excluded from being sent if the message send queue is overly full to prevent clogging
    return this.clientTmi.timeout(channel, username, length, reason)
  }

  // Unban - Unban username on channel.
  doUnban(channel, username) {
    log(`action:unban:on:${channel}:for:${username}`)
    return this.clientTmi.unban(channel, username)
  }

  // Unhost - End the current hosting.
  doUnhost(channel) {
    log(`action:unhost:on:${channel}`)
    return this.clientTmi.unhost(channel)
  }

  // Unmod - Unmod user on a channel.
  doUnmod(channel, username) {
    log(`action:unmod:on:${channel}:for:${username}`)
    return this.clientTmi.unmod(channel, username)
  }

  // UnVIP - UnVIP user on a channel.
  doUnvip(channel, username) {
    log(`action:unvip:on:${channel}:for:${username}`)
    return this.clientTmi.unvip(channel, username)
  }

  // VIP - VIP username on channel.
  doVip(channel, username) {
    log(`action:vip:on:${channel}:for:${username}`)
    return this.clientTmi.vip(channel, username)
  }

  // VIPs - Get list of VIPs on a channel.
  doVips(channel) {
    log(`action:vips:on:${channel}`)
    return this.clientTmi.vips(channel)
  }

  // Whisper - Send an instant message to a user.
  doWhisper(user, message) {
    log(`action:whisper:to:${user}:with:${message}`)
    return this.clientTmi.whisper(user, message)
  }

  async onRedisPubSubEvent(key, event) {
    log(`redis:${event.event}`)
    switch (event.event) {
      case redisKeyGenerator.event.CHAT_CREATED:
        log('take action on channel created')
        if (event.chat.isTracked) {
          await this.doJoin(event.chat.idChatProvider)
        }
        break
      case redisKeyGenerator.event.CHAT_UPDATED:
        log('take action on channel updated')
        await this.doPart(event.chat.idChatProvider)
        if (event.chat.isTracked) {
          await this.doJoin(event.chat.idChatProvider)
        }
        break
      case redisKeyGenerator.event.CHAT_DELETED:
        log('take action on channel deleted')
        await this.doPart(event.chat.idChatProvider)
        break

      default:
        break
    }
  }

  connectHandlers() {
    if (!this.clientTmi) throw new Error('connectMessageHandler -> can not connect message handler if client is not initialized')
    rpsm.subscribe(redisKeyGenerator.events, this.onRedisPubSubEvent.bind(this))
    this.clientTmi.on('action', this.onAction.bind(this))
    this.clientTmi.on('anongiftpaidupgrade', this.onAnongiftpaidupgrade.bind(this))
    this.clientTmi.on('ban', this.onBan.bind(this))
    this.clientTmi.on('chat', this.onChat.bind(this))
    this.clientTmi.on('cheer', this.onCheer.bind(this))
    this.clientTmi.on('clearchat', this.onClearchat.bind(this))
    this.clientTmi.on('connected', this.onConnected.bind(this))
    this.clientTmi.on('connecting', this.onConnecting.bind(this))
    this.clientTmi.on('disconnected', this.onDisconnected.bind(this))
    this.clientTmi.on('emoteonly', this.onEmoteonly.bind(this))
    this.clientTmi.on('emotesets', this.onEmotesets.bind(this))
    this.clientTmi.on('followersonly', this.onFollowersonly.bind(this))
    this.clientTmi.on('giftpaidupgrade', this.onGiftpaidupgrade.bind(this))
    this.clientTmi.on('hosted', this.onHosted.bind(this))
    this.clientTmi.on('hosting', this.onHosting.bind(this))
    this.clientTmi.on('join', this.onJoin.bind(this))
    this.clientTmi.on('logon', this.onLogon.bind(this))
    this.clientTmi.on('message', this.onMessage.bind(this))
    this.clientTmi.on('messagedeleted', this.onMessagedeleted.bind(this))
    this.clientTmi.on('mod', this.onMod.bind(this))
    this.clientTmi.on('mods', this.onMods.bind(this))
    this.clientTmi.on('notice', this.onNotice.bind(this))
    this.clientTmi.on('part', this.onPart.bind(this))
    this.clientTmi.on('ping', this.onPing.bind(this))
    this.clientTmi.on('pong', this.onPong.bind(this))
    this.clientTmi.on('r9kbeta', this.onR9kbeta.bind(this))
    this.clientTmi.on('raided', this.onRaided.bind(this))
    // this.clientTmi.on('raw_message', this.onRaw_message.bind(this)) // NOTE: Ignoring raw messages as they are only useful for debugging.
    this.clientTmi.on('reconnect', this.onReconnect.bind(this))
    this.clientTmi.on('resub', this.onResub.bind(this))
    this.clientTmi.on('roomstate', this.onRoomstate.bind(this))
    this.clientTmi.on('serverchange', this.onServerchange.bind(this))
    this.clientTmi.on('slowmode', this.onSlowmode.bind(this))
    this.clientTmi.on('subgift', this.onSubgift.bind(this))
    this.clientTmi.on('submysterygift', this.onSubmysterygift.bind(this))
    this.clientTmi.on('subscribers', this.onSubscribers.bind(this))
    this.clientTmi.on('subscription', this.onSubscription.bind(this))
    this.clientTmi.on('timeout', this.onTimeout.bind(this))
    this.clientTmi.on('unhost', this.onUnhost.bind(this))
    this.clientTmi.on('unmod', this.onUnmod.bind(this))
    this.clientTmi.on('vips', this.onVIPs.bind(this))
    this.clientTmi.on('whisper', this.onWhisper.bind(this))
  }

  async getChatsToJoin() {
    // TODO: needs to be limited at a later time (user must have been active in the past 7 days)
    return models.Chat.findAll({
      where: {
        provider: 'twitch',
        isTracked: true,
      },
    })
  }

  // Action - Received action message on channel.
  onAction(channel, userstate, message, self) {
    if (self) return // NOTE: Ignore messages sent by the bot itself
    log(`channel:${channel} received event "Action - Received action message on channel"`)
    this.onChat(channel, userstate, message, self)
  }

  // Anongiftpaidupgrade - Username is continuing the Gift Sub they got from an anonymous user in channel.
  onAnongiftpaidupgrade(channel, username, userstate) {
    log(`channel:${channel}:user:${username} received event "Anongiftpaidupgrade - Username is continuing the Gift Sub they got from an anonymous user in channel"`)
  }

  // Ban - Username has been banned on a channel.
  onBan(channel, username, reason, userstate) {
    log(`channel:${channel}:user:${username} received event "Ban - Username has been banned on a channel"`)
  }

  // Chat - Received message on channel.
  async onChat(channel, _userstate, _message, self) {
    let message = _message
    const userstate = { ..._userstate }
    // if (self) return // NOTE: Ignore messages sent by the bot itself
    log(`channel:${channel} received event "Chat - Received message on channel"`)
    const channelName = channel.substring(1) // remove the # sign
    const chat = await models.Chat.findOne({
      where: {
        provider: 'twitch',
        idChatProvider: channelName,
      },
    })

    if (self) {
      this.botIsModInChannels[channel] = userstate.badges.moderator
      userstate.id = userstate.id || this.username
    }

    // Request the user from the Twitch Helix API (especially to get the `profile_image_url`)
    const userHelix = await cacheManager.wrap(redisKeyGenerator.twitch.userHelix(userstate.username), async () => {
      const { _data: userHelixRes } = await this.clientTwitch.helix.users.getUserByName(userstate.username)
      return userHelixRes
    }, { ttl: 60 * 10 /* 10 minutes */ })

    message = this.replaceTwitchEmotes(message, userstate)

    messagesStore.addMessage({
      idChatMessageProvider: userstate.id,
      idChat: chat.idChat,
      idUser: chat.idUser,
      provider: 'twitch',
      displayName: userstate['display-name'] || userstate.username,
      message,
      providerObject: {
        channel,
        userstate,
        userHelix,
      },
      sentAt: moment(parseInt(userstate['tmi-sent-ts']) || moment()),
    })
  }

  // Cheer - Username has cheered to a channel.
  onCheer(channel, userstate, message) {
    log(`channel:${channel} received event "Cheer - Username has cheered to a channel"`)
  }

  // Clearchat - Chat of a channel got cleared.
  onClearchat(channel) {
    log(`channel:${channel} received event "Clearchat - Chat of a channel got cleared"`)
  }

  // Connected - Connected to server.
  onConnected(address, port) {
    log('received event "Connected - Connected to server"')
  }

  // Connecting - Connecting to a server.
  onConnecting(address, port) {
    log('received event "Connecting - Connecting to a server"')
  }

  // Disconnected - Got disconnected from server.
  onDisconnected(reason) {
    log('received event "Disconnected - Got disconnected from server"')
  }

  // Emoteonly - Channel enabled or disabled emote-only mode.
  onEmoteonly(channel, enabled) {
    log(`channel:${channel} received event "Emoteonly - Channel enabled or disabled emote-only mode"`)
  }

  // Emotesets - Received the emote-sets from Twitch.
  onEmotesets(sets, obj) {
    log('received event "Emotesets - Received the emote-sets from Twitch"')
  }

  // Followersonly - Channel enabled or disabled followers-only mode.
  onFollowersonly(channel, enabled, length) {
    log(`channel:${channel} received event "Followersonly - Channel enabled or disabled followers-only mode"`)
  }

  // Giftpaidupgrade - Username is continuing the Gift Sub they got from sender in channel.
  onGiftpaidupgrade(channel, username, sender, userstate) {
    log(`channel:${channel}:user:${username} received event "Giftpaidupgrade - Username is continuing the Gift Sub they got from sender in channel"`)
  }

  // Hosted - Channel is now hosted by another broadcaster.
  onHosted(channel, username, viewers, autohost) {
    log(`channel:${channel}:user:${username} received event "Hosted - Channel is now hosted by another broadcaster"`)
  }

  // Hosting - Channel is now hosting another channel.
  onHosting(channel, target, viewers) {
    log(`channel:${channel}:hosting:${target}:for:${viewers} received event "Hosting - Channel is now hosting another channel"`)
    // TODO: add a way so that these types of notifications are also stored in the database as chat messages of some sort.
  }

  // Join - Username has joined a channel.
  async onJoin(channel, username, self) {
    if (self) { // NOTE: upon joining a channel, the bot should check if it is mod in said channel.
      await this.checkIfBotIsModIn(channel)
    }
    log(`channel:${channel}:user:${username} received event "Join - Username has joined a channel"`)
  }

  // Logon - Connection established, sending informations to server.
  onLogon() {
    log('received event "Logon - Connection established, sending informations to server"')
  }

  // Message - Received a message.
  onMessage(channel, userstate, message, self) {
    if (self) return // NOTE: Ignore messages sent by the bot itself
    // NOTE: Not logging because it would be overkill. Messages of type [chat, whisper, action] are handled in their respective own events.
    // log(`channel:${channel} received event "Message - Received a message"`)
    if (!['chat', 'action', 'whisper'].includes(userstate['message-type'])) {
      error(`channel:${channel} received event "Message" with unknown message-type of ${userstate['message-type']}`)
    }
  }

  // Messagedeleted - Message was deleted/removed.
  onMessagedeleted(channel, username, deletedMessage, userstate) {
    log(`channel:${channel}:user:${username} received event "Messagedeleted - Message was deleted/removed"`)
  }

  // Mod - Someone got modded on a channel.
  onMod(channel, username) {
    log(`channel:${channel}:user:${username} received event "Mod - Someone got modded on a channel"`)
  }

  // Mods - Received the list of moderators of a channel.
  onMods(channel, mods) {
    log(`channel:${channel} received event "Mods - Received the list of moderators of a channel"`)
  }

  // Notice - Received a notice from server.
  onNotice(channel, msgid, message) {
    log(`channel:${channel} received event "Notice - Received a notice from server"`)
  }

  // Part - User has left a channel.
  onPart(channel, username, self) {
    if (self) return // NOTE: Ignore messages sent by the bot itself
    log(`channel:${channel}:user:${username} received event "Part - User has left a channel"`)
  }

  // Ping - Received PING from server.
  onPing() {
    log('received event "Ping - Received PING from server"')
  }

  // Pong - Sent a PING request ? PONG.
  onPong(latency) {
    log('received event "Pong - Sent a PING request ? PONG"')
  }

  // R9kbeta - Channel enabled or disabled R9K mode.
  onR9kbeta(channel, enabled) {
    log(`channel:${channel} received event "R9kbeta - Channel enabled or disabled R9K mode"`)
  }

  // Raided - Channel is now being raided by another broadcaster.
  onRaided(channel, username, viewers) {
    log(`channel:${channel}:user:${username} received event "Raided - Channel is now being raided by another broadcaster"`)
  }

  // Raw_message - IRC data was received and parsed.
  // eslint-disable-next-line camelcase
  onRaw_message(messageCloned, message) {
    log('received event "Raw_message - IRC data was received and parsed"', message)
  }

  // Reconnect - Trying to reconnect to server.
  onReconnect() {
    log('received event "Reconnect - Trying to reconnect to server"')
  }

  // Resub - Username has resubbed on a channel.
  onResub(channel, username, months, message, userstate, methods) {
    log(`channel:${channel}:user:${username} received event "Resub - Username has resubbed on a channel"`)
  }

  // Roomstate - The current state of the channel.
  onRoomstate(channel, state) {
    log(`channel:${channel} received event "Roomstate - The current state of the channel"`, state)
    // TODO: this helps to get the current room state which i will have to display on the website (things like 'slow chat, follower only chat, subscriber chat, etc…)
  }

  // Serverchange - Channel is no longer located on this cluster.
  onServerchange(channel) {
    log(`channel:${channel} received event "Serverchange - Channel is no longer located on this cluster"`)
  }

  // Slowmode - Gives you the current state of the channel.
  onSlowmode(channel, enabled, length) {
    log(`channel:${channel} received event "Slowmode - Gives you the current state of the channel"`)
  }

  // Subgift - Username gifted a subscription to recipient in a channel.
  onSubgift(channel, username, streakMonths, recipient, methods, userstate) {
    log(`channel:${channel}:user:${username} received event "Subgift - Username gifted a subscription to recipient in a channel"`)
  }

  // Submysterygift - Username is gifting a subscription to someone in a channel.
  onSubmysterygift(channel, username, numbOfSubs, methods, userstate) {
    log(`channel:${channel}:user:${username} received event "Submysterygift - Username is gifting a subscription to someone in a channel"`)
  }

  // Subscribers - Channel enabled or disabled subscribers-only mode.
  onSubscribers(channel, enabled) {
    log(`channel:${channel} received event "Subscribers - Channel enabled or disabled subscribers-only mode"`)
  }

  // Subscription - Username has subscribed to a channel.
  onSubscription(channel, username, method, message, userstate) {
    log(`channel:${channel}:user:${username} received event "Subscription - Username has subscribed to a channel"`)
  }

  // Timeout - Username has been timed out on a channel.
  onTimeout(channel, username, reason, duration, userstate) {
    log(`channel:${channel}:user:${username} received event "Timeout - Username has been timed out on a channel"`)
  }

  // Unhost - Channel ended the current hosting.
  onUnhost(channel, viewers) {
    log(`channel:${channel} received event "Unhost - Channel ended the current hosting"`)
  }

  // Unmod - Someone got unmodded on a channel.
  onUnmod(channel, username) {
    log(`channel:${channel}:user:${username} received event "Unmod - Someone got unmodded on a channel"`)
  }

  // VIPs - Received the list of VIPs of a channel.
  onVIPs(channel, vips) {
    log(`channel:${channel} received event "VIPs - Received the list of VIPs of a channel"`)
  }

  // Whisper - Received a whisper.
  onWhisper(from, userstate, message, self) {
    if (self) return // NOTE: Ignore messages sent by the bot itself
    log(`from:${from} received event "Whisper - Received a whisper"`)
  }
}
