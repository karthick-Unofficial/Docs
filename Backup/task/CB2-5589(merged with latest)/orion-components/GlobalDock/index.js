"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "GlobalDock", {
  enumerable: true,
  get: function get() {
    return _GlobalDock["default"];
  }
});
_Object$defineProperty(exports, "closePanel", {
  enumerable: true,
  get: function get() {
    return _dockActions.closePanel;
  }
});
_Object$defineProperty(exports, "openPanel", {
  enumerable: true,
  get: function get() {
    return _dockActions.openPanel;
  }
});
var _GlobalDock = _interopRequireDefault(require("./GlobalDock"));
var _dockActions = require("./dockActions");