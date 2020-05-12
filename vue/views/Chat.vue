<template>
  <div class="chat">
    <v-container>
      <h1>Chat Twitch #{{this.channelName}}</h1>

      <div class="card bg-info">
          <ul class="list-group list-group-flush">
              <li class="list-group-item" v-for="message in messages" :key="message.timestamp">
                {{message.timestamp | moment('YYYY-MM-DD HH:mm:ss')}} [{{message.provider}}/{{message.displayName}}]: {{message.message}}
              </li>
          </ul>

          <div class="card-body">
              <form @submit.prevent="send">
                  <div class="form-group">
                      <input type="text" class="form-control" v-model="newMessage"
                          placeholder="Enter message here">
                  </div>
              </form>
          </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import socket from '@/plugins/socket.client'

// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Chat',

  components: {},

  data() {
    return {
      newMessage: null,
      messages: [],
      channelName: 'spieglio', // TODO: make this somehow user login dependent
    }
  },

  watch: {
    newMessage(value) {},
  },

  mounted() {
    axios
      .get(`/api/v1/chat/messages/${this.channelName}`)
      .then((response) => {
        this.messages = response.data.data.messages
      })
  },

  methods: {
    send() {
      console.log('Message Typed and Hit Enter: ', this.newMessage)
      // this.messages.push({
      //   message: this.newMessage,
      //   type: 0,
      //   user: 'Me',
      // })

      // socket.emit('chat-message', {
      //   message: this.newMessage,
      //   user: this.username,
      // })
      // this.newMessage = null
    },
  },

  sockets: {
    connect() {
      console.log('chat socket connected')
    },
    hello(data) {
      console.log('socket on *hello* with', data)
    },
  },

  created() {
    console.log(this.$socket)

    // REMEMBER: this is how to subscribe dynamically (not via the definitions in vue component `sockets:{}`)
    this.sockets.subscribe(`message-to-${this.channelName}`, (data) => {
      console.log(`socket received message for ${this.channelName}`)

      data.data.messages.forEach((message) => {
        this.messages.push(message)
      })
    })

    this.$socket.emit('hello', 'client says hey')
    this.$socket.emit('chat-channel-connect', {
      channelName: this.channelName,
    })
  },
  destroyed() {
    this.$socket.emit('chat-channel-disconnect', {
      channelName: this.channelName,
    })
  },
}
console.log('Chat.vue initialized')
</script>
