"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactMapboxGl = require("react-mapbox-gl");
var _helpers = require("@turf/helpers");
var _transformRotate = _interopRequireDefault(require("@turf/transform-rotate"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  vessels: _propTypes["default"].object.isRequired,
  before: _propTypes["default"].string
};
var VesselPolygons = function VesselPolygons(_ref) {
  var vessels = _ref.vessels,
    minZoom = _ref.minZoom,
    before = _ref.before;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    polygons = _useState2[0],
    setPolygons = _useState2[1];
  (0, _react.useEffect)(function () {
    var _context, _context2;
    var newPolygons = [];
    (0, _forEach["default"])(_context = (0, _filter["default"])(_context2 = (0, _values["default"])(vessels)).call(_context2, function (vessel) {
      var _vessel$entityData = vessel.entityData,
        geometry = _vessel$entityData.geometry,
        properties = _vessel$entityData.properties;
      var heading = properties.heading,
        hdg = properties.hdg;
      // 511 is an unavailable heading
      return geometry && (heading || hdg) && hdg !== 511;
    })).call(_context, function (vessel) {
      var _vessel$entityData2 = vessel.entityData,
        geometry = _vessel$entityData2.geometry,
        properties = _vessel$entityData2.properties;
      var _properties$dimA = properties.dimA,
        dimA = _properties$dimA === void 0 ? 0 : _properties$dimA,
        _properties$dimB = properties.dimB,
        dimB = _properties$dimB === void 0 ? 0 : _properties$dimB,
        _properties$dimC = properties.dimC,
        dimC = _properties$dimC === void 0 ? 0 : _properties$dimC,
        _properties$dimD = properties.dimD,
        dimD = _properties$dimD === void 0 ? 0 : _properties$dimD,
        heading = properties.heading,
        hdg = properties.hdg,
        length = properties.length;
      var coordinates = geometry.coordinates;
      var _coordinates = (0, _slicedToArray2["default"])(coordinates, 2),
        x = _coordinates[0],
        y = _coordinates[1];
      var starboard = x + (0, _helpers.lengthToDegrees)(dimD, "meters");
      var port = x - (0, _helpers.lengthToDegrees)(dimC, "meters");
      var bow = y + (0, _helpers.lengthToDegrees)(dimA, "meters");
      var stern = y - (0, _helpers.lengthToDegrees)(dimB, "meters");
      var centerX = starboard - (0, _helpers.lengthToDegrees)((dimC + dimD) / 2, "meters");
      var noseStart = stern + (0, _helpers.lengthToDegrees)(length * 0.8, "meters");
      var a = [centerX, bow];
      var b = [starboard, noseStart];
      var c = [starboard, stern];
      var d = [port, stern];
      var e = [port, noseStart];
      var poly = (0, _transformRotate["default"])((0, _helpers.polygon)([[a, b, c, d, e, a]]), heading || hdg, {
        pivot: coordinates
      });
      newPolygons.push(poly);
    });
    setPolygons(newPolygons);
  }, [vessels]);
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
    id: "ac2-vessel-polygons-source",
    geoJsonSource: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: polygons
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "ac2-vessel-polygons",
    sourceId: "ac2-vessel-polygons-source",
    type: "fill",
    paint: {
      "fill-color": "#35b7f3",
      "fill-opacity": 0.5
    },
    minZoom: minZoom,
    before: before
  }));
};
VesselPolygons.propTypes = propTypes;
var _default = VesselPolygons;
exports["default"] = _default;