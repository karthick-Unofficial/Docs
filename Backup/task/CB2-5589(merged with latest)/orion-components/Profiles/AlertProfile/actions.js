"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "addCameraToDockMode", {
  enumerable: true,
  get: function get() {
    return _index.addCameraToDockMode;
  }
});
_Object$defineProperty(exports, "addSpotlight", {
  enumerable: true,
  get: function get() {
    return _Actions4.addSpotlight;
  }
});
exports.closeAlertProfile = void 0;
_Object$defineProperty(exports, "closeDialog", {
  enumerable: true,
  get: function get() {
    return _Actions3.closeDialog;
  }
});
_Object$defineProperty(exports, "closeNotification", {
  enumerable: true,
  get: function get() {
    return _actions2.closeNotification;
  }
});
exports.getCamerasInRangeOfGeo = exports.getActivityDetails = void 0;
_Object$defineProperty(exports, "loadProfile", {
  enumerable: true,
  get: function get() {
    return _Actions2.loadProfile;
  }
});
exports.openAlertProfile = void 0;
_Object$defineProperty(exports, "openDialog", {
  enumerable: true,
  get: function get() {
    return _Actions3.openDialog;
  }
});
_Object$defineProperty(exports, "reopenNotification", {
  enumerable: true,
  get: function get() {
    return _actions2.reopenNotification;
  }
});
_Object$defineProperty(exports, "setCameraPriority", {
  enumerable: true,
  get: function get() {
    return _index.setCameraPriority;
  }
});
_Object$defineProperty(exports, "unsubscribeFromFeed", {
  enumerable: true,
  get: function get() {
    return _Actions.unsubscribeFromFeed;
  }
});
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
var _Actions = require("orion-components/ContextualData/Actions");
var _actions = require("orion-components/Dock/actions");
var _actions2 = require("orion-components/Dock/Notifications/actions");
var _Actions2 = require("orion-components/ContextPanel/Actions");
var _index = require("orion-components/Dock/Actions/index.js");
var _Actions3 = require("orion-components/AppState/Actions");
var _Actions4 = require("orion-components/Map/Tools/Actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var getActivityDetails = function getActivityDetails(id) {
  return function (dispatch) {
    _clientAppCore.activityService.getActivityDetails(id, function (err, response) {
      if (err) {
        console.log("ERR", err);
      } else {
        dispatch((0, _Actions.updateContext)(id, response));
      }
    });
  };
};
exports.getActivityDetails = getActivityDetails;
var getCamerasInRangeOfGeo = function getCamerasInRangeOfGeo(contextId, geometry) {
  return function (dispatch) {
    _clientAppCore.cameraService.getCamerasInRangeOfGeo(geometry, function (err, response) {
      if (err) {
        console.log("ERR", err);
      } else {
        dispatch((0, _Actions.updateContextProperty)(contextId, "camerasInRange", response));
      }
    });
  };
};
exports.getCamerasInRangeOfGeo = getCamerasInRangeOfGeo;
var _openAlertProfile = function _openAlertProfile(id) {
  return {
    type: t.OPEN_ALERT_PROFILE,
    payload: {
      id: id
    }
  };
};
var _closeAlertProfile = function _closeAlertProfile() {
  return {
    type: t.CLOSE_ALERT_PROFILE
  };
};
var openAlertProfile = function openAlertProfile(notification, forReplay) {
  return function (dispatch, getState) {
    var id = notification.id,
      activityId = notification.activityId,
      geometry = notification.geometry;
    var _getState$appState$do = getState().appState.dock.dockData,
      expanded = _getState$appState$do.expanded,
      isOpen = _getState$appState$do.isOpen;
    if (!isOpen) {
      dispatch((0, _actions.toggleOpen)());
    }
    if (expanded && expanded !== id) {
      dispatch(_closeAlertProfile());
    }
    dispatch((0, _Actions.addContext)(activityId, notification));
    dispatch(getActivityDetails(activityId));
    if (!forReplay) {
      dispatch(getCamerasInRangeOfGeo(activityId, geometry));
      dispatch((0, _Actions.startActivityStream)(activityId, "activity", "dock"));
      dispatch((0, _Actions.startAttachmentStream)(activityId, "dock"));
    } else {
      // do we need to do something else here, or leave it up to the widgets to pull in the static data
    }
    dispatch(_openAlertProfile(id));
  };
};
exports.openAlertProfile = openAlertProfile;
var closeAlertProfile = function closeAlertProfile(activityId) {
  return function (dispatch) {
    dispatch(_closeAlertProfile());
    dispatch((0, _Actions.removeContext)(activityId));
  };
};
exports.closeAlertProfile = closeAlertProfile;