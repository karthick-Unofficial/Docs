"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var CameraTop = function CameraTop(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    width: "23",
    height: "15",
    viewBox: "0 0 23 15"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "Group_929",
    "data-name": "Group 929",
    transform: "translate(-697 -804)"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "video",
    transform: "translate(697 804)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "video-2",
    "data-name": "video",
    d: "M20.889,11.625V7.25A1.264,1.264,0,0,0,19.611,6H4.278A1.264,1.264,0,0,0,3,7.25v12.5A1.264,1.264,0,0,0,4.278,21H19.611a1.264,1.264,0,0,0,1.278-1.25V15.375l5.111,5V6.625Z",
    transform: "translate(-3 -6)",
    fill: "#fff"
  })), /*#__PURE__*/_react["default"].createElement("text", {
    id: "PTZ",
    transform: "translate(706 815)",
    fill: "#434343",
    fontSize: "11",
    fontFamily: "Roboto-Medium, Roboto",
    fontWeight: "500"
  }, /*#__PURE__*/_react["default"].createElement("tspan", {
    x: "-3.47",
    y: "0"
  }, "T"))));
};
var _default = CameraTop;
exports["default"] = _default;