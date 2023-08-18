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
var TargetObserved = function TargetObserved(_ref) {
  var handleMouseEnter = _ref.handleMouseEnter,
    handleMouseLeave = _ref.handleMouseLeave;
  return /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    viewBox: "0 0 29.946 21.574"
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "29.946",
    height: "21.574",
    viewBox: "0 0 29.946 21.574"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    id: "icon-eye",
    d: "M16.19,7.992a.6.6,0,0,0-.374.12L.246,19.49a.6.6,0,0,0,.054,1l15.569,8.982a.6.6,0,1,0,.6-1.036l-2.441-1.408a14.564,14.564,0,0,0,.439-16.361.6.6,0,0,0-.041-.057l2.1-1.532a.6.6,0,0,0-.332-1.087Zm8.5,6.062a1.2,1.2,0,0,0-.834,2.057l1.467,1.467h-5.56a1.2,1.2,0,1,0,0,2.4H25.4l-1.549,1.549a1.2,1.2,0,1,0,1.694,1.694l4.4-4.4-4.4-4.4A1.2,1.2,0,0,0,24.689,14.054Zm-9.829.191a13.273,13.273,0,0,1,.527,2.11,2.757,2.757,0,0,0-.237,5.264l.05.015a13.26,13.26,0,0,1-.695,2.124,5.081,5.081,0,0,1,.354-9.513Z",
    transform: "translate(-0.001 -7.992)",
    fill: "#fff"
  })));
};
TargetObserved.propTypes = propTypes;
var _default = TargetObserved;
exports["default"] = _default;