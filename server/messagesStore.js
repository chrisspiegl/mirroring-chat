process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:messagesStore`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:messagesStore:error`)

const Filter = require('bad-words') // package to manage bad word filtering
const naughtyWords = require('naughty-words') // shutterstock bad word lists
const MarkdownIt = require('markdown-it')

const marked = require('marked')
const DOMPurify = require('dompurify')

const RedisPubSubManager = require('server/redisPubSubManager')
const redisKeyGenerator = require('server/redisKeyGenerator')
const models = require('database/models')

const md = new MarkdownIt()
const naughtyWordsCustom = [] // set array of custom bad words that I want to filter
const badWordFilter = new Filter({ placeHolder: '🌸', list: [naughtyWordsCustom, ...Object.values(naughtyWords)].flat() }) // set placeholder & combine all bad word lists to one and add it to the bad word filter
const messageSubscribers = {}
const rpsm = new RedisPubSubManager()

const fetchByUser = async (idUser, limit = 50, offset = 0) => {
  log('fetchForUser -> idUser', idUser)
  let messages = await models.ChatMessage.findAll({
    where: {
      idUser,
    },
    order: [['sentAt', 'DESC']],
    limit,
    offset,
  })
  messages = messages.reverse()
  return messages
}

const fetchByChat = async (idChat, limit = 50, offset = 0) => {
  log('fetchForChat -> idChat', idChat)
  let messages = await models.ChatMessage.findAll({
    where: {
      idChat,
    },
    order: [['sentAt', 'DESC']],
    limit,
    offset,
  })
  messages = messages.reverse()
  return messages
}

const addMessage = async (_message) => {
  log('addNewMessage -> message', _message)
  const message = { ..._message }
  message.message = badWordFilter.clean(message.message)
  // TODO: replace custom emotes see https://github.com/CodingGarden/live-chat-manager/blob/master/server/src/routes/index.js#L339
  // The replace has to happen before the markdown because the replace utilizes the markdown image tag.
  message.message = DOMPurify.sanitize(marked(message), {
    FORBID_ATTR: ['style', 'onerror', 'onload'],
    FORBID_TAGS: ['table', 'script', 'audio', 'video', 'style', 'iframe', 'textarea', 'frame', 'frameset'],
  })

  await models.ChatMessage.create(message)
  rpsm.publish(redisKeyGenerator.messages.stream(message.idUser), message)
  rpsm.publish(redisKeyGenerator.events, {
    event: redisKeyGenerator.event.CHAT_MESSAGE_RECEIVED,
    message,
  })
  return true
}

const isSubscribed = (idSubscriber) => !!messageSubscribers[idSubscriber]

const subscribe = (idSubscriber, idUser, callback) => {
  if (isSubscribed(idSubscriber)) return 'already-subscribed'
  messageSubscribers[idSubscriber] = {
    idUser,
    key: redisKeyGenerator.messages.stream(idUser),
    callback: (key, message) => callback(key, message),
  }
  rpsm.subscribe(messageSubscribers[idSubscriber].key, messageSubscribers[idSubscriber].callback)
  return 'subscribed'
}

const unsubscribe = (idSubscriber, idUser) => {
  if (!messageSubscribers[idSubscriber]) return 'not-subscribed'
  rpsm.unsubscribe(messageSubscribers[idSubscriber].key, messageSubscribers[idSubscriber].callback)
  delete messageSubscribers[idSubscriber]
  return 'unsubscribed'
}

module.exports = {
  addMessage,
  fetchByUser,
  fetchByChat,
  subscribe,
  unsubscribe,
  isSubscribed,
  messageSubscribe: subscribe,
  messageUnsubscribe: unsubscribe,
}
