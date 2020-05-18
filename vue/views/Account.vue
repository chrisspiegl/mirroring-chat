<template lang="pug">
  .account
    h1 Account {{displayName}}
    p Twitch:
      = ' '
      a(href="/auth/twitch" v-if="!user.UserTwitch") Link
      a(@click="unlink('twitch')" v-if="user.UserTwitch") Unlink
    p Facebook:
      = ' '
      a(href="/auth/facebook" v-if="!user.UserFacebook") Link
      a(@click="unlink('facebook')" v-if="user.UserFacebook") Unlink
    p YouTube:
      = ' '
      a(href="/auth/google" v-if="!user.UserGoogle") Link
      a(@click="unlink('google')" v-if="user.UserGoogle") Unlink
    p Discord:
      = ' '
      a(href="/auth/discord" v-if="!user.UserDiscord") Link
      a(@click="unlink('discord')" v-if="user.UserDiscord") Unlink
    p Telegram:
      = ' '
      em not implemented yet
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
      displayName: (state) => `${state.user.profile.displayName}`,
      user: (state) => state.user.profile,
    }),
  },
  methods: {
    unlink(provider) {
      apiCall({
        url: `/v1/auth/${provider}/unlink`,
      }).then((resp) => {
        if (resp.ok) this.$store.dispatch(USER_REQUEST)
        else alert('unlink == not ok')
      }).catch((err) => {
        console.log('Unlink faied with error: ', err)
      })
    },
  },
  components: {},
}
console.log('Account.vue initialized')
</script>