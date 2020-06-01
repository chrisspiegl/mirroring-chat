<template lang='pug'>
  v-container.loginSuccess
    h1 Login Success
    p Please wait, loading…
</template>

<script>
import { authMethods } from '@/state/helpers'

export default {
  name: 'LoginSuccess',
  components: {},
  methods: {
    ...authMethods,
    tryToLogIn() {
      return this.logIn().then((data) => {
        this.$log.info('Login Success Page - Successfully Logged In', data)
        this.$router.push(this.$route.query.redirectFrom || '/dashboard').catch((err) => {
          // FIXME: may be changed in next verison of vue-router to not be necessary.
          // this catch is necesssary because vue-router sees navigation changes as errors…
          // Source for Improement: https://github.com/vuejs/rfcs/pull/150
        })
      }).catch((err) => {
        this.$log.error('Login Success Page - Catch Error', err)
        this.$router.push('/login/failed')
      })
    },
  },
  mounted() {
    this.$log.debug('LoginSuccess.vue mounted')
    this.tryToLogIn()
  },
}
</script>
