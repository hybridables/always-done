/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

module.exports = function alwaysDone (val) {
  var lettaValue = require('letta-value')
  if (typeof val === 'function') {
    return require('letta').apply(this, arguments).then(lettaValue)
  }
  return lettaValue(val)
}
