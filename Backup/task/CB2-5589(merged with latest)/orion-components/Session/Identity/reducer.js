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
  email: loggedInUser ? loggedInUser.email : null
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
    default:
      return state;
  }
};
var _default = identity;
exports["default"] = _default;