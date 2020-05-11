process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')

const debug = require('debug')
const log = debug(`${config.slug}:router:messages`)
log.log = console.log.bind(console)
const error = debug(`${config.slug}:router:messages:error`)

const express = require('express')

const middleware = require('server/middleware')
const models = require('database/models')

module.exports = () => {
  const router = express.Router()
  router.get('/', middleware.catchErrors(async (req, res) => {
    const response = {
      bodyClasses: 'pageMessages'
    }

    response.channelName = `#${req.user.UserTwitch.username}`
    response.messages = await require('server/messagesStore').fetch(`#${req.user.UserTwitch.username}`)

    return res.format({
      '*/*': () => {
        return res.set('Content-Type', 'application/json').send(response);
      },
      text: () => {
        return res.set('Content-Type', 'application/json').send(response);
      },
      html: () => {
        return res.render('messages', response)
      },
      json: () => {
        return res.set('Content-Type', 'application/json').send(response);
      },
    });
  }))

  return router
}
