"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "addRemoveFromCollections", {
  enumerable: true,
  get: function get() {
    return _commonActions.addRemoveFromCollections;
  }
});
_Object$defineProperty(exports, "addRemoveFromEvents", {
  enumerable: true,
  get: function get() {
    return _commonActions.addRemoveFromEvents;
  }
});
exports.hideFOV = exports.attachFilesToCamera = void 0;
_Object$defineProperty(exports, "linkEntities", {
  enumerable: true,
  get: function get() {
    return _entityProfileActions.linkEntities;
  }
});
exports.showFOV = void 0;
_Object$defineProperty(exports, "unlinkEntities", {
  enumerable: true,
  get: function get() {
    return _entityProfileActions.unlinkEntities;
  }
});
_Object$defineProperty(exports, "updateActivityFilters", {
  enumerable: true,
  get: function get() {
    return _commonActions.updateActivityFilters;
  }
});
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _clientAppCore = require("client-app-core");
var _Actions = require("orion-components/GlobalData/Actions");
var _keys = _interopRequireDefault(require("lodash/keys"));
var _pull = _interopRequireDefault(require("lodash/pull"));
var _entityProfileActions = require("./entityProfileActions");
var _commonActions = require("./commonActions");
var attachFilesToCamera = function attachFilesToCamera(cameraId, entityType, files) {
  return function () {
    _clientAppCore.attachmentService.uploadFiles(cameraId, "camera", files, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
  };
};
exports.attachFilesToCamera = attachFilesToCamera;
var showFOV = function showFOV(cameraId) {
  return function (dispatch, getState) {
    var _context;
    var cameraIds = [cameraId];
    var fovs = getState().globalData.fovs;
    if (fovs) cameraIds = (0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(cameraIds), (0, _toConsumableArray2["default"])((0, _keys["default"])(fovs.data)));
    dispatch((0, _Actions.subscribeFOVs)(cameraIds));
  };
};
exports.showFOV = showFOV;
var hideFOV = function hideFOV(cameraId) {
  return function (dispatch, getState) {
    var cameraIds = [];
    var fovs = getState().globalData.fovs;
    if (fovs) cameraIds = (0, _pull["default"])((0, _keys["default"])(fovs.data), cameraId);
    dispatch((0, _Actions.unsubscribeFOVs)([cameraId], fovs.subscription));
    dispatch((0, _Actions.subscribeFOVs)(cameraIds));
  };
};
exports.hideFOV = hideFOV;