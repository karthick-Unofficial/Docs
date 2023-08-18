"use strict";

var _context;
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  appConfig: true
};
_Object$defineProperty(exports, "appConfig", {
  enumerable: true,
  get: function get() {
    return _reducer["default"];
  }
});
var _reducer = _interopRequireDefault(require("./reducer"));
var _actions = require("./actions");
_forEachInstanceProperty(_context = _Object$keys(_actions)).call(_context, function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _actions[key]) return;
  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});