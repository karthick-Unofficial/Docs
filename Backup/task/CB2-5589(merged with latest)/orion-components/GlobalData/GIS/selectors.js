"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.gisStateSelector = exports.gisLayerSelector = exports.gisDataSelector = void 0;
var _reselect = require("reselect");
var _each = _interopRequireDefault(require("lodash/each"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
// Assigning an empty object to a variable, prevents unnecessary re-renders
var defaultGISState = {};
var gisData = function gisData(state) {
  return state.globalData.gisData;
};
var gisState = function gisState(state) {
  return state.appState.persisted.gisState || defaultGISState;
};
var gisDataSelector = (0, _reselect.createSelector)(gisData, function (data) {
  return data;
});
exports.gisDataSelector = gisDataSelector;
var gisStateSelector = (0, _reselect.createSelector)(gisState, function (state) {
  return state;
});
exports.gisStateSelector = gisStateSelector;
var gisLayerSelector = (0, _reselect.createSelector)(gisData, gisState, function (data, state) {
  var layers = data.layers;
  return (0, _each["default"])(layers) ? (0, _pickBy["default"])(layers, function (layer) {
    return state[layer.serviceId] && state[layer.serviceId][layer.id];
  }) : {};
});
exports.gisLayerSelector = gisLayerSelector;