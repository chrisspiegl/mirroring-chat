process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:socket`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:socket:error`)

const socketio = require('socket.io')

const { subscriber: redisSubscriber } = require('server/redis')
const { messageDecode } = require('server/messagesStore')

const keyStream = `${config.slugShort}:${config.envShort}:messages:stream:`

const sockets = {}

// TODO: make this context based with cleaner functions for the socket to process stuff.
// EXAMPLE: new Connection() => this.socket available in all functions, and listening on stuff…

const init = async (http) => {
  log('initializing socket.io connections')
  const io = socketio(http)
  sockets.io = io

  io.on('connection', (socket) => {
    log('on:connection')

    this.channelName = ''
    this.keyStreamChannel = ''

    socket.on('hello', (data) => {
      log('on:hello', data)
      socket.emit('hello', 'this is the server speaking')
    })


    const onRedisMessage = (keyRedis, message) => {
      const messageDecoded = messageDecode(message)
      log('on:redis:message for: ', keyRedis, ' and-message ', messageDecoded)

      // Do not handle messages that are not in the `keyStream` key range for now
      if (keyRedis !== this.keyStreamChannel) return
      const keySocket = `message-to-${messageDecoded.channelName}`
      log('socket:emit:', keySocket)
      socket.emit(keySocket, {
        status: 200,
        socketVersion: 1,
        data: {
          channelName: messageDecoded.channelName,
          messages: [
            messageDecoded,
          ],
        },
      })
    }

    socket.on('disconnect', () => {
      log('on:disconnect for: ', this.keyStreamChannel)
      redisSubscriber.removeListener('message', onRedisMessage)
      redisSubscriber.unsubscribe(this.keyStreamChannel)
      // io.emit('user disconnected')
    })

    socket.on('chat-channel-disconnect', (data) => {
      log('on:chat-channel-disconnect for: ', this.keyStreamChannel)
      redisSubscriber.removeListener('message', onRedisMessage)
      redisSubscriber.unsubscribe(this.keyStreamChannel)
    })

    socket.on('chat-channel-connect', (data) => {
      log('on:chat-channel-connect with: ', data)
      const { channelName } = data
      this.channelName = channelName
      this.keyStreamChannel = keyStream + this.channelName
      log('streamingMessagesStart for: ', this.keyStreamChannel)
      redisSubscriber.on('message', onRedisMessage)
      // FIXME: this stays subscribed (and sending socket replies) until unsubscribed, handle
      // NOTE: Already handling `disconnect` and `destroy()` events from frontend, however, not sure what happens on connection interrupt.
      redisSubscriber.subscribe(this.keyStreamChannel)
    })
  })

  return sockets
}

sockets.init = init

module.exports = sockets
