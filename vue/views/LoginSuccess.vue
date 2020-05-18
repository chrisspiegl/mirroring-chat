<template lang='pug'>
  v-container.loginSuccess
    h1 Login Success
</template>

<script>
import { AUTH_REQUEST } from '@/store/actions/auth'

export default {
  name: 'LoginSuccess',
  components: {},
  created() {
    this.$store.dispatch(AUTH_REQUEST).then(() => {
      this.$router.push('/dashboard')
    }).catch((err) => {
      console.log('Login Success Page - Catch Error', err)
      this.$router.push('/login/failed')
    })
  },
}
console.log('LoginSuccess.vue initialized')
</script>
