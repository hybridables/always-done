/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Handle completion of `fn` and optionally
 * pass `done` callback, otherwise it returns a thunk.
 * If that `thunk` does not accept function, it returns
 * another thunk until you pass `done` to it.
 *
 * **Example**
 *
 * ```js
 * var alwaysDone = require('always-done')
 * var options = {
 *   context: { num: 123, bool: true }
 *   args: [require('assert')]
 * }
 *
 * alwaysDone(function (assert, next) {
 *   assert.strictEqual(this.num, 123)
 *   assert.strictEqual(this.bool, true)
 *   next()
 * }, options, function (err) {
 *   console.log(err, 'done') // => null, 'done'
 * })
 *
 * alwaysDone(function (cb) {
 *   cb(new Error('foo bar'))
 * }, function done (err) {
 *   console.log(err) // => Error: foo bar
 * })
 *
 * ```
 *
 * @param  {Function} `<fn>` function to be called
 * @param  {Object} `[opts]` optional options, such as `context` and `args`, passed to [try-catch-core][]
 * @param  {Object} `[opts.context]` context to be passed to `fn`
 * @param  {Array} `[opts.args]` custom argument(s) to be pass to `fn`, given value is arrayified
 * @param  {Boolean} `[opts.passCallback]` pass `true` if you want `cb` to be passed to `fn` args
 * @param  {Function} `[done]` on completion
 * @return {Function} thunk until you pass `done` to that thunk
 * @throws {TypError} if `fn` not a function.
 * @throws {TypError} if no function is passed to `thunk`.
 * @api public
 */

module.exports = function alwaysDone (fn, opts, done) {
  if (typeof opts === 'function') {
    done = opts
    opts = null
  }
  if (typeof done === 'function') {
    utils.tryCatchCore.call(this, fn, opts, function cb (err, val) {
      // handle errors
      if (err) {
        done(err)
        return
      }

      // handle returned errors
      if (utils.isTypeofError(val)) {
        done(val)
        return
      }

      // handle promises
      if (utils.isPromise(val)) {
        val.then(function (res) {
          done(null, res)
        }, done)
        return
      }

      // handle observables
      if (val && typeof val.subscribe === 'function') {
        utils.subscribe(val, done)
        return
      }

      // handle streams
      if (utils.isNodeStream(val) || utils.isChildProcess(val)) {
        utils.handleStreams(val, done)
        return
      }

      // handle sync
      done(null, val)
    })
    return
  }

  return function thunk (cb) {
    return alwaysDone.call(this, fn, opts, cb)
  }
}

