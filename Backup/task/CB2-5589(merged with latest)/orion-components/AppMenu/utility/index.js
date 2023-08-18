"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.transformRole = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var transformRole = function transformRole(role) {
  var _context;
  return (0, _map["default"])(_context = role.split("-")).call(_context, function (word) {
    return word[0].toUpperCase() + word.substr(1);
  }).join(" ");
};
exports.transformRole = transformRole;