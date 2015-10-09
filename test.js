/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')

test('errors', function (done) {
  require('./test/errors')
  done()
})

test('streams', function (done) {
  require('./test/streams')
  done()
})

test('promises', function (done) {
  require('./test/promises')
  done()
})

test('callbacks', function (done) {
  require('./test/callbacks')
  done()
})

test('observables', function (done) {
  require('./test/observables')
  done()
})

test('sync functions', function (done) {
  require('./test/sync')
  done()
})

test('child processes', function (done) {
  require('./test/child_processes')
  done()
})
