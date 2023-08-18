"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.userCamerasSelector = exports.dockedCamerasSelector = exports.dockOpenSelector = exports.dockDataSelector = exports.cameraDockSelector = void 0;
var _reselect = require("reselect");
var dock = function dock(state) {
  return state.appState.dock;
};
var cameraDockSelector = (0, _reselect.createSelector)(dock, function (dock) {
  return dock.cameraDock;
});
exports.cameraDockSelector = cameraDockSelector;
var dockDataSelector = (0, _reselect.createSelector)(dock, function (dock) {
  return dock.dockData;
});
exports.dockDataSelector = dockDataSelector;
var dockOpenSelector = (0, _reselect.createSelector)(dock, function (dock) {
  return dock.dockData.isOpen;
});
exports.dockOpenSelector = dockOpenSelector;
var dockedCamerasSelector = (0, _reselect.createSelector)(dock, function (dock) {
  return dock.cameraDock.dockedCameras;
});
exports.dockedCamerasSelector = dockedCamerasSelector;
var userCamerasSelector = (0, _reselect.createSelector)(dock, function (dock) {
  return dock.cameraDock.userCameras;
});
exports.userCamerasSelector = userCamerasSelector;