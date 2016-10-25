/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

let fs = require('mz/fs')
let test = require('mukla')
let path = require('path')
let alwaysDone = require('../index')

function resolvedPromise () {
  return Promise.resolve(123)
}

function rejectedPromise () {
  return Promise.reject(new Error('promise error'))
}

function successReadFile () {
  return fs.readFile(path.join(__dirname, '../package.json'), 'utf-8')
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

// test('should return promise', function (done) {
//   var count = 11
//   var promise = alwaysDone(function (cb) {
//     cb(null, 123)
//   }, function (err, res) {
//     test.ifError(err)
//     test.strictEqual(res, 123)
//     count += 22
//   })
//   promise.then(function () {
//     test.strictEqual(isPromise(promise), true)
//     test.strictEqual(count, 33)
//     done()
//   })
// })

// test('should be Bluebird promise if native promise not available', function (done) {
//   var count = 33
//   var promise = alwaysDone(fs.readFileSync, 'package.json', function (err, buf) {
//     test.ifError(err)
//     test.strictEqual(isBuffer(buf), true)
//     count += 33
//   })

//   promise.then(function () {
//     if (semver.lt(process.version, '0.11.13')) {
//       test.strictEqual(promise.___bluebirdPromise, true)
//       test.strictEqual(promise.Prome.___bluebirdPromise, true)
//     }
//     test.strictEqual(count, 66)
//     done()
//   }, done)
// })

// test('should use `pinkie` promise when native promise not available', function (done) {
//   alwaysDone.promise = require('pinkie')
//   var promise = alwaysDone(fs.readFileSync, 'package.json', function (err, res) {
//     test.ifError(err)
//     return res
//   })
//   promise.then(function (buf) {
//     if (semver.lt(process.version, '0.11.13')) {
//       test.strictEqual(promise.___customPromise, true)
//       test.strictEqual(promise.Prome.___customPromise, true)
//     }
//     test.strictEqual(isBuffer(buf), true)
//     done()
//   })
// })

// test('should handle result with promise.then, even if noop callback given', function (done) {
//   var promise = alwaysDone(fs.readFileSync, 'package.json', function () {})
//   promise.then(function (buf) {
//     test.strictEqual(isBuffer(buf), true)
//     done()
//   }, done)
// })
