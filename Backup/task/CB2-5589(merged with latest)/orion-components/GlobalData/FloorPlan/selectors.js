"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.floorPlanSelector = void 0;
var floorPlanSelector = function floorPlanSelector(state) {
  return state.globalData.floorPlanWithFacilityFeedId.floorPlans;
};
exports.floorPlanSelector = floorPlanSelector;