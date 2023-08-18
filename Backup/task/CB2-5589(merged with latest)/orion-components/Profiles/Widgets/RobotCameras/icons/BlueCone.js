"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var BlueCone = function BlueCone(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    width: "93.425",
    height: "55.197",
    viewBox: "0 0 93.425 55.197"
  }, /*#__PURE__*/_react["default"].createElement("defs", null, /*#__PURE__*/_react["default"].createElement("linearGradient", {
    id: "blue-linear-gradient",
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
    id: "blue_cone",
    transform: "translate(-1349.689 -1137.114)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "blue_cone",
    d: "M59.09,2.517l46.389,55.2H12.054Z",
    transform: "translate(1455.168 1194.828) rotate(-180)",
    fill: "url(#blue-linear-gradient)"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_69",
    "data-name": "Line 69",
    y1: "41",
    x2: "35",
    transform: "translate(1434.189 1187.613) rotate(180)",
    fill: "none",
    stroke: "#dbf1ff",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_70",
    "data-name": "Line 70",
    x1: "35",
    y1: "41",
    transform: "translate(1393.189 1187.613) rotate(180)",
    fill: "none",
    stroke: "#dbf1ff",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  })));
};
var _default = BlueCone;
exports["default"] = _default;