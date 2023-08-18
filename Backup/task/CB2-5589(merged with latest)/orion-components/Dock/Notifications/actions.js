"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.queryArchive = exports.notificationBatchReceived = exports.initialNotificationsReceived = exports.getArchiveSuccess = exports.getArchiveFailed = exports.dumpArchive = exports.closeNotification = exports.closeBulkNotifications = void 0;
_Object$defineProperty(exports, "removeDockedCameraAndState", {
  enumerable: true,
  get: function get() {
    return _index.removeDockedCameraAndState;
  }
});
exports.reopenNotification = exports.reopenBulkNotifications = void 0;
exports.startNotificationStream = startNotificationStream;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _clientAppCore = require("client-app-core");
var t = _interopRequireWildcard(require("./actionTypes.js"));
var _index = require("orion-components/Dock/Actions/index.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// import { newNotificationAlert } from "../actions";

function startNotificationStream() {
  return function (dispatch) {
    _clientAppCore.notificationService.streamMyActiveNotifications(function (err, response) {
      if (err) {
        console.log(err);
      } else {
        switch (response.type) {
          case "initial-batch":
            {
              var _context;
              var notifications = (0, _map["default"])(_context = response.changes).call(_context, function (item) {
                return item.new_val;
              });
              dispatch(initialNotificationsReceived(notifications));
              break;
            }
          case "change-batch":
            {
              var _context2;
              var _notifications = (0, _map["default"])(_context2 = response.changes).call(_context2, function (item) {
                return item.new_val;
              });
              dispatch(notificationBatchReceived(_notifications));
              break;
            }
          default:
        }
      }
    });
  };
}
var initialNotificationsReceived = function initialNotificationsReceived(notifications) {
  return {
    notifications: notifications,
    type: t.INITIAL_NOTIFICATIONS_RECEIVED
  };
};
exports.initialNotificationsReceived = initialNotificationsReceived;
var notificationBatchReceived = function notificationBatchReceived(notifications) {
  return {
    notifications: notifications,
    type: t.NOTIFICATION_BATCH_RECEIVED
  };
};
exports.notificationBatchReceived = notificationBatchReceived;
var getArchiveSuccess = function getArchiveSuccess(notifications) {
  return {
    notifications: notifications,
    type: t.GET_ARCHIVE_SUCCESS
  };
};
exports.getArchiveSuccess = getArchiveSuccess;
var getArchiveFailed = function getArchiveFailed() {
  return {
    type: t.GET_ARCHIVE_FAILED
  };
};
exports.getArchiveFailed = getArchiveFailed;
var queryArchive = function queryArchive(page) {
  return function (dispatch) {
    _clientAppCore.notificationService.getArchivedByPage(page, function (err, response) {
      if (err) {
        dispatch(getArchiveFailed());
        console.log(err);
      } else {
        dispatch(getArchiveSuccess(response));
      }
    });
  };
};
exports.queryArchive = queryArchive;
var dumpArchive = function dumpArchive() {
  return {
    type: t.DUMP_ARCHIVE
  };
};
exports.dumpArchive = dumpArchive;
var closeNotification = function closeNotification(notificationId) {
  return {
    notificationId: notificationId,
    type: t.CLOSE_NOTIFICATION
  };
};
exports.closeNotification = closeNotification;
var closeBulkNotifications = function closeBulkNotifications(notificationIds) {
  return {
    notificationIds: notificationIds,
    type: t.CLOSE_NOTIFICATIONS
  };
};
exports.closeBulkNotifications = closeBulkNotifications;
var reopenNotification = function reopenNotification(notification) {
  return {
    notification: notification,
    notificationId: notification.id,
    type: t.REOPEN_NOTIFICATION
  };
};
exports.reopenNotification = reopenNotification;
var reopenBulkNotifications = function reopenBulkNotifications(notifications) {
  return {
    notifications: notifications,
    notificationIds: (0, _map["default"])(notifications).call(notifications, function (a) {
      return a.id;
    }),
    type: t.REOPEN_NOTIFICATIONS
  };
};
exports.reopenBulkNotifications = reopenBulkNotifications;