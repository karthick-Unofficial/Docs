"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _index = require("../index");
var _map = _interopRequireDefault(require("lodash/map"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  rows: _propTypes["default"].array,
  classes: _propTypes["default"].object,
  dir: _propTypes["default"].string
};
var defaultProps = {
  rows: []
};
var styles = {
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(149, 150, 151, 0.4)"
    }
  }
};
var SimpleTable = function SimpleTable(_ref) {
  var rows = _ref.rows,
    classes = _ref.classes,
    dir = _ref.dir;
  var styles = {
    table: {
      margin: "10px 0"
    },
    cell: _objectSpread({
      border: "none",
      color: "#fff"
    }, dir === "rtl" && {
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Table, {
    style: styles.table
  }, /*#__PURE__*/_react["default"].createElement(_material.TableBody, null, (0, _map["default"])(rows, function (row) {
    var label = row.label,
      unit = row.unit,
      value = row.value;
    return /*#__PURE__*/_react["default"].createElement(_material.TableRow, {
      key: label,
      className: classes.root
    }, /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: styles.cell
    }, label), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: styles.cell
    }, value.unit ? /*#__PURE__*/_react["default"].createElement(_index.UnitParser, {
      sourceUnit: value.unit,
      value: value.val
    }) : unit ? /*#__PURE__*/_react["default"].createElement(_index.UnitParser, {
      sourceUnit: unit,
      value: value
    }) : value));
  })));
};
SimpleTable.propTypes = propTypes;
SimpleTable.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(SimpleTable);
exports["default"] = _default;