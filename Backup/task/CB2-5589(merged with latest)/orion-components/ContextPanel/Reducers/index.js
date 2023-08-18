"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "contextPanelData", {
  enumerable: true,
  get: function get() {
    return _reducer2["default"];
  }
});
_Object$defineProperty(exports, "listPanel", {
  enumerable: true,
  get: function get() {
    return _reducer["default"];
  }
});
var _reducer = _interopRequireDefault(require("../ListPanel/reducer"));
var _reducer2 = _interopRequireDefault(require("../ContextPanelData/reducer"));