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
    return res.redirect('/dashboard')
  }
  return res.redirect('/auth/failed')
})
router.get('/failed', (req, res) => {
  req.flash('alert', 'Login failed.')
  return res.redirect('/')
})

router.get('/logout', (req, res) => req.session.regenerate((err) => {
  req.logout()
  req.flash('notice', 'Logout success.')
  return res.redirect('/')
}))

router.get('/:provider/unlink', async (req, res) => {
  const { provider } = req.params
  let userProvider
  switch (provider) {
    case 'facebook':
      userProvider = await req.user.getUserFacebook()
      break
    case 'twitch':
      userProvider = await req.user.getUserTwitch()
      break
    case 'google':
      userProvider = await req.user.getUserGoogle()
      break
    case 'discord':
      userProvider = await req.user.getUserDiscord()
      break
    default:
      break
  }
  await userProvider.destroy()
  req.flash('success', `Connection to ${provider} account unlinked.`)
  return res.redirect('/dashboard')
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
