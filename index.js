/*!
 * always-done <https://github.com/tunnckoCore/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var once = require('onetime')
var slice = require('sliced')
var dezalgo = require('dezalgo')
var isPromise = require('is-promise')
var isError = require('is-typeof-error')
var isAsyncFn = require('is-async-function')
var isNodeStream = require('is-node-stream')
var isChildProcess = require('is-child-process')
var streamExhaust = require('stream-exhaust')
var onStreamEnd = require('on-stream-end')
var catchup = require('catchup')

module.exports = function alwaysDone (fn) {
  var argz = slice(arguments)
  var args = slice(argz, 1, -1)
  var callback = argz[argz.length - 1]

  if (typeof callback !== 'function') {
    throw new TypeError('always-done: expect `callback` function as last argument')
  }

  var self = this
  var domain = catchup().once('error', done)

  function done () {
    domain.off('error', done)
    once(dezalgo(callback), true).apply(null, arguments)
  }
  var ret = domain.run(function () {
    if (!isAsyncFn(fn)) return fn.apply(self, args)
    return fn.apply(self, args.concat(done))
  })
  if (domain.errored) return
  if (isNodeStream(ret) || isChildProcess(ret)) {
    onStreamEnd(streamExhaust(ret), function (err) {
      if (err) return done(err)
      var args = slice(arguments, 1)
      done.apply(self, [null].concat(args))
    })
    return
  }
  if (ret && typeof ret.subscribe === 'function') {
    if (ret.value) return done(null, ret.value)
    ret.subscribe(function noop () {}, done, function (res) {
      var args = slice(arguments)
      done.apply(self, [null].concat(args))
    })
    return
  }
  if (isPromise(ret)) {
    ret.then(function (res) {
      done(null, res)
    }, done)
    return
  }
  if (isError(ret)) {
    done(ret)
    return
  }
  if (!isAsyncFn(fn)) {
    done(null, ret)
  }
}
