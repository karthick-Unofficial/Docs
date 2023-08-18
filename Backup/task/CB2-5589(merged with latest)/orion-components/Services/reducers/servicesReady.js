"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var servicesReady = function servicesReady() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type;
  switch (type) {
    case "SERVICES_READY":
      {
        return true;
      }
    default:
      return state;
  }
};
var _default = servicesReady;
exports["default"] = _default;