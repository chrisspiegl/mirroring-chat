import Vue from 'vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import '@/plugins/logger'

import App from '@/App.vue'
import router from '@/router'
import store from '@/state/store'
import vuetify from '@/plugins/vuetify'
import '@/plugins/socket.client'
import '@/plugins/scroll'
import '@/plugins/toast'
import '@/plugins/confirmDialog'
import '@/plugins/chatScroll'

import Loading from '@/components/lib/loading.vue'
import CenterContainer from '@/components/lib/center-container.vue'

import { mapGetters, mapState, mapMutations } from 'vuex'

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

// HACK: this is because of https://github.com/vuetifyjs/vuetify/issues/9999
const ignoredMessage = 'The .native modifier for v-on is only valid on components but it was used on <svg>.'
Vue.config.warnHandler = (message, vm, componentTrace) => {
  if (message !== ignoredMessage) {
    Vue.$log.error(message + componentTrace)
  }
}

Vue.component('loading', Loading)
Vue.component('center-container', CenterContainer)

export default new Vue({
  router,
  store,
  template: '<App/>',
  vuetify,
  render(h) {
    return h(App)
  },
}).$mount('#app')

// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  // eslint-disable-next-line no-underscore-dangle, no-undef
  window.__app__ = app
}

Vue.$log.debug('main.js initialized')
console.info(`Welcome to mirroring.chat - The application is running in ${process.env.NODE_ENV} mode.`)
