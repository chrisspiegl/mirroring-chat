<template lang='pug'>
  v-container.admin
    h1 Admin
</template>

<script>
export default {
  name: 'Admin',
  components: {},
  mounted() {
    this.$log.debug('Admin.vue mounted')
  },
}
</script>
