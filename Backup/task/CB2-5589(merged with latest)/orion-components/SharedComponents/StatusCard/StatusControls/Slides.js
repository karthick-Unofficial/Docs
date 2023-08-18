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
var _propTypes = _interopRequireDefault(require("prop-types"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _ArrowLeft = _interopRequireDefault(require("@mui/icons-material/ArrowLeft"));
var _ArrowRight = _interopRequireDefault(require("@mui/icons-material/ArrowRight"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  control: _propTypes["default"].object.isRequired,
  updateSelected: _propTypes["default"].func.isRequired,
  disableControls: _propTypes["default"].bool.isRequired,
  dir: _propTypes["default"].string,
  forceUpdate: _propTypes["default"].bool
};
var Slides = function Slides(_ref) {
  var control = _ref.control,
    updateSelected = _ref.updateSelected,
    disableControls = _ref.disableControls,
    dir = _ref.dir,
    forceUpdate = _ref.forceUpdate;
  var selectedIndex = control.selectedIndex;
  var _useState = (0, _react.useState)(selectedIndex),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    selectedIndexState = _useState2[0],
    setSelectedIndexState = _useState2[1];
  var selectedItem = control.items[selectedIndexState];
  var selectedItemColor = selectedItem.color,
    selectedItemText = selectedItem.text;

  // Ensure click event on buttons, icons, etc do not activate
  // the draggable grid 'drag' event
  var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
  };
  var updateSelectedIndex = function updateSelectedIndex(isIncrement) {
    var value = isIncrement ? selectedIndexState + 1 : selectedIndexState - 1;
    setSelectedIndexState(value);
    updateSelected(value);
  };
  (0, _react.useEffect)(function () {
    setSelectedIndexState(selectedIndex);
  }, [selectedIndex, forceUpdate]);
  var styles = {
    container: _objectSpread({
      width: "100%",
      height: "calc(100% - 91px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, dir === "rtl" && {
      flexDirection: "row-reverse"
    }),
    content: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    textContainer: {
      height: "70px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center"
    },
    withColor: _objectSpread(_objectSpread({
      maxWidth: "calc(100% - 70px)"
    }, dir === "rtl" && {
      marginRight: "20px"
    }), dir === "ltr" && {
      marginLeft: "20px"
    }),
    slideText: {
      color: "#B5B9BE",
      fontSize: "20px",
      maxHeight: "70px",
      overflow: "hidden",
      lineHeight: 1,
      overflowWrap: "anywhere",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      textOverflow: "ellipsis",
      displayWebkit: "box"
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.container
  }, !disableControls && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    className: "status-card-slider-control slider-control-left",
    disabled: selectedIndexState === 0,
    onClick: function onClick() {
      return updateSelectedIndex();
    },
    disableFocusRipple: true,
    disableRipple: true,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, /*#__PURE__*/_react["default"].createElement(_ArrowLeft["default"], {
    style: {
      fontSize: "3rem",
      color: selectedIndexState !== 0 ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3"
    }
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.content
  }, selectedItemColor && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      borderRadius: "50%",
      backgroundColor: selectedItemColor,
      height: "50px",
      width: "50px"
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread({}, styles.textContainer), selectedItemColor ? styles.withColor : {})
  }, /*#__PURE__*/_react["default"].createElement("h2", {
    style: styles.slideText
  }, selectedItemText))), !disableControls && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    className: "status-card-slider-control slider-control-right",
    disabled: selectedIndexState === control.items.length - 1,
    onClick: function onClick() {
      return updateSelectedIndex(true);
    },
    disableFocusRipple: true,
    disableRipple: true,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, /*#__PURE__*/_react["default"].createElement(_ArrowRight["default"], {
    style: {
      fontSize: "3rem",
      color: selectedIndexState !== control.items.length - 1 ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"
    }
  }))));
};
Slides.propTypes = propTypes;
var _default = Slides;
exports["default"] = _default;