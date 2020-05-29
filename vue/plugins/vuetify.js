import Vue from 'vue'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import CUSTOM_ICONS from './fontawesome'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon,
  },
})

const opts = {
  theme: {
    dark: true,
    themes: {},
  },
  icons: {
    // iconfont: 'faSvg',
    iconfont: 'faSvg',
    values: CUSTOM_ICONS,
  },
}

export default new Vuetify(opts)

Vue.$log.debug('vuetify.js initialized')
