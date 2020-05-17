<template>
  <v-app id="inspire">
    <navigation />

    <v-content>
      <v-container
        fluid
      >
        <router-view/>
        <v-footer app>
          <span>&copy; 2020 Chris Spiegl | mirroring.chat</span>
        </v-footer>
      </v-container>
    </v-content>
  </v-app>
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
