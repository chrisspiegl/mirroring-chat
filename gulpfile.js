process.env.NODE_ENV = process.env.NODE_ENV || 'local'
process.env.NODE_PATH = '.'
require('module').Module._initPaths() // this is needed to update NODE_PATH at runtime of Gulp
const path = require('path')

const config = require(path.join(__dirname, './config'))

const async = require('async')
const browserSync = require('browser-sync').create()
const changed = require('gulp-changed')
const _ = require('lodash')
const clean = require('gulp-clean')
const composer = require('gulp-uglify/composer')
const concat = require('gulp-concat')
const gif = require('gulp-if')
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const notify = require('gulp-notify')
const pump = require('pump')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const uglifyjs = require('uglify-es')

const minify = composer(uglifyjs)

const paths = {
  clean: ['public/*'],
  copy: {
    // 'public/assets/img': {
    //   cwd: './frontend/img',
    //   src: '**/*',
    // },
    // 'public/assets/fonts': {
    //   cwd: './frontend/fonts',
    //   src: '**/*',
    // },
    _public1: {
      dest: 'public',
      cwd: './vue-dist',
      src: ['**/*'],
    },
    // _public2: {
    //   dest: 'public',
    //   cwd: './frontend',
    //   src: ['robots.txt'],
    // },
  },
  views: ['views/**/*'],
  sass: [
    // 'frontend/**/*.scss',
    // 'frontend/**/*.sass',
  ],
  js: [
    // 'node_modules/jquery/dist/jquery.js',
    // 'node_modules/socket.io-client/dist/socket.io.js',
    // 'frontend/script.js',
  ],
  server: ['data/livereload.json'],
}

const onError = (err) => {
  console.error(err)
}

let isProductionMode = false

gulp.task('setProductionMode', (cb) => {
  isProductionMode = true
  return cb()
})

gulp.task('clean', (cb) => {
  pump([
    gulp.src(paths.clean, {
      read: false,
    }),
    clean(),
    notify('Cleanup Public Directory'),
  ], cb)
})

gulp.task('copy', (cb) => async.forEachOf(paths.copy, (src, dest, cb) => {
  destination = (dest.startsWith('_')) ? src.dest : dest
  pump([
    gulp.src(src.src, {
      cwd: src.cwd,
    }),
    changed(destination),
    gulp.dest(destination),
  ], cb)
}, (err) => {
  if (err) console.log(err)
  notify('Build Copy Reloading')
  if (browserSync.active) browserSync.reload()
  return cb()
}))

gulp.task('buildSass', (cb) => {
  const sassOptions = {
    outputStyle: (!isProductionMode) ? 'expanded' : 'compressed',
  }
  pump([
    gulp.src(paths.sass),
    gif(!isProductionMode, sourcemaps.init()),
    sass(sassOptions).on('error', sass.logError),
    gif(!isProductionMode, sourcemaps.write()),
    gulp.dest('public/assets'),
    gif(browserSync.active, browserSync.stream()),
    notify('Build Styles Reloading'),
  ], cb)
})

gulp.task('buildJs', (cb) => {
  const options = {
    output: {
      comments: /^!/,
      shebang: true,
    },
  }
  pump([
    gulp.src(paths.js),
    gif(!isProductionMode, sourcemaps.init()),
    concat('script.js'),
    gif(isProductionMode, minify(options)),
    gif(!isProductionMode, sourcemaps.write()),
    gulp.dest('public/assets'),
    gif(browserSync.active, browserSync.stream()),
    notify('Build Javascript Reloading'),
  ], cb)
})

gulp.task('buildViews', (cb) => {
  pump([
    gulp.src(paths.views),
    gif(browserSync.active, browserSync.stream()),
    notify('Build Views Reloading'),
  ], cb)
})

gulp.task('buildServer', (cb) => {
  if (!browserSync.active) {
    return browserSync.init({
      proxy: {
        target: `${config.server.protocol}://${config.server.address}:${config.server.port}`,
        ws: true,
      },
      port: config.server.portPublic,
      https: {
        key: './assets/localhost-ssl-certificate/localhost.key',
        cert: './assets/localhost-ssl-certificate/localhost.crt',
      },
      ui: {
        port: config.server.portPublic + 1,
      },
      // socket: {
      // namespace: `http://localhost:4000/bs`
      // },
    }).emitter.on('init', () => {
      console.log('Browsersync is running!')
      return cb()
    })
  }
  return pump([
    gulp.src(paths.server),
    gif(browserSync.active, browserSync.stream()),
    notify('Build Server Reloading'),
  ], cb)
})

gulp.task('localtunnelWebserver', (cb) => {
  const localtunnel = require('localtunnel')

  const opts = {
    subdomain: 'spieglio-npc-bw2si4afw63',
  }
  const tunnel = localtunnel(config.server.port, opts, (err, tunnel) => {
    if (err) console.log(err)
    else console.log(tunnel.url)
  })

  tunnel.on('close', () => {
    console.log('tunnel closed')
    return cb()
  })
})

gulp.task('watch', (cb) => ((
  gulp.watch(_.map(paths.copy, (el) => `${el.cwd}/**/*`), { delay: 500 }).on('all', gulp.series('copy')),
  gulp.watch(paths.sass, { delay: 500 }).on('all', gulp.series('buildSass')),
  gulp.watch(paths.js, { delay: 500 }).on('all', gulp.series('buildJs')),
  gulp.watch(paths.views, { delay: 500 }).on('all', gulp.series('buildViews')),
  gulp.watch(paths.server, { delay: 500 }).on('all', gulp.series('buildServer'))
)))

gulp.task('startWebserver', (cb) => {
  const stream = nodemon({
    script: 'server/index.js',
    ext: 'js',
    watch: ['server'],
    env: {
      LOCALTUNNEL: 0,
      NODE_PATH: '.',
      NODE_ENV: config.env,
      DEBUG: `${config.slug}:*,socket.io:socket*`,
    },
  })

  stream.on('start', () => {
    console.log('nodemon webserver => started')
  })
    .on('quit', () => {
      console.log('nodemon webserver => quit')
      return cb()
    })
    .on('restart', () => {
      console.log('nodemon webserver => restart')
    })
    .on('crash', () => {
      console.error('nodemon webserver => app crashed\n')
      // stream.emit('restart', 10)  // restart the server in 10 seconds
    })
})

gulp.task('startCrawlerTwitch', (cb) => {
  const stream = nodemon({
    script: 'services/crawlerTwitch.js',
    ext: 'js',
    watch: ['services'],
    env: {
      NODE_PATH: '.',
      NODE_ENV: config.env,
      DEBUG: `${config.slug}:*`,
    },
  })

  stream.on('start', () => {
    console.log('nodemon crawler twitch => started')
  })
    .on('quit', () => {
      console.log('nodemon crawler twitch => quit')
      return cb()
    })
    .on('restart', () => {
      console.log('nodemon crawler twitch => restart')
    })
    .on('crash', () => {
      console.error('nodemon crawler twitch => app crashed\n')
    })
})

gulp.task('default', gulp.parallel('startWebserver', 'watch'))

gulp.task('build', gulp.parallel('copy', 'buildSass', 'buildJs'))
gulp.task('buildClean', gulp.series('clean', gulp.parallel('copy', 'buildSass', 'buildJs')))
gulp.task('buildProduction', gulp.series('setProductionMode', 'buildClean'))
