/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

module.exports = function alwaysDone (fn, done) {
  if (typeof done === 'function') {
    utils.tryCatchCore(fn, function cb (err, val) {
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
        utils.tryCatchCore(function (cb) {
          utils.subscribe(val, cb)
        }, done)
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
    return alwaysDone(fn, cb)
  }
}

