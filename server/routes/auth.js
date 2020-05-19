process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:router:auth`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:router:auth:error`)

const express = require('express')
const passport = require('passport')
const pnotice = require('pushnotice')(`${config.slug}:router:authentication`, {
  env: config.env, chat: config.pushnotice.chat, debug: true, disabled: config.pushnotice.disabled,
})

const jwt = require('jsonwebtoken')
const models = require('database/models')

const router = express.Router()

router.get('/', (req, res) => res.redirect('/auth/login'))

router.get('/login', (req, res) => {
  if (!req.user) {
    // not logged in will show login screen with choice of different login services
    const response = {
      bodyClasses: 'pageLogin',
    }
    return res.render('auth/login', response)
  }
  // logged in users will be redirected to their dashboard
  return res.redirect('/dashboard')
})
router.get('/success', (req, res) => {
  if (req.isAuthenticated()) {
    // Double check login status.
    req.flash('notice', 'Logged in successfully.')
    return res.redirect('/login/success')
  }
  return res.redirect('/auth/failed')
})
router.get('/failed', (req, res) => {
  req.flash('alert', 'Login failed.')
  return res.redirect('/login/failed')
})

router.get('/logout', (req, res) => req.session.regenerate((err) => {
  req.logout()
  req.flash('notice', 'Logout success.')
  return res.redirect('/')
}))

router.get('/telegram', async (req, res) => {
  const userTelegram = await req.user.UserTelegram
  console.log(userTelegram)
  res.send(userTelegram)
})

router.get('/telegram/:token', async (req, res) => {
  if (!req.user) {
    // TODO: implement telegram link when user is currently not logged in already
    log('telegram auth - initiated without logged in user')
    return res.redirect('/login')
  }

  const { token } = req.params

  if (!token) {
    error('telegram auth - no token in parameters')
    req.flash('alert', 'Linking Telegram failed. Invalid login token.')
    return res.redirect('/account/telegram')
  }

  let decoded
  try {
    decoded = jwt.verify(token, config.secrets.jwt)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      log('telegram auth - token expired', err)
      req.flash('alert', 'Linking Telegram failed. Token expired.')
    } else if (err.name === 'JsonWebTokenError') {
      log(`telegram auth - token ${err.message}`)
      req.flash('alert', 'Linking Telegram failed. Token invalid.')
    } else {
      error('telegram auth - token verification failed', err)
      req.flash('alert', 'Linking Telegram failed. Invalid login token.')
    }
    return res.redirect('/account/telegram')
  }

  if (!Object.prototype.hasOwnProperty.call(decoded, 'idUserProvider')) {
    error('telegram auth - does not have `idUserProvider` in decoded jwt')
    req.flash('alert', 'Linking Telegram failed. Invalid login token.')
    return res.redirect('/account/telegram')
  }

  const { idUserProvider } = decoded

  const userTelegram = await models.UserTelegram.findByPk(idUserProvider)
  if (!userTelegram) {
    error('telegram auth - no userTelegram with the idUserProvider which got extracted from the token')
    req.flash('alert', 'Linking Telegram failed. Invalid login token.')
    return res.redirect('/account/telegram')
  }

  // Token verified, it was valid, and a UserTelegram with the idUserProvider exists in the database
  req.flash('alert', 'Login succeeded.')
  const userTelegramObject = {
    idUser: req.user.idUser,
  }
  await userTelegram.update(userTelegramObject)
  // Successfully logged in
  req.flash('info', 'Successfully signed in')
  return res.redirect('/auth/success')
})

// Google
router.get('/google', passport.authenticate('google', {
  accessType: 'offline',
  prompt: 'consent',
  scope: config.passport.google.scope,
}))
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/failed',
  successRedirect: '/auth/success',
  failureFlash: true,
}))

// Twitch
router.get('/twitch', passport.authenticate('twitch', {
  // forceVerify: true // this option makes it so that the user is forced to click authenticate again (may be needed if scope changes)
}))
router.get('/twitch/callback', passport.authenticate('twitch', {
  failureRedirect: '/auth/failed',
  successRedirect: '/auth/success',
  failureFlash: true,
}))

// Facebook
router.get('/facebook', passport.authenticate('facebook', {
  accessType: 'offline',
  prompt: 'consent',
  scope: config.passport.facebook.scope,
}))
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/auth/failed',
  successRedirect: '/auth/success',
  failureFlash: true,
}))

// Discord
router.get('/discord', passport.authenticate('discord', {
  permissions: config.passport.discord.permissions,
}))
router.get('/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/auth/failed',
  successRedirect: '/auth/success',
  failureFlash: true,
}))

module.exports = router
