"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.showFOVs = exports.setMapStyle = exports.setLayerState = exports.hideFOVs = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _Actions = require("orion-components/AppState/Actions");
var _Actions2 = require("orion-components/GlobalData/Actions");
var _keys = _interopRequireDefault(require("lodash/keys"));
// TODO: Grab app argument from state
var setMapStyle = function setMapStyle(style) {
  return function (dispatch, getState) {
    var appId = getState().application.appId;
    if (!window.api) {
      dispatch((0, _Actions.updatePersistedState)(appId, "mapSettings", {
        mapStyle: style
      }));
    } else {
      var mapSettingsState = getState().appState.persisted.mapSettings || {};
      mapSettingsState["mapStyle"] = style;
      dispatch((0, _Actions.setLocalAppState)("mapSettings", mapSettingsState));
    }
  };
};

// TODO: Grab app argument from state
exports.setMapStyle = setMapStyle;
var setLayerState = function setLayerState(keyVal) {
  return function (dispatch) {
    dispatch((0, _Actions.updatePersistedState)("facilities-app", "mapSettings", keyVal));
  };
};
exports.setLayerState = setLayerState;
var hideFOVs = function hideFOVs() {
  return function (dispatch, getState) {
    var fovs = getState().globalData.fovs;
    if (fovs) {
      dispatch((0, _Actions2.unsubscribeFOVs)((0, _keys["default"])(fovs.data), fovs.subscription));
    }
    dispatch((0, _Actions.updatePersistedState)("map-app", "showAllFOVs", {
      showAllFOVs: false
    }));
  };
};
exports.hideFOVs = hideFOVs;
var showFOVs = function showFOVs(cameraFeeds) {
  return function (dispatch, getState) {
    var _context;
    (0, _forEach["default"])(_context = (0, _values["default"])(cameraFeeds)).call(_context, function (feed) {
      dispatch((0, _Actions2.subscribeFOVs)((0, _keys["default"])(getState().globalData[feed.feedId].data)));
    });
    dispatch((0, _Actions.updatePersistedState)("map-app", "showAllFOVs", {
      showAllFOVs: true
    }));
  };
};
exports.showFOVs = showFOVs;