"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.safelyMock = exports.getSentData = exports.getMockedMethod = exports.flushAllPromises = exports.checkMockedUrl = void 0;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _setImmediate2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-immediate"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _fetchMock = _interopRequireDefault(require("fetch-mock"));
// Utility to make jest resolve all pending promises so we can continue
var flushAllPromises = function flushAllPromises() {
  return new _promise["default"](function (resolve) {
    return (0, _setImmediate2["default"])(resolve);
  });
};
exports.flushAllPromises = flushAllPromises;
var safelyMock = function safelyMock(method, matcher, response) {
  // future implementation
  // fetchMock[`${method}Once`](patchedMatcher, response).catch(200)

  // current implementation to workaround
  _fetchMock["default"].mock("*", response);
};

// This implementation can also be modified when workaround is fixed
exports.safelyMock = safelyMock;
var checkMockedUrl = function checkMockedUrl(url) {
  var _context;
  return (0, _includes["default"])(_context = _fetchMock["default"].calls().matched[0][0].url).call(_context, url);
};
exports.checkMockedUrl = checkMockedUrl;
var getMockedMethod = function getMockedMethod() {
  // console.log(JSON.stringify(fetchMock.calls()))
  return _fetchMock["default"].calls().matched[0][0].method;
};
exports.getMockedMethod = getMockedMethod;
var getSentData = function getSentData() {
  var call = _fetchMock["default"].calls().matched[0][0];
  if (call.body) {
    return JSON.parse(call.body);
  } else {
    return JSON.parse(call._bodyInit);
  }
};
exports.getSentData = getSentData;