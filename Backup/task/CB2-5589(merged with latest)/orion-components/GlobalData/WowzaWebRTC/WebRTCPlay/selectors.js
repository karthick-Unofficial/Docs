"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebrtcPlay = void 0;
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var webrtcPlay = function webrtcPlay(state) {
  return (state === null || state === void 0 ? void 0 : state.webrtcPlay) || [];
};
var getWebrtcPlay = function getWebrtcPlay(state, streamName) {
  var settings = webrtcPlay(state);
  return settings ? (0, _find["default"])(settings).call(settings, function (item) {
    return item.streamName === streamName;
  }) : undefined;
};
exports.getWebrtcPlay = getWebrtcPlay;