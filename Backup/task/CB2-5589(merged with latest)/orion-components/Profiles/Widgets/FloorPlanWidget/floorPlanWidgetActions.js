"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.setFloorOrder = void 0;
var _clientAppCore = require("client-app-core");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var setFloorOrder = function setFloorOrder(floorPlans) {
  return function (dispatch, getState) {
    var _selectedContextSelec = (0, _Selectors.selectedContextSelector)(getState()),
      entity = _selectedContextSelec.entity;
    _clientAppCore.facilityService.reorderFloorplans(entity.id, floorPlans, function (err) {
      if (err) {
        console.log("ERROR:", err);
      }
    });
  };
};
exports.setFloorOrder = setFloorOrder;