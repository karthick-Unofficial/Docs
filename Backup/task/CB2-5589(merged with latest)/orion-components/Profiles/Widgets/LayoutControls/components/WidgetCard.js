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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _selector = require("orion-components/i18n/Config/selector");
var _reactRedux = require("react-redux");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var WidgetCard = function WidgetCard(_ref) {
  var widget = _ref.widget,
    enable = _ref.enable,
    disable = _ref.disable,
    isExpanded = _ref.isExpanded;
  var _useState = (0, _react.useState)(widget),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    widgetState = _useState2[0],
    setWidgetState = _useState2[1];
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  }, _isEqual["default"]);
  var handleEnableClick = function handleEnableClick(id) {
    setWidgetState(_objectSpread(_objectSpread({}, widgetState), {}, {
      enabled: true
    }));
    enable(id);
  };
  var handleDisableClick = function handleDisableClick(id) {
    setWidgetState(_objectSpread(_objectSpread({}, widgetState), {}, {
      enabled: false
    }));
    disable(id);
  };
  var styles = {
    listItemStyles: {
      backgroundColor: "#1F1F21",
      margin: ".25rem .5rem",
      width: "95.5%",
      zIndex: "999999"
    },
    listIconEnd: _objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: "auto"
    }), dir === "rtl" && {
      marginRight: "auto"
    })
  };
  var getRightIconButton = function getRightIconButton() {
    if (isExpanded) return null;else {
      return widgetState.enabled ? /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        style: styles.listIconEnd,
        onClick: function onClick() {
          return handleDisableClick(widget.id);
        }
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.RemoveCircle, {
        sx: {
          color: "#E85858"
        }
      })) : /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        style: styles.listIconEnd,
        onClick: function onClick() {
          return handleEnableClick(widget.id);
        }
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.AddCircle, {
        sx: {
          color: "#A4B966"
        }
      }));
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    disablePadding: true,
    style: styles.listItemStyles
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemButton, null, /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, null, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Reorder, {
    sx: {
      color: "#FFF"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: widget.name,
    sx: {
      color: "#fff"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, null, getRightIconButton())));
};
var _default = WidgetCard;
exports["default"] = _default;