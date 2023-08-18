"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.userExclusionSelector = void 0;
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _reselect = require("reselect");
var exclusionState = function exclusionState(state) {
  return state.globalData.exclusions;
};
var userIdSelector = function userIdSelector(state) {
  return state.session.user.profile.id;
};
var userExclusionSelector = (0, _reselect.createSelector)(userIdSelector, exclusionState, function (userId, exclusions) {
  var _context;
  var userExclusions = exclusions[userId] ? (0, _filter["default"])(_context = exclusions[userId]).call(_context, function (exclusion) {
    return exclusion.userId === userId;
  }) : [];
  return userExclusions;
});
exports.userExclusionSelector = userExclusionSelector;