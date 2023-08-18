"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _material = require("@mui/material");

var _moment = _interopRequireDefault(require("moment"));

var _react = _interopRequireDefault(require("react"));

var DatePickerToolBar = function DatePickerToolBar(props) {
  if (props) {
    var date = props.date;
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        background: "#1688bd",
        height: "100px",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        display: "flex",
        padding: "10px"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "text"
    }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      variant: "h6"
    }, (0, _moment["default"])(date).format("YYYY"))), /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "text",
      style: {
        textTransform: "none",
        marginLeft: "6px",
        marginTop: "-5px"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      variant: "h4"
    }, (0, _moment["default"])(date).format("ddd"), ", ", (0, _moment["default"])(date).format("MMM DD"))));
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", null);
  }
};

var _default = DatePickerToolBar;
exports["default"] = _default;