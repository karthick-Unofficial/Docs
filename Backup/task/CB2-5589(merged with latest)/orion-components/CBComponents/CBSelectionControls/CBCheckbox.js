"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _propTypes = _interopRequireDefault(require("prop-types"));
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  checked: _propTypes["default"].bool.isRequired,
  handleChange: _propTypes["default"].func.isRequired,
  disableCheckbox: _propTypes["default"].bool
};
var defaultProps = {
  disableCheckbox: false
};
var styles = {
  root: {
    color: "#828283",
    "&$checked": {
      color: "#69f0ae"
    }
  },
  checked: {},
  disabled: {
    opacity: 0.5
  }
};
var CBCheckbox = function CBCheckbox(_ref) {
  var classes = _ref.classes,
    checked = _ref.checked,
    handleChange = _ref.handleChange,
    disableCheckbox = _ref.disableCheckbox,
    label = _ref.label,
    style = _ref.style;
  return label ? /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      classes: {
        root: classes.root,
        checked: classes.checked,
        disabled: classes.disabled
      },
      disabled: disableCheckbox,
      checked: checked,
      icon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircle, null),
      checkedIcon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircle, null),
      onChange: handleChange
    }),
    label: label,
    style: style
  }) : /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
    classes: {
      root: classes.root,
      checked: classes.checked,
      disabled: classes.disabled
    },
    disabled: disableCheckbox,
    checked: checked,
    icon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircle, null),
    checkedIcon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircle, null),
    onChange: handleChange
  });
};
CBCheckbox.propTypes = propTypes;
CBCheckbox.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(CBCheckbox);
exports["default"] = _default;