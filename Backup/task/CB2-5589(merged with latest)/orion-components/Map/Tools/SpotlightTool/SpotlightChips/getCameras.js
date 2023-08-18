"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getCameras = void 0;
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _booleanPointInPolygon = _interopRequireDefault(require("@turf/boolean-point-in-polygon"));
var getCameras = function getCameras(spotlight, cameras) {
  var _context, _context2;
  var filteredCameras = (0, _filter["default"])(_context = (0, _filter["default"])(_context2 = (0, _values["default"])(cameras)).call(_context2, function (camera) {
    return !!camera.entityData.geometry;
  })).call(_context, function (camera) {
    return (0, _booleanPointInPolygon["default"])(camera.entityData.geometry.coordinates, spotlight.geometry);
  });
  return filteredCameras;
};
exports.getCameras = getCameras;