"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _material = require("@mui/material");
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var propTypes = {
  onAccept: _propTypes["default"].func,
  onClear: _propTypes["default"].func,
  onCancel: _propTypes["default"].func,
  resetDateTime: _propTypes["default"].func,
  submit: _propTypes["default"].func,
  actions: _propTypes["default"].object
};
var defaultProps = {
  resetDateTime: function resetDateTime() {},
  submit: function submit() {}
};
var DatePickerActionBar = function DatePickerActionBar(_ref) {
  var onAccept = _ref.onAccept,
    onClear = _ref.onClear,
    onCancel = _ref.onCancel,
    actions = _ref.actions,
    resetDateTime = _ref.resetDateTime,
    submit = _ref.submit;
  var cancel = function cancel() {
    resetDateTime();
    onCancel();
  };
  var ok = function ok() {
    submit();
    onAccept();
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      padding: "6px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flexBasis: "50%"
    }
  }, actions[0] === null ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    onClick: onClear
  }, actions[0])), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flexBasis: "50%"
    }
  }, actions[1] && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    onClick: cancel
  }, actions[1]), actions[2] && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    onClick: ok
  }, actions[2])));
};
DatePickerActionBar.propTypes = propTypes;
DatePickerActionBar.defaultProps = defaultProps;
var _default = DatePickerActionBar;
exports["default"] = _default;