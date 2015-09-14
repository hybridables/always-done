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

function successJsonParse (callback) {
  callback(null, JSON.parse('{"foo":"bar"}'))
}

function returnArray () {
  return [4, 5, 6]
}

function failJsonParse () {
  JSON.parse('{"f')
}

function twoArgs (callback) {
  callback(null, 1, 2)
}

function failure (callback) {
  callback(new Error('callback error'))
}

test('should handle a successful callback', function (done) {
  alwaysDone(successJsonParse, function (err, res) {
    test.ifError(err)
    test.deepEqual(res, {foo: 'bar'})
    done()
  })
})

test('should handle thrown errors', function (done) {
  alwaysDone(failJsonParse, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle an errored callback', function (done) {
  alwaysDone(failure, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(err.message, 'callback error')
    test.strictEqual(res, undefined)
    done()
  })
})

test('should pass all arguments to the completion callback', function (done) {
  alwaysDone(twoArgs, function (err, one, two) {
    test.ifError(err)
    test.strictEqual(one, 1)
    test.strictEqual(two, 2)
    done()
  })
})

test('should pass whole returned array to single argument', function (done) {
  alwaysDone(returnArray, function (err, arr) {
    test.ifError(err)
    test.deepEqual(arr, [4, 5, 6])
    done()
  })
})
