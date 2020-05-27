<template lang="pug">
  v-container.accountTelegram
    h1 Account Telegram Linking
    div(v-if="!user.UserTelegram")
      p To link your mirroring.chat account with a telegram chat, please start talking to the Telegram bot (#[a.button.telegram-bg(href="https://t.me/MirroringChatBot") @MirroringChatBot]) first.
      p.text-center
        a(href="https://t.me/MirroringChatBot") Send a Message to @MirroringChatBot
      p Once you started talking to the bot, you can send the command `/link` and follow the link to verify the connection.
      p Ideally this is done on the same device where you are aready using this website or you copy the link to this browser.
    div(v-else)
      p You are successfully linked to your personal Telegram channel.
      p.text-center
        a(@click="unlink('telegram')" v-if="user.UserTelegram") Unlink
</template>

<script>
import apiCall from '@/utils/api'
import { USER_REQUEST } from '@/store/actions/user'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Account',
  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
    ...mapState({
      user: (state) => state.user.profile,
    }),
  },
  methods: {
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
  mounted() {
    this.$log.debug('AccountTelegram.vue mounted')
  },
  components: {},
}
</script>
