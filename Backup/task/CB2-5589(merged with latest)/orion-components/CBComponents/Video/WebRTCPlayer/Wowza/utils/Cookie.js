"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getCookieValues = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));
var getCookieValues = function getCookieValues(cookieName) {
  var cookieValues = {};
  var cookieString = decodeURIComponent(document.cookie).split(";");
  (0, _forEach["default"])(cookieString).call(cookieString, function (cookie) {
    var _context;
    var name = (0, _trim["default"])(_context = cookie.split("=")[0]).call(_context);
    var value = cookie.split("=")[1];
    if (name === cookieName) {
      try {
        cookieValues = JSON.parse(unescape(value));
      } catch (e) {
        console.error("Invalid JSON string:", e);
      }
    }
  });
  return cookieValues;
};
exports.getCookieValues = getCookieValues;