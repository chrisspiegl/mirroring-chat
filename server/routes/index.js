process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:router:index`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:router:index:error`)

const app = require('express')()
const slashes = require('connect-slashes')

app.use('/api/v1', require('./api/v1'))
app.use('/api', require('./api/v1'))

app.use(slashes(false)) // has to be used after `/api` routes and `express.static` so it does not change those urls
// app.use(csurf({ cookie: false }))

app.use('/auth', require('./auth'))
app.use('/', require('./home')())
app.use('*', require('./home')())
app.use(require('./error').error404)
app.use(require('./error').error500)

module.exports = app
