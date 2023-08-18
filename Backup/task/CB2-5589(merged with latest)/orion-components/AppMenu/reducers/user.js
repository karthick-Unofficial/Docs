"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports["default"] = void 0;
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var initialState = {
  isHydrated: false,
  profile: {}
};
exports.initialState = initialState;
var user = function user() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "HYDRATE_USER_SUCCESS":
      return (0, _assign["default"])({}, state, {
        isHydrated: true,
        profile: action.user
      });
    case "REFRESH_USER_SUCCESS":
      return (0, _assign["default"])({}, state, {
        profile: action.user
      });
    default:
      return state;
  }
};
var _default = user;
exports["default"] = _default;