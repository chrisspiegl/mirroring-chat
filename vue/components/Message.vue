<template lang="pug">
  v-expand-transition
    v-card.mb-2(outlined :class="`${message.provider}-bg`")
      v-list-item
        v-list-item-avatar.mr-2.my-0(size=30)
          v-img(:src="avatar(message)")
        v-list-item-content
          v-list-item-title
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
            v-btn(icon, title="Archive", @click="markMessageDone(index, message)")
              v-icon $check
      v-card-text
        v-list-item-action-text(style="float: right") {{message.sentAt | moment("from", time)}}
        div(v-html="message.message")
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  props: ['message', 'provider', 'index', 'markMessageDone', 'actionMessageReply', 'actionUserBan', 'actionUserTimeout', 'actionMessageHighlight'],
  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
    ...mapState({
      channelName: (state) => state.user.profile.idUser,
      user: (state) => state.user.profile,
      time: (state) => state.time.now,
    }),
  },
  created() {
    // eslint-disable-next-line no-script-url
    // this.message.message = this.message.message.replace('javascript:', 'wat:').replace('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=l60MnDJklnM')
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
  },
}
</script>

<style lang="scss">
img {
  height: 2rem;
}
</style>
