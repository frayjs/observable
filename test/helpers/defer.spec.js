'use strict';

var expect = require('expect.js');
var defer = require('../../src/helpers/defer');

describe('defer(fn: Function): Function', function () {
  it('should be a function', function () {
    expect(defer).to.be.a('function');
  });

  it('should require a task function', function () {
    expect(defer).to.throwException(function (exception) {
      expect(exception.message).to.be('missing mandatory task function');
    });

    expect(defer).withArgs(true).to.throwException(function (exception) {
      expect(exception.message).to.be('missing mandatory task function');
    });

    expect(defer).withArgs(function () {}).to.not.throwException();
  });

  it('should return a deferred function', function () {
    expect(defer(function () {})).to.be.a('function');
  });

  describe('deferred(args...)', function () {
    it('should call the task with provided arguments', function (done) {
      var A = function () {};
      var B = function () {};
      var C = function () {};

      var deferred = defer(function (a, b, c) {
        expect(a).to.be(A);
        expect(b).to.be(B);
        expect(c).to.be(C);
        done();
      });

      deferred(A, B, C);
    });

    it('should call the task asynchronously', function (done) {
      var flow = 'sync';

      var deferred = defer(function (snapshot) {
        expect(snapshot()).to.be('async');
        done();
      });

      deferred(function () {
        return flow;
      });

      flow = 'async';
    });
  });
});
