"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _helpers = require("@turf/helpers");
var _square = _interopRequireDefault(require("@turf/square"));
var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));
var getSpotlight = function getSpotlight(_ref) {
  var camera = _ref.camera,
    spotlightProximity = _ref.spotlightProximity;
  var geometry = camera.entityData.geometry;
  var _geometry$coordinates = (0, _slicedToArray2["default"])(geometry.coordinates, 2),
    x = _geometry$coordinates[0],
    y = _geometry$coordinates[1];
  var value = spotlightProximity.value,
    unit = spotlightProximity.unit;
  var offset = (0, _helpers.lengthToDegrees)(value, unit === "km" ? "kilometers" : "miles");
  var defaultSpotlight = (0, _bboxPolygon["default"])((0, _square["default"])([x - offset, y - offset, x + offset, y + offset]));
  return defaultSpotlight;
};
var _default = getSpotlight;
exports["default"] = _default;