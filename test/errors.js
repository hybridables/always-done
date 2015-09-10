/*!
 * always-done <https://github.com/tunnckoCore/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var alwaysDone = require('../index')

test('should throw TypeError if `callback` not function', function (done) {
  function fixture () {
    alwaysDone(function () {}, 123)
  }

  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `callback` function/)
  done()
})

test('should returned error be passed to completion callback as `err`', function (done) {
  alwaysDone(function () {
    return new Error('foo bar baz')
  }, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.equal(err.message, 'foo bar baz')
    test.equal(res, undefined)
    done()
  })
})
