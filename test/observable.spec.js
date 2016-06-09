'use strict';

var expect = require('expect.js');
var observable = require('../src/observable');

describe('observable(generator: Function): Function', function () {
  it('should be a function', function () {
    expect(observable).to.be.a('function');
  });

  it('should require a generator function', function () {
    expect(observable).to.throwException(function (exception) {
      expect(exception.message).to.be('missing mandatory generator function');
    });

    expect(observable).withArgs(true).to.throwException(function (exception) {
      expect(exception.message).to.be('missing mandatory generator function');
    });

    expect(observable).withArgs(function () {}).to.not.throwException();
  });

  it('should return a subscribe function', function () {
    expect(observable(function () {})).to.be.a('function');
  });

  describe('subscribe(event: String, observer: Function)', function () {
    it('should require an observer function', function () {
      var subscribe = observable(function () {});

      expect(subscribe).to.throwException(function (exception) {
        expect(exception.message).to.be('missing mandatory observer function');
      });

      expect(subscribe).withArgs('foo').to.throwException(function (exception) {
        expect(exception.message).to.be('missing mandatory observer function');
      });

      expect(subscribe).withArgs('foo', true).to.throwException(function (exception) {
        expect(exception.message).to.be('missing mandatory observer function');
      });

      expect(subscribe).withArgs(function () {}).to.throwException(function (exception) {
        expect(exception.message).to.be('missing mandatory observer function');
      });

      expect(subscribe).withArgs('foo', function () {}).to.not.throwException();
    });

    it('should register an observer for a specific event', function (done) {
      var subscribe = observable(function (publish) {
        publish('foo', true);
      });

      subscribe('foo', function (event) {
        expect(event).to.be(true);
        done();
      });
    });

    it('should register multiple observers for a specific event', function (done) {
      var isFirstObserverNotified = false;

      var subscribe = observable(function (publish) {
        publish('foo', true);
      });

      subscribe('foo', function () {
        isFirstObserverNotified = true;
      });

      subscribe('foo', function () {
        expect(isFirstObserverNotified).to.be(true);
        done();
      });
    });

    describe('observer(message: Any)', function () {
      it('should receive event messages from the generator', function (done) {
        var secret = { password: 'admin' };

        var subscribe = observable(function (publish) {
          publish('secret', secret);
        });

        subscribe('secret', function (message) {
          expect(message).to.be(secret);
          done();
        });
      });

      it('should be called for multiple events', function (done) {
        var buffer = '';

        var subscribe = observable(function (publish) {
          publish('data', 'a');
          publish('data', 'b');
          publish('data', 'c');
        });

        subscribe('data', function (message) {
          buffer += message;

          if (message === 'c') {
            expect(buffer).to.be('abc');
            done();
          }
        });
      });
    });
  });

  describe('generator(publish: Function)', function () {
    it('should receive a publish function', function () {
      observable(function (publish) {
        expect(publish).to.be.a('function');
      });
    });

    describe('publish(event: String, message: Any)', function () {
      it('should send messages to the observers', function (done) {
        var observersToTest = 5;
        var observersCalled = 0;
        var originalMessage = function () {};

        var observer = function (message) {
          expect(message).to.be(originalMessage);
          observersCalled++;
          if (observersCalled === observersToTest) { done(); }
        };

        var subscribe = observable(function (publish) {
          publish('foo', originalMessage);
        });

        for (var i = 0; i < observersToTest; i++) {
          subscribe('foo', observer);
        }
      });

      it('should send messages asynchronously', function (done) {

        var timeline = '';

        var subscribe = observable(function (publish) {
          publish('foo', 123);
          timeline += 'g'; // (g)enerator executed
        });

        timeline += 'o'; // (o)bservable created

        subscribe('foo', function (message) {
          expect(message).to.be(123);
          timeline += 'e'; // (e)vent received
          expect(timeline).to.be('goe');
          done();
        });

        expect(timeline).to.be('go');
      });
    });
  });
});
