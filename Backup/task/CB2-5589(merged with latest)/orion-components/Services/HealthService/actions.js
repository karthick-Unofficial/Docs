"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.startHealthPolling = void 0;
var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));
var _clientAppCore = require("client-app-core");
var t = _interopRequireWildcard(require("./actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var systemHealthReceived = function systemHealthReceived(data) {
  return {
    type: t.SYSTEM_HEALTH_RECEIVED,
    payload: data
  };
};
var systemHealthError = function systemHealthError() {
  return {
    type: t.SYSTEM_HEALTH_ERROR,
    payload: true
  };
};
var getSystemHealth = function getSystemHealth() {
  return function (dispatch) {
    _clientAppCore.systemHealthService.getAllWithAuth(function (err, res) {
      if (err) {
        console.log("System health error received", err);
        dispatch(systemHealthError());
      } else {
        dispatch(systemHealthReceived(res));
      }
    });
  };
};
var startHealthPolling = function startHealthPolling() {
  return function (dispatch) {
    // Get initial system health on load
    dispatch(getSystemHealth());

    // Poll for system health every 15 seconds
    (0, _setInterval2["default"])(function () {
      dispatch(getSystemHealth());
    }, 15000);
  };
};
exports.startHealthPolling = startHealthPolling;