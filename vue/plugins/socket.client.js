import Vue from 'vue'
import store from '@/store'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

const connection = '/'

const io = new VueSocketIO({
  debug: true,
  connection: SocketIO(connection),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
})

Vue.use(io)

export default io

console.log('socket.client initialized')
