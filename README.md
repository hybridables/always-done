# [always-done][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

<p align="center">
  <a href="https://github.com/hybridables">
    <img height="250" width="250" src="https://avatars1.githubusercontent.com/u/10666022?v=3&s=250">
  </a>
</p>

> Handle completion and errors with elegance! Support for streams, callbacks, promises, child processes, async and sync functions. A drop-in replacement for [async-done][] - pass 100% of its tests plus more

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [API](#api)
  * [alwaysDone](#alwaysdone)
- [Background](#background)
- [Resolution](#resolution)
- [Support](#support)
  * [async/await completion](#asyncawait-completion)
  * [Callbacks completion](#callbacks-completion)
  * [Synchronous functions](#synchronous-functions)
  * [Promises](#promises)
  * [Streams](#streams)
  * [Observables](#observables)
  * [Child Process](#child-process)
  * [Handling native errors](#handling-native-errors)
  * [Always completes](#always-completes)
- [Contributing](#contributing)

## Install
> Install with [npm](https://www.npmjs.com/)

```sh
$ npm i always-done --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const alwaysDone = requests('always-done')
```

## API

### [alwaysDone](index.js#L42)
> Handle completion of `fn` and optionally pass `done` callback, otherwise it returns a thunk. If that `thunk` does not accept function, it returns another thunk until you pass `done` to it.

**Params**

* `<fn>` **{Function}**: function to be called    
* `[done]` **{Function}**: on completion    
* `returns` **{Function}**: thunk until you pass `done` to that thunk  

**Example**

```js
var alwaysDone = require('always-done')

alwaysDone(function (cb) {
  cb(null, 123)
}, function done (err, res) {
  console.log(err, res) // => null, 123
})

alwaysDone(function (cb) {
  cb(new Error('foo bar'))
}, function done (err) {
  console.log(err) // => Error: foo bar
})
```

## Background

Behind the scenes we use just good plain old `try/catch` block. Sounds you strange? See what "hard" job is done on [try-catch-callback][] and [try-catch-core][].

In the first one, we just calls a function inside try/catch and calls `done` callback with error or result of that function.

About second one, there we wraps the `done` callback with [once][] and [dezalgo][] to ensure it will be called in the next tick.

Here, in `always-done`, we just give a `callback` to that [try-catch-core][] package and "listen" what are the result. Actually we not listening anything, we just make a few checks to understand what the incoming value is - promise, child process, stream, observable and etc.

## Resolution

Nothing so magical. Try/catch block for most of the things works briliant. And [on-stream-end][] module (which is drop-in replacement for [end-of-stream][]) for streams and child processes.

## Support

### async/await completion

```js
alwaysDone(async function () {
  return await Promise.resolve('foobar')
}, function done (e, res) {
  console.log(res) // => 'foobar'
})
```

**[back to top](#table-of-contents)**

### Callbacks completion

```js
var alwaysDone = requests('always-done')

alwaysDone(function (cb) {
  fs.readFile('./package.json', 'utf8', cb)
}, function done (err, res) {
  if (err) return console.log(err)
 
  var pkg = JSON.parse(res)
  console.log(pkg.name) // => 'always-done'
})
```

**[back to top](#table-of-contents)**

### Synchronous functions

#### Returning a value

```js
alwaysDone(function () {
  return 123
}, function done (e, res) {
  console.log(res) // => 123
})
```

#### Returning an error

```js
alwaysDone(function () {
  return new Error('qux bar')
}, function done (err) {
  console.log(err.message) // => 'qux bar'
})
```

**[back to top](#table-of-contents)**

### Promises

#### Returning a resolved Promise

```js
alwaysDone(function () {
  return Promise.resolve(12345)
}, function done (e, res) {
  console.log(res) // => 12345
})
```

#### Returning a rejected Promise

```js
alwaysDone(function () {
  return Promise.reject(new Error('foo bar'))
}, function done (err) {
  console.log(err.message) // => 'foo bar
})
```

**[back to top](#table-of-contents)**

### Streams

#### Unpiped streams

```js
alwaysDone(function () {
  return fs.createReadStream('./package.json')
}, function done (e) {
  console.log('stream completed')
})
```

#### Failing unpiped streams

```js
alwaysDone(function () {
  return fs.createReadStream('foo bar')
}, function done (err) {
  console.log(err.code) // => ENOENT
  console.log(err.message) // => No such file or directory
})
```

#### Failing piped streams

```js
alwaysDone(function () {
  var read = fs.createReadStream('foo bar')
  return read.pipe(through2())
}, function done (err) {
  console.log(err.code) // => ENOENT
  console.log(err.message) // => No such file or directory
})
```

**[back to top](#table-of-contents)**

### Observables

#### Empty observable
```js
var Observable = require('rx').Observable

alwaysDone(function () {
  return Observable.empty()
}, function done (e, res) {
  console.log(e, res) // => null, undefined
})
```

#### Successful observable

```js
alwaysDone(function () {
  return Observable.return([1, 2, 3])
}, function done (e, res) {
  console.log(res) // => [1, 2, 3]
})
```

#### Failing observable

```js
alwaysDone(function () {
  return Observable.throw(new Error('observable error'))
}, function done (err) {
  console.log(err.message) // => 'observable error'
})
```

**[back to top](#table-of-contents)**

### Child Process

#### Successful exec

```js
var cp = require('child_process')

alwaysDone(function () {
  return cp.exec('echo hello world')
}, function done (e, res) {
  console.log(res) // => 'hello world'
})
```

#### Failing exec

```js
var cp = require('child_process')

alwaysDone(function () {
  return cp.exec('foo-bar-baz sasa')
}, function done (err) {
  console.log(err.message) // => 'exited with error code: 12'
})
```

#### Failing spawn

```js
var cp = require('child_process')

alwaysDone(function () {
  return cp.spawn('foo-bar-baz', ['hello world'])
}, function done (err) {
  console.log(err.code) // => ENOENT
})
```

**[back to top](#table-of-contents)**

### Handling native errors

```js
alwaysDone(function () {
  foo
  return 55
}, function (err) {
  console.log(err.name)
  // => ReferenceError: foo is not defined
})
```

**[back to top](#table-of-contents)**

### Always completes
> It may looks strange, but it's logical.

**Example**

```js
// passing empty function
alwaysDone(function () {}, function (err, res) {
  console.log(err, res) // => null, undefined
})
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/hybridables/always-done/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[async-done]: https://github.com/gulpjs/async-done
[dezalgo]: https://github.com/npm/dezalgo
[end-of-stream]: https://github.com/mafintosh/end-of-stream
[on-stream-end]: https://github.com/tunnckocore/on-stream-end
[once]: https://github.com/isaacs/once
[try-catch-callback]: https://github.com/tunnckocore/try-catch-callback
[try-catch-core]: https://github.com/tunnckocore/try-catch-core

[npmjs-url]: https://www.npmjs.com/package/always-done
[npmjs-img]: https://img.shields.io/npm/v/always-done.svg?label=always-done

[license-url]: https://github.com/hybridables/always-done/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/always-done.svg

[downloads-url]: https://www.npmjs.com/package/always-done
[downloads-img]: https://img.shields.io/npm/dm/always-done.svg

[codeclimate-url]: https://codeclimate.com/github/hybridables/always-done
[codeclimate-img]: https://img.shields.io/codeclimate/github/hybridables/always-done.svg

[travis-url]: https://travis-ci.org/hybridables/always-done
[travis-img]: https://img.shields.io/travis/hybridables/always-done/master.svg

[coveralls-url]: https://coveralls.io/r/hybridables/always-done
[coveralls-img]: https://img.shields.io/coveralls/hybridables/always-done.svg

[david-url]: https://david-dm.org/hybridables/always-done
[david-img]: https://img.shields.io/david/hybridables/always-done.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

