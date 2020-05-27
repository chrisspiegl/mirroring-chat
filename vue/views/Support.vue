<template lang='pug'>
  v-container.support
    h1 Support & Help
    p If you have any questions, feedback, or need support… please contact me through the #[a(href="https://t.me/MirroringChat") Telgram Group @MirroringChat].
</template>

<script>
export default {
  name: 'Support',
  mounted() {
    this.$log.debug('Support.vue initialized')
  },
}
</script>
