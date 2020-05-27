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

Vue.$log.debug('vuetify.js initialized')
