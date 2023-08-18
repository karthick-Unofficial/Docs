"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  check: _propTypes["default"].object,
  locale: _propTypes["default"].string
};
var defaultProps = {
  check: {},
  locale: "en"
};
var styles = {
  text: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#FFF"
  },
  subtext: {
    fontSize: "12px",
    color: "white",
    width: "100%"
  }
};
var SystemHealthItem = function SystemHealthItem(_ref) {
  var check = _ref.check,
    locale = _ref.locale;
  var errorMessage = check.status && check.status.message ? check.status.message : null;
  var passed = check.status && check.status.ok;
  var displayValue = check.displayValue ? check.displayValue : passed ? "Passed" : "Error";
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      width: "90%",
      padding: "5px 0 5px 0"
    }
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: _objectSpread(_objectSpread({}, styles.text), !passed && {
      color: "#be3e49"
    })
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: check.name
  })), /*#__PURE__*/_react["default"].createElement("p", {
    style: _objectSpread(_objectSpread({}, styles.text), !passed && {
      color: "#be3e49"
    })
  }, displayValue == "Passed" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.systemHealth.systemHealthItem.passed"
  }) : displayValue == "Error" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.systemHealth.systemHealthItem.error"
  }) : displayValue), errorMessage && /*#__PURE__*/_react["default"].createElement("p", {
    style: styles.subtext
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: errorMessage
  })), errorMessage && /*#__PURE__*/_react["default"].createElement("p", {
    style: _objectSpread(_objectSpread({}, styles.subtext), {}, {
      color: "#6e7376"
    })
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.systemHealth.systemHealthItem.lastUpdate"
  }), (0, _moment["default"])(check.lastUpdated).locale(locale).fromNow())));
};
SystemHealthItem.propTypes = propTypes;
SystemHealthItem.defaultProps = defaultProps;
var _default = SystemHealthItem;
exports["default"] = _default;