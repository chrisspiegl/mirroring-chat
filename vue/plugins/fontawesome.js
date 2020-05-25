import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// TODO: improve by only importing the icons I am actually using
// https: //github.com/FortAwesome/vue-fontawesome#import-entire-styles

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(fas, far, fab)

export default {
  menu: { // used for the nav-icon by vuetify
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'bars'],
    },
  },
  twitch: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fab', 'twitch'],
    },
  },
  facebook: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fab', 'facebook-f'],
    },
  },
  telegram: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fab', 'telegram'],
    },
  },
  youtube: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fab', 'youtube'],
    },
  },
  discord: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fab', 'discord'],
    },
  },
  dashboard: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'columns'],
    },
  },
  home: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'home'],
    },
  },
  logout: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'sign-out-alt'],
    },
  },
  chat: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'comment'],
    },
  },
  user: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'user'],
    },
  },
  help: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'question-circle'],
    },
  },
  info: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'info-circle'],
    },
  },
  about: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'users'],
    },
  },
  settings: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'cog'],
    },
  },
  laughBeam: {
    component: FontAwesomeIcon,
    props: {
      icon: ['far', 'laugh-beam'],
    },
  },
  ban: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'ban'],
    },
  },
  timeout: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'band-aid'],
    },
  },
  reply: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'reply'],
    },
  },
  share: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'share-alt'],
    },
  },

}

console.log('fontawesome initialized')
