"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.searchValueSelector = exports.mapFiltersState = exports.mapFiltersSelector = exports.mapFiltersById = exports.listPanelState = exports.filteredFeaturesSelector = exports.eventTemplateSearchSelector = exports.eventSearchSelector = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _reselect = require("reselect");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var listPanelState = function listPanelState(state) {
  return state.appState.contextPanel.listPanel;
};
exports.listPanelState = listPanelState;
var mapFiltersState = function mapFiltersState(state) {
  return state.appState.contextPanel.listPanel && state.appState.contextPanel.listPanel.mapFilters;
};
exports.mapFiltersState = mapFiltersState;
var mapEntities = function mapEntities(state) {
  return state.appState.mapRef.entities;
};
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _reactFastCompare["default"]);
var searchValueSelector = (0, _reselect.createSelector)(listPanelState, function (state) {
  return state.searchValue.toLowerCase();
});
exports.searchValueSelector = searchValueSelector;
var mapFiltersById = (0, _reselect.createSelector)(mapFiltersState, function (filters) {
  var _context;
  if (!filters) {
    return [];
  }
  var filterIds = [];
  (0, _forEach["default"])(_context = (0, _values["default"])(filters)).call(_context, function (collection) {
    (0, _forEach["default"])(collection).call(collection, function (entity) {
      return filterIds.push(entity.id);
    });
  });
  return filterIds;
});
exports.mapFiltersById = mapFiltersById;
var filteredFeaturesSelector = createDeepEqualSelector(mapFiltersById, mapEntities, function (ids, entities) {
  var _context2;
  if (!ids.length) {
    return;
  }
  var features = {};
  (0, _forEach["default"])(_context2 = (0, _values["default"])(entities)).call(_context2, function (feed) {
    var _context3;
    return (0, _forEach["default"])(_context3 = (0, _values["default"])(feed)).call(_context3, function (entity) {
      if ((0, _includes["default"])(ids).call(ids, entity.id) || (0, _includes["default"])(ids).call(ids, entity.parentEntity)) {
        features[entity.id] = entity;
      }
    });
  });
  return features;
});
exports.filteredFeaturesSelector = filteredFeaturesSelector;
var mapFiltersSelector = createDeepEqualSelector(filteredFeaturesSelector, function (entities) {
  return entities;
});
exports.mapFiltersSelector = mapFiltersSelector;
var eventSearchSelector = (0, _reselect.createSelector)(listPanelState, function (state) {
  return state && state.eventSearch && state.eventSearch.toLowerCase();
});
exports.eventSearchSelector = eventSearchSelector;
var eventTemplateSearchSelector = (0, _reselect.createSelector)(listPanelState, function (state) {
  return state.eventTemplateSearch.toLowerCase();
});
exports.eventTemplateSearchSelector = eventTemplateSearchSelector;