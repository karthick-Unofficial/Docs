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
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  selectedColor: _propTypes["default"].string.isRequired,
  setData: _propTypes["default"].func.isRequired,
  title: _propTypes["default"].string.isRequired
};
var defaultProps = {
  selectedColor: "#0073c8",
  setData: function setData() {},
  title: "Color"
};
var styles = {
  colorBlock: {
    height: 34,
    width: 34
  },
  colorRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15
  },
  text: {
    color: "white"
  }
};

// Individual Color Block
var Tile = function Tile(_ref) {
  var color = _ref.color,
    selectColor = _ref.selectColor,
    selectedColor = _ref.selectedColor;
  var isWhite = color === "#ffffff";
  return /*#__PURE__*/_react["default"].createElement("div", {
    onClick: function onClick() {
      return selectColor(color);
    },
    style: _objectSpread(_objectSpread({}, styles.colorBlock), {}, {
      backgroundColor: color
    }, selectedColor === color && {
      border: isWhite ? "3px solid #8c8c8c" : "3px solid white"
    })
  });
};
var ColorTiles = function ColorTiles(_ref2) {
  var selectedColor = _ref2.selectedColor,
    title = _ref2.title,
    setData = _ref2.setData;
  var selectColor = function selectColor(hex) {
    setData(hex);
  };
  var colorRowOne = ["#0073c8", "#38499f", "#238238", "#ffac3c", "#9c0019", "#000000"];
  var colorRowTwo = ["#2face8", "#6e399e", "#82cf51", "#fffd4f", "#ff0022", "#ffffff"];
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: styles.text
  }, title)), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.colorRow
  }, (0, _map["default"])(colorRowOne).call(colorRowOne, function (hexCode) {
    return /*#__PURE__*/_react["default"].createElement(Tile, {
      key: hexCode,
      color: hexCode,
      selectColor: selectColor,
      selectedColor: selectedColor
    });
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread({}, styles.colorRow), {}, {
      marginBottom: 15
    })
  }, (0, _map["default"])(colorRowTwo).call(colorRowTwo, function (hexCode) {
    return /*#__PURE__*/_react["default"].createElement(Tile, {
      key: hexCode,
      color: hexCode,
      selectColor: selectColor,
      selectedColor: selectedColor
    });
  }))));
};
ColorTiles.propTypes = propTypes;
ColorTiles.defaultProps = defaultProps;
var _default = ColorTiles;
exports["default"] = _default;