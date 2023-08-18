"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactMapboxGl = require("react-mapbox-gl");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var OrderingLayers = function OrderingLayers() {
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-alerts-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-clusters-position-end",
    before: "---ac2-alerts-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-feed-entities-position-end",
    before: "---ac2-clusters-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-distance-tool-position-end",
    before: "---ac2-feed-entities-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-gis-points-position-end",
    before: "---ac2-distance-tool-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-track-history-position-end",
    before: "---ac2-gis-points-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-linestrings-position-end",
    before: "---ac2-track-history-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-gis-linestrings-position-end",
    before: "---ac2-linestrings-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-gis-multilinestrings-position-end",
    before: "---ac2-gis-linestrings-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-weather-position-end",
    before: "---ac2-gis-multilinestrings-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-floorplans-position-end",
    before: "---ac2-weather-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-facilities-position-end",
    before: "---ac2-floorplans-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-event-proximities-position-end",
    before: "---ac2-facilities-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-polygons-position-end",
    before: "---ac2-event-proximities-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-gis-polygons-position-end",
    before: "---ac2-polygons-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-multipolygons-position-end",
    before: "---ac2-gis-polygons-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-gis-multipolygons-position-end",
    before: "---ac2-multipolygons-position-end",
    type: "symbol"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "---ac2-nautical-charts-position-end",
    before: "---ac2-gis-multipolygons-position-end",
    type: "symbol"
  }));
};
var _default = OrderingLayers;
exports["default"] = _default;