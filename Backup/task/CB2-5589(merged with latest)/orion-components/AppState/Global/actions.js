"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalAppState = void 0;
exports.updateGlobalUserAppSettings = updateGlobalUserAppSettings;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
var _Actions = require("orion-components/i18n/Actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var globalAppStateReceived = function globalAppStateReceived(appState) {
  return {
    type: t.APP_SETTINGS_STATE_RECEIVED,
    payload: appState
  };
};
var updateLocalUserAppSettings = function updateLocalUserAppSettings(update) {
  return {
    type: t.LOCAL_APP_SETTINGS_UPDATED,
    payload: update
  };
};

/**
 * Retrieve a user's appSettings and set in redux state
 */
var getGlobalAppState = function getGlobalAppState() {
  return function (dispatch) {
    return new _promise["default"](function (resolve) {
      _clientAppCore.userService.getAppSettings(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          dispatch(globalAppStateReceived(result));
          dispatch((0, _Actions.setLocaleWithFallback)(result.locale));
          resolve();
        }
      });
    });
  };
};

/**
 * Update a user's appSettings in local redux state and in the database
 * @param {object} update -- Update object
 */
exports.getGlobalAppState = getGlobalAppState;
function updateGlobalUserAppSettings(update) {
  return function (dispatch) {
    _clientAppCore.userService.updateAppSettings(update, function (err, res) {
      if (err) {
        console.log(err, res);
      } else {
        dispatch(updateLocalUserAppSettings(update));
      }
    });
  };
}