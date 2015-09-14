/*!
 * always-done <https://github.com/tunnckoCore/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('fs')
var test = require('assertit')
var alwaysDone = require('../index')

function successJsonParse () {
  return JSON.parse('{"foo":"bar"}')
}

function returnFailingJsonParse () {
  return JSON.parse('{"f')
}

function noReturnFailJsonParse () {
  JSON.parse('{"f')
}

function returnArray () {
  return [4, 5, 6]
}

function successReadFile () {
  return fs.readFileSync('package.json', 'utf-8')
}

function failReadFile () {
  return fs.readFileSync('foo-bar')
}

test('should handle result when JSON.parse pass', function (done) {
  alwaysDone(successJsonParse, function (err, res) {
    test.ifError(err)
    test.deepEqual(res, {foo: 'bar'})
    done()
  })
})

test('should handle error when JSON.parse fail', function (done) {
  alwaysDone(returnFailingJsonParse, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle result when fs.readFileSync pass', function (done) {
  alwaysDone(successReadFile, function (err, res) {
    test.ifError(err)
    test.ok(res.indexOf('"license": "MIT"') !== -1)
    done()
  })
})

test('should handle error when fs.readFileSync fail', function (done) {
  alwaysDone(failReadFile, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle thrown errors', function (done) {
  alwaysDone(noReturnFailJsonParse, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(res, undefined)
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
