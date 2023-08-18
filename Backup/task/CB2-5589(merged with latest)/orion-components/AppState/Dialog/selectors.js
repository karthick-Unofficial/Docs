"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.fullscreenCameraOpen = void 0;
var fullscreenCameraOpen = function fullscreenCameraOpen(state) {
  return state.appState.dock.cameraDock.cameraPriority.modalOpen;
};
exports.fullscreenCameraOpen = fullscreenCameraOpen;