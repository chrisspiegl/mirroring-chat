import Vue from 'vue'
import scroll from 'vuescroll'

// You can set global config here.
Vue.use(scroll, {
  ops: {
    // The global config
    bar: {
      // showDelay: 500,
      onlyShowBarOnScroll: false,
      keepShow: true,
      background: '#cc5630',
      opacity: 0.8,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: 0,
      size: '6px',
      disable: false,
    },
  },
})
