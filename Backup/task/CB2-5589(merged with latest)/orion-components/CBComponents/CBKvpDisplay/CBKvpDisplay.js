"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var propTypes = {
  keyValuePairs: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    key: _propTypes["default"].string,
    value: _propTypes["default"].string
  })),
  classes: _propTypes["default"].object
};
var defaultProps = {
  keyValuePairs: [{
    key: "",
    value: ""
  }]
};
var styles = {
  selected: {
    backgroundColor: "rgba(149, 150, 151, 0.4) !important"
  }
};
var CBKvpDisplay = function CBKvpDisplay(_ref) {
  var keyValuePairs = _ref.keyValuePairs,
    classes = _ref.classes;
  return /*#__PURE__*/_react["default"].createElement(_material.Paper, null, /*#__PURE__*/_react["default"].createElement(_material.Table, null, /*#__PURE__*/_react["default"].createElement(_material.TableBody, null, (0, _map["default"])(keyValuePairs).call(keyValuePairs, function (pair, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableRow, {
      key: pair.key + index,
      classes: {
        selected: classes.selected
      },
      selected: index % 2 === 0 ? true : false
    }, /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: {
        padding: "4px 24px 4px 24px"
      }
    }, pair.key), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: {
        padding: "4px 24px 4px 24px"
      }
    }, pair.value));
  }))));
};
CBKvpDisplay.propTypes = propTypes;
CBKvpDisplay.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(CBKvpDisplay);
exports["default"] = _default;