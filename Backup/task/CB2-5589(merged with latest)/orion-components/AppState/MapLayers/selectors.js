"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.mapLayersState = void 0;
var mapLayersState = function mapLayersState(state) {
  return state.appState.mapLayers;
};
exports.mapLayersState = mapLayersState;