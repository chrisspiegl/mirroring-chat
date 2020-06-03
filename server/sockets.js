process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:socket`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:socket:error`)

const socketio = require('socket.io')

const messagesStore = require('server/messagesStore')

// TODO: make this context based with cleaner functions for the socket to process stuff.
// EXAMPLE: new Connection() => this.socket available in all functions, and listening on stuff…

module.exports = (http) => {
  log('initializing socket.io connections')
  const io = socketio(http)

  // NOTE: future note for socket.io with authentication
  // io.use((socket, next) => {
  //   console.log('I AM ACTUALLY HERE')
  //   if (socket.handshake.query && socket.handshake.query.token) {
  //     jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function (err, decoded) {
  //       if (err) return next(new Error('Authentication error'));
  //       socket.decoded = decoded;
  //       next();
  //     });
  //   } else {
  //     next(new Error('Authentication error'));
  //   }
  // })

  io.of('/mirroring').use((socket, next) => {
    log('mirroring namespace middleware')
    // console.log(socket)
    next()
  }).on('connection', (socket) => {
    log(`on:connection:${socket.id}`)
    this.idUser = null
    socket.emit('CONNECT', 'socket with server established')

    // handling client disconnect
    socket.on('disconnect', () => {
      log('on:disconnect for: ', this.idUser)
      messagesStore.unsubscribe(`socket-io-${socket.id}`)
    })


    const onNewMessage = (key, message) => {
      log('on:redis:message for: ', key, ' and-message ', message)
      const keySocket = 'ADD_CHAT_MESSAGE'
      log('socket:emit:', keySocket)
      socket.emit(keySocket, {
        status: 200,
        socketVersion: 1,
        data: message,
      })
    }

    socket.on('CHAT_CONNECT', (data) => {
      log('on:CHAT_CONNECT with: ', data, socket.id)
      const { idUser } = data
      this.idUser = idUser
      log('streamingMessagesStart for: ', this.idUser)
      // FIXME: this stays subscribed (and sending socket replies) until unsubscribed, handle
      // NOTE: Already handling `disconnect` and `destroy()` events from frontend, however, not sure what happens on connection interrupt.
      messagesStore.subscribe(`socket-io-${socket.id}`, this.idUser, onNewMessage)
    })

    socket.on('CHAT_DISCONNECT', () => {
      log('on:CHAT_DISCONNECT for: ', this.idUser)
      messagesStore.unsubscribe(`socket-io-${socket.id}`)
    })
  })

  return io
}
