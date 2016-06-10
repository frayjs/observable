'use strict';

var defer = require('./helpers/defer');

var subscribe = function (observers, event, observer) {
  if (typeof observer !== 'function') {
    throw new Error('missing mandatory observer function');
  }

  if (typeof observers[event] === 'undefined') {
    observers[event] = [];
  }

  observers[event].push(observer);
};

var publish = defer(function (observers, event, message) {
  if (Array.isArray(observers[event])) {
    observers[event].forEach(function (observer) {
      observer(message);
    });
  }
});

var observable = function (generator) {
  if (typeof generator !== 'function') {
    throw new Error('missing mandatory generator function');
  }

  var observers = {};
  generator(publish.bind(null, observers));
  return subscribe.bind(null, observers);
};

module.exports = observable;
