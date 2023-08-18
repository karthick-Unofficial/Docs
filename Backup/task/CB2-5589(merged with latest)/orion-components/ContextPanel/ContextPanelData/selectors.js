"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.viewingHistorySelector = exports.secondaryContextSelector = exports.primaryContextSelector = exports.contextPanelState = void 0;
var _reselect = require("reselect");
var contextPanelState = function contextPanelState(state) {
  return state.appState.contextPanel.contextPanelData;
};
exports.contextPanelState = contextPanelState;
var viewingHistorySelector = (0, _reselect.createSelector)(contextPanelState, function (state) {
  return state.viewingHistory;
});
exports.viewingHistorySelector = viewingHistorySelector;
var primaryContextSelector = (0, _reselect.createSelector)(contextPanelState, function (state) {
  return state.selectedContext.primary;
});
exports.primaryContextSelector = primaryContextSelector;
var secondaryContextSelector = (0, _reselect.createSelector)(contextPanelState, function (state) {
  return state.selectedContext.secondary;
});
exports.secondaryContextSelector = secondaryContextSelector;