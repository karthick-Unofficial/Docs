"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.clearNotification = exports.appStateReceived = void 0;
_Object$defineProperty(exports, "confirmFirstUse", {
  enumerable: true,
  get: function get() {
    return _Actions.confirmFirstUse;
  }
});
exports.createUserFeedback = createUserFeedback;
exports.getAppState = void 0;
_Object$defineProperty(exports, "logOut", {
  enumerable: true,
  get: function get() {
    return _Actions.logOut;
  }
});
exports.setAppState = exports.newNotificationAlert = void 0;
exports.setTab = setTab;
exports.subscribeAll = subscribeAll;
exports.toggleOpen = toggleOpen;
exports.toggleWavCam = toggleWavCam;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var t = _interopRequireWildcard(require("./actionTypes.js"));
var _clientAppCore = require("client-app-core");
var _actions = require("./Notifications/actions");
var _actions2 = require("./Cameras/actions");
var _Actions = require("../Session/Actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// userAppState methods for camera dock. May be used for more in the future.
var appStateReceived = function appStateReceived(userAppState) {
  return {
    type: t.DOCK_APP_STATE_RECEIVED,
    payload: userAppState
  };
};
exports.appStateReceived = appStateReceived;
var getAppState = function getAppState() {
  return function (dispatch) {
    var app = "alert-sidebar";
    return new _promise["default"](function (resolve) {
      _clientAppCore.userService.getAppState(app, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          dispatch(appStateReceived(result.state));
          resolve();
        }
      });
    });
  };
};
exports.getAppState = getAppState;
var setAppState = function setAppState(keyVal) {
  return function () {
    var app = "alert-sidebar";
    _clientAppCore.userService.setAppState(app, keyVal, function (err, result) {
      if (err) {
        console.log(err, result);
      }
    });
  };
};
exports.setAppState = setAppState;
function setTab(tab) {
  return {
    type: t.SET_ALERTS_TAB,
    tab: tab
  };
}
function toggleWavCam() {
  return {
    type: t.TOGGLE_WAV_CAM
  };
}
function toggleOpen() {
  return {
    type: t.TOGGLE_OPEN
  };
}

//TODO:
var newNotificationAlert = function newNotificationAlert(notification) {
  return {
    type: t.SHOW_ALERT,
    notification: notification
  };
};
exports.newNotificationAlert = newNotificationAlert;
var clearNotification = function clearNotification(notificationId) {
  return {
    type: t.HIDE_ALERT,
    notificationId: notificationId
  };
};
exports.clearNotification = clearNotification;
function subscribeAll() {
  return function (dispatch) {
    dispatch((0, _actions.startNotificationStream)());
    dispatch((0, _actions2.getAllCameras)());
  };
}

// Generate user feedback notifications
function createUserFeedback(message, undoFunc) {
  return function (dispatch) {
    var payload = {
      id: message,
      feedback: true,
      summary: message,
      createdDate: new Date(),
      undoFunc: undoFunc
    };
    dispatch(newNotificationAlert(payload));
  };
}