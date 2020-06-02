process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:router:error`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:router:error:error`)

const boom = require('boom')

const pnotice = require('pushnotice')(`${config.slug}:router:error`, {
  env: config.env,
  chat: config.pushnotice.chat,
  debug: true,
  disabled: config.pushnotice.disabled,
})

const errorResponder = (status, req, res, err) => {
  const boomError = boom.boomify(err)
  const errorObject = {
    url: req.url,
    method: req.method,
    code: status,
    msg: boomError.output.payload.error,
    message: boomError.output.payload.message,
    error: boomError || undefined,
    stack: boomError.stack,
  }

  console.error(boomError.stack)

  pnotice(`Error ${status}: ${boomError.output.payload.error}\n${boomError.output.payload.message}\n${JSON.stringify(errorObject)}`)

  if (res.locals.isApi) {
    // If the request is an API request, definitely respond with API response.
    return res.status(status).json(boomError.output.payload)
  }

  return res.format({
    '*/*': () => res.status(status).json(errorObject),
    text: () => res.status(status).send(errorObject.message),
    html: () => {
      error.bodyClasses = 'pageError'
      return res.status(status).render('error', errorObject)
    },
    json: () => res.status(status).send(errorObject),
  })
}

const error404 = (req, res, next) => {
  throw boom.notFound()
}

const error500 = async (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return errorResponder(400, req, res, err)
  }
  if (err.isBoom) {
    return errorResponder(err.output.statusCode, req, res, err)
  }
  return errorResponder(500, req, res, err)
}

module.exports = {
  error404,
  error500,
  errorResponder,
}
