 <template lang="pug">
  //- v-container.fill-height
  v-container.fill-height
    .boxToFillHeight
      //- div
        v-toolbar(dense)
          v-btn-toggle(v-model="chatsToFollow", multiple, dense)
            v-btn.twitch-bg(icon, title="Show all messages from Twitch")
              v-icon $twitch
            v-btn.youtube-bg(icon, title="Show all messages from YouTube")
              v-icon $youtube
            v-btn.facebook-bg(icon, title="Show all messages from Facebook")
              v-icon $facebook

      div(v-bind="messages").chat-container
        vue-scroll(ref="vuescroll", :ops="vuescrollOps")
          v-card.mb-2
            v-card-title.justify-center You Reached the Top
            v-card-subtitle.text-center Currently this is limited to the past 50 messages on load. #[br] This may change in the future, let us know if this is important to you.
          v-card.mb-2(v-for="message in messages" :key="message.idChatMessage", outlined, :class="`${message.provider}-bg`")
            v-list-item
              v-list-item-avatar.mr-2.my-0(size=30)
                v-img(:src="avatar(message)")
              v-list-item-content
                v-list-item-title
                  v-icon(size="1rem") ${{message.provider}}
                  | /{{message.displayName}}
              v-list-item-action-text {{message.sentAt | moment("from", time)}}
              v-list-item-action-text
                v-card-actions
                  v-btn(icon, title="Ban")
                    v-icon $ban
                  v-btn(icon, title="Timeout")
                    v-icon $timeout
                  v-btn(icon, title="Highlight this message")
                    v-icon $highlight
                  v-btn(icon, title="Reply to this message")
                    v-icon $reply
                  v-btn(icon, title="Archive")
                    v-icon $check
            v-card-text {{message.message}}


      //- div
        v-toolbar()
          v-text-field(label="Send Message", hide-details="auto")
          v-item-group(dense)
            v-btn(icon, title="Send to All")
              v-icon $chat
            v-btn.twitch-bg(icon, title="Send to Twitch")
              v-icon $twitch
            v-btn.youtube-bg(icon, title="Send to YouTube")
              v-icon $youtube
            v-btn.facebook-bg(icon, title="Send to Facebook")
              v-icon $facebook
      div
        v-system-bar(color="transparent")
          v-spacer
          span(v-if="lastUpdated") Last chat message recieved
            = " "
            | {{lastUpdated | moment("from", time)}}
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
      channelName: (state) => state.user.profile.idUser,
      user: (state) => state.user.profile,
      time: (state) => state.time.now,
    }),
  },

  data() {
    return {
      newMessage: null,
      messages: [],
      lastUpdated: null,
      scrollBottom: true,
      scrollBottomOnInit: true,
      vuescrollOps: {
        scrollPanel: {
          initialScrollY: '100%',
          scrollingX: false,
          scrollingY: true,
          speed: 300,
        },
      },
    }
  },

  mounted() {
    this.$log.debug('Chat.vue mounted')
    apiCall({
      url: `/v1/chat/messages/${this.user.idUser}`,
      method: 'GET',
    }).then((resp) => {
      resp.data.messages.forEach((message) => {
        this.messages.push(message)
      })
      this.lastUpdated = new Date()
    }).catch((err) => {
      this.$log.error('Error requesting chat messages: ', err)
    })
  },

  watch: {
    newMessage(value) { this.$log.debug('Typing: ', value) },
    messages(messages) {
      this.$log.debug(`Currently displaying ${messages.length}`)
      const { scrollTop } = this.$refs.vuescroll.getPosition()
      const scrollBottom = scrollTop + this.$refs.vuescroll.$el.scrollHeight
      const elementScrollHeight = this.$refs.vuescroll.$children[0].$el.scrollHeight
      this.scrollBottom = (this.scrollBottomOnInit || scrollBottom > elementScrollHeight - 200)
      this.scrollBottomOnInit = false
      this.$nextTick(function $nextTick() {
        if (this.scrollBottom) {
          this.$refs.vuescroll.scrollTo({ y: '100%' })
        }
      })
    },
  },

  methods: {
    avatar(message) {
      let avatar = `https://api.adorable.io/avatars/285/${message.displayName}.png`
      switch (message.provider) {
        case 'twitch':
          if (message.providerObject && message.providerObject.userHelix) {
            avatar = message.providerObject.userHelix.profile_image_url
          }
          break
        case 'youtube':
          avatar = message.providerObject.authorDetails.profileImageUrl
          break

        default:
          break
      }
      return avatar
    },
    chatTopReached() {
      this.$log.debug('top of chat reached, TODO: load previous messages')
    },
    send() {
      this.$log.debug('Message Typed and Hit Enter: ', this.newMessage)
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
      this.$log.debug('chat socket connected')
    },
    hello(data) {
      this.$log.debug('socket on *hello* with', data)
    },
    server(data) {
      this.$log.debug('server: ', data)
    },
  },

  created() {
    // REMEMBER: this is how to subscribe dynamically (not via the definitions in vue component `sockets:{}`)
    this.sockets.subscribe(`message-to-${this.channelName}`, (data) => {
      this.$log.debug(`socket received message for ${this.channelName}`)
      data.data.messages.forEach((message) => {
        this.messages.push(message)
        this.lastUpdated = new Date()
      })
    })

    this.$socket.emit('hello', 'client says hey')
    this.$socket.emit('chat-channel-connect', {
      channelName: this.channelName,
    })
  },

  updated() {
  },

  destroyed() {
    this.$socket.emit('chat-channel-disconnect', {
      channelName: this.channelName,
    })
  },
}
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
}

.wrap-text {
  word-wrap: break-word;
  -webkit-line-clamp: unset !important;
}
</style>
