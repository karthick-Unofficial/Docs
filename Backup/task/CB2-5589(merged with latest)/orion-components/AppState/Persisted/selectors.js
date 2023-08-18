"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.widgetStateSelector = exports.weatherRadarLayerOpacitySelector = exports.ssrRadarLayerOpacitySelector = exports.roadAndLabelLayerOpacitySelector = exports.profileState = exports.persistedState = exports.nauticalChartLayerOpacitySelector = exports.mapSettingsSelector = exports.layerOpacitySelector = exports.eventTemplateFiltersSelector = exports.eventFiltersSelector = exports.disabledFeedsSelector = exports.activityFiltersSelector = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _reselect = require("reselect");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var persistedState = function persistedState(state) {
  return state.appState.persisted;
};
exports.persistedState = persistedState;
var profileState = function profileState(state) {
  return state.appState.contextPanel.profile;
};
exports.profileState = profileState;
var mapSettingsSelector = (0, _reselect.createSelector)(persistedState, function (state) {
  var settings = state.mapSettings || {};
  return _objectSpread({
    mapZoom: settings.mapZoom || 3,
    mapCenter: settings.mapCenter || [-98.2015, 39.4346],
    mapStyle: settings.mapStyle || "satellite"
  }, settings);
});
exports.mapSettingsSelector = mapSettingsSelector;
var widgetStateSelector = (0, _reselect.createSelector)(persistedState, profileState, function (persisted, profile) {
  var type = profile.selectedEntity.type;
  switch (type) {
    case "shapes":
    case "track":
      type = "entity";
      break;
    case "camera":
      break;
    case undefined:
      // this should be removed once events are given an entityType prop
      type = "event";
      break;
    default:
      break;
  }
  return persisted.profileWidgetOrder ? persisted.profileWidgetOrder[type] : null;
});
exports.widgetStateSelector = widgetStateSelector;
var disabledFeedsSelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state && state.disabledFeeds ? state.disabledFeeds : [];
});
exports.disabledFeedsSelector = disabledFeedsSelector;
var layerOpacitySelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.layerOpacity ? state.layerOpacity : 1;
});
exports.layerOpacitySelector = layerOpacitySelector;
var nauticalChartLayerOpacitySelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.nauticalChartLayerOpacity;
});
exports.nauticalChartLayerOpacitySelector = nauticalChartLayerOpacitySelector;
var roadAndLabelLayerOpacitySelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.roadAndLabelLayerOpacity;
});
exports.roadAndLabelLayerOpacitySelector = roadAndLabelLayerOpacitySelector;
var weatherRadarLayerOpacitySelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.weatherRadarLayerOpacity;
});
exports.weatherRadarLayerOpacitySelector = weatherRadarLayerOpacitySelector;
var ssrRadarLayerOpacitySelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.ssrRadarLayerOpacity !== null && state.ssrRadarLayerOpacity !== undefined ? state.ssrRadarLayerOpacity : 1;
});
exports.ssrRadarLayerOpacitySelector = ssrRadarLayerOpacitySelector;
var activityFiltersSelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.activityFilters ? state.activityFilters : [];
});
exports.activityFiltersSelector = activityFiltersSelector;
var eventFiltersSelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.eventFilters ? state.eventFilters : [];
});
exports.eventFiltersSelector = eventFiltersSelector;
var eventTemplateFiltersSelector = (0, _reselect.createSelector)(persistedState, function (state) {
  return state.eventTemplateFilters ? state.eventTemplateFilters : [];
});
exports.eventTemplateFiltersSelector = eventTemplateFiltersSelector;