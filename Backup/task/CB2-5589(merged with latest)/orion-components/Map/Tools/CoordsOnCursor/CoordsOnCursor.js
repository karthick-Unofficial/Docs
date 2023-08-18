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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactMapboxGl = require("react-mapbox-gl");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _CBComponents = require("../../../CBComponents");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  replay: _propTypes["default"].bool
};
var CoordsOnCursor = function CoordsOnCursor(_ref) {
  var replay = _ref.replay;
  var map = (0, _reactRedux.useSelector)(function (state) {
    return replay ? (0, _Selectors.replayMapObject)(state) : (0, _Selectors.mapObject)(state);
  });
  var coordsOnCursor = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapSettingsSelector)(state).coordsOnCursor || false;
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    mouseMoveSet = _useState2[0],
    setMouseMoveSet = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    tooltipLocation = _useState4[0],
    setTooltipLocation = _useState4[1];
  (0, _react.useEffect)(function () {
    var mouseMoved = function mouseMoved(e) {
      setTooltipLocation(e.lngLat);
    };
    if (map && !mouseMoveSet) {
      map.on("mousemove", mouseMoved);
      setMouseMoveSet(true);
    }
    return function () {
      if (map && mouseMoveSet) {
        map.off("mousemove", mouseMoved);
      }
    };
  }, [map, mouseMoveSet]);
  return coordsOnCursor && tooltipLocation && /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Marker, {
    key: "lat-lng-tooltip",
    coordinates: [tooltipLocation.lng, tooltipLocation.lat],
    anchor: "bottom-left",
    style: {
      pointerEvents: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      backgroundColor: "#00000066",
      padding: "2px 4px"
    }
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: {
      color: "#FFFFFF"
    }
  }, "Lat: ", /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
    sourceUnit: "decimal-degrees",
    value: tooltipLocation.lat
  }), ", Long: ", /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
    sourceUnit: "decimal-degrees",
    value: tooltipLocation.lng
  }))));
};
CoordsOnCursor.propTypes = propTypes;
var _default = CoordsOnCursor;
exports["default"] = _default;