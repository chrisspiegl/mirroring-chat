<template lang="pug">
  v-container.chat.fill-height
    h1 Chat Twitch \#{{channelName}}
    .boxToFillHeight
      .chat-container(v-chat-scroll="{always: false, notSmoothOnInit: true, smooth: true}")
        .message(v-for="message in messages" :key="message.timestamp" :class="`${message.provider}-bg`") {{message.timestamp | moment('YYYY-MM-DD HH:mm:ss')}} [{{message.provider}}/{{message.displayName}}]: {{message.message}}
        //- .message.facebook-bg facebook Message
        //- .message.discord-bg discord Message
        //- .message.twitch-bg twitch Message
        //- .message.telegram-bg telegram Message
        //- .message.youtube-bg youtube Message

      form(@submit.prevent="send")
        input.newMessage(type="text" v-model="newMessage" placeholder="Enter message here")
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
    server(data) {
      console.log('server: ', data)
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

<style lang="scss" scoped>
.fill-height {
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
}

.boxToFillHeight {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 1 auto;
}

.chat-container {
  flex: 1 1 auto;
  overflow-y: auto;
  height: 100px; /* == min-height: 100px*/

  .message {
    border-bottom: solid 1px #ccc;
    padding: 0.5rem 0.2rem;
  }
}

form .newMessage {
  width: 100%;
  padding: 0.3rem 0.5rem;
  background: #f1f1f1;
  color: #2c2f33;
  flex: 1 1 auto;
  outline: none;
}

.twitch-bg {
  background-color: #6441a5;
  color: #f1f1f1;
}
.twitch {
  // background-color: #fff;
  color: #6441a5;
}
.youtube-bg {
  background-color: #ff0000;
  color: #fff;
}
.youtube {
  // background-color: #fff;
  color: #ff0000;
}
.facebook-bg {
  background-color: #3b5998;
  color: #fff;
}
.facebook {
  // background-color: #fff;
  color: #3b5998;
}
.discord-bg {
  background-color: #7289da;
  color: #2c2f33;
}
.discord {
  // background-color: #fff;
  color: #7289da;
}
.telegram-bg {
  background-color: #0088cc;
  color: #fff;
}
.telegram {
  // background-color: #fff;
  color: #0088cc;
}
</style>
