"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = require("react");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var propTypes = {
  feature: _propTypes["default"].object.isRequired,
  map: _propTypes["default"].object.isRequired
};
var Spotlight = function Spotlight(_ref) {
  var feature = _ref.feature;
  var mapRef = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.baseMap.mapRef;
  });
  var map = mapRef;
  var clearSource = function clearSource() {
    map.removeLayer("ac2-".concat(feature.id, "-spotlight"));
    map.removeSource("ac2-".concat(feature.id, "-spotlight-source"));
  };
  var addSource = function addSource(feature) {
    map.addSource("ac2-".concat(feature.id, "-spotlight-source"), {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [feature]
      }
    });
    map.addLayer({
      id: "ac2-".concat(feature.id, "-spotlight"),
      type: "line",
      source: "ac2-".concat(feature.id, "-spotlight-source"),
      paint: {
        "line-color": ["case", ["has", "strokeColor"], ["get", "strokeColor"], "#35b7f3"],
        "line-width": 10
      }
    });
  };
  (0, _react.useEffect)(function () {
    addSource(feature);
    return function () {
      clearSource();
    };
  }, [feature]);
  return null;
};
Spotlight.propTypes = propTypes;
var _default = /*#__PURE__*/(0, _react.memo)(Spotlight);
exports["default"] = _default;