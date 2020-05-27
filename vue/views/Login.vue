<template lang='pug'>
  v-container.login
    h1 Login
    div
      a(href="/auth/twitch") Twitch
    div
      a(href="/auth/google") Google/YouTube
    //- div
      a(href="/auth/facebook") Facebook


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
