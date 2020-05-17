import Vue from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import '@/plugins/socket.client'
import '@/plugins/moment'

import Loading from '@/components/lib/loading.vue'
import CenterContainer from '@/components/lib/center-container.vue'

Vue.config.productionTip = false

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
