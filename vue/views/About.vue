<template lang='pug'>
  v-container.about
    h1 About
</template>

<script>
export default {
  name: 'About',
  components: {},
  mounted() {
    this.$log.debug('About.vue mounted')
  },
}
</script>
