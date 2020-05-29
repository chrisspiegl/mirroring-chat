import Vue from 'vue'
import VuetifyToast from 'vuetify-toast-snackbar'

Vue.use(VuetifyToast, {
  x: 'right', // default
  y: 'top', // default
  color: 'info', // default
  icon: '', // TODO: icons are currently having issues (fontawesome icons are not recognized)
  iconColor: '', // default
  // classes: ['body-2'],
  timeout: 3000, // default
  dismissable: true, // default
  multiLine: false, // default
  vertical: false, // default
  queueable: false, // default
  showClose: true, // default
  closeText: 'x', // default
  closeIcon: '', // default // TODO: icons are currently having issues (fontawesome icons are not recognized)
  closeColor: '', // default
  slot: [], // default
  shorts: {
    custom: {
      color: 'purple',
    },
  },
  property: '$toast', // default
})

Vue.$log.debug('toast.js initialized')
