"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  label: _propTypes["default"].string.isRequired,
  icon: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element]).isRequired,
  action: _propTypes["default"].func,
  toggled: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool
};
var defaultProps = {
  action: null,
  toggled: false,
  disabled: false
};
var styles = {
  root: {
    textTransform: "none",
    flexDirection: "column",
    maxWidth: 60
  },
  label: {
    flexDirection: "column"
  }
};
var FontIconButton = function FontIconButton(_ref) {
  var classes = _ref.classes,
    label = _ref.label,
    icon = _ref.icon,
    action = _ref.action,
    toggled = _ref.toggled,
    disabled = _ref.disabled;
  return /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    classes: {
      label: classes.label,
      root: classes.root
    },
    style: {
      color: toggled ? "#35b7f3" : "#828283",
      opacity: disabled ? 0.5 : 1
    },
    disabled: disabled,
    onClick: action
  }, /*#__PURE__*/_react["default"].createElement(_material.Icon, null, icon), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    color: "inherit",
    variant: "caption"
  }, label));
};
FontIconButton.propTypes = propTypes;
FontIconButton.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(FontIconButton);
exports["default"] = _default;