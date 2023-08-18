"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var BatteryFull = function BatteryFull(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "12",
    viewBox: "0 0 20 12"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "battery",
    transform: "translate(20) rotate(90)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "battery-2",
    "data-name": "battery",
    d: "M16.67,4H15V2H9V4H7.33A1.33,1.33,0,0,0,6,5.33V20.67A1.336,1.336,0,0,0,7.33,22h9.34A1.33,1.33,0,0,0,18,20.67V5.33A1.336,1.336,0,0,0,16.67,4Z",
    transform: "translate(-6 -2)",
    fill: "#fff"
  })));
};
var _default = BatteryFull;
exports["default"] = _default;