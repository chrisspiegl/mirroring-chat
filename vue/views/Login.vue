<template lang='pug'>
  v-container.login
    h1 Login
    div
      a(href="/auth/twitch") Twitch
    div
      a(href="/auth/facebook") Facebook
    div
      a(href="/auth/discord") Discord
    div
      a(href="/auth/google") Google/YouTube


</template>

<script>
export default {
  name: 'Login',
  components: {},
}
console.log('Login.vue initialized')
</script>
