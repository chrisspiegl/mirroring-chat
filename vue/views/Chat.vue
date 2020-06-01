 <template lang="pug">
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

      v-row
        v-col
          div.boxToFillHeight(style="height: 100%")
            v-card
              v-toolbar(dense)
                v-toolbar-title {{messagesUndone.length}} Unacknoweledged Messages
                v-spacer
                //- v-btn(icon)
                  v-icon $twitch
            div.chat-container
              vue-scroll(ref="vuescrollDone", :ops="vuescrollOptionsDone")
                //- v-card.mb-2
                //-   v-card-title.justify-center You Reached the Top
                //-   v-card-subtitle.text-center Currently this is limited to the past 50 messages on load. #[br] This may change in the future, let us know if this is important to you.
                message(
                  v-if="messagesUndone.length > 0"
                  v-for="(message, index) in messagesUndone"
                  :key="message.idChatMessage"
                  :provider="message.provider"
                  :message="message"
                  :index="index"
                  :markMessageDone="markMessageDone"
                  :actionMessageReply="actionMessageReply"
                  :actionUserBan="actionUserBan"
                  :actionUserTimeout="actionUserTimeout"
                  :actionMessageHighlight="actionMessageHighlight"
                )
                v-card.mb-2(v-if="messagesUndone.length === 0 && messages.length !== 0")
                  v-card-title.justify-center INBOX ZERO
                  v-card-subtitle.text-center You reached the bottom.
                v-card.mb-2(v-if="messages.length === 0")
                  v-card-title.justify-center Nothing yet…
                  v-card-subtitle.text-center Invite some people to your strem and let's chat.
        v-col
          div.boxToFillHeight(style="height: 100%")
            v-card
              v-toolbar(dense)
                v-toolbar-title Live Chat with {{messagesReversed.length}} Messages
                v-spacer
                //- v-btn(icon)
                  v-icon $twitch
            div.chat-container
              vue-scroll(ref="vuescrollLive", :ops="vuescrollOptionsDone")
                //- v-card.mb-2
                //-   v-card-title.justify-center You Reached the Top
                //-   v-card-subtitle.text-center Currently this is limited to the past 50 messages on load. #[br] This may change in the future, let us know if this is important to you.
                message(
                  v-if="messages.length > 0"
                  v-for="(message, index) in messagesReversed"
                  :key="message.idChatMessage"
                  :provider="message.provider"
                  :message="message"
                  :index="index"
                  :markMessageDone="markMessageDone"
                  :actionMessageReply="actionMessageReply"
                  :actionUserBan="actionUserBan"
                  :actionUserTimeout="actionUserTimeout"
                  :actionMessageHighlight="actionMessageHighlight"
                  :style="{ opacity: message.doneAt ? 0.5 : 1 }"
                )
                v-card.mb-2(v-if="messages.length === 0")
                  v-card-title.justify-center Nothing yet…
                  v-card-subtitle.text-center Invite some people to your strem and let's chat.
      div
        v-system-bar(color="transparent")
          //- div
          //- v-toolbar()
          //-   v-text-field(label="Send Message", hide-details="auto")
          //-   v-item-group(dense)
          //-     v-btn(icon, title="Send to All")
          //-       v-icon $chat
          //-     v-btn.twitch-bg(icon, title="Send to Twitch")
          //-       v-icon $twitch
          //-     v-btn.youtube-bg(icon, title="Send to YouTube")
          //-       v-icon $youtube
          //-     v-btn.facebook-bg(icon, title="Send to Facebook")
          //-       v-icon $facebook
          v-spacer
          span(v-if="lastUpdated && messages.length > 0") Last message
            = " "
            | {{lastUpdated | moment("from", time)}}
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { authComputed } from '@/state/helpers'
import { apiCall } from '@/utils/api'

import Message from '../components/Message.vue'

export default {
  name: 'Chat',

  components: {
    Message,
  },

  computed: {
    ...authComputed,
    ...mapState({
      channelName: (state) => state.auth.userCurrent.idUser,
      time: (state) => state.time.now,
    }),
    messagesUndone() {
      return this.messages.filter(
        (m) => !m.doneAt
          && !m.message.startsWith('!drop'),
      )
    },
    messagesReversed() {
      return this.messages.slice().reverse()
    },

  },

  data() {
    return {
      newMessage: null,
      messages: [],
      lastUpdated: null,
      scrollBottom: true,
      scrollBottomOnInit: true,
      vuescrollOptionsDone: {
        scrollPanel: {
          // initialScrollY: '100%',
          scrollingX: false,
          scrollingY: true,
          // speed: 300,
        },
      },
      vuescrollOptionsLive: {
        scrollPanel: {
          initialScrollY: '100%',
          scrollingX: false,
          scrollingY: true,
          // speed: 300,
        },
      },
    }
  },

  mounted() {
    this.$log.debug('Chat.vue mounted')
    apiCall({
      url: `/v1/chat/messages/${this.userCurrent.idUser}`,
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
    },
  },

  methods: {
    markMessageDone(index, message) {
      this.$set(message, 'doneAt', new Date())
      apiCall({
        url: `/v1/chat/message/${message.idChatMessage}`,
        method: 'PUT',
        data: { message },
      }).then((resp) => {
        this.$toast(`Message by ${message.displayName} marked done.`)
      }).catch((err) => {
        this.$log.error(`PUT /v1/chat/message/${message.idChatMessage}`, err)
      })
    },
    actionMessageReply(index, message) {},
    async actionUserBan(index, message) {
      const confirmedDialog = await this.$confirm(`Do you really want to ban <b>${message.displayName}</b>?`, {
        color: 'error',
        title: `Banning - ${message.displayName}`,
        buttonTrueText: 'Yes',
        buttonFalseText: 'No',
      })
      if (confirmedDialog) {
        apiCall({
          url: `/v1/chat/message/${message.idChatMessage}/ban`,
          method: 'POST',
          data: { message },
        }).then((resp) => {
          this.$toast(resp.message)
        }).catch((err) => {
          this.$toast(`Failed to ban ${message.displayName} from the live chat.`)
          this.$log.error('Failed to ban user', err)
        })
      }
    },
    async actionUserTimeout(index, message) {
      const confirmedDialog = await this.$confirm(`Do you really want to send <b>${message.displayName}</b> into timeout?`, {
        color: 'warning',
        title: `Timeout for ${message.displayName}`,
        buttonTrueText: 'Yes',
        buttonFalseText: 'No',
      })
      if (confirmedDialog) {
        this.$toast(`Sent ${message.displayName} into timeout.`)
        apiCall({
          url: `/v1/chat/message/${message.idChatMessage}/timeout`,
          method: 'POST',
          data: { message },
        }).then((resp) => {
          this.$toast(resp.message)
        }).catch((err) => {
          this.$toast(`Failed to timeout ${message.displayName} from the live chat.`)
          this.$log.error('Failed to timeout user', err)
        })
      }
    },
    actionMessageHighlight(index, message) {},
    send() {
      this.$log.debug('Message Typed and Hit Enter: ', this.newMessage)
      // this.messages.push({
      //   message: this.newMessage,
      //   type: 0,
      //   user: 'Me',
      // })

      // socket.emit('chat-message', {
      //   message: this.newMessage,
      //   user: this.userCurrentname,
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
    // Logic to stay at the bottom if already at the bottom.
    // const { scrollTop } = this.$refs.vuescroll.getPosition()
    // const scrollBottom = scrollTop + this.$refs.vuescroll.$el.scrollHeight
    // const elementScrollHeight = this.$refs.vuescroll.$children[0].$el.scrollHeight
    // this.scrollBottom = (this.scrollBottomOnInit || scrollBottom > elementScrollHeight - 200)
    // this.scrollBottomOnInit = false
    // this.$nextTick(function $nextTick() {
    //   if (this.scrollBottom) {
    //     this.$refs.vuescroll.scrollTo({ y: '100%' })
    //   }
    // })
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
