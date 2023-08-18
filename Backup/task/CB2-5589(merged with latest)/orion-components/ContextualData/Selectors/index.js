"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.trackHistorySelector = exports.contextualDataByKey = exports.contextById = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _reselect = require("reselect");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var context = function context(state) {
  return state.contextualData;
};
var contextById = function contextById(id) {
  return (0, _reselect.createSelector)(context, function (context) {
    return context[id];
  });
};
exports.contextById = contextById;
var contextualDataByKey = function contextualDataByKey(id, key) {
  return (0, _reselect.createSelector)(contextById(id), function (context) {
    if (context) {
      return context[key];
    }
  });
};
exports.contextualDataByKey = contextualDataByKey;
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _reactFastCompare["default"]);
var getTrackHistory = function getTrackHistory(state, disabledFeeds) {
  var _context;
  var trackHistory = {};
  var context = state.contextualData;
  (0, _forEach["default"])(_context = (0, _keys["default"])(context)).call(_context, function (contextKey) {
    if (context[contextKey] && context[contextKey].trackHistory && (disabledFeeds ? !(0, _includes["default"])(disabledFeeds).call(disabledFeeds, context[contextKey].entity.feedId) : true)) {
      trackHistory[contextKey] = (0, _cloneDeep["default"])(context[contextKey].trackHistory);
    }
  });
  return trackHistory;
};
var trackHistorySelector = createDeepEqualSelector(getTrackHistory, function (trackHistory) {
  return trackHistory;
});
exports.trackHistorySelector = trackHistorySelector;