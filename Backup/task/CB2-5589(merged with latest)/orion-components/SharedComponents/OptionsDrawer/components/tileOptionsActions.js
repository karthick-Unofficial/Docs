"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.setMapStyle = void 0;
var _Actions = require("orion-components/AppState/Actions");
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
exports.setMapStyle = setMapStyle;