/*!
 * always-done <https://github.com/hybridables/always-done>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('fs')
var test = require('assertit')
var path = require('path')
var alwaysDone = require('../index')

test('should allow passing custom context through options', function (done) {
  alwaysDone(function () {
    test.strictEqual(this.num, 123)
    test.strictEqual(this.bool, true)
    test.strictEqual(arguments.length, 0)
  }, {
    context: { num: 123, bool: true }
  }, done)
})

test('should allow passing custom context through `.call`', function (done) {
  alwaysDone.call({
    foo: 'bar'
  }, function () {
    test.strictEqual(this.foo, 'bar')
    test.strictEqual(arguments.length, 0)
  }, done)
})

test('should allow passing custom arguments through options', function (done) {
  var filepath = path.join(__dirname, '../package.json')
  alwaysDone(fs.readFile, {
    args: [filepath, 'utf8']
  }, function (err, res) {
    test.strictEqual(err, null)
    test.strictEqual(typeof res, 'string')

    var json = JSON.parse(res)
    test.strictEqual(json.license, 'MIT')
    done()
  })
})

test('should pass callback arg, when `fn` is async or when sync but passCallback: true', function (done) {
  alwaysDone(function (foo, bar) {
    test.strictEqual(arguments.length, 2)
    test.strictEqual(foo, 'bar')
    test.strictEqual(bar, 'qux')
  }, {
    args: ['bar', 'qux']
  }, function (err) {
    test.strictEqual(err, null)
    alwaysDone(function (aaa, bbb) {
      test.strictEqual(arguments.length, 3)
      test.strictEqual(aaa, 111)
      test.strictEqual(bbb, 222)

      // get the callback (3rd argument)
      // intentionally getting it in this way
      var cb = arguments[2]
      cb()
    }, {
      passCallback: true,
      args: [111, 222]
    }, done)
  })
})
