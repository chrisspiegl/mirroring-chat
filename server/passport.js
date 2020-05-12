process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')

const debug = require('debug')
const log = debug(`${config.slug}:passport`)
log.log = console.log.bind(console)
const error = debug(`${config.slug}:passport:error`)

const _ = require('lodash')
const moment = require('moment')
const pnotice = require('pushnotice')(`${config.slug}:passport`, {env: config.env, chat: config.pushnotice.chat, debug: true, disabled: config.pushnotice.disabled})

const passport = require('passport')
const refresh = require("passport-oauth2-refresh")
const passportDiscord = require('passport-discord').Strategy
const passportFacebook = require('passport-facebook').Strategy
const passportGoogle = require('passport-google-oauth20').Strategy
const passportTwitch = require('@d-fischer/passport-twitch').Strategy

const models = require('database/models')

/**
 * Build Callback Url from Config Settings
 */
const buildCallbackUrl = (provider) => {
  return config.server.protocolPublic + "://" + config.server.hostname + (config.server.portPublic === '' ? '' : ':' + config.server.portPublic) + `/auth/${provider}/callback`
}

/**
 * Passport Universal Login Flow
 * Generates everything based on functions & the provider name
 */
const loginFlow = async (req, tokenAccess, tokenRefresh, profile, done) => {
  let userProviderOptions = createUserProviderOptions(tokenAccess, tokenRefresh, profile)
  let modelUserProvider = selectModelUserProvider(profile.provider)
  let userProvider = await findUserProvider(profile)
  if (userProvider) {
    // Updating the user provider data in the database no matter what (apparently the person is actually logged in as provider user)
    await userProvider.update(userProviderOptions)
    if (req.user) {
      // Logged in and user provider found
      if (req.user.idUser === userProvider.idUser) {
        log(`login:user:${req.user.idUser}:already-linked-to:${profile.provider}:${userProvider.idUserProvider}`)
        req.flash('success', `The ${profile.provider} account is already connected to your account.`)
      } else {
        log(`login:user:${req.user.idUser}:already-linked-different-account:${profile.provider}:${userProvider.idUserProvider}`)
        req.flash('error', `The ${profile.provider} account you tried to link is already connected to a different user account. Please check if that is your account or contact our support team.`)
      }
    } else {
      // Not logged in and user provider found, going to try to find the user for that account
      log(`login:${profile.provider}:user:${userProvider.idUserProvider}:found-looking-for-user-object`)
      req.user = await findUser(userProvider)
      // FIXME: special case: user provider found, user not logged in, BUT: on the search for a local user we got nothing.
      // This is an edge case and in this case the user account should be created automatically
    }
  } else {
    // User provider not found
    if (req.user) {
      // Provider account does not exist and user is logged in, thus we are linking the provider to the req.user
      log(`login:user:${req.user.idUser}:logged-in-user-linking-new-provider:${profile.provider}:${profile.id}`)
      userProviderOptions.idUserProvider = profile.id
      userProviderOptions.idUser = req.user.idUser
      console.log("loginFlow -> userProviderOptions", userProviderOptions)
      userProvider = await modelUserProvider.create(userProviderOptions)
      log(`login:user:${req.user.idUser}:logged-in-user-now-linked-to-provider:${profile.provider}:${userProvider.idUserProvider}`)
      req.user = await findUser(userProvider)
    } else {
      // provider account is not found and user is not logged in thus creating a completely new account
      log(`login:${profile.provider}:user:${profile.id}:creating-new-user`)
      req.user = await createUser(profile, tokenAccess, tokenRefresh)
    }
  }
  return done(null, req.user)
}

/**
 * Passport Google Login Strategy
 */
const strategyGoogle = new passportGoogle({
  clientID: config.passport.google.clientId,
  clientSecret: config.passport.google.clientSecret,
  accessType: 'offline',
  // This userProfileURL is necessary because of the Google+ Deprecation
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  callbackURL: buildCallbackUrl('google'),
  passReqToCallback: true,
}, loginFlow)
passport.use(strategyGoogle)
refresh.use(strategyGoogle)

/**
 * Passport Twitch Login Strategy
 */
const strategyTwitch = new passportTwitch({
  clientID: config.passport.twitch.clientId,
  clientSecret: config.passport.twitch.clientSecret,
  callbackURL: buildCallbackUrl('twitch'),
  scope: config.passport.twitch.scope,
  passReqToCallback: true,
}, loginFlow)
passport.use(strategyTwitch)
refresh.use(strategyTwitch)

/**
 * Passport Facebook Login Strategy
 */
const strategyFacebook = new passportFacebook({
  clientID: config.passport.facebook.clientId,
  clientSecret: config.passport.facebook.clientSecret,
  callbackURL: buildCallbackUrl('facebook'),
  profileFields: ['id', 'displayName', 'photos', 'email'],
  passReqToCallback: true,
}, loginFlow)
passport.use(strategyFacebook)
refresh.use(strategyFacebook)

/**
 * Passport Discord Login Strategy
 */
const strategyDiscord = new passportDiscord({
  clientID: config.passport.discord.clientId,
  clientSecret: config.passport.discord.clientSecret,
  callbackURL: buildCallbackUrl('discord'),
  scope: config.passport.discord.scope,
  passReqToCallback: true,
}, loginFlow)
passport.use(strategyDiscord)
refresh.use(strategyDiscord)

/**
 * Passport Telegram Login Strategy
 */
// const strategyTelegram = new passportTelegram({
//   clientID: config.passport.telegram.mirroringChatBot.clientId,
//   // clientSecret: config.passport.telegram.clientSecret,
//   callbackURL: buildCallbackUrl('telegram'),
//   scope: config.passport.telegram.scope,
//   passReqToCallback: true,
// }, loginFlow)
// passport.use(strategyTelegram)
// refresh.use(strategyTelegram)


/**
 * ======================================================
 * Session storage and retrieval:
 */

/**
 * Save user in Session
 */
passport.serializeUser(async (user, callback) => {
  log(`user:${user.idUser}:serializing`)
  try {
    user.lastLogin = moment()
    await user.save()
    log(`user:${user.idUser}:serialized`)
    return callback(null, user.idUser)
  } catch(err) {
    error(`user:${user.idUser}:serializing`, err)
    return callback(null, false)
  }
})

/**
 * Load user saved in Session
 */
passport.deserializeUser(async (idUser, callback) => {
  log(`user:${idUser}:deserializing`)
  try {
    let user = await models.User.findByPk(idUser, {
      include: [
        models.UserGoogle,
        models.UserTwitch,
        models.UserFacebook,
        models.UserDiscord,
      ],
    })
    if (!user) return callback(null, false)
    log(`user:${idUser}:deserialized`)
    user.lastActive = moment()
    await user.save()
    return callback(null, user)
  } catch(err) {
    error(`user:${idUser}:deserializing`, err)
    return callback(null, false)
  }
})

module.exports = passport


/**
 * ======================================================
 * Support functions below:
 */

/**
 * CreateUserProviderOptions
 */
const createUserProviderOptions = (tokenAccess, tokenRefresh, profile) => {
  log(`login:generate-provider-options:${profile.provider}`)
  switch (profile.provider) {
    case 'google':
      return {
        tokenAccess: tokenAccess,
        tokenRefresh: tokenRefresh,
        picture: profile.photos[0].value,
        email: profile.emails[0].value,
        displayName: profile.displayName,
      }
    case 'twitch':
      return {
        tokenAccess: tokenAccess,
        tokenRefresh: tokenRefresh,
        displayName: profile.display_name,
        email: profile.email,
        picture: profile.profile_image_url,
        username: profile.login,
      }
    case 'discord':
      return {
        tokenAccess: tokenAccess,
        tokenRefresh: tokenRefresh,
        displayName: profile.username,
        email: profile.email,
        picture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg`,
        username: profile.username,
      }
    case 'facebook':
      return {
        tokenAccess: tokenAccess,
        tokenRefresh: tokenRefresh,
        displayName: profile.displayName,
        email: null,
        picture: profile.photos[0].value,
        username: profile.id,
      }
  }
}

/**
 * SelectModelUserProvider
 */
const selectModelUserProvider = (provider) => {
  log(`login:selecting-provider-model-for:${provider}`)
  switch (provider) {
    case 'google':
      return models.UserGoogle
    case 'twitch':
      return models.UserTwitch
    case 'discord':
      return models.UserDiscord
    case 'facebook':
      return models.UserFacebook
  }
}

/**
 * FindUserProvider - look for the provider user account
 */
const findUserProvider = async (profile) => {
  let { id: idUserProvider, provider } = profile
  log(`login:searching:${provider}:user:${idUserProvider}`)
  switch (provider) {
    case 'google':
      return await models.UserGoogle.findByPk(idUserProvider, {
        include: models.User
      })
    case 'twitch':
      return await models.UserTwitch.findByPk(idUserProvider, {
        include: models.User
      })
    case 'discord':
      return await models.UserDiscord.findByPk(idUserProvider, {
        include: models.User
      })
    case 'facebook':
      return await models.UserFacebook.findByPk(idUserProvider, {
        include: models.User
      })
  }
}

/**
 * FindUser - looks for the local user model
 */
const findUser = async (userProvider) => {
  log(`login:searching:user:${userProvider.idUser}`)
  let user = await userProvider.getUser()
  if (!user) {
    error(`login:user:${userProvider.idUser}:not-found`)
    return null
  }
  log(`login:user:${user.idUser}:found`)
  user.set('picture', userProvider.get('picture'))
  user.save()
  return user
}

/**
 * CreateUser - Create User in Database
 */
const createUser = async (profile, tokenAccess, tokenRefresh) => {
  log(`login:user:create`)
  let userOptions = {
    settings: {},
    lastActive: moment(),
    lastLogin: moment(),
    createdAt: moment(),
    updatedAt: moment(),
  }

  let { provider } = profile
  let modelProvider

  switch (provider) {
    case 'google':
      modelProvider = models.UserGoogle
      _.merge(userOptions, {
        displayName: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos ? profile.photos[0].value : undefined,
        username: null,
        UserGoogle: {
          idUserProvider: profile.id,
          tokenAccess: tokenAccess,
          tokenRefresh: tokenRefresh,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
        },
      })
      break
    case 'twitch':
      modelProvider = models.UserTwitch
      _.merge(userOptions, {
        displayName: profile.display_name,
        email: profile.email,
        picture: profile.profile_image_url,
        username: profile.login,
        UserTwitch: {
          idUserProvider: profile.id,
          tokenAccess: tokenAccess,
          tokenRefresh: tokenRefresh,
          displayName: profile.display_name,
          email: profile.email,
          picture: profile.profile_image_url,
          username: profile.login,
        },
      })
      break
    case 'discord':
      modelProvider = models.UserDiscord
      _.merge(userOptions, {
        displayName: profile.username,
        email: profile.email,
        picture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg`,
        username: profile.username,
        UserDiscord: {
          idUserProvider: profile.id,
          tokenAccess: tokenAccess,
          tokenRefresh: tokenRefresh,
          displayName: profile.username,
          email: profile.email,
          picture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg`,
          username: profile.username,
        },
      })
      break
    case 'facebook':
      modelProvider = models.UserFacebook
      _.merge(userOptions, {
        displayName: profile.displayName,
        email: null,
        picture: profile.photos[0].value,
        username: profile.id,
        UserFacebook: {
          idUserProvider: profile.id,
          tokenAccess: tokenAccess,
          tokenRefresh: tokenRefresh,
          displayName: profile.displayName,
          email: null,
          picture: profile.photos[0].value,
          username: profile.id,
        },
      })
      break
  }

  let user = await models.User.create(userOptions, {
    include: [modelProvider]
  })
  log(`login:user:${user.idUser}:created`)
  return user
}
