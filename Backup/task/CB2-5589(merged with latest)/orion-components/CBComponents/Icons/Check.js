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
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  fontSize: _propTypes["default"].oneOf(["inherit", "default", "small", "large"]),
  dir: _propTypes["default"].string
};
var defaultProps = {
  fontSize: "default",
  dir: "ltr"
};
var Check = function Check(_ref) {
  var fontSize = _ref.fontSize,
    dir = _ref.dir;
  var styles = {
    icon: _objectSpread(_objectSpread({}, dir === "rtl" && {
      marginLeft: 0
    }), dir === "ltr" && {
      marginRight: 0
    }),
    layered: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.layered
  }, /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    fontSize: fontSize,
    style: styles.icon
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircle, {
    style: {
      color: "#00af3b"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    fontSize: fontSize,
    style: _objectSpread(_objectSpread({}, styles.icon), {}, {
      position: "absolute"
    })
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircleOutline, {
    style: {
      color: "#FFF"
    }
  })));
};
Check.propTypes = propTypes;
Check.defaultProps = defaultProps;
var _default = Check;
exports["default"] = _default;