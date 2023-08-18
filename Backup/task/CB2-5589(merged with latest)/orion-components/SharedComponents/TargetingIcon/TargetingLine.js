"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _react = _interopRequireWildcard(require("react"));
var _center = _interopRequireDefault(require("@turf/center"));
var _helpers = require("@turf/helpers");
var _jquery = _interopRequireDefault(require("jquery"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ROTATION_SPEED = 0.2;

// cSpell:ignore millis
var TargetingLine = function TargetingLine(_ref) {
  var config = _ref.config,
    map = (0, _map["default"])(_ref),
    geometry = _ref.geometry,
    x = _ref.x,
    y = _ref.y;
  var time = (0, _now["default"])();
  var _useState = (0, _react.useState)(time),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    millis = _useState2[0],
    setMillis = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    request = _useState4[0],
    setRequest = _useState4[1];
  (0, _react.useEffect)(function () {
    // Prevents { position: fixed } from working improperly within a parent element that has a CSS transform
    (0, _jquery["default"])("#targeting-line").detach().appendTo("#root");
    setRequest(requestAnimationFrame(tick));
    return function () {
      (0, _jquery["default"])("#targeting-line").remove();
      cancelAnimationFrame(request);
    };
  }, []);
  var tick = function tick() {
    setMillis((0, _now["default"])());
    setRequest(requestAnimationFrame(tick));
  };
  var drawTargetingLine = function drawTargetingLine(x1, y1) {
    var _context, _context2;
    var defaults = {
      xOffset: 0,
      yOffset: 0
    };

    // Configuration to compensate for absolute positioning on sidebars
    var options = _objectSpread(_objectSpread({}, defaults), config);

    // Centering calculations
    var feature;
    switch (geometry.type) {
      case "Point":
        feature = (0, _helpers.point)(geometry.coordinates);
        break;
      case "LineString":
        feature = (0, _helpers.lineString)(geometry.coordinates);
        break;
      case "Polygon":
        feature = (0, _helpers.polygon)(geometry.coordinates);
        break;
      case "MultiPolygon":
        feature = (0, _helpers.multiPolygon)(geometry.coordinates);
        break;
      default:
        break;
    }
    var centerCoords = map.project((0, _center["default"])(feature).geometry.coordinates);

    // Set width of circle dependent on zoom
    var radius = 3 * map.getZoom();
    var xOne = x1 + options.xOffset;
    var yOne = y1; // + options.yOffset;
    var xTwo = centerCoords.x - 5 + options.xOffset;
    var yTwo = centerCoords.y + options.yOffset;

    // Set line x2/y2 on outside of circle
    var adjacent = Math.abs(xOne - xTwo);
    var opposite = Math.abs(yOne - yTwo);
    var theta = Math.atan2(opposite, adjacent);
    var xThree;
    var yThree;
    xOne < xTwo ? xThree = xTwo - radius * Math.cos(theta) : xThree = xTwo + radius * Math.cos(theta);
    yOne < yTwo ? yThree = yTwo - radius * Math.sin(theta) : yThree = yTwo + radius * Math.sin(theta);
    var lineStyles = {
      top: 48,
      // Offset for Menu Bar
      position: "fixed",
      zIndex: 999999999,
      pointerEvents: "none",
      left: 6 // Offset for icon padding
    };

    return /*#__PURE__*/_react["default"].createElement("div", {
      id: "targeting-line",
      style: lineStyles
    }, /*#__PURE__*/_react["default"].createElement("svg", {
      width: "2000",
      height: "1200"
    }, /*#__PURE__*/_react["default"].createElement("line", {
      x1: xOne,
      y1: yOne,
      x2: xThree,
      y2: yThree,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xOne,
      y1: yOne,
      x2: xThree,
      y2: yThree,
      stroke: "white",
      strokeWidth: "1.5"
    }), /*#__PURE__*/_react["default"].createElement("g", {
      className: "targetingCircle",
      transform: (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "rotate(".concat(millis * ROTATION_SPEED % 360, " ")).call(_context2, xTwo, " ")).call(_context, yTwo, ")")
    }, /*#__PURE__*/_react["default"].createElement("circle", {
      cx: xTwo,
      cy: yTwo,
      r: radius,
      stroke: "black",
      strokeWidth: "1.75",
      fill: "none"
    }), /*#__PURE__*/_react["default"].createElement("circle", {
      cx: xTwo,
      cy: yTwo,
      r: radius,
      stroke: "white",
      strokeWidth: "1.5",
      fill: "none"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo - radius,
      y1: yTwo,
      x2: xTwo - radius / 2,
      y2: yTwo,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo - radius,
      y1: yTwo,
      x2: xTwo - radius / 2,
      y2: yTwo,
      stroke: "white",
      strokeWidth: "1.5"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo + radius,
      y1: yTwo,
      x2: xTwo + radius / 2,
      y2: yTwo,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo + radius,
      y1: yTwo,
      x2: xTwo + radius / 2,
      y2: yTwo,
      stroke: "white",
      strokeWidth: "1.5"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo - radius,
      x2: xTwo,
      y2: yTwo - radius / 2,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo - radius,
      x2: xTwo,
      y2: yTwo - radius / 2,
      stroke: "white",
      strokeWidth: "1.5"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo + radius,
      x2: xTwo,
      y2: yTwo + radius / 2,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo + radius,
      x2: xTwo,
      y2: yTwo + radius / 2,
      stroke: "white",
      strokeWidth: "1.5"
    }))));
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, drawTargetingLine(x, y));
};
var _default = TargetingLine;
exports["default"] = _default;