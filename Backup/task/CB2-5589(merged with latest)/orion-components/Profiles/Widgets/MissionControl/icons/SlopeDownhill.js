"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var SlopeDownhill = function SlopeDownhill(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    id: "slope-downhill",
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "17.504",
    viewBox: "0 0 20 17.504"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "slope-downhill-2",
    "data-name": "slope-downhill",
    d: "M22,19v3H2V13l20,6M19.09,7.5l-.84,2.76-10.12-3a2.9,2.9,0,1,0-.56,1.85l10.12,3-.84,2.78,4.82-2.6Z",
    transform: "translate(-2 -4.496)",
    fill: "#fff"
  }));
};
var _default = SlopeDownhill;
exports["default"] = _default;