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
var _material = require("@mui/material");
var _Icons = require("orion-components/CBComponents/Icons");
var _i18n = require("orion-components/i18n");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ErrorCard = function ErrorCard(_ref) {
  var dir = _ref.dir;
  var styles = {
    card: {
      borderRadius: "5px",
      marginBottom: 12,
      background: "transparent"
    },
    listItem: _objectSpread({
      backgroundColor: "#494d53"
    }, dir === "rtl" && {
      flexDirection: "row-reverse",
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: styles.card
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "12px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_Icons.Alert, {
    dir: dir
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: {
      fontSize: "14px"
    },
    primary: (0, _i18n.getTranslation)("global.dock.systemHealth.errorCard.errorText"),
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1"
    }
  })));
};
var _default = ErrorCard;
exports["default"] = _default;