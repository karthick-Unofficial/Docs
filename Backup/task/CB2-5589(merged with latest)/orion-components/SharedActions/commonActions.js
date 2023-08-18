"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.closeProfile = exports.addRemoveFromEvents = exports.addRemoveFromCollections = void 0;
exports.createCollection = createCollection;
exports.deleteCollection = deleteCollection;
exports.restoreCollection = restoreCollection;
exports.updateActivityFilters = exports.setWidgetOrder = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _Actions = require("orion-components/AppState/Actions");
var _index = require("orion-components/Dock/Actions/index.js");
var _clientAppCore = require("client-app-core");
var _Actions2 = require("orion-components/ContextPanel/Actions");
var updateActivityFilters = function updateActivityFilters(appId, keyVal) {
  return function (dispatch) {
    dispatch((0, _Actions.updatePersistedState)(appId, "activityFilters", keyVal));
  };
};
exports.updateActivityFilters = updateActivityFilters;
var setWidgetOrder = function setWidgetOrder(profile, widgets) {
  return function (dispatch, getState) {
    var appId = getState().application.appId;
    var keyVal = (0, _defineProperty2["default"])({}, profile, widgets);
    if (appId === "cameras-app") {
      dispatch((0, _Actions.updatePersistedState)(appId, "profileWidgetOrder", keyVal, false));
    } else {
      dispatch((0, _Actions.updatePersistedState)(appId, "profileWidgetOrder", keyVal));
    }
  };
};
exports.setWidgetOrder = setWidgetOrder;
var addRemoveFromCollections = function addRemoveFromCollections(entityId, added, removed, entityName, entityType, feedId, undoing) {
  return function (dispatch) {
    var addedIds = (0, _map["default"])(added).call(added, function (collection) {
      return collection.id;
    });
    var removedIds = (0, _map["default"])(removed).call(removed, function (collection) {
      return collection.id;
    });
    _clientAppCore.entityCollection.addRemoveMemberToMulti(entityId, entityName, entityType, feedId, addedIds, removedIds, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        if (!undoing) {
          var undo = true;
          var undoFunc = function undoFunc() {
            dispatch(
            // We pass null for entityName, entityType, and feedId to prevent activities
            // from generating when we undo a collection update
            addRemoveFromCollections(entityId, removed, added, null, null, null, undo));
          };
          var addedMessage = "";
          var removedMessage = "";
          if (added[0]) {
            (0, _forEach["default"])(added).call(added, function (collection, index) {
              addedMessage += index !== added.length - 1 ? "".concat(collection.name, ", ") : "".concat(collection.name);
            });
          }
          if (removed[0]) {
            (0, _forEach["default"])(removed).call(removed, function (collection, index) {
              removedMessage += index !== removed.length - 1 ? "".concat(collection.name, ", ") : "".concat(collection.name);
            });
          }
          var completeMessage = addedMessage ? entityName + " added to " + addedMessage + "." : "";
          completeMessage += removedMessage ? entityName + " removed from " + removedMessage + "." : "";
          dispatch((0, _index.createUserFeedback)(completeMessage, undoFunc));
        }
      }
    });
  };
};
exports.addRemoveFromCollections = addRemoveFromCollections;
var addRemoveFromEvents = function addRemoveFromEvents(entityId, entityType, feedId, added, removed) {
  return function () {
    _clientAppCore.eventService.updatePinnedEntities(entityId, entityType, feedId, added, removed, function (err, response) {
      if (err) {
        console.log(err, response);
      }
    });
  };
};
exports.addRemoveFromEvents = addRemoveFromEvents;
var closeProfile = function closeProfile() {
  return function (dispatch) {
    dispatch((0, _Actions2.closeSecondary)());
    dispatch((0, _Actions.clearSelectedEntity)());
  };
};
exports.closeProfile = closeProfile;
function createCollection(name, members) {
  return function (dispatch, getState) {
    var state = getState();
    _clientAppCore.entityCollection.createCollection(name, members, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        if (state.appId && state.appId === "events-app" || state.appId === "map-app") {
          var id = response.generated_keys[0];
          var undo = true;
          var undoFunc = function undoFunc() {
            dispatch(deleteCollection(id, name, undo));
          };
          dispatch((0, _index.createUserFeedback)(name + " has been created.", undoFunc));
        }
      }
    });
  };
}
function deleteCollection(collectionId, collectionName, undoing) {
  return function (dispatch) {
    _clientAppCore.entityCollection.deleteCollection(collectionId, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        if (!undoing) {
          var undoFunc = function undoFunc() {
            dispatch(restoreCollection(collectionId));
          };
          dispatch((0, _index.createUserFeedback)(collectionName + " has been deleted.", undoFunc));
        }
      }
    });
  };
}
function restoreCollection(collectionId) {
  return function () {
    _clientAppCore.entityCollection.restoreCollection(collectionId, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    });
  };
}