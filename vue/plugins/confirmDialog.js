import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'
import vuetify from './vuetify'

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Accept',
  buttonFalseText: 'Discard',
  color: 'warning',
  icon: '',
  title: 'Warning',
  width: 350,
  property: '$confirm',
})
Vue.$log.debug('confirmDialog.js initialized')
