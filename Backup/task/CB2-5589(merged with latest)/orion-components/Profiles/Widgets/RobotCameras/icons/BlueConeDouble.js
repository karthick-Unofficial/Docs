"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var BlueConeDouble = function BlueConeDouble(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    width: "55.197",
    height: "139.779",
    viewBox: "0 0 55.197 139.779"
  }, /*#__PURE__*/_react["default"].createElement("defs", null, /*#__PURE__*/_react["default"].createElement("linearGradient", {
    id: "blue-double-linear-gradient",
    x1: "0.5",
    x2: "0.5",
    y2: "1",
    gradientUnits: "objectBoundingBox"
  }, /*#__PURE__*/_react["default"].createElement("stop", {
    offset: "0",
    stopColor: "#5a92b4"
  }), /*#__PURE__*/_react["default"].createElement("stop", {
    offset: "1",
    stopColor: "#4982a4",
    stopOpacity: "0"
  }))), /*#__PURE__*/_react["default"].createElement("g", {
    id: "blue_cone_front",
    transform: "translate(-1402.689 -1265.782)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "blue_cone_double",
    d: "M70.373,0l69.406,55.2H0Z",
    transform: "translate(1402.689 1405.562) rotate(-90)",
    fill: "url(#blue-double-linear-gradient)"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_71",
    "data-name": "Line 71",
    y1: "48",
    x2: "61",
    transform: "translate(1403.567 1396.285) rotate(-90)",
    fill: "none",
    stroke: "#dbf1ff",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_72",
    "data-name": "Line 72",
    x1: "60",
    y1: "48",
    transform: "translate(1403.567 1335.285) rotate(-90)",
    fill: "none",
    stroke: "#dbf1ff",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  })));
};
var _default = BlueConeDouble;
exports["default"] = _default;