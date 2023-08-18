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
var Target = function Target(_ref) {
  var handleMouseEnter = _ref.handleMouseEnter,
    handleMouseLeave = _ref.handleMouseLeave;
  return /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/_react["default"].createElement("title", null, "targeting-icon"), /*#__PURE__*/_react["default"].createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10.5",
    fill: "none",
    stroke: "#fff",
    strokeMiterlimit: "10",
    strokeWidth: "2.5"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    x1: "2",
    y1: "12",
    x2: "7",
    y2: "12",
    fill: "none",
    stroke: "#fff",
    strokeMiterlimit: "10",
    strokeWidth: "2.5"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    x1: "17",
    y1: "12",
    x2: "22",
    y2: "12",
    fill: "none",
    stroke: "#fff",
    strokeMiterlimit: "10",
    strokeWidth: "2.5"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    x1: "12",
    y1: "2",
    x2: "12",
    y2: "7",
    fill: "none",
    stroke: "#fff",
    strokeMiterlimit: "10",
    strokeWidth: "2.5"
  }), /*#__PURE__*/_react["default"].createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12",
    y2: "22",
    fill: "none",
    stroke: "#fff",
    strokeMiterlimit: "10",
    strokeWidth: "2.5"
  })));
};
Target.propTypes = propTypes;
var _default = Target;
exports["default"] = _default;