"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireWildcard(require("react"));
var _reactSlick = _interopRequireDefault(require("react-slick"));
var _material = require("@mui/material");
var _ChevronLeft = _interopRequireDefault(require("@mui/icons-material/ChevronLeft"));
var _ChevronRight = _interopRequireDefault(require("@mui/icons-material/ChevronRight"));
var _size = _interopRequireDefault(require("lodash/size"));
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ImageViewer = function ImageViewer(_ref) {
  var images = _ref.images,
    dir = _ref.dir;
  var slider = (0, _react.useRef)();
  var handleSliderUpdate = function handleSliderUpdate() {
    if (slider && slider.innerSlider) {
      slider.innerSlider.adaptHeight();
    }
  };
  (0, _react.useEffect)(function () {
    if ((0, _size["default"])(images)) {
      handleSliderUpdate();
    }
  }, []);
  handleSliderUpdate();
  var next = function next() {
    slider.slickNext();
  };
  var previous = function previous() {
    slider.slickPrev();
  };
  var orderImages = function orderImages(arr) {
    (0, _forEach["default"])(arr).call(arr, function (i) {
      if (i.defaultImage === true && (0, _indexOf["default"])(arr).call(arr, i) > 0) {
        (0, _splice["default"])(arr).call(arr, (0, _indexOf["default"])(arr).call(arr, i), 1);
        arr.unshift(i);
      }
    });
  };
  orderImages(images);
  var styles = {
    button: {
      position: "absolute",
      top: "40%",
      zIndex: "100",
      opacity: 0.5,
      height: 48,
      width: 48,
      padding: 0
    },
    icon: {
      height: 48,
      width: 48
    },
    image: {
      width: "100%"
    }
  };
  var settings = {
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    variableWidth: false,
    arrows: false,
    centerMode: true,
    centerPadding: "0px"
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_reactSlick["default"], (0, _extends2["default"])({
    ref: slider
  }, settings), (0, _map["default"])(images).call(images, function (item, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: index
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        position: "relative"
      }
    }, images.length > 1 && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      iconStyle: styles.icon,
      style: _objectSpread(_objectSpread(_objectSpread({}, styles.button), dir === "rtl" && {
        right: 2
      }), dir === "ltr" && {
        left: 2
      }),
      onClick: previous
    }, dir && dir === "rtl" ? /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], {
      color: "black"
    }) : /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
      color: "black"
    })), /*#__PURE__*/_react["default"].createElement("img", {
      onLoad: handleSliderUpdate,
      style: styles.image,
      alt: "attachment",
      src: item.source != null && item.source == "external" ? item.handle : "/_download?handle=" + item.handle
    }), images.length > 1 && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      iconStyle: styles.icon,
      style: dir === "rtl" ? _objectSpread(_objectSpread({}, styles.button), {}, {
        left: 2
      }) : _objectSpread(_objectSpread({}, styles.button), {}, {
        right: 2
      }),
      onClick: next
    }, dir && dir === "rtl" ? /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
      color: "black"
    }) : /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], {
      color: "black"
    }))));
  })));
};
var propsChange = function propsChange(prevProps, nextProps) {
  return !(0, _reactFastCompare["default"])(prevProps, nextProps);
};
var _default = /*#__PURE__*/(0, _react.memo)(ImageViewer, propsChange);
exports["default"] = _default;