'use strict'

var utils = require('lazy-cache')(require)
var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign, no-global-assign

/**
 * Lazily required module dependencies
 */

require('is-child-process')
require('is-node-stream')
require('is-promise')
require('is-typeof-error')
require('on-stream-end')
require('stream-exhaust')
require('try-catch-core')
require = fn // eslint-disable-line no-undef, no-native-reassign, no-global-assign

utils.subscribe = function subscribe (val, done) {
  function onNext (state) {
    onNext.state = state
  }

  val.subscribe(onNext, done, function observableCallback () {
    done(null, onNext.state)
  })
}

utils.handleStreams = function handleStreams (val, done) {
  var stream = utils.streamExhaust(val)

  process.once('newListener', function onNewListener (name) {
    this.removeAllListeners(name)
  })
  process.once('uncaughtException', function onerror (err) {
    stream.emit('error', err)
  })

  utils.onStreamEnd(stream, done)
}

/**
 * Expose `utils` modules
 */

module.exports = utils
