"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _ChevronLeft = _interopRequireDefault(require("@mui/icons-material/ChevronLeft"));
var _ViewList = _interopRequireDefault(require("@mui/icons-material/ViewList"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _selector = require("orion-components/i18n/Config/selector");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var DockControl = function DockControl(_ref) {
  var _context, _context2, _context3, _context4, _context5;
  var history = _ref.history,
    viewLastProfile = _ref.viewLastProfile,
    open = _ref.open,
    secondaryOpen = _ref.secondaryOpen,
    hidden = _ref.hidden,
    children = _ref.children,
    styles = _ref.styles,
    secondaryStyles = _ref.secondaryStyles,
    onArrowClick = _ref.onArrowClick,
    onPanelClick = _ref.onPanelClick,
    actionButtons = _ref.actionButtons,
    className = _ref.className,
    secondaryClassName = _ref.secondaryClassName,
    closeSecondary = _ref.closeSecondary,
    WavCamOpen = _ref.WavCamOpen;
  var _useState = (0, _react.useState)(true),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    primaryOpen = _useState2[0],
    setPrimaryOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    secondaryOpenState = _useState4[0],
    setSecondaryOpenState = _useState4[1];
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  }, _isEqual["default"]);
  //const [hideSecondary, setHideSecondary] = useState(false);
  //not used anymore

  var togglePrimaryOpen = function togglePrimaryOpen() {
    setPrimaryOpen(!primaryOpen);
    // secondaryOpen: !this.state.primaryOpen
  };

  var handleLastEntityClick = function handleLastEntityClick() {
    var entity = history[history.length - 2];
    viewLastProfile(entity);
  };

  // Presence of open prop determines whether or not DockControl is being used as a controlled component or not.
  // If no open prop, manages own state and uses own click handlers. If open prop, all those have to be passed in manually.

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles || {},
    className: open !== null ? (0, _concat["default"])(_context = "dock-control ".concat(open ? "open" : "closed", " ")).call(_context, hidden ? "hide" : "available") : "dock-control available ".concat(primaryOpen ? "open" : "closed")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles && styles.backgroundColor ? {
      backgroundColor: styles.backgroundColor
    } : {},
    className: "dock-control-inner ".concat(className)
  }, (0, _isArray["default"])(children) ? children[0] : children, children[1] !== undefined && /*#__PURE__*/_react["default"].createElement("div", {
    style: open ? {} : {
      height: "calc(100vh - ".concat(WavCamOpen ? "288px" : "48px", ")")
    },
    className: open !== null ? (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "secondary-panel scrollbar ".concat(secondaryClassName, " ")).call(_context3, secondaryOpen ? "list-open" : "closed", " ")).call(_context2, open ? "" : "attached") : (0, _concat["default"])(_context4 = (0, _concat["default"])(_context5 = "secondary-panel scrollbar ".concat(secondaryClassName, " ")).call(_context5, secondaryOpenState ? "list-open" : "closed", " ")).call(_context4, open ? "" : "attached")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "profile-wrapper"
  }, history.length >= 2 && /*#__PURE__*/_react["default"].createElement("div", {
    id: "profile-navigation"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleLastEntityClick,
    startIcon: dir === "ltr" ? /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
      style: {
        marginLeft: 0
      }
    }) : null,
    endIcon: dir === "rtl" ? /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
      style: {
        marginRight: 0
      }
    }) : null,
    style: {
      width: "100%",
      textAlign: "left",
      justifyContent: "unset"
    }
  }, history[history.length - 2].name.toUpperCase())), /*#__PURE__*/_react["default"].createElement("div", {
    className: "profile-close-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: closeSecondary
  }, /*#__PURE__*/_react["default"].createElement(_Close["default"], null))), children[1])), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    className: open !== null ? "hide-dock ".concat(open && secondaryOpen ? "profile-open" : "profile-closed") : "hide-dock ".concat(primaryOpen && secondaryOpenState ? "profile-open" : "profile-closed"),
    onClick: open !== null ? onArrowClick : togglePrimaryOpen
  }, /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
    className: "close-arrow"
  }))))), /*#__PURE__*/_react["default"].createElement("div", {
    style: secondaryStyles || {},
    className: open !== null ? "dock-control-sidebar  ".concat(open ? "closed" : "open") : "dock-control-sidebar ".concat(primaryOpen ? "closed" : "open")
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, null, /*#__PURE__*/_react["default"].createElement(_ViewList["default"], {
    onClick: open !== null ? onPanelClick : togglePrimaryOpen
  })), actionButtons));
};
var _default = DockControl;
exports["default"] = _default;