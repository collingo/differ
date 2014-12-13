var walker = require('walker');
var WalkerObject = require('walker-object');
var _ = require('lodash');

function getPathFromObject(obj, path) {
  var result = obj;
  path = _.clone(path);
  while(result && path.length) {
    result = result[path.shift()];
  }
  return result;
}

function checkForDeletions(left, right, response) {
  walker(new WalkerObject(), left, function(leftValue, path) {
    var rightValue;
    if(path.length) {
      rightValue = getPathFromObject(right, path);
      if(rightValue === undefined) {
        response.push({
          type: 'delete',
          path: path,
          oldValue: leftValue
        });
        return true; // skips children
      }
    }
  });
  return response;
}

function checkForAdditions(left, right, response) {
  walker(new WalkerObject(), right, function(rightValue, path) {
    var leftValue;
    if(path.length) {
      leftValue = getPathFromObject(left, path);
      if(leftValue === undefined) {
        response.push({
          type: 'add',
          path: path,
          newValue: rightValue
        });
        return true; // skips children
      }
    }
  });
  return response;
}

function checkForUpdates(left, right, response) {
  walker(new WalkerObject(), left, function(leftValue, path) {
    var rightValue;
    if(path.length) {
      rightValue = getPathFromObject(right, path);
      if(typeof leftValue !== 'object') {
        if(rightValue !== undefined && leftValue !== rightValue) {
          response.push({
            type: 'update',
            path: path,
            oldValue: leftValue,
            newValue: rightValue
          });
        }
      }
    }
  });
  return response;
}

module.exports = function(left, right) {
  var response = [];
  response = checkForDeletions(left, right, response);
  response = checkForAdditions(left, right, response);
  response = checkForUpdates(left, right, response);
  return response;
};