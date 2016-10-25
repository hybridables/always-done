'use strict'

var utils = require('lazy-cache')(require)
var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign, no-global-assign

/**
 * Lazily required module dependencies
 */

require('is-promise')
require('is-typeof-error')
require('try-catch-core')
require = fn // eslint-disable-line no-undef, no-native-reassign, no-global-assign

utils.subscribe = function subscribe (val, done) {
  function onNext (state) {
    onNext.state = state
  }

  val.subscribe(onNext, done, function () {
    done(null, onNext.state)
  })
}

/**
 * Expose `utils` modules
 */

module.exports = utils
