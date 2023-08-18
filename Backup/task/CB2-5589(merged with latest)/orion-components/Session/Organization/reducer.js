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
  profile: {},
  externalSystems: []
};
exports.initialState = initialState;
var organization = function organization() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type;
  switch (type) {
    case "HYDRATE_USER_SUCCESS":
      return (0, _assign["default"])({}, state, {
        isHydrated: true,
        profile: action.org,
        externalSystems: action.externalSystems
      });
    default:
      return state;
  }
};
var _default = organization;
exports["default"] = _default;