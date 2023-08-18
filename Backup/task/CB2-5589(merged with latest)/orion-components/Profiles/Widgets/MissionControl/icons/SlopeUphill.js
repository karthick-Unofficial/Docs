"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var SlopeUphill = function SlopeUphill(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    width: "21.303",
    height: "18.683",
    viewBox: "0 0 21.303 18.683"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    id: "slope-uphill",
    transform: "translate(-3)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "slope-uphill-2",
    "data-name": "slope-uphill",
    d: "M23.3,13.556v9.586H2v-3.2l21.3-6.391m-.341-6.327L17.828,4.46l.895,2.961-10.779,3.2a3.086,3.086,0,1,0-.66,4.314A3.044,3.044,0,0,0,8.54,12.587l10.779-3.2.895,2.961Z",
    transform: "translate(1 -4.46)",
    fill: "#fff"
  })));
};
var _default = SlopeUphill;
exports["default"] = _default;