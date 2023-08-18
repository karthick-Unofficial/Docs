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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _ChevronLeft = _interopRequireDefault(require("@mui/icons-material/ChevronLeft"));
var _ChevronRight = _interopRequireDefault(require("@mui/icons-material/ChevronRight"));
var _ViewList = _interopRequireDefault(require("@mui/icons-material/ViewList"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _jquery = _interopRequireDefault(require("jquery"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Selectors = require("./Selectors");
var _Actions = require("../AppState/Actions");
var actionCreators = _interopRequireWildcard(require("./Actions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context11, _context12; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context11 = ownKeys(Object(source), !0)).call(_context11, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context12 = ownKeys(Object(source))).call(_context12, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ContextPanelWrapper = function ContextPanelWrapper(_ref) {
  var dir = _ref.dir,
    hidden = _ref.hidden,
    children = _ref.children,
    actionButtons = _ref.actionButtons,
    className = _ref.className,
    secondaryClassName = _ref.secondaryClassName,
    secondaryCloseAction = _ref.secondaryCloseAction,
    readOnly = _ref.readOnly,
    mobileToggle = _ref.mobileToggle;
  var panelState = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.contextPanelState)(state);
  });
  var primaryOpen = panelState ? panelState.primaryOpen : null;
  var secondaryOpen = panelState && ((0, _jquery["default"])(".secondary-panel").length || (0, _jquery["default"])(".secondary-panelRTL").length) ? panelState.secondaryOpen : null;
  var history = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.viewingHistorySelector)(state);
  });
  var context = (0, _reactRedux.useSelector)(function (state) {
    return Boolean((0, _Selectors.selectedContextSelector)(state));
  });
  var mapVisible = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState ? state.mapState.baseMap.visible : false;
  });
  var WavCamOpen = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.dockData.WavCam;
  });
  return /*#__PURE__*/_react["default"].createElement(ContextPanel, {
    panelState: panelState,
    primaryOpen: primaryOpen,
    secondaryOpen: secondaryOpen,
    history: history,
    context: context,
    mapVisible: mapVisible,
    WavCamOpen: WavCamOpen,
    dir: dir,
    hidden: hidden,
    children: children,
    actionButtons: actionButtons,
    className: className,
    secondaryClassName: secondaryClassName,
    secondaryCloseAction: secondaryCloseAction,
    readOnly: readOnly,
    mobileToggle: mobileToggle
  });
};
var ContextPanel = function ContextPanel(props) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10;
  var dispatch = (0, _reactRedux.useDispatch)();
  var primaryOpen = props.primaryOpen,
    secondaryOpen = props.secondaryOpen,
    history = props.history,
    context = props.context,
    mapVisible = props.mapVisible,
    WavCamOpen = props.WavCamOpen,
    dir = props.dir,
    hidden = props.hidden,
    children = props.children,
    actionButtons = props.actionButtons,
    className = props.className,
    secondaryClassName = props.secondaryClassName,
    secondaryCloseAction = props.secondaryCloseAction,
    readOnly = props.readOnly,
    mobileToggle = props.mobileToggle;
  var expandSecondary = actionCreators.expandSecondary,
    shrinkSecondary = actionCreators.shrinkSecondary,
    viewPrevious = actionCreators.viewPrevious,
    clearViewingHistory = actionCreators.clearViewingHistory,
    _closeSecondary = actionCreators._closeSecondary,
    openPrimary = actionCreators.openPrimary,
    openSecondary = actionCreators.openSecondary,
    closePrimary = actionCreators.closePrimary,
    closeSecondary = actionCreators.closeSecondary;
  var _useState = (0, _react.useState)({
      secondaryExpand: false,
      secondaryWidth: null
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  (0, _react.useEffect)(function () {
    var primaryWidth = dir && dir == "rtl" ? (0, _jquery["default"])(".dock-controlRTL").outerWidth() / 2 : (0, _jquery["default"])(".dock-control").outerWidth() / 2;
    // -- set initial offset when app starts with primary open
    if (primaryOpen) {
      dispatch((0, _Actions.setMapOffset)(primaryWidth));
    }
  }, []);
  var toggleSecondaryExpand = function toggleSecondaryExpand() {
    setState(function (prevState) {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        secondaryExpand: !state.secondaryExpand
      });
    });
    if (!state.secondaryExpand === true) {
      if (context) dispatch(expandSecondary());
    } else if (!state.secondaryExpand === false) {
      if (context) dispatch(shrinkSecondary());
    }
  };
  var handleLastEntityClick = function handleLastEntityClick() {
    dispatch(viewPrevious(history));
  };
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    var primaryWidth = dir && dir === "rtl" ? (0, _jquery["default"])(".dock-controlRTL").outerWidth() / 2 : (0, _jquery["default"])(".dock-control").outerWidth() / 2;
    var secondaryWidth = dir && dir === "rtl" ? (0, _jquery["default"])(".secondary-panelRTL").length ? (0, _jquery["default"])(".secondary-panelRTL").outerWidth() / 2 : 0 : (0, _jquery["default"])(".secondary-panel").length ? (0, _jquery["default"])(".secondary-panel").outerWidth() / 2 : 0;
    if (prevProps) {
      if (prevProps.primaryOpen && !primaryOpen) {
        dispatch((0, _Actions.setMapOffset)(-primaryWidth));
      }
      if (!prevProps.primaryOpen && primaryOpen) {
        dispatch((0, _Actions.setMapOffset)(primaryWidth));
      }
      if (!prevProps.secondaryOpen && secondaryOpen) {
        setState(function (prevProps) {
          return _objectSpread(_objectSpread({}, prevProps), {}, {
            secondaryWidth: secondaryWidth
          });
        });
        dispatch((0, _Actions.setMapOffset)(secondaryWidth));
      }
      if (prevProps.secondaryOpen && !secondaryOpen) {
        dispatch((0, _Actions.setMapOffset)(secondaryWidth ? -secondaryWidth : state.secondaryWidth ? -state.secondaryWidth : 0));
        dispatch(clearViewingHistory());
        setState(function (prevProps) {
          return _objectSpread(_objectSpread({}, prevProps), {}, {
            secondaryWidth: 0
          });
        });
      }
      // -- if secondary already open and secondary width changes, update offset
      if (prevProps.secondaryOpen && secondaryOpen && secondaryWidth !== state.secondaryWidth) {
        var offsetDiff = secondaryWidth - state.secondaryWidth;
        setState(function (prevProps) {
          return _objectSpread(_objectSpread({}, prevProps), {}, {
            secondaryWidth: secondaryWidth
          });
        });
        dispatch((0, _Actions.setMapOffset)(offsetDiff));
      }
    }
  }, [props]);
  var handleMobileToggle = function handleMobileToggle(toggle) {
    if (toggle === "open") {
      dispatch(openPrimary());
      if (context) dispatch(openSecondary());
    } else if (toggle === "close") {
      dispatch(closePrimary());
      if (context) dispatch(_closeSecondary());
    }
  };
  var secondaryExpand = state.secondaryExpand;
  var showMobileToggle = mapVisible && (0, _jquery["default"])(window).width() <= 1023;
  var secondaryStyling = {
    height: "calc(100vh - ".concat(WavCamOpen ? "288px" : "48px", ")")
  };
  if (readOnly) dir == "rtl" ? secondaryStyling.right = secondaryExpand ? -600 : -360 : secondaryStyling.left = secondaryExpand ? -600 : -360;
  var styles = {
    dockControl: _objectSpread(_objectSpread({}, dir === "ltr" && {
      left: readOnly ? -360 : 0
    }), dir === "rtl" && {
      right: readOnly ? -360 : 0
    }),
    chevronRight: _objectSpread({}, dir === "rtl" && {
      right: "-150%"
    })
  };
  return !hidden ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.dockControl,
    className: (0, _concat["default"])(_context = "".concat(dir && dir == "rtl" ? "dock-controlRTL" : "dock-control", " ")).call(_context, primaryOpen || showMobileToggle && secondaryOpen ? "open" : "closed")
  }, showMobileToggle && /*#__PURE__*/_react["default"].createElement("div", {
    id: "toggle-mobile"
  }, primaryOpen || secondaryOpen ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: function onClick() {
      return handleMobileToggle("close");
    }
  }, (0, _i18n.getTranslation)("global.contextPanel.viewMap")) : /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: function onClick() {
      return handleMobileToggle("open");
    }
  }, context ? (0, _i18n.getTranslation)("global.contextPanel.openProfile") : (0, _i18n.getTranslation)("global.contextPanel.openListPanel"))), mobileToggle && mobileToggle.visible && /*#__PURE__*/_react["default"].createElement("div", {
    id: "toggle-mobile"
  }, primaryOpen || secondaryOpen ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: function onClick() {
      return handleMobileToggle("close");
    }
  }, mobileToggle.closeLabel) : /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: function onClick() {
      return handleMobileToggle("open");
    }
  }, mobileToggle.openLabel)), !readOnly && /*#__PURE__*/_react["default"].createElement("div", {
    className: "dock-control-inner ".concat(className)
  }, (0, _isArray["default"])(children) ? children[0] : children, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    className: (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = "\n\t\t\t\t\t\t\t\t".concat(dir && dir == "rtl" ? "hide-dockRTL" : "hide-dock", "\n\t\t\t\t\t\t\t\t")).call(_context4, secondaryOpen ? "profile-open" : "profile-closed", "\n\t\t\t\t\t\t\t\t")).call(_context3, primaryOpen ? "" : "arrow-removed", "\n\t\t\t\t\t\t\t\t")).call(_context2, state.secondaryExpand ? "arrow-expanded" : ""),
    onClick: function onClick() {
      return dispatch(closePrimary());
    },
    style: {
      borderRadius: "unset",
      height: 48
    }
  }, dir && dir == "rtl" ? /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], {
    className: "close-arrow ".concat(primaryOpen ? "" : "close-arrow-removed"),
    color: "#fff",
    style: styles.chevronRight
  }) : /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
    className: "close-arrow ".concat(primaryOpen ? "" : "close-arrow-removed"),
    color: "#fff"
  }))))), children[1] && /*#__PURE__*/_react["default"].createElement("div", {
    style: secondaryStyling,
    className: (0, _concat["default"])(_context5 = (0, _concat["default"])(_context6 = (0, _concat["default"])(_context7 = (0, _concat["default"])(_context8 = (0, _concat["default"])(_context9 = "".concat(dir && dir == "rtl" ? "secondary-panelRTL" : "secondary-panel", " scrollbar ")).call(_context9, secondaryClassName, "\n\t\t\t\t\t\t\t")).call(_context8, secondaryOpen ? "open" : "closed", "\n\t\t\t\t\t\t\t")).call(_context7, primaryOpen ? "list-open" : "list-closed", "\n\t\t\t\t\t\t\t")).call(_context6, secondaryExpand ? "secondary-expanded" : "", "\n\t\t\t\t\t\t\t")).call(_context5, showMobileToggle ? "mobile" : "desktop", " ")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "profile-wrapper"
  }, history.length >= 2 && /*#__PURE__*/_react["default"].createElement("div", {
    id: "profile-navigation"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleLastEntityClick,
    style: {
      width: "100%",
      height: "36px",
      textAlign: "left",
      justifyContent: "unset"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", null, dir && dir == "rtl" ? /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], {
    style: {
      marginLeft: 0,
      verticalAlign: "middle"
    }
  }) : /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
    style: {
      marginLeft: 0,
      verticalAlign: "middle"
    }
  }), /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      verticalAlign: "middle",
      fontSize: "14px",
      fontWeight: "bold",
      padding: "0 16px 0 8px",
      letterSpacing: "0px"
    }
  }, history[1].name ? history[1].name.toString().toUpperCase() : history[1].id.toString().toUpperCase())))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "profile-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: toggleSecondaryExpand,
    sx: {
      color: "#fff"
    }
  }, state.secondaryExpand && (dir && dir == "rtl" ? /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], {
    className: "close-expand"
  }) : /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
    className: "close-expand"
  })), !state.secondaryExpand && (dir && dir == "rtl" ? /*#__PURE__*/_react["default"].createElement(_ChevronLeft["default"], {
    className: "open-expand"
  }) : /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], {
    className: "open-expand"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "profile-close-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: !secondaryCloseAction ? function () {
      return dispatch(closeSecondary());
    } : function () {
      dispatch(closeSecondary());
      dispatch(secondaryCloseAction());
    },
    sx: {
      color: "#fff"
    }
  }, /*#__PURE__*/_react["default"].createElement(_Close["default"], null))), children[1])), /*#__PURE__*/_react["default"].createElement("div", {
    className: (0, _concat["default"])(_context10 = "".concat(dir && dir == "rtl" ? "dock-controlRTL-sidebar" : "dock-control-sidebar", " ")).call(_context10, primaryOpen ? "closed" : "open")
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: function onClick() {
      return dispatch(openPrimary());
    }
  }, /*#__PURE__*/_react["default"].createElement(_ViewList["default"], {
    color: "#fff"
  })), actionButtons && (0, _map["default"])(actionButtons).call(actionButtons, function (button, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      style: {
        color: "#fff"
      },
      key: index
    }, button);
  }))) : /*#__PURE__*/_react["default"].createElement("div", null);
};
ContextPanel.displayName = "ContextPanel";
var _default = ContextPanelWrapper;
exports["default"] = _default;