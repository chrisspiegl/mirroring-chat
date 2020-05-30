<template lang='pug'>
  v-container.loginSuccess
    h1 Login Success
    p Please wait, loading…
</template>

<script>
import { AUTH_REQUEST } from '@/store/actions/auth'
import { USER_REQUEST } from '@/store/actions/user'

export default {
  name: 'LoginSuccess',
  components: {},
  async created() {
    try {
      const respAuthRequest = await this.$store.dispatch(AUTH_REQUEST)
      if (respAuthRequest.ok) {
        const respUserRequest = await this.$store.dispatch(USER_REQUEST)
        if (respUserRequest.ok) {
          this.$router.push('/dashboard')
        }
      }
    } catch (err) {
      this.$log.error('Login Success Page - Catch Error', err)
      this.$router.push('/login/failed')
    }
  },
  mounted() {
    this.$log.debug('LoginSuccess.vue mounted')
  },
}
</script>
