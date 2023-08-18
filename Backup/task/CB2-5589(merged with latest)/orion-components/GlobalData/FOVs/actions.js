"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.unsubscribeFOVs = exports.subscribeFOVs = void 0;
var _clientAppCore = require("client-app-core");
var _Actions = require("../Actions");
var _size = _interopRequireDefault(require("lodash/size"));
var _each = _interopRequireDefault(require("lodash/each"));
/*
 * Subscribe to camera FOVs
 * @param cameraIds: array of camera ids to grab FOVs for
 */
var subscribeFOVs = function subscribeFOVs(cameraIds) {
  return function (dispatch, getState) {
    var fovs = getState().globalData.fovs;
    if (fovs && fovs.subscription) {
      dispatch((0, _Actions.unsubscribeGlobalFeed)("fovs", fovs.subscription));
    }
    _clientAppCore.cameraService.streamFOVs(cameraIds, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      switch (response.type) {
        case "initial-batch":
          {
            var data = response.changes;
            dispatch((0, _Actions.dataBatchReceived)(data, "fovs", "all", "parentEntity"));
          }
          break;
        case "add":
        case "change":
          dispatch((0, _Actions.dataReceived)(response.new_val, "fovs", "all", "parentEntity"));
          break;
        case "remove":
          dispatch((0, _Actions.removeData)(response.old_val.parentEntity, "fovs", "all"));
          break;
        default:
          break;
      }
    }).then(function (subscription) {
      dispatch((0, _Actions.setDataSubscription)(subscription.channel, "fovs", "all"));
    });
  };
};

/*
 * Unsubscribe (remove data) from camera FOVs
 * @param cameraIds: array of camera ids to clear data for
 * @param subscription: subscription channel for FOV stream
 */
exports.subscribeFOVs = subscribeFOVs;
var unsubscribeFOVs = function unsubscribeFOVs(cameraIds, subscription) {
  return function (dispatch, getState) {
    var fovCount = (0, _size["default"])(getState().globalData.fovs.data);
    if (cameraIds) {
      // Passing false for deleting arg to prevent context state clearing and profile closing
      (0, _each["default"])(cameraIds, function (id) {
        return dispatch((0, _Actions.removeData)(id, "fovs", "all", false));
      });
      // If there are no more FOVs in the data, unsubscribe
      if (cameraIds.length >= fovCount) {
        dispatch((0, _Actions.unsubscribeGlobalFeed)("fovs", subscription));
      }
    }
  };
};
exports.unsubscribeFOVs = unsubscribeFOVs;