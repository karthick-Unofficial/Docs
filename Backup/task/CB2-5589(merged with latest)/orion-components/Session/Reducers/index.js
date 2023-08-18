"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "identity", {
  enumerable: true,
  get: function get() {
    return _reducer["default"];
  }
});
_Object$defineProperty(exports, "organization", {
  enumerable: true,
  get: function get() {
    return _reducer3["default"];
  }
});
_Object$defineProperty(exports, "user", {
  enumerable: true,
  get: function get() {
    return _reducer2["default"];
  }
});
var _reducer = _interopRequireDefault(require("../Identity/reducer"));
var _reducer2 = _interopRequireDefault(require("../User/reducer"));
var _reducer3 = _interopRequireDefault(require("../Organization/reducer"));