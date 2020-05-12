process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')

const debug = require('debug')

const log = debug(`${config.slug}:router:home`)
log.log = console.log.bind(console)
const error = debug(`${config.slug}:router:home:error`)

const path = require('path')
const express = require('express')

const middleware = require('server/middleware')

module.exports = () => {
  const router = express.Router()
  router.get('/', middleware.catchErrors(async (req, res) => {
    res.sendFile(path.join(config.root, 'public/index.html'))

    // const response = {
    //   bodyClasses: 'pageHome'
    // }

    // // Redirect logged in users to the dashboard unless they are accessing /home directly
    // if (req.user && req.baseUrl !== '/home') {
    //   return res.redirect('/dashboard')
    // }

    // return res.render('home', response)
  }))

  return router
}
