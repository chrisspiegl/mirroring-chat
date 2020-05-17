<template lang="pug">
  v-app#inspire
    navigation

    v-content
      v-container.fill-height(fluid)
        router-view
        v-footer(app)
          span &copy; 2020 Chris Spiegl | mirroring.chat
</template>

<script>
import Navigation from '@/components/navigation/index.vue'

export default {
  name: 'App',

  components: {
    Navigation,
  },

  props: {
    source: String,
  },

  created() {
    this.$vuetify.theme.dark = true
  },
}

console.log('App.vue initialized')

</script>

<style lang="scss" scoped>
.fill-height {
  align-items: flex-start;
}
</style>
