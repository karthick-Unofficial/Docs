"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _trackMovementBuilder = _interopRequireDefault(require("./track-movement-builder.js"));
var _systemHealthBuilder = _interopRequireDefault(require("./system-health-builder.js"));
var _vesselEvent = _interopRequireDefault(require("./vessel-event.js"));
var _alarm = _interopRequireDefault(require("./alarm.js"));
var _createEvent = _interopRequireDefault(require("./create-event"));
var builder = function builder(rule, collections, targetAction, hasLinks) {
  switch (rule.type) {
    case "track-movement":
      return (0, _trackMovementBuilder["default"])(rule, collections, targetAction, hasLinks);
    case "system-health":
      return (0, _systemHealthBuilder["default"])(rule, collections, targetAction, hasLinks);
    case "vessel-event":
      return (0, _vesselEvent["default"])(rule, collections);
    case "alarm":
      return (0, _alarm["default"])(rule, collections);
    case "create-event":
      return (0, _createEvent["default"])(rule, collections);
    default:
      return "";
  }
};
var _default = builder;
exports["default"] = _default;