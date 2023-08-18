"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.trackHistoryDuration = exports.globalState = void 0;
var globalState = function globalState(state) {
  return state.appState.global;
};
exports.globalState = globalState;
var trackHistoryDuration = function trackHistoryDuration(state) {
  return state.appState.global.trackHistory.duration;
};
exports.trackHistoryDuration = trackHistoryDuration;