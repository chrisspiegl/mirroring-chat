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
                v-card.mb-2(v-if="chatMessagesUndone.length === 0 && chatMessages.length === 0")
                  v-card-title.justify-center Nothing yet…
                  v-card-subtitle.text-center Invite some people to your strem and let's chat.
        v-col
          div.boxToFillHeight(style="height: 100%")
            v-card
              v-toolbar(dense)
                v-toolbar-title Live Chat with {{chatMessagesReversed.length}} Messages
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
        v-toolbar(dense)
          v-text-field(v-model="newMessageText", ref="newMessageText" label="Send Message", hide-details="auto")
          v-btn-toggle.mx-4()
            v-btn(color="primary", title="Send to All", @click="sendMessage('all')")
              v-icon(size="1rem") $chat
            v-btn.twitch-bg(title="Send to Twitch", @click="sendMessage('twitch')")
              v-icon(size="1rem") $twitch
            v-btn.youtube-bg(title="Send to YouTube", @click="sendMessage('youtube')")
              v-icon(size="1rem") $youtube
            //- v-btn.facebook-bg(title="Send to Facebook", @click="sendMessage('facebook')")
              v-icon(size="1rem") $facebook
          span(v-if="chatMessagesLastUpdated && chatMessages.length > 0") Last updated
            = " "
            abbr(:title="dateFormat(chatMessagesLastUpdated)") {{dateFormatRelative(chatMessagesLastUpdated, time)}}
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { authComputed, chatMessagesComputed, chatMessagesMethods } from '@/state/helpers'

import dateFormatRelative from '@/utils/dateFormatRelative'
import dateFormat from '@/utils/dateFormat'
import { apiCall } from '@/utils/api'
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
      newMessageText: '',
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
    dateFormat,
    dateFormatRelative,
    sendMessage(provider) {
      if (!this.newMessageText || this.newMessageText.trim() === '') return this.$toast('Message can not be empty!')
      const data = {
        provider,
        text: this.newMessageText,
      }
      return apiCall({
        method: 'post',
        url: '/v1/chat/send',
        data,
      }).then((resp) => {
        this.$toast(resp.message)
        this.newMessageText = ''
      }).catch((err) => {
        this.$log.error('error while sending message', err)
      })
    },
    actionMessageDone(index, message) {
      this.markChatMessageDone(message).then(() => {
        this.$toast(`Message by ${message.displayName} marked done.`)
      }).catch((err) => {
        this.$log.error(`PUT /v1/chat/message/${message.idChatMessage}`, err)
      })
    },
    actionMessageReply(index, message) {
      this.newMessageText = `@${message.displayName} `
      this.$refs.newMessageText.focus()
    },
    async actionUserBan(index, message) {
      const confirmedDialog = await this.$confirm(`Do you really want to ban <b>${message.displayName}</b>?`, {
        color: 'error',
        title: `Banning - ${message.displayName}`,
        buttonTrueText: 'Yes',
        buttonFalseText: 'No',
      })
      if (confirmedDialog) {
        this.banChatMessage(message).then((resp) => {
          console.log('actionMessageReply -> resp', resp)
          this.$toast(resp.message)
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
