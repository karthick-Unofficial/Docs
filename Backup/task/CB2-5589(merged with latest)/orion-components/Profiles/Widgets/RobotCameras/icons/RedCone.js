"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var RedCone = function RedCone(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    width: "93.425",
    height: "55.197",
    viewBox: "0 0 93.425 55.197"
  }, /*#__PURE__*/_react["default"].createElement("defs", null, /*#__PURE__*/_react["default"].createElement("linearGradient", {
    id: "red-linear-gradient",
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
    id: "red_cone_single",
    transform: "translate(1778.311 1367.271) rotate(180)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "red_cone",
    d: "M59.09,2.517l46.389,55.2H12.054Z",
    transform: "translate(1672.832 1309.557)",
    fill: "url(#red-linear-gradient)"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_75",
    "data-name": "Line 75",
    y1: "46",
    x2: "39",
    transform: "translate(1691.599 1313.861)",
    fill: "none",
    stroke: "#ce0000",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    id: "Line_76",
    "data-name": "Line 76",
    x1: "37",
    y1: "45",
    transform: "translate(1734.386 1315.861)",
    fill: "none",
    stroke: "red",
    strokeWidth: "1",
    strokeDasharray: "5",
    opacity: "0.614"
  })));
};
var _default = RedCone;
exports["default"] = _default;