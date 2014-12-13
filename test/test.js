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

  it('should recognise property additions on objects', function() {
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

  // it('should recognise object property additions on object', function() {
  //   var left = {};
  //   var right = {
  //     first: {
  //       second: 123
  //     }
  //   };
  //   var expectedResult = [
  //     {
  //       type: 'add',
  //       path: ['first'],
  //       newValue: {
  //         second: 123
  //       }
  //     }
  //   ];
  //   expect(differ(left, right)).to.deep.equal(expectedResult);
  // });

  it('should recognise property deletions on objects', function() {
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

  it('should recognise property updates on objects', function() {
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

});