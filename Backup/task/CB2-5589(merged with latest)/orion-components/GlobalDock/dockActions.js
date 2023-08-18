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
exports.saveDockState = exports.openPanel = exports.moveToOtherDock = exports.closePanel = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _Actions = require("../AppState/Actions");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context7, _context8; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context7 = ownKeys(Object(source), !0)).call(_context7, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context8 = ownKeys(Object(source))).call(_context8, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var dockStateKey = "globalDockState";
var openPanel = function openPanel(appId, panelName) {
  return function (dispatch, getState) {
    var _context, _context2;
    var state = getState();
    var globalDockState = state.appState && state.appState.persisted && state.appState.persisted.globalDockState;
    if (!globalDockState) {
      return;
    }
    var newDockState = null;
    if (globalDockState && globalDockState.leftDock && globalDockState.leftDock.availablePanels && (0, _includes["default"])(_context = globalDockState.leftDock.availablePanels).call(_context, panelName)) {
      if (globalDockState.leftDock.currentPanel !== panelName) {
        newDockState = _objectSpread(_objectSpread({}, globalDockState), {}, {
          leftDock: _objectSpread(_objectSpread({}, globalDockState.leftDock), {}, {
            currentPanel: panelName
          })
        });
      }
    } else if (globalDockState && globalDockState.rightDock && globalDockState.rightDock.availablePanels && (0, _includes["default"])(_context2 = globalDockState.rightDock.availablePanels).call(_context2, panelName)) {
      if (globalDockState.rightDock.currentPanel !== panelName) {
        newDockState = _objectSpread(_objectSpread({}, globalDockState), {}, {
          rightDock: _objectSpread(_objectSpread({}, globalDockState.rightDock), {}, {
            currentPanel: panelName
          })
        });
      }
    }
    if (newDockState) {
      dispatch((0, _Actions.updatePersistedState)(appId, dockStateKey, newDockState, false));
    }
  };
};
exports.openPanel = openPanel;
var closePanel = function closePanel(appId, panelName) {
  return function (dispatch, getState) {
    var state = getState();
    var globalDockState = state.appState && state.appState.persisted && state.appState.persisted.globalDockState;
    if (!globalDockState) {
      return;
    }
    var newDockState;
    if (globalDockState && globalDockState.leftDock && globalDockState.leftDock.currentPanel === panelName) {
      newDockState = _objectSpread(_objectSpread({}, globalDockState), {}, {
        leftDock: _objectSpread(_objectSpread({}, globalDockState.leftDock), {}, {
          currentPanel: null
        })
      });
    } else if (globalDockState && globalDockState.rightDock && globalDockState.rightDock.currentPanel === panelName) {
      newDockState = _objectSpread(_objectSpread({}, globalDockState), {}, {
        rightDock: _objectSpread(_objectSpread({}, globalDockState.rightDock), {}, {
          currentPanel: null
        })
      });
    } else {
      return;
    }
    dispatch((0, _Actions.updatePersistedState)(appId, dockStateKey, newDockState, false));
  };
};
exports.closePanel = closePanel;
var moveToOtherDock = function moveToOtherDock(appId, globalDockState, dockDirection, panelName) {
  return function (dispatch) {
    var newDockState;
    if (dockDirection === "left") {
      var _context3, _context4;
      var newLeftPanels = (0, _filter["default"])(_context3 = globalDockState.leftDock.availablePanels).call(_context3, function (panel) {
        return panel !== panelName;
      });
      newDockState = {
        leftDock: {
          availablePanels: newLeftPanels,
          currentPanel: null
        },
        rightDock: {
          availablePanels: (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(globalDockState.rightDock.availablePanels), [panelName]),
          currentPanel: panelName
        }
      };
    } else {
      var _context5, _context6;
      var newRightPanels = (0, _filter["default"])(_context5 = globalDockState.rightDock.availablePanels).call(_context5, function (panel) {
        return panel !== panelName;
      });
      newDockState = {
        leftDock: {
          availablePanels: (0, _concat["default"])(_context6 = []).call(_context6, (0, _toConsumableArray2["default"])(globalDockState.leftDock.availablePanels), [panelName]),
          currentPanel: panelName
        },
        rightDock: {
          availablePanels: newRightPanels,
          currentPanel: null
        }
      };
    }
    dispatch((0, _Actions.updatePersistedState)(appId, dockStateKey, newDockState, false));
  };
};
exports.moveToOtherDock = moveToOtherDock;
var saveDockState = function saveDockState(appId, globalDockState) {
  return function (dispatch) {
    dispatch((0, _Actions.updatePersistedState)(appId, dockStateKey, globalDockState, false));
  };
};
exports.saveDockState = saveDockState;