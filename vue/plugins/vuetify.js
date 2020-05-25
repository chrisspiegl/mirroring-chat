import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import CUSTOM_ICONS from './fontawesome'

Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'faSvg',
    values: CUSTOM_ICONS,
  },
}

export default new Vuetify(opts)

console.log('vuetify initialized')
