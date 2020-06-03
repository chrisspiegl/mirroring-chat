<template lang="pug">
  v-expand-transition
    v-card.mb-2(outlined :class="`${message.provider}-bg`")
      v-list-item
        v-list-item-avatar.mr-2.my-0(size=30)
          v-img(:src="avatar(message)")
        v-list-item-content
          v-list-item-title
            a(:href="profileLink(message)", target="_blank")
              v-icon(size="1rem") ${{message.provider}}
              | /{{message.displayName}}
        v-list-item-action-text
          v-card-actions
            v-btn(icon, title="Ban", @click="actionUserBan(index, message)")
              v-icon $ban
            v-btn(icon, title="Timeout", @click="actionUserTimeout(index, message)")
              v-icon $timeout
            v-btn(icon, title="Highlight this message", @click="actionMessageHighlight(index, message)")
              v-icon $highlight
            v-btn(icon, title="Reply to this message", @click="actionMessageReply(index, message)")
              v-icon $reply
            v-btn(icon, title="Archive", @click="actionMessageDone(index, message)")
              v-icon $check
      v-card-text
        v-list-item-action-text(style="float: right")
          abbr(:title="dateFormat(parseISO(message.sentAt))") {{dateFormatStrict(parseISO(message.sentAt), time)}}
        div(v-html="message.message")
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import parseISO from 'date-fns/parseISO'

import dateFormatRelative from '@/utils/dateFormatRelative'
import dateFormatStrict from '@/utils/dateFormatStrict'
import dateFormat from '@/utils/dateFormat'

export default {
  props: ['message', 'provider', 'index', 'actionMessageDone', 'actionMessageReply', 'actionUserBan', 'actionUserTimeout', 'actionMessageHighlight'],
  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
    ...mapState({
      channelName: (state) => state.user.profile.idUser,
      user: (state) => state.user.profile,
      time: (state) => state.time.now,
    }),
  },
  methods: {
    dateFormatRelative,
    dateFormatStrict,
    dateFormat,
    parseISO,
    profileLink(message) {
      switch (message.provider) {
        case 'twitch':
          if (!message.providerObject.userstate.username) return '#'
          return `https://twitch.tv/${message.providerObject.userstate.username}`
        case 'youtube':
          return message.providerObject.authorDetails.channelUrl
        default:
          return '#'
      }
    },
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
  },
}
</script>

<style lang="scss">
img {
  height: 2rem;
}
</style>
