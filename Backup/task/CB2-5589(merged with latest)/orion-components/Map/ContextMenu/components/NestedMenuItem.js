"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/slice");
var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");
var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");
var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");
var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");
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
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));
var _react = _interopRequireWildcard(require("react"));
var _styles = require("@mui/styles");
var _Menu = _interopRequireDefault(require("@mui/material/Menu"));
var _ChevronRight = _interopRequireDefault(require("@mui/icons-material/ChevronRight"));
var _ChevronLeft = _interopRequireDefault(require("@mui/icons-material/ChevronLeft"));
var _clsx = _interopRequireDefault(require("clsx"));
var _ContextMenuItem = _interopRequireDefault(require("./ContextMenuItem"));
var _excluded = ["parentMenuOpen", "label", "rightIcon", "leftIcon", "children", "className", "tabIndex", "ContainerProps", "dir", "isUsedForEventCreation"],
  _excluded2 = ["ref"];
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var useMenuStyles = (0, _styles.makeStyles)({
  root: function root(props) {
    return {
      backgroundColor: props.open ? "#2c2d2f" : "#494d53"
    };
  },
  gutters: {
    paddingRight: 11
  },
  paper: {
    boxShadow: "rgb(0,0,0,0.7) -5px 5px 10px 0px",
    backgroundColor: "#494d53"
  }
});

/**
 * Use as a drop-in replacement for `<MenuItem>` when you need to add cascading
 * menu elements as children to this component.
 */
var NestedMenuItem = /*#__PURE__*/_react["default"].forwardRef(function NestedMenuItem(props, ref) {
  var parentMenuOpen = props.parentMenuOpen,
    label = props.label,
    _props$rightIcon = props.rightIcon,
    rightIcon = _props$rightIcon === void 0 ? /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], null) : _props$rightIcon,
    _props$leftIcon = props.leftIcon,
    leftIcon = _props$leftIcon === void 0 ? /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], null) : _props$leftIcon,
    children = props.children,
    className = props.className,
    tabIndexProp = props.tabIndex,
    _props$ContainerProps = props.ContainerProps,
    ContainerPropsProp = _props$ContainerProps === void 0 ? {} : _props$ContainerProps,
    dir = props.dir,
    _props$isUsedForEvent = props.isUsedForEventCreation,
    isUsedForEventCreation = _props$isUsedForEvent === void 0 ? false : _props$isUsedForEvent,
    MenuItemProps = (0, _objectWithoutProperties2["default"])(props, _excluded);
  var containerRefProp = ContainerPropsProp.ref,
    ContainerProps = (0, _objectWithoutProperties2["default"])(ContainerPropsProp, _excluded2);
  var menuItemRef = (0, _react.useRef)(null);
  (0, _react.useImperativeHandle)(ref, function () {
    return menuItemRef.current;
  });
  var containerRef = (0, _react.useRef)(null);
  (0, _react.useImperativeHandle)(containerRefProp, function () {
    return containerRef.current;
  });
  var menuContainerRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isSubMenuOpen = _useState2[0],
    setIsSubMenuOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(true),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    isSubMenuOpenedForFirstTime = _useState4[0],
    setIsSubMenuOpenedForFirstTime = _useState4[1];
  var handleMouseEnter = function handleMouseEnter(event) {
    //Added a timeout function, when this nested menu component is used for the new event creation process. The reason for this timeout function is that the nested menu is opened without giving enough time for the menu to render properly.
    if (isUsedForEventCreation && isSubMenuOpenedForFirstTime) {
      setIsSubMenuOpenedForFirstTime(false);
      (0, _setTimeout2["default"])(function () {
        setIsSubMenuOpen(true);
      }, 150);
    } else {
      setIsSubMenuOpen(true);
    }
    if (ContainerProps && ContainerProps.onMouseEnter) {
      ContainerProps.onMouseEnter(event);
    }
  };
  var handleMouseLeave = function handleMouseLeave(event) {
    setIsSubMenuOpen(false);
    if (ContainerProps && ContainerProps.onMouseLeave) {
      ContainerProps.onMouseLeave(event);
    }
  };

  // To address situations where the mouse is already on this menu item when the menu item is
  // rendered because of which mouse enter would not get fired.
  var handleMouseMove = function handleMouseMove(event) {
    if (!isSubMenuOpen) {
      setIsSubMenuOpen(true);
      if (ContainerProps && ContainerProps.onMouseEnter) {
        ContainerProps.onMouseEnter(event);
      }
    }
  };

  // Check if any immediate children are active
  var isSubmenuFocused = function isSubmenuFocused() {
    var active = null;
    if (containerRef.current && containerRef.current.ownerDocument) active = containerRef.current.ownerDocument.activeElement;
    var children = [];
    if (menuContainerRef && menuContainerRef.current && menuContainerRef.current.children) children = menuContainerRef.current.children;
    var _iterator = _createForOfIteratorHelper(children),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var child = _step.value;
        if (child === active) {
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return false;
  };
  var handleFocus = function handleFocus(event) {
    if (event.target === containerRef.current) {
      setIsSubMenuOpen(true);
    }
    if (ContainerProps && ContainerProps.onFocus) {
      ContainerProps.onFocus(event);
    }
  };
  var handleKeyDown = function handleKeyDown(event) {
    if (event.key === "Escape") {
      return;
    }
    if (isSubmenuFocused()) {
      event.stopPropagation();
    }
    var active = null;
    if (containerRef.current && containerRef.current.ownerDocument) active = containerRef.current.ownerDocument.activeElement;
    if (event.key === "ArrowLeft" && isSubmenuFocused()) {
      if (containerRef.current) containerRef.current.focus();
    }
    if (event.key === "ArrowRight" && event.target === containerRef.current && event.target === active) {
      if (menuContainerRef && menuContainerRef.current && menuContainerRef.current.children) menuContainerRef.current.children[0].focus();
    }
  };
  var open = isSubMenuOpen && parentMenuOpen;
  var menuClasses = useMenuStyles({
    open: open
  });

  // Root element must have a `tabIndex` attribute for keyboard navigation
  var tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }
  var style = _objectSpread(_objectSpread({
    width: "100%"
  }, dir === "ltr" && {
    textAlign: "left"
  }), dir === "rtl" && {
    textAlign: "right"
  });
  return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({}, ContainerProps, {
    ref: containerRef,
    onFocus: handleFocus,
    tabIndex: tabIndex,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
    onKeyDown: handleKeyDown
  }), /*#__PURE__*/_react["default"].createElement(_ContextMenuItem["default"], (0, _extends2["default"])({}, MenuItemProps, {
    className: (0, _clsx["default"])(menuClasses.root, className),
    classes: {
      gutters: menuClasses.gutters
    },
    ref: menuItemRef
  }), /*#__PURE__*/_react["default"].createElement("span", {
    style: style
  }, label), dir === "rtl" ? leftIcon : rightIcon), /*#__PURE__*/_react["default"].createElement(_Menu["default"]
  // Set pointer events to "none" to prevent the invisible Popover div
  // from capturing events for clicks and hovers
  , {
    style: {
      pointerEvents: "none"
    },
    anchorEl: menuItemRef.current,
    anchorOrigin: {
      horizontal: dir === "rtl" ? "left" : "right",
      vertical: "top"
    },
    transformOrigin: {
      horizontal: dir === "rtl" ? "right" : "left",
      vertical: "top"
    },
    open: open,
    autoFocus: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
    onClose: function onClose() {
      setIsSubMenuOpen(false);
    },
    classes: {
      paper: menuClasses.paper
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: menuContainerRef,
    style: {
      pointerEvents: "auto",
      overflowY: "scroll",
      maxHeight: "calc(100vh - 96px)"
    }
  }, children)));
});
var _default = NestedMenuItem;
exports["default"] = _default;