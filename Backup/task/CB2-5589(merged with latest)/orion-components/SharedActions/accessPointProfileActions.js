"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
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
exports.attachFilesToAccessPoint = void 0;
_Object$defineProperty(exports, "createCollection", {
  enumerable: true,
  get: function get() {
    return _commonActions.createCollection;
  }
});
_Object$defineProperty(exports, "linkEntities", {
  enumerable: true,
  get: function get() {
    return _entityProfileActions.linkEntities;
  }
});
_Object$defineProperty(exports, "unlinkEntities", {
  enumerable: true,
  get: function get() {
    return _entityProfileActions.unlinkEntities;
  }
});
exports.updateAccesspoint = void 0;
_Object$defineProperty(exports, "updateActivityFilters", {
  enumerable: true,
  get: function get() {
    return _commonActions.updateActivityFilters;
  }
});
var _clientAppCore = require("client-app-core");
var _entityProfileActions = require("./entityProfileActions");
var _commonActions = require("./commonActions");
var attachFilesToAccessPoint = function attachFilesToAccessPoint(accessPointId, entityType, files) {
  return function () {
    _clientAppCore.attachmentService.uploadFiles(accessPointId, "accessPoint", files, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
  };
};
exports.attachFilesToAccessPoint = attachFilesToAccessPoint;
var updateAccesspoint = function updateAccesspoint(accessPointId, accessPoint) {
  return function () {
    _clientAppCore.accessPointService.update(accessPointId, accessPoint, function (err, response) {
      if (err) {
        console.log(err, response);
      }
    });
  };
};
exports.updateAccesspoint = updateAccesspoint;