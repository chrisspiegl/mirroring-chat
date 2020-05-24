process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('config')
const debug = require('debug')

const log = debug(`${config.slug}:redisPubSubManager`)
log.log = console.log.bind(console)
// eslint-disable-next-line no-unused-vars
const error = debug(`${config.slug}:redisPubSubManager:error`)

const { publisher, subscriber } = require('server/redis')

let instance = null

// In part inspired by: https://github.com/wilmerhmg/redis-pub-sub-manager/blob/master/RedisPubSub.js

module.exports = class RedisPubSubManager {
  constructor() {
    if (instance) {
      return instance
    }

    this.publisher = publisher
    this.subscriber = subscriber
    this.subscriptions = {}
    this.subscriber.on('message', this.onMessage.bind(this))
    instance = this
    return instance
  }

  publish(key, message) {
    this.publisher.publish(key, this.stringifyMessage(message))
  }

  subscribe(key, callback) {
    if (this.subscriptions[key]) {
      this.subscriptions[key] = [...this.subscriptions[key], callback]
    } else {
      this.subscriptions[key] = [callback]
      this.subscriber.subscribe(key)
    }
    log(`key ${key} subscribed`)
  }

  unsubscribe(key, callbackToUnsubscribe) {
    const callbacks = this.subscriptions[key] ? this.subscriptions[key] : []
    this.subscriptions[key] = callbacks.filter((callback) => callback !== callbackToUnsubscribe)
    log(`only ${this.subscriptions[key].length} callbacks left`)
    if (this.subscriptions[key].length === 0) {
      this.unbind(key)
    }
  }

  unbind(key) {
    this.subscriber.unsubscribe(key)
    delete this.subscriptions[key]
  }

  unbindAll() {
    Object.keys(this.subscriptions).forEach((key) => this.unbind(key))
  }

  onMessage(key, message) {
    log(`onMessage: ${key}`)
    const messageParsed = this.parseMessage(message)
    const callbacks = this.subscriptions[key] ? this.subscriptions[key] : []
    callbacks.forEach((callback) => callback(key, messageParsed))
  }

  // eslint-disable-next-line class-methods-use-this
  parseMessage(message) {
    try {
      return JSON.parse(message)
    } catch (exception) {
      error('exception while parsing message', exception, message)
      return message
    }
  }

  // eslint-disable-next-line class-methods-use-this
  stringifyMessage(message) {
    return JSON.stringify(message)
  }
}
