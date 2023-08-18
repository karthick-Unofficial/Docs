"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.rulesSelector = void 0;
var _reselect = require("reselect");
var _values = _interopRequireDefault(require("lodash/values"));
var ruleState = function ruleState(state) {
  return state.globalData.rules;
};
var rulesSelector = (0, _reselect.createSelector)(ruleState, function (rules) {
  return (0, _values["default"])(rules);
});
exports.rulesSelector = rulesSelector;