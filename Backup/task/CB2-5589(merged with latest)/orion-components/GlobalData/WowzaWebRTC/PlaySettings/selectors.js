"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlaySettings = void 0;
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var playSettings = function playSettings(state) {
  return (state === null || state === void 0 ? void 0 : state.playSettings) || [];
};
var getPlaySettings = function getPlaySettings(state, streamName) {
  var settings = playSettings(state);
  return settings ? (0, _find["default"])(settings).call(settings, function (item) {
    return item.streamName === streamName;
  }) : undefined;
};
exports.getPlaySettings = getPlaySettings;