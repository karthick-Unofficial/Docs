"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEvent = exports.initialEventBatchReceived = exports.getEventTypes = exports.getAllTemplates = exports.getAllEvents = exports.eventTemplateRemoved = exports.eventTemplateReceived = exports.eventRemoved = exports.eventReceived = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Used by getAllEvents to set initial events in state by hash
var initialEventBatchReceived = function initialEventBatchReceived(events) {
  return {
    type: t.INITIAL_EVENT_BATCH_RECEIVED,
    payload: events
  };
};

// Used by getAllEvents to set event to state by hash
exports.initialEventBatchReceived = initialEventBatchReceived;
var eventReceived = function eventReceived(event) {
  return {
    type: t.EVENT_RECEIVED,
    payload: event
  };
};

// Used by getAllEvents to set event comment count to state by hash (eventId)
exports.eventReceived = eventReceived;
var receivedCommentCount = function receivedCommentCount(eventId, stats) {
  return {
    type: t.RECEIVED_EVENT_COMMENT_COUNT,
    payload: {
      eventId: eventId,
      stats: stats
    }
  };
};
var eventRemoved = function eventRemoved(eventId) {
  return {
    type: t.EVENT_REMOVED,
    payload: {
      eventId: eventId
    }
  };
};
exports.eventRemoved = eventRemoved;
var eventUpdated = function eventUpdated(eventId, event) {
  return {
    type: t.EVENT_UPDATED,
    payload: {
      eventId: eventId,
      event: event
    }
  };
};

/*
 * Get all events
 * @param format: format of object to return (ex. intermediate)
 */
var getAllEvents = function getAllEvents() {
  var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "full";
  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return function (dispatch) {
    // stream events
    _clientAppCore.eventService.subscribeEvents(format, status, type, function (err, res) {
      if (err) {
        console.log("Get all events error:", err);
      } else {
        var initialEventBatch = [];
        (0, _forEach["default"])(res).call(res, function (change) {
          if (change.type === "initial") {
            initialEventBatch.push(change.new_val);
          }
          if (change.type === "add") {
            var event = change.new_val;
            dispatch(eventReceived(event));
            dispatch(receivedCommentCount(event.id, {
              commentCount: event.commentCount
            }));
          } else if (change.type === "change") {
            var _event = change.new_val;
            dispatch(eventUpdated(_event.id, _event));
            dispatch(receivedCommentCount(_event.id, {
              commentCount: _event.commentCount
            }));
          } else if (change.type === "remove") {
            var _event2 = change.old_val;
            dispatch(eventRemoved(_event2.id));
          }
        });
        if (initialEventBatch.length > 0) {
          dispatch(initialEventBatchReceived(initialEventBatch));
        }
      }
    });
  };
};
exports.getAllEvents = getAllEvents;
var eventTypesReceived = function eventTypesReceived(types) {
  return {
    type: t.EVENT_TYPES_RECEIVED,
    payload: {
      types: types
    }
  };
};
var getEventTypes = function getEventTypes() {
  return function (dispatch) {
    _clientAppCore.eventTypeService.getEventTypes(function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      dispatch(eventTypesReceived(response));
    });
  };
};
exports.getEventTypes = getEventTypes;
var updateEvent = function updateEvent(eventId, event) {
  return function () {
    _clientAppCore.eventService.updateEvent(eventId, event, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
    });
  };
};
exports.updateEvent = updateEvent;
var eventTemplateReceived = function eventTemplateReceived(event) {
  return {
    type: t.EVENT_TEMPLATE_RECEIVED,
    payload: event
  };
};
exports.eventTemplateReceived = eventTemplateReceived;
var eventTemplateRemoved = function eventTemplateRemoved(eventId) {
  return {
    type: t.EVENT_TEMPLATE_REMOVED,
    payload: {
      eventId: eventId
    }
  };
};
exports.eventTemplateRemoved = eventTemplateRemoved;
var eventTemplateUpdated = function eventTemplateUpdated(eventId, event) {
  return {
    type: t.EVENT_TEMPLATE_UPDATED,
    payload: {
      eventId: eventId,
      event: event
    }
  };
};
var getAllTemplates = function getAllTemplates() {
  var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "full";
  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return function (dispatch) {
    // stream event templates
    _clientAppCore.eventService.subscribeTemplates(format, status, type, function (err, res) {
      if (err) {
        console.log("Get all event templates error:", err);
      } else {
        (0, _forEach["default"])(res).call(res, function (change) {
          if (change.type === "add" || change.type === "initial") {
            var event = change.new_val;
            dispatch(eventTemplateReceived(event));
          } else if (change.type === "change") {
            var _event3 = change.new_val;
            dispatch(eventTemplateUpdated(_event3.id, _event3));
          } else if (change.type === "remove") {
            var _event4 = change.old_val;
            dispatch(eventTemplateRemoved(_event4.id));
          }
        });
      }
    });
  };
};
exports.getAllTemplates = getAllTemplates;