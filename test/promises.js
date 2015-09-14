/*!
 * always-done <https://github.com/tunnckoCore/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('mz/fs')
var test = require('assertit')
var Bluebird = require('bluebird')
var isPromise = require('is-promise')
var alwaysDone = require('../index')

function resolvedPromise () {
  return Bluebird.resolve(123)
}

function rejectedPromise () {
  return Bluebird.reject(new Error('promise error'))
}

function successReadFile () {
  return fs.readFile('package.json', 'utf-8')
}

function failReadFile () {
  return fs.readFile('foo-bar')
}

test('should handle a resolved promise', function (done) {
  alwaysDone(resolvedPromise, function (err, res) {
    test.ifError(err)
    test.strictEqual(res, 123)
    done(err)
  })
})

test('should handle a rejected promise', function (done) {
  alwaysDone(rejectedPromise, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle result of promised fs.readFile', function (done) {
  alwaysDone(successReadFile, function (err, res) {
    test.ifError(err)
    test.ok(res.indexOf('"license": "MIT"') !== -1)
    done()
  })
})

test('should handle error of promised fs.readFile', function (done) {
  alwaysDone(failReadFile, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(res, undefined)
    done()
  })
})

test('should return promise', function (done) {
  var count = 11
  var promise = alwaysDone(function (cb) {
    cb(null, 123)
  }, function (err, res) {
    test.ifError(err)
    test.strictEqual(res, 123)
    count += 22
  })
  promise.then(function () {
    test.strictEqual(isPromise(promise), true)
    test.strictEqual(count, 33)
    done()
  })
})
