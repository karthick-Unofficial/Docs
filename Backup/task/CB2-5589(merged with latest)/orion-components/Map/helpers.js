"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.validateShape = exports.getSpotlight = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _kinks2 = _interopRequireDefault(require("@turf/kinks"));
var _helpers = require("@turf/helpers");
var _square = _interopRequireDefault(require("@turf/square"));
var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));
var _reactToastify = require("react-toastify");
var _i18n = require("orion-components/i18n");
// cSpell:ignore toastify

/**
 *
 * @param {Object} geometry - { type: String, coordinates: Array}
 */
var validateShape = function validateShape(geometry) {
  var type = geometry.type,
    coordinates = geometry.coordinates;
  var feature = null;
  if (type !== "Polygon" && type !== "LineString") {
    return true;
  } else if (type === "Polygon") {
    feature = (0, _helpers.polygon)(coordinates);
  } else if (type === "LineString") {
    feature = (0, _helpers.lineString)(coordinates);
  }
  if (feature) {
    var _kinks = (0, _kinks2["default"])(feature),
      features = _kinks.features;
    if (features.length) {
      (0, _reactToastify.toast)((0, _i18n.getTranslation)("global.map.helper.toast"), {
        type: "error"
      });
      return false;
    }
    return true;
  }
};
exports.validateShape = validateShape;
var getSpotlight = function getSpotlight(_ref) {
  var center = _ref.center,
    _ref$spotlightProximi = _ref.spotlightProximity,
    spotlightProximity = _ref$spotlightProximi === void 0 ? {
      value: 0.3,
      unit: "mi"
    } : _ref$spotlightProximi;
  if (!spotlightProximity) spotlightProximity = {
    value: 0.3,
    unit: "mi"
  };
  var _center$geometry$coor = (0, _slicedToArray2["default"])(center.geometry.coordinates, 2),
    x = _center$geometry$coor[0],
    y = _center$geometry$coor[1];
  var _spotlightProximity = spotlightProximity,
    value = _spotlightProximity.value,
    unit = _spotlightProximity.unit;
  var offset = (0, _helpers.lengthToDegrees)(value, unit === "km" ? "kilometers" : "miles");
  var defaultSpotlight = (0, _bboxPolygon["default"])((0, _square["default"])([x - offset, y - offset, x + offset, y + offset]));
  return defaultSpotlight;
};
exports.getSpotlight = getSpotlight;