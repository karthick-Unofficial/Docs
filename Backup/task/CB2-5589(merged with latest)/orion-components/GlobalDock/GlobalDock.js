"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _mdiMaterialUi = require("mdi-material-ui");
var _ErrorBoundary = _interopRequireDefault(require("../ErrorBoundary"));
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./dockActions"));
var _keys = _interopRequireDefault(require("lodash/keys"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  appId: _propTypes["default"].string.isRequired,
  dockDirection: _propTypes["default"].string.isRequired,
  globalDockState: _propTypes["default"].object,
  panelsConfig: _propTypes["default"].object.isRequired,
  panelsToHide: _propTypes["default"].array,
  exclusiveModePanel: _propTypes["default"].string,
  reportWidth: _propTypes["default"].func,
  reportAvailablePanels: _propTypes["default"].func,
  reportCurrentPanel: _propTypes["default"].func,
  openPanel: _propTypes["default"].func.isRequired,
  closePanel: _propTypes["default"].func.isRequired,
  moveToOtherDock: _propTypes["default"].func.isRequired,
  saveDockState: _propTypes["default"].func.isRequired
};
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    collapsedPaper: {
      marginTop: 48,
      width: 0,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    miniPaper: {
      marginTop: 48,
      width: 60,
      boxShadow: "6px 0px 8px #0000007B, -6px 0px 8px #0000007B",
      zIndex: 550,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    expandedPaper: {
      marginTop: 48,
      width: 560,
      boxShadow: "6px 0px 8px #0000007B, -6px 0px 8px #0000007B",
      zIndex: 550,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    exclusivePaper: {
      marginTop: 48,
      width: 500,
      boxShadow: "6px 0px 8px #0000007B, -6px 0px 8px #0000007B",
      zIndex: 550,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  };
});
var GlobalDock = function GlobalDock(_ref) {
  var appId = _ref.appId,
    dockDirection = _ref.dockDirection,
    panelsConfig = _ref.panelsConfig,
    panelsToHide = _ref.panelsToHide,
    exclusiveModePanel = _ref.exclusiveModePanel,
    reportWidth = _ref.reportWidth,
    reportAvailablePanels = _ref.reportAvailablePanels,
    reportCurrentPanel = _ref.reportCurrentPanel;
  var dispatch = (0, _reactRedux.useDispatch)();
  var openPanel = actionCreators.openPanel,
    closePanel = actionCreators.closePanel,
    moveToOtherDock = actionCreators.moveToOtherDock,
    saveDockState = actionCreators.saveDockState;
  var globalDockState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState && state.appState.persisted && state.appState.persisted.globalDockState;
  });
  var getCurrentPanel = function getCurrentPanel() {
    if (!globalDockState) {
      return null;
    }
    return dockDirection === "left" ? globalDockState.leftDock.currentPanel : globalDockState.rightDock.currentPanel;
  };
  var getAvailablePanels = function getAvailablePanels() {
    var dockPanels = dockDirection === "left" ? globalDockState.leftDock.availablePanels : globalDockState.rightDock.availablePanels;
    if (!panelsToHide || panelsToHide.length === 0) {
      return dockPanels;
    } else {
      return (0, _filter["default"])(dockPanels).call(dockPanels, function (panel) {
        return !(0, _includes["default"])(panelsToHide).call(panelsToHide, panel);
      });
    }
  };
  var hasDiscrepancy = function hasDiscrepancy() {
    // Discrepancies might exist if the persisted state conflicts with the parameters passed
    // to the control. In such cases, we should avoid rendering.
    if (!panelsToHide || panelsToHide.length === 0) {
      return false;
    }
    var currentPanel = getCurrentPanel();
    if ((0, _includes["default"])(panelsToHide).call(panelsToHide, currentPanel)) {
      return true;
    }
    return false;
  };
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    currentPanel = _useState2[0],
    setCurrentPanel = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    availablePanels = _useState4[0],
    setAvailablePanels = _useState4[1];
  (0, _react.useEffect)(function () {
    if (!globalDockState) {
      // We setup the default state
      var _availablePanels = (0, _keys["default"])(panelsConfig);
      var newState = {
        leftDock: {
          availablePanels: _availablePanels,
          currentPanel: null
        },
        rightDock: {
          availablePanels: [],
          currentPanel: null
        }
      };
      dispatch(saveDockState(appId, newState));
    } else {
      var _context;
      // We check for any new panels not added to the dock state, we add them to left dock
      var newPanels = [];
      (0, _forEach["default"])(_context = (0, _keys["default"])(panelsConfig)).call(_context, function (panel) {
        var _context2, _context3;
        if (!(0, _includes["default"])(_context2 = globalDockState.leftDock.availablePanels).call(_context2, panel) && !(0, _includes["default"])(_context3 = globalDockState.rightDock.availablePanels).call(_context3, panel)) {
          newPanels.push(panel);
        }
      });
      if (newPanels.length > 0) {
        var _context4;
        var _newState = _objectSpread(_objectSpread({}, globalDockState), {}, {
          leftDock: _objectSpread(_objectSpread({}, globalDockState.leftDock), {}, {
            availablePanels: (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(globalDockState.leftDock.availablePanels), newPanels)
          })
        });
        dispatch(saveDockState(appId, _newState));
      }
    }
  }, []);
  (0, _react.useEffect)(function () {
    if (!globalDockState) {
      return;
    }
    var newAvailablePanels = getAvailablePanels();
    if (!(0, _isEqual["default"])(availablePanels, newAvailablePanels)) {
      setAvailablePanels(newAvailablePanels);
      if (reportAvailablePanels) {
        reportAvailablePanels(newAvailablePanels);
      }
    }
    var newCurrentPanel = getCurrentPanel();
    if (newCurrentPanel !== null && !(0, _includes["default"])(newAvailablePanels).call(newAvailablePanels, newCurrentPanel)) {
      dispatch(closePanel(appId, newCurrentPanel));
    } else if (currentPanel !== newCurrentPanel) {
      setCurrentPanel(newCurrentPanel);
      if (reportCurrentPanel) {
        reportCurrentPanel(newCurrentPanel);
      }
    }
  }, [globalDockState, panelsToHide]);
  (0, _react.useEffect)(function () {
    if (!reportWidth) {
      return;
    }
    if (exclusiveModePanel) {
      if (exclusiveModePanel === currentPanel) {
        reportWidth(500);
      } else {
        reportWidth(0);
      }
    } else {
      if (currentPanel) {
        reportWidth(560);
      } else if (availablePanels.length > 0) {
        reportWidth(60);
      } else {
        reportWidth(0);
      }
    }
  }, [currentPanel, availablePanels, exclusiveModePanel]);
  var discrepanciesExist = hasDiscrepancy();
  var MoveToDockIcon;
  var moveToDockTooltip;
  if (dockDirection === "left") {
    MoveToDockIcon = _mdiMaterialUi.DockRight;
    moveToDockTooltip = "Dock Right";
  } else {
    MoveToDockIcon = _mdiMaterialUi.DockLeft;
    moveToDockTooltip = "Dock Left";
  }
  var _useStyles = useStyles(),
    collapsedPaper = _useStyles.collapsedPaper,
    miniPaper = _useStyles.miniPaper,
    expandedPaper = _useStyles.expandedPaper,
    exclusivePaper = _useStyles.exclusivePaper;
  var paperStyle = collapsedPaper;
  if (exclusiveModePanel) {
    if (exclusiveModePanel === currentPanel) {
      paperStyle = exclusivePaper;
    }
  } else if (currentPanel) {
    paperStyle = expandedPaper;
  } else if (availablePanels && availablePanels.length > 0) {
    paperStyle = miniPaper;
  }
  var dockContentStyle = exclusiveModePanel ? {
    overflow: "scroll",
    height: "calc(100vh - 48px)"
  } : {
    overflow: "scroll",
    height: "calc(100vh - 116px)"
  };
  var renderPanelArea = function renderPanelArea() {
    var Panel = panelsConfig[currentPanel].panel;
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "dockArea"
    }, !exclusiveModePanel && /*#__PURE__*/_react["default"].createElement("div", {
      className: "dockHeader"
    }, /*#__PURE__*/_react["default"].createElement("h5", {
      className: "title"
    }, panelsConfig[currentPanel].header), /*#__PURE__*/_react["default"].createElement(_material.Tooltip, {
      title: moveToDockTooltip,
      placement: "bottom"
    }, /*#__PURE__*/_react["default"].createElement(MoveToDockIcon, {
      className: "moveToDockIcon",
      onClick: function onClick() {
        return dispatch(moveToOtherDock(appId, globalDockState, dockDirection, currentPanel));
      }
    })), /*#__PURE__*/_react["default"].createElement(_material.Tooltip, {
      title: "Close",
      placement: "bottom"
    }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.Close, {
      className: "close",
      onClick: function onClick() {
        return dispatch(closePanel(appId, currentPanel));
      }
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "dockContent",
      style: dockContentStyle
    }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(Panel, null))));
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Drawer, {
    variant: "persistent",
    anchor: dockDirection,
    classes: {
      paper: paperStyle
    },
    open: !discrepanciesExist
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "globalDock"
  }, currentPanel && dockDirection === "right" && (!exclusiveModePanel || exclusiveModePanel === currentPanel) && renderPanelArea(), !exclusiveModePanel && /*#__PURE__*/_react["default"].createElement("div", {
    className: "iconBar"
  }, (0, _map["default"])(availablePanels).call(availablePanels, function (panel) {
    var Icon = panelsConfig[panel].icon;
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: panel,
      className: "iconContainer ".concat(currentPanel === panel ? "selected" : "")
    }, /*#__PURE__*/_react["default"].createElement(_material.Tooltip, {
      title: panelsConfig[panel].header,
      placement: "bottom"
    }, /*#__PURE__*/_react["default"].createElement(Icon, {
      className: "icon",
      onClick: function onClick() {
        var callback = panelsConfig[panel].callback;
        if (callback) {
          callback();
        } else {
          dispatch(openPanel(appId, panel));
        }
      }
    })));
  })), currentPanel && dockDirection === "left" && (!exclusiveModePanel || exclusiveModePanel === currentPanel) && renderPanelArea()));
};
GlobalDock.propTypes = propTypes;
var _default = GlobalDock;
exports["default"] = _default;