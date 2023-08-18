"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context6, _context7; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context6 = ownKeys(Object(source), !0)).call(_context6, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context7 = ownKeys(Object(source))).call(_context7, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ROTATION_SPEED = 0.2;
var TargetingLine = function TargetingLine(_ref) {
  var config = _ref.config,
    entityGeo = _ref.entityGeo,
    map = (0, _map["default"])(_ref),
    x = _ref.x,
    y = _ref.y;
  var _useState = (0, _react.useState)((0, _now["default"])()),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    millis = _useState2[0],
    setMillis = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    request = _useState4[0],
    setRequest = _useState4[1];
  (0, _react.useEffect)(function () {
    setRequest(requestAnimationFrame(tick));
  }, []);
  (0, _react.useEffect)(function () {
    return function () {
      cancelAnimationFrame(request);
    };
  }, []);
  var tick = function tick() {
    setMillis((0, _now["default"])());
    setRequest(requestAnimationFrame(tick));
  };
  var drawTargetingLine = function drawTargetingLine(x1, y1) {
    var _context4, _context5;
    var defaults = {
      xOffset: 0,
      yOffset: 0
    };

    // Configuration to compensate for absolute positioning on sidebars
    var options = _objectSpread(_objectSpread({}, defaults), config);

    // Centering calculations
    var coords;
    switch (entityGeo.type) {
      case "Point":
        coords = map.project(entityGeo.coordinates);
        break;
      case "LineString":
        {
          var line = (0, _values["default"])(entityGeo.coordinates);

          // Get line center
          var lineCenter = (0, _reduce["default"])(line).call(line, function (x, y) {
            return [x[0] + y[0] / line.length, x[1] + y[1] / line.length];
          }, [0, 0]);
          coords = map.project(lineCenter);
          break;
        }
      case "Polygon":
        {
          var _context;
          // Map coordinate objects to an arry
          var poly = (0, _map["default"])(_context = entityGeo.coordinates[0]).call(_context, function (obj) {
            var _context2, _context3;
            return (0, _map["default"])(_context2 = (0, _sort["default"])(_context3 = (0, _keys["default"])(obj)).call(_context3)).call(_context2, function (key) {
              return obj[key];
            });
          });
          // Get Polygon center
          var a = 0;
          var b = 0;
          var c = 0;
          var length = poly.length;
          var _x = function _x(i) {
            return poly[i % length][0];
          };
          var _y = function _y(i) {
            return poly[i % length][1];
          };
          for (var i = 0; i < poly.length; i++) {
            var m = _x(i) * _y(i + 1) - _x(i + 1) * _y(i);
            a += m;
            b += (_x(i) + _x(i + 1)) * m;
            c += (_y(i) + _y(i + 1)) * m;
          }
          var n = 3 * a;
          var polyCenter = [b / n, c / n];
          coords = map.project(polyCenter);
          break;
        }
      default:
        break;
    }

    // set width of circle dependent on zoom
    var radius = 4 * map.getZoom();
    var xOne = x1 + options.xOffset;
    var yOne = y1 + options.yOffset;
    var xTwo = coords.x - 5 + options.xOffset;
    var yTwo = coords.y + options.yOffset;
    var adjacent = Math.abs(xOne - xTwo);
    var opposite = Math.abs(yOne - yTwo);
    var theta = Math.atan2(opposite, adjacent);
    var xThree;
    var yThree;
    if (xOne < xTwo) {
      xThree = xTwo - radius * Math.cos(theta);
    } else {
      xThree = xTwo + radius * Math.cos(theta);
    }
    if (yOne < yTwo) {
      yThree = yTwo - radius * Math.sin(theta);
    } else {
      yThree = yTwo + radius * Math.sin(theta);
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "targetingLine"
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
      transform: (0, _concat["default"])(_context4 = (0, _concat["default"])(_context5 = "rotate(".concat(millis * ROTATION_SPEED % 360, " ")).call(_context5, xTwo, " ")).call(_context4, yTwo, ")")
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
      x2: xTwo - radius - radius / 2,
      y2: yTwo,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo - radius,
      y1: yTwo,
      x2: xTwo - radius - radius / 2,
      y2: yTwo,
      stroke: "white",
      strokeWidth: "1.5"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo + radius,
      y1: yTwo,
      x2: xTwo + radius + radius / 2,
      y2: yTwo,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo + radius,
      y1: yTwo,
      x2: xTwo + radius + radius / 2,
      y2: yTwo,
      stroke: "white",
      strokeWidth: "1.5"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo - radius,
      x2: xTwo,
      y2: yTwo - radius - radius / 2,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo - radius,
      x2: xTwo,
      y2: yTwo - radius - radius / 2,
      stroke: "white",
      strokeWidth: "1.5"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo + radius,
      x2: xTwo,
      y2: yTwo + radius + radius / 2,
      stroke: "black",
      strokeWidth: "1.75"
    }), /*#__PURE__*/_react["default"].createElement("line", {
      x1: xTwo,
      y1: yTwo + radius,
      x2: xTwo,
      y2: yTwo + radius + radius / 2,
      stroke: "white",
      strokeWidth: "1.5"
    }))));
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, drawTargetingLine(x, y));
};
var _default = TargetingLine;
exports["default"] = _default;