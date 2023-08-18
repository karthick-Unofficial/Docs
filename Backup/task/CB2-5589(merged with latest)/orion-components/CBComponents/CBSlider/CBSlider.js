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
  value: _propTypes["default"].number.isRequired,
  min: _propTypes["default"].number,
  max: _propTypes["default"].number,
  step: _propTypes["default"].number,
  onChange: _propTypes["default"].func.isRequired,
  onChangeCommitted: _propTypes["default"].func
};
var defaultProps = {
  min: 0,
  max: 100,
  step: 1
};
var CBSlider = function CBSlider(_ref) {
  var value = _ref.value,
    min = _ref.min,
    max = _ref.max,
    step = _ref.step,
    onChange = _ref.onChange,
    onChangeCommitted = _ref.onChangeCommitted;
  return /*#__PURE__*/_react["default"].createElement(_material.Slider, {
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: onChange,
    onChangeCommitted: onChangeCommitted,
    size: "small"
  });
};
CBSlider.propTypes = propTypes;
CBSlider.defaultProps = defaultProps;
var _default = CBSlider;
exports["default"] = _default;