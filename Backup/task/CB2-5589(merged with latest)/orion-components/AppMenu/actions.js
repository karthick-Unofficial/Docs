"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.logOut = exports.identityInvalidated = exports.hydrateUserSuccess = exports.hydrateUser = void 0;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _clientAppCore = require("client-app-core");
var t = _interopRequireWildcard(require("./actionTypes.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var hydrateUserSuccess = function hydrateUserSuccess(user) {
  return {
    type: t.HYDRATE_USER_SUCCESS,
    user: user
  };
};
exports.hydrateUserSuccess = hydrateUserSuccess;
var hydrateUser = function hydrateUser(username) {
  return function (dispatch) {
    return new _promise["default"](function (resolve) {
      _clientAppCore.userService.getProfile(username, function (err, response) {
        if (err) {
          console.log(err);
          if (err.response.status === 404) {
            dispatch(logOut());
          }
        } else {
          dispatch(hydrateUserSuccess(response.user));
          resolve();
        }
      });
    });
  };
};
exports.hydrateUser = hydrateUser;
var identityInvalidated = function identityInvalidated() {
  return {
    type: t.IDENTITY_INVALIDATED
  };
};
exports.identityInvalidated = identityInvalidated;
var logOut = function logOut() {
  return function (dispatch) {
    _clientAppCore.authService.logout(function () {
      dispatch(identityInvalidated());
    });
  };
};
exports.logOut = logOut;