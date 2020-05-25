process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:socket`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:socket:error`)

const socketio = require('socket.io')
const uuid = require('uuid')

const messageStore = require('server/messagesStore')
const redisKeyGenerator = require('server/redisKeyGenerator')

// TODO: make this context based with cleaner functions for the socket to process stuff.
// EXAMPLE: new Connection() => this.socket available in all functions, and listening on stuff…

module.exports = (http) => {
  log('initializing socket.io connections')
  const io = socketio(http)

  // NOTE: future note for socket.io with authentication
  // io.use((socket, next) => {
  //   console.log('I AM ACTUALLY HERE')
  //   // if (socket.handshake.query && socket.handshake.query.token) {
  //   //   jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function (err, decoded) {
  //   //     if (err) return next(new Error('Authentication error'));
  //   //     socket.decoded = decoded;
  //   //     next();
  //   //   });
  //   // } else {
  //   //   next(new Error('Authentication error'));
  //   // }
  // })

  io.of('/mirroring').use((socket, next) => {
    log('mirroring namespace middleware')
    next()
  }).on('connection', (socket) => {
    const idSocket = uuid.v4()
    log('on:connection')

    this.channelName = ''

    socket.on('hello', (data) => {
      log('on:hello', data)
      socket.emit('hello', 'this is the server speaking')
    })

    const onNewMessage = (key, message) => {
      log('on:redis:message for: ', key, ' and-message ', message)

      // Do not handle messages that are not in the `keyStream` key range for now
      if (key !== redisKeyGenerator.messages.stream(this.channelName)) return
      const keySocket = `message-to-${message.idUser}`
      log('socket:emit:', keySocket)
      socket.emit(keySocket, {
        status: 200,
        socketVersion: 1,
        data: {
          messages: [
            message,
          ],
        },
      })
    }

    socket.on('disconnect', () => {
      log('on:disconnect for: ', this.channelName)
      messageStore.unsubscribe(`socket-io-${idSocket}`)
    })

    socket.on('chat-channel-disconnect', (data) => {
      log('on:chat-channel-disconnect for: ', this.channelName)
      messageStore.unsubscribe(`socket-io-${idSocket}`)
    })

    socket.on('chat-channel-connect', (data) => {
      log('on:chat-channel-connect with: ', data)
      const { channelName } = data
      this.channelName = channelName
      log('streamingMessagesStart for: ', this.channelName)
      // FIXME: this stays subscribed (and sending socket replies) until unsubscribed, handle
      // NOTE: Already handling `disconnect` and `destroy()` events from frontend, however, not sure what happens on connection interrupt.
      messageStore.subscribe(`socket-io-${idSocket}`, this.channelName, onNewMessage)
    })
  })

  return io
}
