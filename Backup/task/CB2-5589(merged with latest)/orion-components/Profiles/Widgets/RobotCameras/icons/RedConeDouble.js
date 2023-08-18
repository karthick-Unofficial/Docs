"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var RedConeDouble = function RedConeDouble(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    width: "55.197",
    height: "139.779",
    viewBox: "0 0 55.197 139.779"
  }, /*#__PURE__*/_react["default"].createElement("defs", null, /*#__PURE__*/_react["default"].createElement("linearGradient", {
    id: "red-double-linear-gradient",
    x1: "0.5",
    x2: "0.5",
    y2: "1",
    gradientUnits: "objectBoundingBox"
  }, /*#__PURE__*/_react["default"].createElement("stop", {
    offset: "0",
    stopColor: "#ffbcbc"
  }), /*#__PURE__*/_react["default"].createElement("stop", {
    offset: "1",
    stopColor: "red",
    stopOpacity: "0"
  }))), /*#__PURE__*/_react["default"].createElement("g", {
    id: "red_cone_front",
    transform: "translate(-1514.689 -1269.782)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "red_cone_double",
    d: "M70.373,0l69.406,55.2H0Z",
    transform: "translate(1514.689 1409.562) rotate(-90)",
    fill: "url(#red-double-linear-gradient)"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_73",
    "data-name": "Line 73",
    y1: "48",
    x2: "61",
    transform: "translate(1515.567 1400.285) rotate(-90)",
    fill: "none",
    stroke: "red",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_74",
    "data-name": "Line 74",
    x1: "57",
    y1: "46",
    transform: "translate(1517.567 1336.285) rotate(-90)",
    fill: "none",
    stroke: "red",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  })));
};
var _default = RedConeDouble;
exports["default"] = _default;