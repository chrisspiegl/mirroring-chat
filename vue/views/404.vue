<template lang='pug'>
  v-container.error404
    h1 Error 404 — Not Found
</template>

<script>
export default {
  name: 'About',
  components: {},
  mounted() {
    this.$log.debug('404.vue mounted')
  },
}
</script>
