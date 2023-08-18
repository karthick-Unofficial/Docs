"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _i18n = require("orion-components/i18n");
var styles = {
  text: {
    color: "white"
  }
};
var propTypes = {
  transparency: _propTypes["default"].number.isRequired,
  setData: _propTypes["default"].func.isRequired
};
var defaultProps = {
  transparency: 20,
  setData: function setData() {}
};
var TransparencySlider = function TransparencySlider(_ref) {
  var transparency = _ref.transparency,
    setData = _ref.setData;
  var handleTransparencyChange = function handleTransparencyChange(e, value) {
    setData(value);
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "100%",
      padding: "0 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement("p", {
    className: "b1-white",
    style: styles.text
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.transparencySlider.fill",
    count: transparency
  }), " "), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "16px 0"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.CBSlider, {
    value: transparency,
    min: 0,
    max: 100,
    step: 1,
    onChange: handleTransparencyChange
  })));
};
TransparencySlider.propTypes = propTypes;
TransparencySlider.defaultProps = defaultProps;
var _default = TransparencySlider;
exports["default"] = _default;