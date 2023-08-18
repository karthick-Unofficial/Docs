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
exports.attachFilesToEntity = attachFilesToEntity;
_Object$defineProperty(exports, "createCollection", {
  enumerable: true,
  get: function get() {
    return _commonActions.createCollection;
  }
});
exports.linkEntities = exports.deleteShape = void 0;
exports.shareEntityToOrg = shareEntityToOrg;
exports.unlinkEntities = void 0;
exports.unshareEntityToOrg = unshareEntityToOrg;
var _clientAppCore = require("client-app-core");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _actions = require("orion-components/Dock/actions");
var _Actions = require("orion-components/ContextPanel/Actions");
var _Actions2 = require("orion-components/Map/Tools/Actions");
var _Actions3 = require("orion-components/AppState/Actions");
var _commonActions = require("./commonActions");
var linkEntities = function linkEntities(entity, linkType, added) {
  return function () {
    for (var i = 0; i < added.length; i++) {
      _clientAppCore.linkedEntitiesService.create({
        type: linkType,
        entities: [{
          id: entity.id,
          type: entity.entityType
        }, added[i]]
      }, function (err, response) {
        if (err) {
          console.log(err, response);
        }
      });
    }
  };
};
exports.linkEntities = linkEntities;
var unlinkEntities = function unlinkEntities(entities, linkType) {
  return function () {
    _clientAppCore.linkedEntitiesService["delete"](entities, linkType, function (err, response) {
      if (err) {
        console.log(err, response);
      }
    });
  };
};
exports.unlinkEntities = unlinkEntities;
function shareEntityToOrg(entityId) {
  return function () {
    _clientAppCore.shapeService.share(entityId, function (err, result) {
      if (err) {
        console.log(err, result);
      }
    });
  };
}
function unshareEntityToOrg(entityId) {
  return function () {
    _clientAppCore.shapeService.unshareEntity(entityId, function (err, result) {
      if (err) {
        console.log(err, result);
      }
    });
  };
}
function attachFilesToEntity(entityId, entityType, files) {
  return function () {
    _clientAppCore.attachmentService.uploadFiles(entityId, entityType, files, function (err, result) {
      if (err) {
        console.log(err, result);
      }
    });
  };
}
var deleteShape = function deleteShape(id, name, undoing) {
  return function (dispatch, getState) {
    var state = getState();
    _clientAppCore.shapeService["delete"](id, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        if (!undoing) {
          var undoFunc = function undoFunc() {
            dispatch((0, _Actions2.restoreShape)(id));
          };
          dispatch((0, _actions.createUserFeedback)(name + " has been deleted.", undoFunc));
          if (state.appId && state.appId === "cameras-app") {
            dispatch((0, _Actions.closeSecondary)());
            dispatch((0, _Actions3.clearSelectedEntity)());
          }
        }
        if (state.appId && state.appId === "events-app") {
          dispatch((0, _Actions.loadProfile)((0, _Selectors.selectedEntityState)(state).id, (0, _Selectors.selectedEntityState)(state).name, (0, _Selectors.selectedEntityState)(state).entityType, "profile"));
        }
      }
    });
  };
};
exports.deleteShape = deleteShape;