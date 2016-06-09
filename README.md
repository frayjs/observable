fray.observable
===============

Custom observable events

[![Build Status](https://travis-ci.org/frayjs/observable.svg?branch=master)](https://travis-ci.org/frayjs/observable)
[![Test Coverage](https://codeclimate.com/github/frayjs/observable/badges/coverage.svg)](https://codeclimate.com/github/frayjs/observable/coverage)

Usage
-----

Events are deferred ensuring an asynchronous execution

```js
var observable = require('fray.observable');

var subscribe = observable(function (publish) {
  publish('foo', 'hello!');
});


subscribe('foo', function (msg) {
  console.log(msg); // 'hello!'
});
```

Install
-------

    npm install fray.observable

Contributing
------------

PRs are welcome!

### Unit tests

    git clone https://github.com/frayjs/observable
    cd observable
    npm install
    npm test

License
-------

MIT
