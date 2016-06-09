'use strict';

var defer = function (task) {
  if (typeof task !== 'function') {
    throw new Error('missing mandatory task function');
  }

  return function (/* args... */) {
    var args = arguments;

    setTimeout(function () {
      task.apply(null, args);
    }, 0);
  };
};

module.exports = defer;
