/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

let fs = require('fs')
let path = require('path')
let test = require('mukla')
let alwaysDone = require('../index')

function successJsonParse (callback) {
  callback(null, JSON.parse('{"foo":"bar"}'))
}

function notSpreadArrays (callback) {
  callback(null, [1, 2], 3, [4, 5])
}

function failure (callback) {
  callback(new Error('callback error'))
}

function readFile (cb) {
  fs.readFile(path.join(__dirname, '../package.json'), 'utf8', cb)
}

test('should handle a successful callback', function (done) {
  alwaysDone(successJsonParse, function (err, res) {
    test.ifError(err)
    test.deepEqual(res, {foo: 'bar'})
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

// @see tunnckoCore/try-catch-callback#1
// @see tunnckoCore/try-catch-core#4
// test('should spread arguments - e.g. cb(null, 1, 2)', function (done) {
//   alwaysDone(twoArgs, function (err, one, two) {
//     test.ifError(err)
//     test.strictEqual(one, 1)
//     test.strictEqual(two, 2)
//     done()
//   })
// })

test('should not spread arrays - e.g. cb(null, [1, 2], 3)', function (done) {
  alwaysDone(notSpreadArrays, function (err, arrOne, three, arrTwo) {
    test.ifError(err)
    test.deepEqual(arrOne, [1, 2])

    // @see tunnckoCore/try-catch-callback#1
    // @see tunnckoCore/try-catch-core#4
    // test.strictEqual(three, 3)
    // test.deepEqual(arrTwo, [4, 5])
    done()
  })
})

test('should handle result of `fs.readFile`', function (done) {
  alwaysDone(readFile, function (err, res) {
    test.ifError(err)
    test.equal(typeof res, 'string')
    test.ok(res.indexOf('"license": "MIT"') !== -1)
    done()
  })
})

test('should handle buffer result from `fs.readFile` passed directly', function (done) {
  alwaysDone(fs.readFile, path.join(__dirname, '../package.json'), function (err, res) {
    test.ifError(err)
    test.ok(Buffer.isBuffer(res))
    test.ok(res.toString('utf8').indexOf('"license": "MIT"') !== -1)
    done()
  })
})
