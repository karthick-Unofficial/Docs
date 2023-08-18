"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var getAction = function getAction(_ref) {
  var type = _ref.type,
    url = _ref.url;
  var action;
  switch (type) {
    case "external_link":
      action = function action() {
        return window.open(url, "_blank");
      };
      break;
    default:
      break;
  }
  return action;
};
var _default = getAction;
exports["default"] = _default;