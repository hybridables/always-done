/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var cp = require('child_process')
var test = require('assertit')
var alwaysDone = require('../index')

function execSuccess () {
  return cp.exec('echo hello world')
}

function execFail () {
  return cp.exec('foo-bar-baz hello world')
}

function spawnSuccess () {
  return cp.spawn('echo', ['hello world'])
}

function spawnFail () {
  return cp.spawn('foo-bar-baz', ['hello world'])
}

test('should handle successful exec', function (done) {
  alwaysDone(execSuccess, function (err, res) {
    test.ifError(err)
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle failing exec', function (done) {
  alwaysDone(execFail, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(err.message, 'exited with error code: 127')
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle successful spawn', function (done) {
  alwaysDone(spawnSuccess, function (err, res) {
    test.ifError(err)
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle failing spawn', function (done) {
  alwaysDone(spawnFail, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(err.code, 'ENOENT')
    test.strictEqual(res, undefined)
    done()
  })
})
