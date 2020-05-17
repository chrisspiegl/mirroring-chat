<template>
  <div class="logout">
    <h1>Logout</h1>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from '@/store/actions/auth'

export default {
  name: 'Logout',
  components: {},
  created() {
    this.$store.dispatch(AUTH_LOGOUT).then(() => {
      // this.$router.push('/login')
      window.location.href = '/auth/logout'
    })
  },
}
console.log('Logout.vue initialized')
</script>
