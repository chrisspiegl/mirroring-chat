process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const debug = require('debug')
const config = require('../config')

const log = debug(`${config.slug}:db:config`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:db:config:error`)

const exp = {}
exp[config.env] = config.database.sequelize
log(`loading config database ${JSON.stringify(exp[config.env])}`)
module.exports = exp
