"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.replayMapState = exports.replayMapObject = exports.mapStateSelector = exports.mapState = exports.mapSelector = exports.mapObject = exports.inEditGeo = exports.activeReplayEntitiesSelector = exports.activeEntitiesSelector = void 0;
var _reselect = require("reselect");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _isEqual["default"]);
var mapState = function mapState(state) {
  return state.appState.mapRef;
};
exports.mapState = mapState;
var mapObject = function mapObject(state) {
  return state.appState.mapRef.mapObject;
};
exports.mapObject = mapObject;
var inEditGeo = function inEditGeo(state) {
  return state.appState.mapRef.inEditGeo;
};
exports.inEditGeo = inEditGeo;
var replayMapState = function replayMapState(state) {
  return state.appState.replayMapRef;
};
exports.replayMapState = replayMapState;
var replayMapObject = function replayMapObject(state) {
  return state.appState.replayMapRef.mapObject;
};
exports.replayMapObject = replayMapObject;
var baseMapRefState = function baseMapRefState(state) {
  return state.replayMapState ? state.replayMapState.replayBaseMap.mapRef : state.mapState ? state.mapState.baseMap.mapRef : null;
};
var activeEntitiesSelector = (0, _reselect.createSelector)(mapState, function (state) {
  return state.entities;
});
exports.activeEntitiesSelector = activeEntitiesSelector;
var activeReplayEntitiesSelector = (0, _reselect.createSelector)(replayMapState, function (state) {
  return state.entities;
});
exports.activeReplayEntitiesSelector = activeReplayEntitiesSelector;
var mapSelector = function mapSelector() {
  return createDeepEqualSelector(baseMapRefState, function (result) {
    return result;
  });
};
exports.mapSelector = mapSelector;
var mapStateSelector = function mapStateSelector() {
  return createDeepEqualSelector(mapState, function (result) {
    return result;
  });
};
exports.mapStateSelector = mapStateSelector;