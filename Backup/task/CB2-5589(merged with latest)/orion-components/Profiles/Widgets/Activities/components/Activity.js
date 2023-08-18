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
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var Activity = function Activity(_ref) {
  var activity = _ref.activity,
    forReplay = _ref.forReplay,
    timeFormatPreference = _ref.timeFormatPreference,
    dir = _ref.dir,
    locale = _ref.locale;
  var styles = {
    wrapper: _objectSpread({
      padding: 16,
      borderBottom: "1px solid rgba(255,255,255, 0.3)",
      color: "#fff"
    }, dir === "rtl" && {
      textAlign: "right"
    })
  };
  var id = activity.id,
    type = activity.type,
    published = activity.published,
    object = activity.object,
    actor = activity.actor,
    summary = activity.summary;
  var primaryText;
  switch (type) {
    case "comment":
      primaryText = "\"".concat(object.message, "\"");
      break;
    default:
      primaryText = summary;
      break;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wrapper
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      wordWrap: "break-word",
      fontSize: 14
    },
    variant: "body1"
  }, primaryText), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    noWrap: true,
    variant: "body2",
    style: {
      color: "rgb(181, 185, 190)",
      fontSize: 12
    }
  }, type === "comment" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.activities.activity.posted",
    count: actor.name
  }) : "", /*#__PURE__*/_react["default"].createElement(_CBComponents.Timestamp, {
    key: id,
    timestamp: published,
    format: "full_".concat(timeFormatPreference),
    useTimeAgo: !forReplay,
    locale: locale
  })));
};
var _default = Activity;
exports["default"] = _default;