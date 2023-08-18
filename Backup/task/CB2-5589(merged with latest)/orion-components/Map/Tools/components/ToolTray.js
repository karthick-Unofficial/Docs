"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  children: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object]),
  dockOpen: _propTypes["default"].bool,
  WavCamOpen: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  children: [],
  dockOpen: false
};
var ToolTray = function ToolTray(_ref) {
  var _context;
  var children = _ref.children,
    dockOpen = _ref.dockOpen,
    WavCamOpen = _ref.WavCamOpen,
    dir = _ref.dir;
  var styles = {
    tray: _objectSpread(_objectSpread(_objectSpread({
      position: "absolute",
      bottom: WavCamOpen ? "15.55rem" : "2.55rem"
    }, dir === "ltr" && {
      right: ".5rem"
    }), dir === "rtl" && {
      left: ".5rem"
    }), {}, {
      display: "flex",
      justifyContent: "flex-end",
      //transition: "transform 200ms linear", //Leaving out for now because it's choppy
      transform: "translateX(-".concat(dockOpen ? 420 : 0, "px)")
    }),
    child: _objectSpread(_objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: 8
    }), dir === "rtl" && {
      marginRight: 8
    }), {}, {
      display: "flex",
      alignItems: "center"
    })
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.tray
  }, (0, _isArray["default"])(children) ? (0, _map["default"])(_context = (0, _filter["default"])(children).call(children, function (child) {
    return !!child;
  })).call(_context, function (child, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: index,
      style: styles.child
    }, child);
  }) : /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.child
  }, children));
};
ToolTray.propTypes = propTypes;
ToolTray.defaultProps = defaultProps;
var _default = ToolTray;
exports["default"] = _default;