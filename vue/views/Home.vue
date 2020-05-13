<template>
  <div class="home">
    <h1>mirroring.chat</h1>
    <div>
      <a href="/auth/twitch" class="">Twitch</a>
    </div>
    <div>
      <a href="/auth/facebook" class="">Facebook</a>
    </div>
    <div>
      <a href="/auth/discord" class="">Discord</a>
    </div>
    <div>
      <a href="/auth/google" class="">Google/YouTube</a>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
  },
}
console.log('Home initialized')
</script>
