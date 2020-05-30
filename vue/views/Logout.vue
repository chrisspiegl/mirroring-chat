<template lang='pug'>
  v-container.logout
    h1 Logout
</template>

<script>
import { AUTH_LOGOUT } from '@/store/actions/auth'

export default {
  name: 'Logout',
  components: {},
  created() {
    this.$store.dispatch(AUTH_LOGOUT).then(() => {
      // this.$router.push('/login')
      localStorage.removeItem('profileUser')
      window.location.href = '/auth/logout'
    })
  },
  mounted() {
    this.$log.debug('Logout.vue mounted')
  },
}
</script>
