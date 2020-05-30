<template lang="pug">
  v-container.dashboard
    h1 Welcome to the Dashboard #[em {{user.displayName}}]
    p Check linked accounts on the #[a(href="/account") accounts] page and then head over to the #[a(href="/chat") chat] page to see the incoming messages on your live streaming profiles.
    p With future develpoment, on this page, there will be a dashboard of analytical data abuot your live streaming sessions. Things like concurrent viewers, total chat messages received, as well as other details. However, this will take some time to develop 😊.
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapState({
      user: (state) => state.user.profile,
    }),
  },
  mounted() {
    this.$log.debug('Dashboard.vue mounted')
  },
}
</script>
