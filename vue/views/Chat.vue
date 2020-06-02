 <template lang="pug">
  v-container.pa-0.my-0.fill-height
    .boxToFillHeight
      div
        v-toolbar(dense)
          v-card-title.justify-center All Chat Messages
          //- v-model="chatsToFollow",
          //- v-btn-toggle(multiple, dense)
          //-   v-btn.twitch-bg(icon, title="Show all messages from Twitch")
          //-     v-icon $twitch
          //-   v-btn.youtube-bg(icon, title="Show all messages from YouTube")
          //-     v-icon $youtube
          //-   v-btn.facebook-bg(icon, title="Show all messages from Facebook")
          //-     v-icon $facebook
      v-row
        v-col
          div.boxToFillHeight(style="height: 100%")
            v-card
              v-toolbar(dense)
                v-toolbar-title {{chatMessagesUndone.length}} Unacknoweledged Messages
                v-spacer
                //- v-btn(icon)
                  v-icon $twitch
            div.chat-container
              vue-scroll(ref="vuescrollDone", :ops="vuescrollOptionsDone")
                message(
                  v-if="chatMessagesUndone.length > 0"
                  v-for="(message, index) in chatMessagesUndone"
                  :key="message.idChatMessage"
                  :provider="message.provider"
                  :message="message"
                  :index="index"
                  :actionMessageDone="actionMessageDone"
                  :actionMessageReply="actionMessageReply"
                  :actionUserBan="actionUserBan"
                  :actionUserTimeout="actionUserTimeout"
                  :actionMessageHighlight="actionMessageHighlight"
                )
                v-card.mb-2(v-if="chatMessagesUndone.length === 0 && chatMessages.length !== 0")
                  v-card-title.justify-center INBOX ZERO
                  v-card-subtitle.text-center You reached the bottom.
                v-card.mb-2(v-if="chatMessagesUndone.length === 0")
                  v-card-title.justify-center Nothing yet…
                  v-card-subtitle.text-center Invite some people to your strem and let's chat.
        v-col
          div.boxToFillHeight(style="height: 100%")
            v-card
              v-toolbar(dense)
                v-toolbar-title Live Chat with {{chatMessagesReversed.length}} Messages
                v-spacer
                //- v-btn(icon)
                  v-icon $twitch
            div.chat-container
              vue-scroll(ref="vuescrollLive", :ops="vuescrollOptionsLive")
                message(
                  v-if="chatMessagesReversed.length > 0"
                  v-for="(message, index) in chatMessagesReversed"
                  :key="message.idChatMessage"
                  :provider="message.provider"
                  :message="message"
                  :index="index"
                  :actionMessageDone="actionMessageDone"
                  :actionMessageReply="actionMessageReply"
                  :actionUserBan="actionUserBan"
                  :actionUserTimeout="actionUserTimeout"
                  :actionMessageHighlight="actionMessageHighlight"
                  :style="{ opacity: message.doneAt ? 0.5 : 1 }"
                )
                v-card.mb-2(v-if="chatMessagesReversed.length === 0")
                  v-card-title.justify-center Nothing yet…
                  v-card-subtitle.text-center Invite some people to your strem and let's chat.
      div
        v-toolbar()
          v-text-field(label="Send Message", hide-details="auto")
          v-item-group.pr-4()
            v-btn(icon, title="Send to All")
              v-icon(size="1rem") $chat
            v-btn.twitch-bg(icon, title="Send to Twitch")
              v-icon(size="1rem") $twitch
            v-btn.youtube-bg(icon, title="Send to YouTube")
              v-icon(size="1rem") $youtube
            v-btn.facebook-bg(icon, title="Send to Facebook")
              v-icon(size="1rem") $facebook
          span(v-if="chatMessagesLastUpdated && chatMessages.length > 0") Last updated
            = " "
            abbr(:title="chatMessagesLastUpdated")
              | {{chatMessagesLastUpdated | moment("from", time)}}
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { authComputed, chatMessagesComputed, chatMessagesMethods } from '@/state/helpers'

import Message from '../components/Message.vue'

export default {
  components: {
    Message,
  },

  computed: {
    ...authComputed,
    ...chatMessagesComputed,
    ...mapState({
      channelName: (state) => state.auth.userCurrent.idUser,
      time: (state) => state.time.now,
    }),
  },

  data() {
    return {
      vuescrollOptionsDone: {
        scrollPanel: {
          scrollingX: false,
          scrollingY: true,
        },
      },
      vuescrollOptionsLive: {
        scrollPanel: {
          scrollingX: false,
          scrollingY: true,
        },
      },
    }
  },

  mounted() {
    this.$log.debug('Chat.vue mounted')
    this.fetchChatMessages()
  },

  watch: {
    chatMessages(chatMessages) {
      this.$log.debug(`Currently displaying ${chatMessages.length}`)
    },
  },

  methods: {
    ...chatMessagesMethods,
    actionMessageDone(index, message) {
      this.markChatMessageDone(message).then(() => {
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
        this.banChatMessage(message).then((resp) => {
          this.$toast(resp.message) // TODO: check if resp.message is the right choice here?!
        })
          .catch((err) => {
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
        this.banChatMessage(message).then((resp) => {
          this.$toast(`Sent ${message.displayName} into timeout.`)
        }).catch((err) => {
          this.$toast(`Failed to timeout ${message.displayName} from the live chat.`)
          this.$log.error('Failed to timeout user', err)
        })
      }
    },
    actionMessageHighlight(index, message) {
      // TODO: implement endpoint for this action with the widget implementation
    },
  },

  sockets: {
    // TODO: move all these chat sockets to the vuex store…
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
        this.chatMessagesLastUpdated = new Date()
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
