<template lang="pug">
  v-container.account
    h1 Account {{displayName}}
    v-card
      v-list-item
        v-list-item-content
          v-list-item-title Connected Accounts
      v-card-text
        p Twitch:
          = ' '
          a(href="/auth/twitch" v-if="!user.UserTwitch") Link
          template(v-if="user.UserTwitch")
            span {{user.UserTwitch.displayName}}
            = ' '
            a(@click="unlink('twitch')") Unlink
        p YouTube:
          = ' '
          a(href="/auth/google" v-if="!user.UserGoogle") Link
          template(v-if="user.UserGoogle")
            span {{user.UserGoogle.displayName}}
            = ' '
            a(@click="unlink('google')") Unlink
        //- p Facebook:
          = ' '
          a(href="/auth/facebook" v-if="!user.UserFacebook") Link
          template(v-if="user.UserFacebook")
            span {{user.UserFacebook.displayName}}
            = ' '
            a(@click="unlink('facebook')") Unlink
        p Telegram:
          = ' '
          a(href="/account/telegram" v-if="!user.UserTelegram") Link
          template(v-if="user.UserTelegram")
            span {{user.UserTelegram.displayName}}
            = ' '
            a(@click="unlink('telegram')") Unlink

    v-card.mt-8
      v-list-item
        v-list-item-content
          v-list-item-title Account Settings
      v-card-text
        v-list
          v-list-item
            v-switch.mx-2(v-model="youtubeCrawlForActiveStreams.value", @change="updateUserSetting(youtubeCrawlForActiveStreams)")
            v-list-item-title
              v-icon(size="1rem") $youtube
              = ' '
              | YouTube Track for Active Streams

          v-list-item
            v-switch.mx-2(v-model="youtubeCrawlForUpcomingStreams.value", @change="updateUserSetting(youtubeCrawlForUpcomingStreams)")
            v-list-item-title
              v-icon(size="1rem") $youtube
              = ' '
              | YouTube Track for Upcoming Streams

          //- v-list-item
            v-switch.mx-2(v-model="facebookCrawlForActiveStreams")
            v-list-item-title
              v-icon(size="1rem") $facebook
              = ' '
              | Facebook Track for Active Streams

          //- v-list-item
            v-switch.mx-2(v-model="facebookCrawlForUpcomingStreams")
            v-list-item-title
              v-icon(size="1rem") $facebook
              = ' '
              | Facebook Track for Active Streams


    v-card.mt-8
      v-list-item
        v-list-item-content
          v-list-item-title Live & Permanent Broadcasts
      v-card-text
        v-list
          v-list-item(
            v-for="(chat, index) in chatsActiveOrPermanent"
            :key="chat.idChat"
          )
            v-list-item-content
              v-list-item-title
                v-icon(size="1rem") ${{chat.provider}}
                = ' '
                a(:href="(chat.provider === 'twitch' ? `https://twitch.com/${chat.idChatProvider}` : `https://youtu.be/${chat.idChatProvider}`)") {{chat.title}}
            v-list-item-action-text
              v-switch.mx-2(v-model="chat.isTracked", label="tracking new messages", @change="isTrackedToggle(chat)")

    v-card.mt-8
      v-list-item
        v-list-item-content
          v-list-item-title Upcoming Live Broadcasts
      v-card-text
        v-list
          v-list-item(
            v-for="(chat, index) in chatsUpcoming"
            :key="chat.idChat"
          )
            v-list-item-content
              v-list-item-title
                v-icon(size="1rem") ${{chat.provider}}
                = ' '
                a(:href="(chat.provider === 'twitch' ? `https://twitch.com/${chat.idChatProvider}` : `https://youtu.be/${chat.idChatProvider}`)") {{chat.title}}
              | Scheduled for {{(chat.provider === 'youtube') ? chat.providerObject.snippet.scheduledStartTime : '' | moment('YYYY-MM-DD HH:mm:ss')}} which is {{(chat.provider === 'youtube') ? chat.providerObject.snippet.scheduledStartTime : '' | moment("from")}}
            v-list-item-action-text
              v-card-actions
                v-switch.mx-2(v-model="chat.isTracked", label="tracking new messages", @change="isTrackedToggle(chat)")

    v-card.mt-8
      v-list-item
        v-list-item-content
          v-list-item-title Past Broadcasts
      v-card-text
        v-list
          v-list-item(
            v-for="(chat, index) in chatsPast"
            :key="chat.idChat"
          )
            v-list-item-content
              v-list-item-title
                v-icon(size="1rem") ${{chat.provider}}
                = ' '
                a(:href="(chat.provider === 'twitch' ? `https://twitch.com/${chat.idChatProvider}` : `https://youtu.be/${chat.idChatProvider}`)") {{chat.title}}
            v-list-item-action-text(disabled)
              v-card-actions
                v-switch.mx-2(v-model="chat.isTracked", label="tracking new messages", @change="isTrackedToggle(chat)", disabled)

</template>

<script>
import apiCall from '@/utils/api'
import { USER_REQUEST } from '@/store/actions/user'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Account',
  data() {
    return {
      chats: [],
      youtubeCrawlForUpcomingStreams: {
        key: 'youtubeCrawlForUpcomingStreams',
        value: false,
      },
      youtubeCrawlForActiveStreams: {
        key: 'youtubeCrawlForActiveStreams',
        value: false,
      },
    }
  },
  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
    ...mapState({
      displayName: (state) => `${state.user.profile.displayName}`,
      user: (state) => state.user.profile,
    }),
    chatsActiveOrPermanent() {
      return this.chats.filter((chat) => !!chat.isPermanent || chat.status === 'active')
    },
    chatsUpcoming() {
      return this.chats.filter((chat) => chat.status === 'upcoming')
    },
    chatsPast() {
      return this.chats.filter((chat) => !['upcoming', 'permanent', 'live', 'active'].includes(chat.status))
    },
  },
  methods: {
    isTrackedToggle(chat) {
      apiCall({
        url: `/v1/chats/${this.user.idUser}/${chat.idChat}`,
        method: 'PUT',
        data: chat,
      }).then((resp) => {
        this.$log.debug(`Updated tracking status of ${chat.title} / ${chat.idChat}`)
      }).catch((err) => {
        this.$log.error('Error updating chat: ', chat, ' with error:', err)
      })
    },
    updateUserSetting(userSetting) {
      apiCall({
        url: `/v1/usersetting/${this.user.idUser}/${userSetting.key}`,
        method: 'PUT',
        data: userSetting,
      }).then((resp) => {
        this.$log.debug(`Updated tracking status of ${userSetting.key} / ${userSetting.idUserSetting}`)
      }).catch((err) => {
        this.$log.error('Error updating chat: ', userSetting, ' with error:', err)
      })
    },
    unlink(provider) {
      apiCall({
        url: `/v1/auth/${provider}/unlink`,
      }).then((resp) => {
        if (resp.ok) this.$store.dispatch(USER_REQUEST)
        else this.$log.debug('Unlink with not ok response', resp)
      }).catch((err) => {
        this.$log.debug('Unlink failed with error', err)
      })
    },
  },
  components: {},
  mounted() {
    this.$log.debug('Account.vue mounted')
    apiCall({
      url: `/v1/chats/${this.user.idUser}`,
      method: 'GET',
    }).then((resp) => {
      resp.data.chats.forEach((chat) => {
        this.chats.push(chat)
      })
    }).catch((err) => {
      this.$log.error('Error requesting chats: ', err)
    })
    apiCall({
      url: `/v1/usersetting/${this.user.idUser}/youtubeCrawlForActiveStreams`,
      method: 'GET',
    }).then((resp) => {
      if (resp.data) {
        this.youtubeCrawlForActiveStreams = resp.data
      }
      console.log(resp.data)
    }).catch((err) => {
      this.$log.error('Error requesting youtubeCrawlForActiveStreams: ', err)
    })
    apiCall({
      url: `/v1/usersetting/${this.user.idUser}/youtubeCrawlForUpcomingStreams`,
      method: 'GET',
    }).then((resp) => {
      if (resp.data) {
        this.youtubeCrawlForUpcomingStreams = resp.data
      }
    }).catch((err) => {
      this.$log.error('Error requesting youtubeCrawlForUpcomingStreams: ', err)
    })
  },
}
</script>
