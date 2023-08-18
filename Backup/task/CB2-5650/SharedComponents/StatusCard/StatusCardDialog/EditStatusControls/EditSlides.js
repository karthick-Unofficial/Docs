"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactColor = require("react-color");
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Fab = _interopRequireDefault(require("@mui/material/Fab"));
var _Popover = _interopRequireDefault(require("@mui/material/Popover"));
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _Delete = _interopRequireDefault(require("@mui/icons-material/Delete"));
var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var itemPropTypes = {
  slide: _propTypes["default"].object.isRequired,
  index: _propTypes["default"].number.isRequired,
  handleChangeColor: _propTypes["default"].func.isRequired,
  handleChangeText: _propTypes["default"].func.isRequired,
  handleRemoveSlide: _propTypes["default"].func.isRequired,
  deleteDisabled: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var EditTextItem = function EditTextItem(_ref) {
  var slide = _ref.slide,
    index = _ref.index,
    handleChangeColor = _ref.handleChangeColor,
    handleChangeText = _ref.handleChangeText,
    handleRemoveSlide = _ref.handleRemoveSlide,
    deleteDisabled = _ref.deleteDisabled,
    dir = _ref.dir;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    isHovered = _useState4[0],
    setIsHovered = _useState4[1];
  var handleClick = function handleClick(e) {
    setAnchorEl(e.currentTarget);
  };
  var handleClose = function handleClose() {
    setAnchorEl(null);
  };
  var handleHover = function handleHover(type) {
    setIsHovered(type);
  };
  var open = Boolean(anchorEl);
  var itemStyles = {
    container: {
      width: "100%",
      margin: "15px 0 15px 0",
      display: "flex",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "space-evenly"
    },
    inputLabelProps: _objectSpread(_objectSpread({
      color: "#B5B9BE"
    }, dir === "rtl" && {
      transformOrigin: "top right",
      textAlign: "right",
      right: "0"
    }), dir === "rtl" && {
      transformOrigin: "top left",
      textAlign: "left"
    })
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: itemStyles.container
  }, /*#__PURE__*/_react["default"].createElement("div", {
    onClick: handleClick,
    onMouseEnter: function onMouseEnter() {
      return handleHover(true);
    },
    onMouseLeave: function onMouseLeave() {
      return handleHover(false);
    },
    style: _objectSpread({
      borderRadius: "50%",
      backgroundColor: slide.color ? slide.color : "transparent",
      height: "50px",
      width: "50px",
      boxShadow: slide.color ? null : "0 0 0 2px #B5B9BE"
    }, isHovered && {
      boxShadow: "0 0 0 3px ".concat(slide.color ? slide.color : "white"),
      cursor: "pointer"
    })
  }), /*#__PURE__*/_react["default"].createElement(_Popover["default"], {
    id: "color-popover-".concat(index),
    open: open,
    anchorEl: anchorEl,
    onClose: handleClose,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactColor.GithubPicker, {
    color: slide.color,
    onChangeComplete: function onChangeComplete(color) {
      handleChangeColor(color, index);
      handleClose();
    },
    colors: ["#008b02", "#fcac00", "#db0000", "#1273de", "#038795", "#3f3f3f", "#000000", "#7fc580", "#fdd57f", "#ed7f7f", "#88b9ee", "#81c3ca", "#9f9f9f", "#ffffff"]
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "70%",
      padding: "0 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_TextField["default"], {
    style: {
      width: "100%"
    },
    id: "text-set-".concat(index),
    variant: "standard",
    label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.StatusCardDialog.editSlide.fieldLabel.text"),
    value: slide.text,
    onChange: function onChange(e) {
      return handleChangeText(e, index);
    },
    margin: "normal",
    InputLabelProps: {
      style: itemStyles.inputLabelProps
    }
  })), deleteDisabled ? /*#__PURE__*/_react["default"].createElement(_Tooltip["default"], {
    title: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.StatusCardDialog.editSlide.fieldLabel.atleastOne")
  }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    style: {
      padding: 0
    },
    onClick: function onClick() {
      return handleRemoveSlide(index);
    },
    disabled: true
  }, /*#__PURE__*/_react["default"].createElement(_Delete["default"], null)))) : /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    style: {
      padding: 0
    },
    onClick: function onClick() {
      return handleRemoveSlide(index);
    }
  }, /*#__PURE__*/_react["default"].createElement(_Delete["default"], null)));
};
EditTextItem.propTypes = itemPropTypes;
var propTypes = {
  control: _propTypes["default"].object.isRequired,
  setData: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var EditText = function EditText(_ref2) {
  var control = _ref2.control,
    setData = _ref2.setData,
    dir = _ref2.dir;
  var items = control.items;
  var _useState5 = (0, _react.useState)(items),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    slides = _useState6[0],
    setSlides = _useState6[1];

  // -- Initialize child data
  setData(slides);

  // Ensure click event on buttons, icons, etc do not activate
  // the draggable grid 'drag' event
  var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
  };
  var handleChangeColor = function handleChangeColor(color, index) {
    var newSlides = (0, _toConsumableArray2["default"])(slides);
    newSlides[index].color = color.hex;
    setSlides(newSlides);
    setData(newSlides);
  };
  var handleChangeText = function handleChangeText(e, index) {
    var newSlides = (0, _toConsumableArray2["default"])(slides);
    newSlides[index].text = e.target.value;
    setSlides(newSlides);
    setData(newSlides);
  };
  var addNewSlide = function addNewSlide() {
    var _context;
    var newSlides = (0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(slides), [{
      text: ""
    }]);
    setSlides(newSlides);
    setData(newSlides);
  };
  var handleRemoveSlide = function handleRemoveSlide(index) {
    var newSlides = (0, _filter["default"])(slides).call(slides, function (item, idx) {
      return idx !== index;
    });
    setSlides(newSlides);
    setData(newSlides);
  };
  var styles = {
    container: {
      width: "100%",
      height: "100%"
    },
    controls: _objectSpread(_objectSpread({
      display: "flex",
      align: "center",
      alignItems: "center",
      paddingTop: "15px"
    }, dir === "rtl" && {
      marginRight: "17px"
    }), dir === "ltr" && {
      marginLeft: "17px"
    }),
    typography: _objectSpread(_objectSpread({}, dir === "rtl" && {
      marginRight: "1rem"
    }), dir === "ltr" && {
      marginLeft: "1rem"
    })
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "edit-slides-boundary",
    style: styles.container,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, (0, _map["default"])(slides).call(slides, function (slide, idx) {
    return /*#__PURE__*/_react["default"].createElement(EditTextItem, {
      key: idx + 10,
      slide: slide,
      text: slide.text,
      color: slide.color,
      index: idx,
      handleChangeColor: handleChangeColor,
      handleChangeText: handleChangeText,
      handleRemoveSlide: handleRemoveSlide,
      deleteDisabled: slides.length <= 1,
      dir: dir
    });
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.controls
  }, /*#__PURE__*/_react["default"].createElement(_Fab["default"], {
    onClick: addNewSlide,
    color: "primary",
    size: "small"
  }, /*#__PURE__*/_react["default"].createElement(_Add["default"], null)), /*#__PURE__*/_react["default"].createElement(_Typography["default"], {
    variant: "body1",
    style: styles.typography
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.statusCard.StatusCardDialog.editSlide.newSlide"
  }))));
};
EditText.propTypes = propTypes;
var _default = EditText; // add a property to one of the rows, fo rthe selected index, use indexOf to set selected index before updating
exports["default"] = _default;