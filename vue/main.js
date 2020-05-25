import Vue from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import '@/plugins/socket.client'
import '@/plugins/moment'
import '@/plugins/scroll'
import '@/plugins/chatScroll'

import Loading from '@/components/lib/loading.vue'
import CenterContainer from '@/components/lib/center-container.vue'

Vue.config.productionTip = false

// HACK: this is because of https://github.com/vuetifyjs/vuetify/issues/9999
const ignoredMessage = 'The .native modifier for v-on is only valid on components but it was used on <svg>.'
Vue.config.warnHandler = (message, vm, componentTrace) => {
  if (message !== ignoredMessage) {
    console.error(message + componentTrace)
  }
}

Vue.component('loading', Loading)
Vue.component('center-container', CenterContainer)

new Vue({
  router,
  store,
  template: '<App/>',
  vuetify,
  render(h) {
    return h(App)
  },
}).$mount('#app')

console.log('main initialized')
