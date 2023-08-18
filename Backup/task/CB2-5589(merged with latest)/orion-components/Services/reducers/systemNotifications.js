"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var initialState = [];
var systemNotifications = function systemNotifications() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "SYSTEM_NOTIFICATIONS_RECEIVED":
      {
        var newState = (0, _cloneDeep["default"])(state);
        (0, _forEach["default"])(payload).call(payload, function (newNotification) {
          if (!(0, _some["default"])(newState).call(newState, function (oldNotification) {
            return oldNotification.id === newNotification.id;
          })) {
            newState.push(newNotification);
          }
        });

        // return newState.concat(payload);
        return newState;
      }
    case "SYSTEM_NOTIFICATION_ACKNOWLEDGED":
      {
        var notificationId = payload.notificationId;
        if (notificationId) {
          // -- update notification as acknowledged
          var _newState = (0, _cloneDeep["default"])(state);
          var index = (0, _findIndex["default"])(_newState).call(_newState, function (notification) {
            return notification.id === notificationId;
          });
          _newState[index].ack = true;
          return _newState;
        } else {
          return state;
        }
      }
    case "SYSTEM_NOTIFICATIONS_CLEARED":
      {
        return [];
      }
    default:
      return state;
  }
};
var _default = systemNotifications;
exports["default"] = _default;