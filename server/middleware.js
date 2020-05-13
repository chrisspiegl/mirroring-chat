/* eslint-disable no-param-reassign */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:router:middleware`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:router:middleware:error`)

const _ = require('lodash')
const boom = require('boom')
const moment = require('moment-timezone')
const url = require('url')
const useragent = require('express-useragent')

const models = require('database/models')
const routerError = require('server/routes/error')

/**
 * Extension based on url parameter in router `\.:ext?`
 * Only works with routes that have `\.:ext?` parameter at the end
 * Answers then should be done with
 * ```
 * let response = {};
 * return res.format({
 *   html: () => {
 *     response.bodyClasses = ''
 *     return res.render("view-file", response);
 *   },
 *   json: () => {
 *     return res.send(response);
 *   }
 * });
 * ```
 */
const extension = (req, res, next) => {
  if (url.parse(req.url).pathname.match(/\.json$/)) {
    req.params.ext = 'json'
  } else if (!req.params.ext) {
    req.params.ext = 'html'
  }
  if (!_.includes(['html', 'json'], req.params.ext)) {
    return routerError.errorResponder(404, req, res)
  }
  if (req.params.ext === 'json') {
    req.headers.accept = _.join(['application/json', req.headers.accept])
  }
  return next()
}

const setBounce = (def) => (req, res, next) => {
  const ref = req.session
  const ref1 = req.query
  if (ref != null ? ref.bounceTo : undefined) {
    return next()
  }
  if (def) {
    req.session.bounceTo = def
  } else if (ref1 != null ? ref1.bounce : undefined) {
    req.session.bounceTo = req.query.bounce
  } else {
    req.session.bounceTo = req.get('Referer') || '/'
  }
  log(`session.bounceTo = ${req.session.bounceTo}`)
  return next()
}

const bounce = (def) => (req, res, next) => {
  const tmp = req.session.bounceTo
  if (tmp) {
    delete req.session.bounceTo
  }
  return res.redirect(tmp || def || '/')
}

const ensureLogin = (req, res, next) => {
  log('ensure logged in')
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('alert', `You have to be logged in to access ${req.originalUrl}`)
  return res.format({
    html() {
      return res.redirect('/auth')
    },
    json() {
      return res.json({
        error: 'not-logged-in',
      })
    },
    default() {
      return res.redirect('/auth')
    },
  })
}

const analytics = (req, res, next) => {
  const requestTime = new Date()
  const requestPath = url.parse(req.url).path
  res.on('finish', async () => {
    const useragentParsed = useragent.parse(req.get('User-Agent'))
    const type = ((locals) => {
      if (locals.isPage) return 'page'
      if (locals.isAPI) return 'api'
      return 'static'
    })(res.locals)

    await models.LogRequest.create({
      url: requestPath,
      method: req.method,
      status: res.statusCode,
      type,
      refHeader: req.headers.referer,
      refQuery: req.query.ref,
      userAgent: req.get('User-Agent'),
      browser: useragentParsed.browser,
      browserVersion: useragentParsed.version,
      os: useragentParsed.os,
      platform: useragentParsed.platform,
      bot: useragentParsed.isBot,
      dnt: !!req.header('dnt'),
      responseTime: (new Date() - requestTime) / 1000, // convert to seconds
      day: moment(requestTime).format('dddd'),
      hour: moment(requestTime).hour(),
    })
  })
  next()
}

const catchErrors = (fn) => (req, res, next) => {
// Make sure to `.catch()` any errors and pass them along to the `next()`
// middleware in the chain, in this case the error handler.
// return fn(req, res, next).catch(next;
// return Promise.resolve(fn(req, res, next)).catch((err) => {
  fn(req, res, next).catch((err) => {
    if (!err.isBoom) {
      return next(boom.badImplementation(err))
    }
    return next(err)
  })
}


module.exports = {
  extension,
  setBounce,
  bounce,
  ensureLogin,
  analytics,
  catchErrors,
}
