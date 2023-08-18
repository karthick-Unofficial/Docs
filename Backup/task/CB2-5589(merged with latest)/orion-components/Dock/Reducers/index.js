"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
_Object$defineProperty(exports, "notifications", {
  enumerable: true,
  get: function get() {
    return _reducer3["default"];
  }
});
var _reducer = _interopRequireDefault(require("../Cameras/reducer"));
var _reducer2 = _interopRequireDefault(require("../reducer"));
var _redux = require("redux");
var _reducer3 = _interopRequireDefault(require("../Notifications/reducer"));
var dock = (0, _redux.combineReducers)({
  cameraDock: _reducer["default"],
  dockData: _reducer2["default"]
});
var _default = dock;
exports["default"] = _default;