"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var propTypes = {
  fontSize: _propTypes["default"].oneOf(["inherit", "default", "small", "large"])
};
var CameraDetection = function CameraDetection(_ref) {
  var handleMouseEnter = _ref.handleMouseEnter,
    handleMouseLeave = _ref.handleMouseLeave;
  return /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    viewBox: "0 0 29.82 14.271"
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "29.82",
    height: "14.271",
    viewBox: "0 0 29.82 14.271"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "icon-cam-alert",
    d: "M-2922.736,10336.749h-16.1c-1.671,0-2.981-.979-2.981-2.229v-9.812c0-1.251,1.309-2.23,2.981-2.23h16.1c1.673,0,2.983.979,2.983,2.23v9.812C-2919.752,10335.771-2921.063,10336.749-2922.736,10336.749Zm-7.886-11.63c-4.019,0-7.1,4.153-7.124,4.2l-.208.3.208.3a13.127,13.127,0,0,0,2.13,2.151,8.3,8.3,0,0,0,4.994,2.041,8.308,8.308,0,0,0,5-2.041,13.119,13.119,0,0,0,2.13-2.151l.2-.3-.2-.3C-2923.524,10329.272-2926.6,10325.119-2930.622,10325.119Zm18.624,10.151h0l-6.559-2.619v-6.073l6.561-2.62v11.313Zm-18.624-2.161a6.558,6.558,0,0,1-3.793-1.411,13.262,13.262,0,0,1-2.246-2.086c.289-.359,2.915-3.494,6.039-3.494s5.754,3.137,6.042,3.494C-2924.869,10329.972-2927.493,10333.109-2930.622,10333.109Zm0-6.493a3.051,3.051,0,0,0-3.1,3,3.051,3.051,0,0,0,3.1,3,3.051,3.051,0,0,0,3.1-3A3.051,3.051,0,0,0-2930.622,10326.616Zm0,4a1.017,1.017,0,0,1-1.032-1,1.017,1.017,0,0,1,1.032-1,1.017,1.017,0,0,1,1.032,1A1.017,1.017,0,0,1-2930.622,10330.611Z",
    transform: "translate(2941.819 -10322.479)",
    fill: "#fff"
  })));
};
CameraDetection.propTypes = propTypes;
var _default = CameraDetection;
exports["default"] = _default;