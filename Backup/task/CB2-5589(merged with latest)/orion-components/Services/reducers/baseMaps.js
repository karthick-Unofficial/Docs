"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var initialState = [];
var baseMaps = function baseMaps() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "BASE_MAP_CONFIG_RECEIVED":
      {
        return payload;
      }
    default:
      return state;
  }
};
var _default = baseMaps;
exports["default"] = _default;