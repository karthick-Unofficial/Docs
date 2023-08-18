"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.userFeedsSelector = void 0;
var _reselect = require("reselect");
var _values = _interopRequireDefault(require("lodash/values"));
var userFeedState = function userFeedState(state) {
  return state.session.userFeeds;
};
var userFeedsSelector = (0, _reselect.createSelector)(userFeedState, function (userFeeds) {
  return (0, _values["default"])(userFeeds);
});
exports.userFeedsSelector = userFeedsSelector;