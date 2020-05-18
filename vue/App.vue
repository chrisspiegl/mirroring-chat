<template lang="pug">
  v-app#inspire
    navigation
    v-content
      v-container.fill-height(fluid, style="padding: 0;")
        router-view
      v-footer(app)
        span &copy; 2020 Chris Spiegl | mirroring.chat
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

console.log('App.vue initialized')

</script>

<style lang="scss" scoped>
.container.fill-height {
  align-items: flex-start;
}
</style>
