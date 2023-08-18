"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFacility = exports.attachFilesToFacility = void 0;
exports.removeFloorPlanAccessPointsSub = removeFloorPlanAccessPointsSub;
exports.removeFloorPlanCameraSub = removeFloorPlanCameraSub;
var _Actions = require("orion-components/ContextualData/Actions");
var _clientAppCore = require("client-app-core");
function removeFloorPlanCameraSub(contextId, subscriptionId) {
  return function (dispatch) {
    dispatch((0, _Actions.removeFeed)(contextId, subscriptionId));
  };
}
function removeFloorPlanAccessPointsSub(contextId, subscriptionId) {
  return function (dispatch) {
    dispatch((0, _Actions.removeFeed)(contextId, subscriptionId));
  };
}
var attachFilesToFacility = function attachFilesToFacility(facilityId, entityType, files) {
  return function () {
    _clientAppCore.attachmentService.uploadFiles(facilityId, "facility", files, function (err, result) {
      if (err) {
        console.log(err, result);
      }
    });
  };
};
exports.attachFilesToFacility = attachFilesToFacility;
var deleteFacility = function deleteFacility(facilityId) {
  _clientAppCore.facilityService["delete"](facilityId);
};
exports.deleteFacility = deleteFacility;