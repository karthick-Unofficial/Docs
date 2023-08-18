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
var _jquery = _interopRequireDefault(require("jquery"));
var _size = _interopRequireDefault(require("lodash/size"));
var _filter = _interopRequireDefault(require("lodash/filter"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  children: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object]),
  xOffset: _propTypes["default"].number,
  emptyMessage: _propTypes["default"].string,
  padding: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  dir: _propTypes["default"].string
};
var defaultProps = {
  children: [],
  xOffset: 0,
  emptyMessage: "",
  padding: null
};

// TODO: Investigate using Material UI transform utilities to smooth transition
// TODO: Update to handle Portals
var Canvas = function Canvas(_ref) {
  var children = _ref.children,
    xOffset = _ref.xOffset,
    emptyMessage = _ref.emptyMessage,
    padding = _ref.padding,
    dir = _ref.dir;
  var isMobile = (0, _jquery["default"])(window).width() <= 1023;
  var childCount = (0, _size["default"])((0, _filter["default"])(children, function (child) {
    return Boolean(child);
  }));
  var styles = {
    height: isMobile ? "calc(100% - 48px)" : "100%",
    width: "calc(100% - ".concat(isMobile ? 0 : xOffset, "px)"),
    marginLeft: dir && dir == "rtl" ? {} : isMobile ? 0 : xOffset,
    marginRight: dir && dir == "rtl" ? isMobile ? 0 : xOffset : {},
    padding: typeof padding === "number" || typeof padding === "string" ? padding : isMobile ? "24px 6px" : "24px 36px",
    overflowY: "scroll",
    empty: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#828283"
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "canvas",
    style: childCount > 0 ? styles : _objectSpread(_objectSpread({}, styles), styles.empty)
  }, childCount ? children : emptyMessage);
};
Canvas.propTypes = propTypes;
Canvas.defaultProps = defaultProps;
var _default = Canvas;
exports["default"] = _default;