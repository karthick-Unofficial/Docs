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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _Icons = require("orion-components/CBComponents/Icons");
var _SystemHealthItem = _interopRequireDefault(require("./SystemHealthItem"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  title: _propTypes["default"].string.isRequired,
  hasError: _propTypes["default"].bool.isRequired,
  healthSystems: _propTypes["default"].array,
  dir: _propTypes["default"].string,
  locale: _propTypes["default"].string
};
var defaultProps = {
  title: "",
  hasError: false,
  healthSystems: [],
  dir: "ltr",
  locale: "en"
};
var SystemHealthCard = function SystemHealthCard(_ref) {
  var title = _ref.title,
    hasError = _ref.hasError,
    healthSystems = _ref.healthSystems,
    dir = _ref.dir,
    locale = _ref.locale;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var handleExpand = function handleExpand() {
    setExpanded(!expanded);
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: {
      borderRadius: "5px",
      marginBottom: 12,
      background: "transparent"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: {
      backgroundColor: "#494d53"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "12px"
    }
  }, hasError ? /*#__PURE__*/_react["default"].createElement(_Icons.Alert, null) : /*#__PURE__*/_react["default"].createElement(_Icons.Check, null)), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: {
      fontSize: "14px",
      color: "#FFF",
      textAlign: dir == "rtl" ? "right" : "left"
    },
    primary: (0, _i18n.getTranslation)(title),
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1"
    }
  }), healthSystems.length ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    variant: "text",
    onClick: handleExpand,
    style: {
      fontSize: "14px",
      textTransform: "lowercase",
      color: "#3faede"
    }
  }, expanded ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.systemHealth.systemHealthCard.hide"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.systemHealth.systemHealthCard.more"
  })) : null), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded
  }, /*#__PURE__*/_react["default"].createElement(_material.CardContent, {
    style: {
      padding: dir && dir == "rtl" ? "0 50px 0 0" : "0 0 0 50px",
      backgroundColor: "#494d53"
    }
  }, (0, _map["default"])(healthSystems).call(healthSystems, function (system, index) {
    var _context;
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: system.label,
      style: _objectSpread({
        lineHeight: "24px",
        padding: "5px 0 5px 0"
      }, index === healthSystems.length - 1 && {
        paddingBottom: "20px"
      })
    }, /*#__PURE__*/_react["default"].createElement("p", {
      style: {
        color: "white",
        fontWeight: "bold"
      }
    }, (0, _i18n.getTranslation)(system.label)), (0, _map["default"])(_context = system.checks).call(_context, function (check) {
      return /*#__PURE__*/_react["default"].createElement(_SystemHealthItem["default"], {
        key: check.id,
        check: check,
        locale: locale
      });
    }), index !== healthSystems.length - 1 && /*#__PURE__*/_react["default"].createElement("hr", {
      style: {
        width: "90%"
      }
    }));
  }))));
};
SystemHealthCard.propTypes = propTypes;
SystemHealthCard.defaultProps = defaultProps;
var _default = SystemHealthCard;
exports["default"] = _default;