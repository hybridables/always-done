/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

let fs = require('fs')
let path = require('path')
let test = require('assertit')
let through2 = require('through2')
let alwaysDone = require('../index')

let exists = path.join(__dirname, '../.gitignore')
let notExists = path.join(__dirname, '../not_exists')

let EndStream = through2.ctor(function (chunk, enc, cb) {
  this.push(chunk)
  cb()
}, function (cb) {
  this.emit('end', 2)
  cb()
})

function success () {
  let read = fs.createReadStream(exists)
  return read.pipe(new EndStream())
}

function failure () {
  let read = fs.createReadStream(notExists)
  return read.pipe(new EndStream())
}

function unpiped () {
  return fs.createReadStream(exists)
}

function unpipedFailure () {
  return fs.createReadStream(notExists)
}

test('should handle a successful stream', function (done) {
  alwaysDone(success, function (err, res) {
    test.ifError(err)
    test.strictEqual(err, null)
    test.strictEqual(res, undefined)
    done()
  })
})

// works, but does nothing, IMHO
// it works even without `dezalgo` and `once`
// modules in the core, so.. maybe good codebase?!?! Owned.
//
test('should handle a successful stream and call the callback once', function (done) {
  alwaysDone(function (cb) {
    return success().on('end', function () { cb(null, 3) })
  }, function (err, res) {
    test.ifError(err)
    test.strictEqual(err, null)
    test.strictEqual(res, 3)
    done()
  })
})

test('should handle an errored stream', function (done) {
  alwaysDone(failure, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(err.code, 'ENOENT')
    test.strictEqual(res, undefined)
    done()
  })
})

test('should handle an error unpiped readable stream', function (done) {
  alwaysDone(unpipedFailure, function (err, res) {
    test.ifError(!err)
    test.ok(err instanceof Error)
    test.strictEqual(err.code, 'ENOENT')
    test.strictEqual(res, undefined)
    done()
  })
})

test('should consume an unpiped readable stream', function (done) {
  alwaysDone(unpiped, function (err, res) {
    test.ifError(err)
    test.strictEqual(err, null)
    test.strictEqual(res, undefined)
    done()
  })
})
