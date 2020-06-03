<template lang="pug">
  v-container.account
    h1 Account {{userCurrent.displayName}}
    v-card
      v-list-item
        v-list-item-content
          v-list-item-title Connected Accounts
      v-card-text
        p Twitch:
          = ' '
          a(href="/auth/twitch" v-if="!userCurrent.UserTwitch") Link
          template(v-if="userCurrent.UserTwitch")
            span {{userCurrent.UserTwitch.displayName}}
            = ' '
            a(@click="unlink('twitch')") Unlink
        p YouTube:
          = ' '
          a(href="/auth/google" v-if="!userCurrent.UserGoogle") Link
          template(v-if="userCurrent.UserGoogle")
            span {{userCurrent.UserGoogle.displayName}}
            = ' '
            a(@click="unlink('google')") Unlink
        //- p Facebook:
          = ' '
          a(href="/auth/facebook" v-if="!userCurrent.UserFacebook") Link
          template(v-if="userCurrent.UserFacebook")
            span {{userCurrent.UserFacebook.displayName}}
            = ' '
            a(@click="unlink('facebook')") Unlink
        p Telegram:
          = ' '
          a(href="/account/telegram" v-if="!userCurrent.UserTelegram") Link
          template(v-if="userCurrent.UserTelegram")
            span {{userCurrent.UserTelegram.displayName}}
            = ' '
            a(@click="unlink('telegram')") Unlink

    v-card.mt-8
      v-list-item
        v-list-item-content
          v-list-item-title Account Settings
      v-card-text
        v-list
          v-list-item(v-if="userCurrent.UserGoogle")
            v-switch.mx-2(v-model="youtubeCrawlForActiveStreams")
            v-list-item-title
              v-icon(size="1rem") $youtube
              = ' '
              | YouTube Track for Active Streams

          v-list-item(v-if="userCurrent.UserGoogle")
            v-switch.mx-2(v-model="youtubeCrawlForUpcomingStreams")
            v-list-item-title
              v-icon(size="1rem") $youtube
              = ' '
              | YouTube Track for Upcoming Streams

          v-list-item(v-if="userCurrent.UserTelegram")
            v-switch.mx-2(v-model="telegramForward")
            v-list-item-title
              v-icon(size="1rem") $telegram
              = ' '
              | Forward Messages to Telegram

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
              v-switch.mx-2(:input-value="chat.isTracked", label="tracking new messages", @change="isTrackedToggle(chat)")

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
              | Scheduled for {{(chat.provider === 'youtube') ? dateFormat(parseISO(chat.providerObject.snippet.scheduledStartTime)) : ''}} which is {{(chat.provider === 'youtube') ? dateFormatRelative(parseISO(chat.providerObject.snippet.scheduledStartTime)) : ''}}
            v-list-item-action-text
              v-card-actions
                v-switch.mx-2(:input-value="chat.isTracked", label="tracking new messages", @change="isTrackedToggle(chat)")

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
                v-switch.mx-2(:input-value="chat.isTracked", label="tracking new messages", @change="isTrackedToggle(chat)", disabled)

</template>

<script>
import { apiCall } from '@/utils/api'
import parseISO from 'date-fns/parseISO'
import dateFormat from '@/utils/dateFormat'
import dateFormatRelative from '@/utils/dateFormatRelative'

import {
  authComputed,
  userSettingsComputed,
  userSettingsMethods,
  chatsComputed,
  chatsMethods,
} from '@/state/helpers'

export default {
  computed: {
    ...authComputed,
    ...userSettingsComputed,
    ...chatsComputed,
    youtubeCrawlForActiveStreams: {
      get() { return this.getUserSettingValueByKey({ key: 'youtubeCrawlForActiveStreams' }) },
      set(value) { this.updateUserSetting({ key: 'youtubeCrawlForActiveStreams', value }) },
    },
    youtubeCrawlForUpcomingStreams: {
      get() { return this.getUserSettingValueByKey({ key: 'youtubeCrawlForUpcomingStreams' }) },
      set(value) { this.updateUserSetting({ key: 'youtubeCrawlForUpcomingStreams', value }) },
    },
    telegramForward: {
      get() { return this.getUserSettingValueByKey({ key: 'telegramForward' }) },
      set(value) { this.updateUserSetting({ key: 'telegramForward', value }) },
    },
  },
  methods: {
    ...userSettingsMethods,
    ...chatsMethods,
    dateFormat,
    dateFormatRelative,
    parseISO,
    async updateUserSetting({ key, value }) {
      this.updateUserSettingByKey({ key, value }).then(() => {
        this.$toast(`${value ? 'Activated' : 'Deactivated'} ${key}.`)
      }).catch((err) => {
        this.$toast(`Error while ${value ? 'activating' : 'deactivating'} of ${key}.`)
        this.$log.error(`Error while ${value ? 'activating' : 'deactivating'} of ${key}.`, err)
      })
    },
    async isTrackedToggle(chat) {
      console.log('isTrackedToggle -> chat', chat)
      const isTracked = !chat.isTracked
      await this.updateChat({
        chat,
        changes: { isTracked },
      })
      this.$toast(`Chat ${chat.title} marked to be ${(isTracked) ? 'tracked' : 'not tracked'}.`)
    },
    unlink(provider) {
      apiCall({
        url: `/v1/auth/${provider}/unlink`,
      }).then((resp) => {
        if (resp.ok) this.$store.dispatch('USER_REQUEST')
        else this.$log.debug('Unlink with not ok response', resp)
      }).catch((err) => {
        this.$log.debug('Unlink failed with error', err)
      })
    },
  },
  components: {},
  mounted() {
    this.$log.debug('Account.vue mounted')
    this.fetchChats()
  },
}
</script>
