import Vue from 'vue'
import store from '@/store'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

const url = '/mirroring'
const socketConnection = SocketIO(url, {
  // transports: ['polling', 'websocket'],
})

const io = new VueSocketIO({
  debug: true,
  connection: socketConnection,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
})

Vue.use(io)

export default io

Vue.$log.debug('socket.client.js initialized')
