import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// TODO: improve by only importing the icons I am actually using
// https://github.com/FortAwesome/vue-fontawesome#import-entire-styles

// fab: Font Awesome Brands
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faTwitch } from '@fortawesome/free-brands-svg-icons/faTwitch'
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube'

// far: Font Awesome Regular
import { faLaughBeam } from '@fortawesome/free-regular-svg-icons/faLaughBeam'

// fas: Font Awesome Solid
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan'
import { faBandAid } from '@fortawesome/free-solid-svg-icons/faBandAid'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faColumns } from '@fortawesome/free-solid-svg-icons/faColumns'
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons/faBullhorn'


Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(
  faBullhorn,
  faCheck,
  faDiscord,
  faFacebookF,
  faTelegram,
  faTwitch,
  faYoutube,
  faLaughBeam,
  faBan,
  faBandAid,
  faBars,
  faCog,
  faColumns,
  faComment,
  faHome,
  faInfoCircle,
  faQuestionCircle,
  faReply,
  faShareAlt,
  faSignOutAlt,
  faUser,
  faUsers,
)

export default {
  menu: {
    // used for the nav-icon by vuetify
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
  check: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'check'],
    },
  },
  highlight: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fas', 'bullhorn'],
    },
  },
}

Vue.$log.debug('fontawesome.js initialized')
