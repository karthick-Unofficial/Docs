"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.setUserProfile = exports.hydrateUser = exports.getFirstUseText = exports.confirmFirstUse = void 0;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));
var _clientAppCore = require("client-app-core");
var _actions = require("../Identity/actions");
var t = _interopRequireWildcard(require("./actionTypes"));
var _this = void 0;
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Set a user's profile in state
 * @param user: user object
 */
var hydrateUserSuccess = function hydrateUserSuccess(res) {
  return {
    type: t.HYDRATE_USER_SUCCESS,
    user: res.user,
    org: res.org,
    externalSystems: res.externalSystems
  };
};
var endSession = function endSession() {
  return {
    type: t.SESSION_ENDED
  };
};
var handleSessionEnd = function handleSessionEnd(mockStore) {
  mockStore.dispatch(endSession());
};
var firstUseTextReceived = function firstUseTextReceived(text) {
  return {
    type: t.FIRST_USE_TEXT_RECEIVED,
    payload: {
      text: text
    }
  };
};
var getFirstUseText = function getFirstUseText() {
  return function (dispatch) {
    _clientAppCore.restClient.exec_get("/ecosystem/api/_clientConfig", function (err, response) {
      if (err) console.log("ERROR", err);
      if (!response) return;
      var firstUseText = response.firstUseText;
      if (firstUseText) dispatch(firstUseTextReceived(firstUseText));
    });
  };
};
exports.getFirstUseText = getFirstUseText;
var firstUseConfirmed = function firstUseConfirmed() {
  return {
    type: t.FIRST_USE_CONFIRMED
  };
};
var confirmFirstUse = function confirmFirstUse(userId) {
  return function (dispatch) {
    var update = {
      firstUseAck: true
    };
    _clientAppCore.userService.updateUser(userId, update, function (err, response) {
      if (err) console.log("ERROR", err);
      if (!response) return;
      dispatch(firstUseConfirmed());
    });
  };
};

/*
 * Get a user's profile
 * @param userId: user's ID
 */
exports.confirmFirstUse = confirmFirstUse;
var hydrateUser = function hydrateUser(userId) {
  return function (dispatch) {
    return new _promise["default"](function (resolve) {
      _clientAppCore.userService.getProfile(userId, function (err, response) {
        if (err) {
          console.log(err);
          if (err.response.status === 404 || err.response.status === 401) {
            dispatch((0, _actions.logOut)());
          }
        } else {
          var firstUseAck = response.user.firstUseAck;
          dispatch(hydrateUserSuccess(response));
          var mockStore = {
            dispatch: dispatch
          };
          var handler = (0, _bind["default"])(handleSessionEnd).call(handleSessionEnd, _this, mockStore);
          _clientAppCore.authService.addSessionEndHandler(handler);
          if (!firstUseAck) dispatch(getFirstUseText());
          resolve();
        }
      });
    });
  };
};

/*
 * Set a user's profile - used in portable replay
 * @param userProfile: user profile with same schema retrieved in hydrateUser
 */
exports.hydrateUser = hydrateUser;
var setUserProfile = function setUserProfile(userProfile) {
  return function (dispatch) {
    dispatch(hydrateUserSuccess(userProfile));
  };
};
exports.setUserProfile = setUserProfile;