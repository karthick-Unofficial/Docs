"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeToSystemNotifications = exports.clearSystemNotifications = exports.acknowledgeSystemNotification = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _clientAppCore = require("client-app-core");
var t = _interopRequireWildcard(require("./actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var systemNotificationsReceived = function systemNotificationsReceived(data) {
  return {
    type: t.SYSTEM_NOTIFICATIONS_RECEIVED,
    payload: data
  };
};
var systemNotificationAcknowledged = function systemNotificationAcknowledged(notificationId) {
  return {
    type: t.SYSTEM_NOTIFICATION_ACKNOWLEDGED,
    payload: {
      notificationId: notificationId
    }
  };
};
var systemNotificationsCleared = function systemNotificationsCleared() {
  return {
    type: t.SYSTEM_NOTIFICATIONS_CLEARED
  };
};
var initialBatchReceived = false;
var subscribeToSystemNotifications = function subscribeToSystemNotifications(userId) {
  return function (dispatch) {
    _clientAppCore.systemNotificationService.subscribeByUser(userId, function (err, res) {
      if (err) console.log(err);
      if (!res) return;
      switch (res.type) {
        case "initial":
          {
            var notificationBatch = res.batch;
            if (!initialBatchReceived) {
              initialBatchReceived = true;

              // -- send through everything, including "interrupt = false"
              dispatch(systemNotificationsReceived(notificationBatch));
            } else {
              (0, _forEach["default"])(notificationBatch).call(notificationBatch, function (notification) {
                // -- only send through "interrupt = true"
                if (notification.interrupt) {
                  dispatch(systemNotificationsReceived([notification]));
                }
              });
            }
            break;
          }
        case "add":
          {
            var notification = res.new_val;

            // -- only send through "interrupt = true"
            if (notification.interrupt) {
              dispatch(systemNotificationsReceived([notification]));
            }
            break;
          }
        // -- I don't think change or remove will ever occur in our current setup - CD
        case "change":
        case "remove":
        default:
          console.log("subscribeToSystemNotifications - Invalid type: ".concat(res.type));
      }
    });
  };
};
exports.subscribeToSystemNotifications = subscribeToSystemNotifications;
var acknowledgeSystemNotification = function acknowledgeSystemNotification(notificationId) {
  return function (dispatch) {
    _clientAppCore.systemNotificationService.acknowledgeSystemNotification(notificationId, function (err, res) {
      if (err) return console.log("acknowledgeSystemNotification - Error:", err);
      if (!res) return console.log("acknowledgeSystemNotification - Error - No response returned for notificationId: ".concat(notificationId));
      if (res.success === false) return console.log("acknowledgeSystemNotification - Unsuccessful: ".concat(res.message));
      if (res.systemNotificationId) {
        dispatch(systemNotificationAcknowledged(res.systemNotificationId));
      } else {
        console.log("acknowledgeSystemNotification - Error: notificationId not found in response");
      }
    });
  };
};

// -- Remove all local systemNotifications (systemNotifications should already be acknowledged on the backend)
exports.acknowledgeSystemNotification = acknowledgeSystemNotification;
var clearSystemNotifications = function clearSystemNotifications() {
  return function (dispatch) {
    dispatch(systemNotificationsCleared());
  };
};
exports.clearSystemNotifications = clearSystemNotifications;