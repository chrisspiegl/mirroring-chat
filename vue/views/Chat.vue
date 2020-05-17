<template>
  <div class="chat">
    <v-container>
      <h1>Chat Twitch #{{channelName}}</h1>

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
import { mapGetters, mapState } from 'vuex'
import apiCall from '@/utils/api'

export default {
  name: 'Chat',

  components: {},

  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
    ...mapState({
      channelName: (state) => state.user.profile.UserTwitch.username, // TODO: make this somehow idUser dependent
      user: (state) => state.user.profile,
    }),
  },

  data() {
    return {
      newMessage: null,
      messages: [],
    }
  },

  mounted() {
    apiCall({
      url: `/v1/chat/messages/${this.channelName}`,
      method: 'GET',
    }).then((resp) => {
      this.messages = resp.data.messages
    }).catch((err) => {
      console.error('Error requesting chat messages: ', err)
    })
  },

  watch: {
    newMessage(value) { console.log('Typing: ', value) },
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
    console.log(this.channelName)

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
