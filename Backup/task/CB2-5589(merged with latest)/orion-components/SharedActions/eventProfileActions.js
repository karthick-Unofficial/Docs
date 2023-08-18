"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.unpinEntity = exports.shareEvent = exports.publishEvent = exports.deleteEventNotes = exports.attachFilesToEvent = void 0;
_Object$defineProperty(exports, "updateActivityFilters", {
  enumerable: true,
  get: function get() {
    return _commonActions.updateActivityFilters;
  }
});
exports.updateEventNotes = void 0;
var _clientAppCore = require("client-app-core");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _commonActions = require("./commonActions");
var unpinEntity = function unpinEntity(itemType, itemId) {
  return function (dispatch, getState) {
    var state = getState();
    var eventId = (0, _Selectors.primaryContextSelector)(state);
    _clientAppCore.eventService.unpinEntity(eventId, itemType, itemId, function (err, response) {
      if (err) {
        console.log(err, response);
      }
    });
  };
};
exports.unpinEntity = unpinEntity;
var attachFilesToEvent = function attachFilesToEvent(eventId, entityType, files) {
  return function () {
    _clientAppCore.attachmentService.uploadFiles(eventId, "event", files, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
  };
};
exports.attachFilesToEvent = attachFilesToEvent;
var publishEvent = function publishEvent(eventId) {
  return function () {
    _clientAppCore.eventService.makeEventPublic(eventId, function (err, response) {
      if (err) {
        console.log(err, response);
      }
    });
  };
};
exports.publishEvent = publishEvent;
var shareEvent = function shareEvent(eventId, orgId) {
  return function () {
    _clientAppCore.eventService.shareEvent(eventId, orgId, function (err, response) {
      if (err) {
        console.log(err, response);
      }
    });
  };
};
exports.shareEvent = shareEvent;
var updateEventNotes = function updateEventNotes(event, notes, callback) {
  if (callback) {
    return function () {
      _clientAppCore.eventService.updateEventNotes(event.id, event.notes, notes, callback);
    };
  } else {
    return function () {
      _clientAppCore.eventService.updateEventNotes(event.id, event.notes, notes, function (err, result) {
        if (err) {
          console.log(err);
        } else return result;
      });
    };
  }
};
exports.updateEventNotes = updateEventNotes;
var deleteEventNotes = function deleteEventNotes(eventId, callback) {
  if (callback) {
    return function () {
      _clientAppCore.eventService.deleteEventNotes(eventId, callback);
    };
  } else {
    return function () {
      _clientAppCore.eventService.deleteEventNotes(eventId, function (err, result) {
        if (err) {
          console.log(err);
        } else return result;
      });
    };
  }
};
exports.deleteEventNotes = deleteEventNotes;