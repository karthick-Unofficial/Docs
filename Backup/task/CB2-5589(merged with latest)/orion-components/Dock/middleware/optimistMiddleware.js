"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _reduxOptimist = require("redux-optimist");
var _clientAppCore = require("client-app-core");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var nextTransactionID = 1;
var optimistMiddleware = function optimistMiddleware(store) {
  return function (next) {
    return function (action) {
      // Adding a serializable transactionId to every action so optimist can keep track of where it needs to commit/revert
      // This needs to be included in every optimist middleware for redundancy, only the first in the middleware chain will take effect

      if (!action) {
        console.error("optimistMiddleware received an action that was not defined. Action would have been assigned transaction ID: ", nextTransactionID);
      } else {
        if (!action.transactionId && !action.optimist) {
          action = (0, _assign["default"])({}, action, {
            transactionId: nextTransactionID++
          });
        }
        if (action.type === "CLOSE_NOTIFICATION") {
          next(_objectSpread(_objectSpread({}, action), {}, {
            optimist: {
              type: _reduxOptimist.BEGIN,
              id: action.transactionId
            }
          }));
          _clientAppCore.notificationService.closeNotification(action.notificationId, function (err, response) {
            if (err) {
              console.log(err);
              next({
                type: "CLOSE_NOTIFICATION_FAILED",
                notificationId: action.notificationId,
                notification: action.notification,
                error: err,
                optimist: {
                  type: _reduxOptimist.REVERT,
                  id: action.transactionId
                }
              });
            } else {
              next({
                type: "CLOSE_NOTIFICATION_COMPLETE",
                notificationId: action.notificationId,
                notification: action.notification,
                response: response,
                optimist: {
                  type: _reduxOptimist.COMMIT,
                  id: action.transactionId
                }
              });
            }
          });
        } else if (action.type === "CLOSE_NOTIFICATIONS") {
          next(_objectSpread(_objectSpread({}, action), {}, {
            optimist: {
              type: _reduxOptimist.BEGIN,
              id: action.transactionId
            }
          }));
          _clientAppCore.notificationService.closeBulkNotifications(action.notificationIds, function (err, response) {
            if (err) {
              console.log(err);
              next({
                type: "CLOSE_NOTIFICATIONS_FAILED",
                notifications: action.notifications,
                notificationIds: action.notificationIds,
                error: err,
                optimist: {
                  type: _reduxOptimist.REVERT,
                  id: action.transactionId
                }
              });
            } else {
              next({
                type: "CLOSE_NOTIFICATIONS_COMPLETE",
                notifications: action.notifications,
                notificationIds: action.notificationIds,
                response: response,
                optimist: {
                  type: _reduxOptimist.COMMIT,
                  id: action.transactionId
                }
              });
            }
          });
        } else if (action.type === "REOPEN_NOTIFICATION") {
          next(_objectSpread(_objectSpread({}, action), {}, {
            optimist: {
              type: _reduxOptimist.BEGIN,
              id: action.transactionId
            }
          }));
          _clientAppCore.notificationService.reopenNotification(action.notificationId, function (err, response) {
            if (err) {
              console.log(err);
              next({
                type: "REOPEN_NOTIFICATION_FAILED",
                notificationId: action.notificationId,
                notification: action.notification,
                error: err,
                optimist: {
                  type: _reduxOptimist.REVERT,
                  id: action.transactionId
                }
              });
            } else {
              next({
                type: "REOPEN_NOTIFICATION_COMPLETE",
                notificationId: action.notificationId,
                notification: action.notification,
                response: response,
                optimist: {
                  type: _reduxOptimist.COMMIT,
                  id: action.transactionId
                }
              });
            }
          });
        } else if (action.type === "REOPEN_NOTIFICATIONS") {
          next(_objectSpread(_objectSpread({}, action), {}, {
            optimist: {
              type: _reduxOptimist.BEGIN,
              id: action.transactionId
            }
          }));
          _clientAppCore.notificationService.reopenBulkNotifications(action.notificationIds, function (err, response) {
            if (err) {
              console.log(err);
              next({
                type: "REOPEN_NOTIFICATIONS_FAILED",
                notifications: action.notifications,
                notificationIds: action.notificationIds,
                error: err,
                optimist: {
                  type: _reduxOptimist.REVERT,
                  id: action.transactionId
                }
              });
            } else {
              next({
                type: "REOPEN_NOTIFICATIONS_COMPLETE",
                notifications: action.notifications,
                notificationIds: action.notificationIds,
                response: response,
                optimist: {
                  type: _reduxOptimist.COMMIT,
                  id: action.transactionId
                }
              });
            }
          });
        } else {
          return next(action);
        }
      }
    };
  };
};
var _default = optimistMiddleware;
exports["default"] = _default;