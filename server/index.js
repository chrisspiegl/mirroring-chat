process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:server`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:server:error`)

log(`Running '${config.name}' Server in '${process.env.NODE_ENV}' environment`)

const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const expressStatusMonitor = require('express-status-monitor')
const flash = require('express-flash')
const fs = require('fs')
const helmet = require('helmet')
const logger = require('morgan')
const moment = require('moment-timezone')
const path = require('path')
const pmx = require('pmx')
const http = require('http')
const session = require('express-session')
const SessionRedisStore = require('connect-redis')(session)

pmx.init({ http: true })
moment.tz.setDefault('UTC')

const passport = require('server/passport')
const models = require('database/models')
const sockets = require('server/sockets')
const middleware = require('server/middleware')
const routes = require('server/routes')
const pnotice = require('pushnotice')(`${config.slug}:server`, {
  env: config.env, chat: config.pushnotice.chat, debug: true, disabled: config.pushnotice.disabled,
})
const redis = require('server/redis')

// Application
const app = express()
const server = http.Server(app)
const websocket = sockets(server)

app.use(helmet())
app.use(cors())
app.use(logger('tiny')) // Less extreme logging of requests
// app.use(middleware.analytics) // Disable analytics cause it's a internal tool
app.use(expressStatusMonitor({
  title: 'Express Status', // Default title
  // theme: 'default.css', // Default styles
  // path: '/status',
  // socketPath: '/socket.io', // In case you use a custom path
  websocket,
  spans: [{
    interval: 1, // Every second
    retention: 60, // Keep 60 data points in memory
  }, {
    interval: 5, // Every 5 seconds
    retention: 60,
  }, {
    interval: 15, // Every 15 seconds
    retention: 60,
  }],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    eventLoop: true,
    heap: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  healthChecks: [],
  ignoreStartsWith: '/admin',
}))
app.set('trust proxy', 1) // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// app.use(require('server/limiter').limiterReject); // Apply rate limiting to all routes
// app.use(require('server/limiter').limiterSlowDown); // Apply limiter to slow down to all routes
app.set('views', path.join(config.root, 'views'))
app.set('view engine', 'pug')
app.set('view cache', (config.envShort === 'pro'))
app.use(express.static(path.join(config.root, 'public')))
app.use(compression())
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false })) // to support URL-encoded bodies

const sessionRedisStoreOptions = config.database.redis
sessionRedisStoreOptions.prefix = `${config.slugShort}:${config.envShort}:sess:`
sessionRedisStoreOptions.client = redis.redisClient
app.use(session({
  // https://lockmedown.com/securing-node-js-managing-sessions-express-js/
  store: new SessionRedisStore(sessionRedisStoreOptions),
  secret: config.secrets.session,
  resave: false,
  proxy: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
    secure: (config.env === 'production' && config.server.protocol === 'https'),
    httpOnly: true, // Since the session ID is of no use to the client, there is absolutely no reason that the front-end  application should ever have access to the session ID in the cookie.  However, by default, any script running on the front-end application will have access to a cookie’s contents.
  },
  name: 'id',
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(middleware.extension)
app.use(require('server/locals'))

app.use((err, req, res, next) => {
  // Error in the Express App
  error(err.message)
  pnotice(`app.use error ${err.message}`)
  next(err, req, res)
})

// Each and every request
app.use((req, res, next) => next())

app.use(routes)

server.listen(config.server.port, config.server.address, async () => {
  await models.init()

  const host = server.address().address
  const { port } = server.address()
  const livereloadDate = new Date()
  fs.writeFileSync(path.join(config.root, '/data/livereload.json'), JSON.stringify({ livereload: livereloadDate }), { flat: 'w' })
  log(`Livereload written at ${livereloadDate}`)
  log(`App listening at ${config.server.protocol}://${config.server.hostname}${config.server.portPublic === '' ? '' : `:${config.server.portPublic}`}`)
  log(`Internal Address: ${host}:${port}`)
  pnotice(`App listening at ${config.server.protocol}://${config.server.hostname}${config.server.portPublic === '' ? '' : `:${config.server.portPublic}`}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  const cleanUp = async () => {
    // Clean up other resources like DB connections
    log('closing database connection')
    if (models && models.sequelize) {
      await models.sequelize.close()
    }
  }

  log('Closing server...')

  server.close(async () => {
    log('Server closed !!! ')

    await cleanUp()
    process.exit()
  })

  // Force close server after 5secs
  setTimeout(async (e) => {
    log('Forcing server close !!!', e)

    await cleanUp()
    process.exit(1)
  }, 10000) // 10 seconds
})

process.on('unhandledRejection', async (reason, promise) => {
  error('unhandledRejection', reason.stack || reason, promise)
  pnotice(`unhandledRejection:\n${JSON.stringify(reason)}`, 'ERROR')
  // routerError.error500(reason);
})
