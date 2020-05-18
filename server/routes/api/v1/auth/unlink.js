/* eslint-disable global-require */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:api:v1:auth:unlink`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:api:v1:auth:unlink:error`)

const jwt = require('jsonwebtoken')

const asyncHandler = require('express-async-handler')

module.exports = asyncHandler(async (req, res) => {
  const response = {
    ok: true,
    status: 200,
    apiVersion: 1,
    name: 'AuthUnlinkProvider',
    description: 'Destory a connection between logged in user and a specified provider.',
    data: {},
  }
  const {
    provider,
  } = req.params
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

  if (userProvider) {
    await userProvider.destroy()
  } else {
    response.message = `User is not connected to provider ${provider}.`
  }

  return res.status(response.status).set('Content-Type', 'application/json').send(response)
})
