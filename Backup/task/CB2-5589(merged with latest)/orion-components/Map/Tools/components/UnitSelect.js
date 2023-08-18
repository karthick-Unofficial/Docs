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
var _mdiMaterialUi = require("mdi-material-ui");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var UnitSelect = function UnitSelect(_ref) {
  var landUnitSystem = _ref.landUnitSystem,
    handleSelect = _ref.handleSelect,
    dir = _ref.dir;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var handleOpen = function handleOpen(e) {
    setAnchorEl(e.target);
  };
  var handleClose = function handleClose() {
    setAnchorEl(null);
  };
  var handleClick = (0, _react.useCallback)(function (value) {
    handleSelect(value);
    handleClose();
  });
  var styles = {
    textAlignRight: _objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Fab, {
    onClick: handleOpen,
    color: "primary"
  }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.Ruler, {
    style: {
      color: "#FFF"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    open: !!anchorEl,
    anchorEl: anchorEl,
    onClose: handleClose,
    anchorOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    transformOrigin: {
      vertical: "bottom",
      horizontal: "right"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    onClick: function onClick() {
      return handleClick("nautical-miles");
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.map.tools.unitSelect.nauticalMiles"),
    style: styles.textAlignRight
  })), landUnitSystem === "metric" ? /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    onClick: function onClick() {
      return handleClick("kilometers");
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.map.tools.unitSelect.kilometers"),
    style: styles.textAlignRight
  })) : /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    onClick: function onClick() {
      return handleClick("miles");
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.map.tools.unitSelect.miles"),
    style: styles.textAlignRight
  }))));
};
var _default = /*#__PURE__*/(0, _react.memo)(UnitSelect);
exports["default"] = _default;