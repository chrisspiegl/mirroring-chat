import Vue from 'vue'
import VueLogger from 'vuejs-logger'

const isProduction = process.env.NODE_ENV === 'production'

const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: ':',
  showConsoleColors: true,
}

// LEVELS:
// debug
// info
// warn
// error
// fatal

Vue.use(VueLogger, options)
