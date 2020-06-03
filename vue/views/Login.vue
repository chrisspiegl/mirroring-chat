<template lang='pug'>
  v-container.login.text-center
    h1 Login with…
    div.justify-center
      v-btn.ma-4(href="/auth/twitch") Twitch
    div.justify-center
      v-btn.ma-4(href="/auth/google") Google/YouTube


</template>

<script>
export default {
  name: 'Login',
  components: {},
  mounted() {
    this.$log.debug('Login.vue mounted')
  },
}
</script>
