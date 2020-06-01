<template lang="pug">
  v-app#inspire
    navigation
    v-content
      v-container.fill-height(fluid, style="padding: 0;")
        transition: keep-alive: router-view(v-if="$route.meta.keepAlive", :key="$route.fullPath")
        router-view(v-if="!$route.meta.keepAlive", :key="$route.fullPath")
</template>

<script>
import Navigation from '@/components/navigation/index.vue'

function debounce(func, wait, immediate) {
  let timeout
  return (...args) => {
    const context = this
    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export default {
  name: 'App',

  components: {
    Navigation,
  },

  props: {
    source: String,
  },

  methods: {
    onResize() {
      this.$store.commit('CHANGE_IS_MOBILE', {
        width: window.innerWidth,
        height: window.innerHeight,
      })
    },
  },

  mounted() {
    this.$log.debug('App.vue mounted')
    window.addEventListener('resize', debounce(this.onResize, 250))
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },

  created() {
    this.$vuetify.theme.dark = true
    this.onResize()
  },
}
</script>

<style lang="scss" scoped>

// System font stack: https://www.digitalocean.com/community/tutorials/css-system-font-stack
$fontStackSystem: -apple-system, BlinkMacSystemFont, "system-ui", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
$fontStackMono: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
$body-font-family: $fontStackMono;
$title-font: $fontStackMono;

.v-application {
  font-family: $body-font-family, sans-serif !important;
    .title { // To pin point specific classes of some components
      font-family: $title-font, sans-serif !important;
    }
 }

.container.fill-height {
  align-items: flex-start;
}
</style>
