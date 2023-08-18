"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var geometry = {
  "coordinates": [-96.51724428580445, 51.43671891342285],
  "type": "Point"
};
var UnitsRow = function UnitsRow(_ref) {
  var unit = _ref.unit,
    id = _ref.id;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "unitsRow"
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1
  }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      style: {
        transform: "scale(1.1)"
      },
      checked: true
    })
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2
  }, geometry && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    feedId: "",
    id: id,
    geometry: geometry
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2
  }, /*#__PURE__*/_react["default"].createElement("div", null, unit.memberType === "person" ? /*#__PURE__*/_react["default"].createElement("img", {
    alt: "person",
    style: {
      width: 35,
      margin: "5px 10px"
    },
    src: require("../../SharedComponents/ShapeEdit/icons/Person_blue.png")
  }) : /*#__PURE__*/_react["default"].createElement("img", {
    alt: "police_car",
    style: {
      width: 35,
      margin: "5px 10px"
    },
    src: require("../../SharedComponents/ShapeEdit/icons/Police_Car_blue.png")
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 5,
    sm: 5,
    md: 5,
    lg: 5
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      fontSize: "14px",
      paddingTop: "12px",
      margin: "0px 5px"
    }
  }, "AISHUB")), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    style: {
      textTransform: "none",
      color: "#66686C"
    }
  }, "Settings"))));
};
var _default = UnitsRow;
exports["default"] = _default;