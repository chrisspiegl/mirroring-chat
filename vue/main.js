import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import '@/plugins/socket.client'
import '@/plugins/moment'

Vue.config.productionTip = false

new Vue({
  template: '<App/>',
  router,
  store,
  vuetify,
  render(h) {
    return h(App)
  },
}).$mount('#app')

console.log('main initialized')
