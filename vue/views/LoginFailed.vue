<template lang='pug'>
  div.loginFailed
    h1 Login Failed
    p Your login request failed. Please try again or contact our #[a(href="/support") support team].
    p We are sorry for the inconvenience.
</template>

<script>
import appConfig from '@/app.config'

export default {
  name: 'LoginFailed',
  components: {},
  mounted() {
    this.$log.debug('LoginFailed.vue mounted')
  },
}
</script>
