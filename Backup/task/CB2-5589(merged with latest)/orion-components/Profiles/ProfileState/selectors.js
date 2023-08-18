"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.selectedFacilitySelector = exports.selectedEntityState = exports.selectedContextSelector = exports.contextualDataState = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));
var _reselect = require("reselect");
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _excluded = ["subscriptions"],
  _excluded2 = ["floorPlanCameras"];
var selectedEntityState = function selectedEntityState(state) {
  return state.appState.contextPanel.profile ? state.appState.contextPanel.profile.selectedEntity : null;
};
exports.selectedEntityState = selectedEntityState;
var contextualDataState = function contextualDataState(state) {
  return state.contextualData;
};
exports.contextualDataState = contextualDataState;
var selectedContextSelector = (0, _reselect.createSelector)(selectedEntityState, contextualDataState, function (entity, contextualData) {
  return entity ? contextualData[entity.id] : null;
});
exports.selectedContextSelector = selectedContextSelector;
var selectedFacilitySelector = (0, _reselect.createSelector)(selectedEntityState, contextualDataState, function (entity, contextualData) {
  var returnObject = {};
  if (entity) {
    var context = contextualData[entity.id];
    var subscriptions = context.subscriptions,
      copyOfContext = (0, _objectWithoutProperties2["default"])(context, _excluded);
    returnObject = (0, _cloneDeep["default"])(copyOfContext);
    if (subscriptions) {
      var floorPlanCameras = subscriptions.floorPlanCameras,
        copySubs = (0, _objectWithoutProperties2["default"])(subscriptions, _excluded2);
      returnObject.subscriptions = (0, _cloneDeep["default"])(copySubs);
    }
  }
  return entity ? returnObject : null;
});
exports.selectedFacilitySelector = selectedFacilitySelector;