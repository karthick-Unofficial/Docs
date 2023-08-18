"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "dialog", {
  enumerable: true,
  get: function get() {
    return _reducer2["default"];
  }
});
_Object$defineProperty(exports, "drawingTools", {
  enumerable: true,
  get: function get() {
    return _reducer7["default"];
  }
});
_Object$defineProperty(exports, "global", {
  enumerable: true,
  get: function get() {
    return _reducer8["default"];
  }
});
_Object$defineProperty(exports, "loading", {
  enumerable: true,
  get: function get() {
    return _reducer["default"];
  }
});
_Object$defineProperty(exports, "mapLayers", {
  enumerable: true,
  get: function get() {
    return _reducer6["default"];
  }
});
_Object$defineProperty(exports, "mapRef", {
  enumerable: true,
  get: function get() {
    return _reducer5["default"];
  }
});
_Object$defineProperty(exports, "persisted", {
  enumerable: true,
  get: function get() {
    return _reducer3["default"];
  }
});
_Object$defineProperty(exports, "profile", {
  enumerable: true,
  get: function get() {
    return _reducer4["default"];
  }
});
var _reducer = _interopRequireDefault(require("../Loading/reducer"));
var _reducer2 = _interopRequireDefault(require("../Dialog/reducer"));
var _reducer3 = _interopRequireDefault(require("../Persisted/reducer"));
var _reducer4 = _interopRequireDefault(require("../../Profiles/ProfileState/reducer"));
var _reducer5 = _interopRequireDefault(require("../Map/reducer"));
var _reducer6 = _interopRequireDefault(require("../MapLayers/reducer"));
var _reducer7 = _interopRequireDefault(require("../Drawing/reducer"));
var _reducer8 = _interopRequireDefault(require("../Global/reducer"));