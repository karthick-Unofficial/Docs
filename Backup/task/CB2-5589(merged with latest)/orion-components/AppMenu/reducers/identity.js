"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports["default"] = void 0;
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _clientAppCore = require("client-app-core");
var loggedInUser = _clientAppCore.authService.getLoggedInUser();
var initialState = {
  isAuthenticated: loggedInUser !== null ? true : false,
  userId: loggedInUser ? loggedInUser.userId : null,
  email: loggedInUser ? loggedInUser.email : null,
  errorMessage: ""
};
exports.initialState = initialState;
var identity = function identity() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "IDENTITY_INVALIDATED":
      return (0, _assign["default"])({}, state, {
        isAuthenticated: false,
        userId: null,
        email: null
      });
    case "LOGIN_REQUEST":
      return (0, _assign["default"])({}, state, {
        isFetching: true,
        isAuthenticated: false,
        errorMessage: ""
      });
    case "LOGIN_SUCCESS":
      return (0, _assign["default"])({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: ""
      });
    case "LOGIN_FAILURE":
      return (0, _assign["default"])({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
};
var _default = identity;
exports["default"] = _default;