'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var sandbox;

//// SUT
var differ = require('../src/differ');

describe('Differ', function() {

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should respond with no changes when objects are identical', function() {
    expect(differ({}, {})).to.deep.equal([]);
    expect(differ([], [])).to.deep.equal([]);
    expect(differ({test:123}, {test:123})).to.deep.equal([]);
    expect(differ([1], [1])).to.deep.equal([]);
  });

  describe('additions', function() {

    it('to objects', function() {
      var left = {};
      var right = {
        test: 123
      };
      var expectedResult = [
        {
          type: 'add',
          path: ['test'],
          newValue: 123
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('to nested objects', function() {
      var left = {
        first: {}
      };
      var right = {
        first: {
          second: 123
        }
      };
      var expectedResult = [
        {
          type: 'add',
          path: ['first', 'second'],
          newValue: 123
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('of whole objects', function() {
      var left = {};
      var right = {
        first: {
          second: 123
        }
      };
      var expectedResult = [
        {
          type: 'add',
          path: ['first'],
          newValue: {
            second: 123
          }
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('to arrays', function() {
      var left = [];
      var right = [123];
      var expectedResult = [
        {
          type: 'add',
          path: [0],
          newValue: 123
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

  });

  describe('deletions', function() {

    it('from objects', function() {
      var left = {
        test: 123
      };
      var right = {};
      var expectedResult = [
        {
          type: 'delete',
          path: ['test'],
          oldValue: 123
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('of nested values', function() {
      var left = {
        first: {
          second: 123
        }
      };
      var right = {
        first: {}
      };
      var expectedResult = [
        {
          type: 'delete',
          path: ['first', 'second'],
          oldValue: 123
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('of whole objects', function() {
      var left = {
        first: {
          second: 123
        }
      };
      var right = {};
      var expectedResult = [
        {
          type: 'delete',
          path: ['first'],
          oldValue: {
            second: 123
          }
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('from arrays', function() {
      var left = [123];
      var right = [];
      var expectedResult = [
        {
          type: 'delete',
          path: [0],
          oldValue: 123
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

  });

  describe('updates', function() {

    it('to objects', function() {
      var left = {
        test: 123
      };
      var right = {
        test: 456
      };
      var expectedResult = [
        {
          type: 'update',
          path: ['test'],
          oldValue: 123,
          newValue: 456
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('on nested objects', function() {
      var left = {
        first: {
          second: 123
        }
      };
      var right = {
        first: {
          second: 456
        }
      };
      var expectedResult = [
        {
          type: 'update',
          path: ['first', 'second'],
          oldValue: 123,
          newValue: 456
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('of whole objects should be interpretted as additions and deletions', function() {
      var left = {
        first: {
          second: 123
        }
      };
      var right = {
        first: {
          third: 456
        }
      };
      var expectedResult = [{
          type: 'delete',
          path: ['first', 'second'],
          oldValue: 123
        }, {
          type: 'add',
          path: ['first', 'third'],
          newValue: 456
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('to arrays', function() {
      var left = [123];
      var right = [456];
      var expectedResult = [
        {
          type: 'update',
          path: [0],
          oldValue: 123,
          newValue: 456
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

  });

  describe('reorders in arrays', function() {

    it('should be interpretted as updates', function() {
      var left = [123, 456];
      var right = [456, 123];
      var expectedResult = [
        {
          type: 'update',
          path: [0],
          newValue: 456,
          oldValue: 123
        }, {
          type: 'update',
          path: [1],
          newValue: 123,
          oldValue: 456
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

    it('of nested items with matching keys should be interpretted as updates', function() {
      var left = [{
        test: 123
      }, {
        test: 456
      }];
      var right = [{
        test: 456
      }, {
        test: 123
      }];
      var expectedResult = [
        {
          type: 'update',
          path: [0, 'test'],
          newValue: 456,
          oldValue: 123
        }, {
          type: 'update',
          path: [1, 'test'],
          newValue: 123,
          oldValue: 456
        }
      ];
      expect(differ(left, right)).to.deep.equal(expectedResult);
    });

  });

});