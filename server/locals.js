process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:locals`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:locals:error`)

const _ = require('lodash')
const moment = require('moment-timezone')

moment.tz.setDefault('UTC')

module.exports = (req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  res.locals = res.locals || {}
  // eslint-disable-next-line no-param-reassign
  res.locals = _.merge(res.locals, {
    isPage: true,
    isApi: false,
    _,
    moment,
    // flash: req.flash(),
    req,
    namePrintDay(date) {
      return date.calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: '[Next] dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'MMM DD, YYYY',
      })
    },
    config,
    renderTimestamp: moment().toISOString(),
    title: config.name,
    url: `${config.server.protocol}://${config.server.hostname}${config.server.portPublic === '' ? '' : `:${config.server.portPublic}`}/`,
    headScript: `
      <script>
        var rootUri = '/'
        var rootUrl = '${config.server.protocol}://${config.server.hostname}${config.server.portPublic === '' ? '' : `:${config.server.portPublic}`}/'
      </script>
    `,
  })
  return next()
}
