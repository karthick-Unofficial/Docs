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
var _iconsMaterial = require("@mui/icons-material");
var _CBComponents = require("orion-components/CBComponents");
var propTypes = {
  label: _propTypes["default"].string.isRequired,
  tooltip: _propTypes["default"].string,
  unit: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number, _propTypes["default"].object]).isRequired,
  visual: _propTypes["default"].string.isRequired
};
var defaultProps = {
  tooltip: "",
  unit: ""
};
var VisualDetail = function VisualDetail(_ref) {
  var label = _ref.label,
    tooltip = _ref.tooltip,
    unit = _ref.unit,
    value = _ref.value,
    visual = _ref.visual;
  var styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      placeContent: "center",
      alignItems: "center"
    },
    direction: {
      transform: "rotate(".concat(value > 180 ? value - 360 : value, "deg)"),
      color: "#FFF",
      width: 30,
      height: 30,
      margin: 4
    },
    flag: {
      height: 20,
      width: 28,
      margin: 4
    }
  };
  switch (visual) {
    case "text":
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: styles.wrapper
      }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        variant: "caption"
      }, label), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        variant: "h5"
      }, value.unit ? /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
        sourceUnit: value.unit,
        value: value.val
      }) : unit ? /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
        sourceUnit: unit,
        value: value
      }) : value));
    case "direction":
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: styles.wrapper
      }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        variant: "caption"
      }, label), /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Navigation, {
        style: styles.direction
      }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        variant: "caption"
      }, /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
        sourceUnit: unit,
        value: value
      })));
    case "flag":
      return /*#__PURE__*/_react["default"].createElement(_material.Tooltip, {
        title: tooltip,
        placement: "bottom"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: styles.wrapper
      }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        variant: "caption"
      }, label), /*#__PURE__*/_react["default"].createElement("div", {
        style: styles.flag,
        className: "flag-icon-background ".concat("fi fi-" + value.toLowerCase())
      }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        variant: "caption"
      }, value)));
    default:
      return null;
  }
};
VisualDetail.propTypes = propTypes;
VisualDetail.defaultProps = defaultProps;
var _default = VisualDetail;
exports["default"] = _default;