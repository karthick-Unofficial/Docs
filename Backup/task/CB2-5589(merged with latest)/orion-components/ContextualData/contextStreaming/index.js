"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.unsubscribe = exports.subscriptionReceived = exports.subscriptionDataRemoved = exports.subscriptionDataBatchReceived = exports.startTrackHistoryStream = exports.startRulesStream = exports.startProximityEntitiesStream = exports.startLiveCameraStream = exports.startListStream = exports.startGateRunnerActivityStream = exports.startFloorPlanCameraStream = exports.startFloorPlanAccessPointsStream = exports.startFOVItemStream = exports.startEventPinnedItemsStream = exports.startEventCameraStream = exports.startEventActivityStream = exports.startCamerasLinkedItemsStream = exports.startCamerasInRangeStream = exports.startCameraInRangeVideoStream = exports.startAttachmentStream = exports.startActivityStream = exports.simpleUnsub = void 0;
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _clientAppCore = require("client-app-core");
var _Actions = require("../Actions");
var t = _interopRequireWildcard(require("./actionTypes"));
var _each = _interopRequireDefault(require("lodash/each"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context20, _context21; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context20 = ownKeys(Object(source), !0)).call(_context20, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context21 = ownKeys(Object(source))).call(_context21, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var subscriptionDataReceived = function subscriptionDataReceived(contextId, data, subscriptionId) {
  var iterable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var splitGeo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return {
    type: t.SUBSCRIPTION_DATA_RECEIVED,
    payload: {
      contextId: contextId,
      data: data,
      subscriptionId: subscriptionId,
      iterable: iterable,
      splitGeo: splitGeo
    }
  };
};
var subscriptionDataBatchReceived = function subscriptionDataBatchReceived(contextId, data, subscriptionId) {
  var iterable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var splitGeo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return {
    type: t.SUBSCRIPTION_DATA_BATCH_RECEIVED,
    payload: {
      contextId: contextId,
      data: data,
      subscriptionId: subscriptionId,
      iterable: iterable,
      splitGeo: splitGeo
    }
  };
};
exports.subscriptionDataBatchReceived = subscriptionDataBatchReceived;
var subscriptionDataRemoved = function subscriptionDataRemoved(contextId, dataId, subscriptionId) {
  var iterable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return {
    type: t.SUBSCRIPTION_DATA_REMOVED,
    payload: {
      contextId: contextId,
      dataId: dataId,
      subscriptionId: subscriptionId,
      iterable: iterable
    }
  };
};
exports.subscriptionDataRemoved = subscriptionDataRemoved;
var subscriptionDataUpdated = function subscriptionDataUpdated(contextId, data, subscriptionId) {
  var iterable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var splitGeo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return {
    type: t.SUBSCRIPTION_DATA_UPDATED,
    payload: {
      contextId: contextId,
      data: data,
      subscriptionId: subscriptionId,
      iterable: iterable,
      splitGeo: splitGeo
    }
  };
};

// Exported to be used for setting blank entity stream
var subscriptionReceived = function subscriptionReceived(contextId, subscription, subscriptionId, subscriberRef) {
  return {
    type: t.SET_SUBSCRIPTION,
    payload: {
      contextId: contextId,
      subscription: subscription,
      subscriptionId: subscriptionId,
      subscriberRef: subscriberRef
    }
  };
};

/**
 * Start a Camera Stream
 * @param: contextId -- Id of Camera you would like to stream
 * @param: videoProfile -- object with unsubscribe function
 * @param: subscriberRef -- reference to component that is using feed
 */
exports.subscriptionReceived = subscriptionReceived;
var startLiveCameraStream = function startLiveCameraStream(contextId, videoProfile, subscriberRef) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(dispatch) {
      var response;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _clientAppCore.cameraService.streamVideo(contextId, videoProfile);
          case 3:
            response = _context.sent;
            dispatch(subscriptionDataReceived(contextId, response, "liveCamera", false));
            dispatch(subscriptionReceived(contextId, response.channel, "liveCamera", subscriberRef));
            _context.next = 11;
            break;
          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 8]]);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};

/**
 * Start a list Stream
 * @param: eventId -- Id of Event you would like to stream lists from
 * @param: subscriberRef -- reference to component that is using feed
 */
exports.startLiveCameraStream = startLiveCameraStream;
var startListStream = function startListStream(eventId, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.eventService.streamLists(eventId, {
      expandRefs: true
    }, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        if (response.code) {
          var _context2;
          console.log((0, _concat["default"])(_context2 = "Error code: ".concat(response.code, " - ")).call(_context2, response.message));
        } else {
          if (response.type === "remove") {
            dispatch(subscriptionDataRemoved(eventId, response.old_val.id, "lists"));
          } else if (response.type === "change") {
            dispatch(subscriptionDataUpdated(eventId, response.new_val, "lists"));
          } else {
            dispatch(subscriptionDataReceived(eventId, response.new_val, "lists"));
          }
        }
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(eventId, subscription.channel, "lists", subscriberRef));
    });
  };
};

/**
 * Start an Activity Stream
 * @param: id -- Id of entity you would like to get Activities for
 * @param: targetType -- entityType of the entity you would like to get Activities for. (ex. "camera")
 * @param: contextId -- Id of entity that owns or is starting subscription
 * @param: subscriberRef -- reference to component that is using feed
 */
exports.startListStream = startListStream;
var startActivityStream = function startActivityStream(id, targetType, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.activityService.subscribeByTarget(id, targetType, null, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        dispatch(subscriptionDataReceived(id, response.new_val, "activities"));
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(id, subscription.channel, "activities", subscriberRef));
    });
  };
};

/**
 * Start an Activity Stream for an Event
 * @param: id -- Id of entity you would like to get Activities for
 * @param: contextId -- Id of entity that owns or is starting subscription
 * @param: subscriberRef -- reference to component that is using feed
 */
exports.startActivityStream = startActivityStream;
var startEventActivityStream = function startEventActivityStream(eventId, subscriberRef) {
  var amount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  return function (dispatch) {
    _clientAppCore.activityService.subscribeByEvent(eventId, "event", amount, null, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        dispatch(subscriptionDataReceived(eventId, response.new_val, "activities"));
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(eventId, subscription.channel, "activities", subscriberRef));
    });
  };
};

/**
 * Start an Activity Stream
 * @param: id -- Id of entity you would like to get Activities for
 * @param: targetType -- entityType of the entity you would like to get Activities for. (ex. "camera")
 * @param: contextId -- Id of entity that owns or is starting subscription
 * @param: subscriberRef -- reference to component that is using feed
 */
exports.startEventActivityStream = startEventActivityStream;
var startGateRunnerActivityStream = function startGateRunnerActivityStream(id, targetType, filterOptions, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.activityService.subscribeByTarget(id, targetType, filterOptions, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        dispatch(subscriptionDataReceived(id, response.new_val, "activities"));
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(id, subscription.channel, "activities", subscriberRef));
    });
  };
};

/*
 * Start an Attachment Stream
 * @param: id -- Id of entity you would like to get Attachments for
 * @param: entityType -- entityType of the entity you would like to get Attachments for
 * @param: contextId -- Id of entity that owns or is starting subscription
 * @param: subscriberRef -- reference to component that is using feed
 */
exports.startGateRunnerActivityStream = startGateRunnerActivityStream;
var startAttachmentStream = function startAttachmentStream(id, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.attachmentService.subscribeByTarget(id, function (err, response) {
      if (err) {
        console.log(err);
      }
      if (!response) return;
      switch (response.type) {
        case "initial":
        case "add":
        case "change":
          {
            dispatch(subscriptionDataReceived(id, response.new_val, "attachments"));
            break;
          }
        case "remove":
          dispatch(subscriptionDataRemoved(id, response.old_val.id, "attachments"));
          break;
        default:
          break;
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(id, subscription.channel, "attachments", subscriberRef));
    });
  };
};
exports.startAttachmentStream = startAttachmentStream;
var startEventPinnedItemsStream = function startEventPinnedItemsStream(eventId, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.eventService.subscribeEventPinnedItems(eventId, function (err, response) {
      if (err || response.err) {
        console.log(response.err);
      } else if (response.changes) {
        var _context3;
        (0, _forEach["default"])(_context3 = response.changes).call(_context3, function (update) {
          var item = update.new_val;
          if (item && (update.type === "add" || update.type === "initial" || update.type === "change")) {
            dispatch(subscriptionDataReceived(eventId, item, "pinnedItems"));
          } else if (update.type === "remove") {
            dispatch(subscriptionDataRemoved(eventId, update.old_val.id, "pinnedItems"));
          }
        });
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(eventId, subscription.channel, "pinnedItems", subscriberRef));
    });
  };
};

/**
 * Stream cameras associated with an event. This includes:
 * 	- Cameras pinned to event
 * 	- Cameras that include the event in their FOV
 * @param {string} eventId
 */
exports.startEventPinnedItemsStream = startEventPinnedItemsStream;
var startEventCameraStream = function startEventCameraStream(eventId, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.eventService.subscribeEventCameras(eventId, function (err, res) {
      if (err) console.log(err);else {
        var _context4;
        (0, _forEach["default"])(_context4 = res.changes).call(_context4, function (change) {
          switch (change.type) {
            case "initial":
            case "add":
            case "change":
              dispatch(subscriptionDataReceived(eventId, change.new_val, "eventCameras"));
              break;
            case "remove":
              dispatch(subscriptionDataRemoved(eventId, change.old_val.id, "eventCameras"));
              break;
            default:
              break;
          }
        });
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(eventId, subscription.channel, "eventCameras", subscriberRef));
    });
  };
};

/**
 * Stream cameras associated with a facility's floorplan. This includes:
 * 	- Cameras attached to a floorplan
 * @param {string} facilityId
 * @param {string} floorPlanId
 */
exports.startEventCameraStream = startEventCameraStream;
var startFloorPlanCameraStream = function startFloorPlanCameraStream(facilityId, floorPlanId, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.facilityService.streamFloorplanCameras(facilityId, floorPlanId, function (err, res) {
      if (err) console.log(err);else {
        (0, _forEach["default"])(res).call(res, function (change) {
          switch (change.type) {
            case "initial":
            case "add":
            case "change":
              dispatch(subscriptionDataBatchReceived(facilityId, [change.new_val], "floorPlanCameras"));
              break;
            case "remove":
              dispatch(subscriptionDataRemoved(facilityId, change.old_val.id, "floorPlanCameras"));
              break;
            default:
              break;
          }
        });
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(facilityId, subscription.channel, "floorPlanCameras", subscriberRef));
    });
  };
};

/**
 * Stream accessPoints associated with a facility's floorplan. This includes:
 * 	- Access Points attached to a floorplan
 * @param {string} facilityId
 * @param {string} floorPlanId
 */
exports.startFloorPlanCameraStream = startFloorPlanCameraStream;
var startFloorPlanAccessPointsStream = function startFloorPlanAccessPointsStream(facilityId, floorPlanId, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.facilityService.streamFloorplanAccessPoints(facilityId, floorPlanId, function (err, res) {
      if (err) console.log(err);else {
        (0, _forEach["default"])(res).call(res, function (change) {
          switch (change.type) {
            case "initial":
            case "add":
            case "change":
              dispatch(subscriptionDataBatchReceived(facilityId, [change.new_val], "floorPlanAccessPoints"));
              break;
            case "remove":
              dispatch(subscriptionDataRemoved(facilityId, change.old_val.id, "floorPlanAccessPoints"));
              break;
            default:
              break;
          }
        });
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(facilityId, subscription.channel, "floorPlanAccessPoints", subscriberRef));
    });
  };
};
exports.startFloorPlanAccessPointsStream = startFloorPlanAccessPointsStream;
var startCamerasLinkedItemsStream = function startCamerasLinkedItemsStream(contextId, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.linkedEntitiesService.subscribeLinkedEntities(contextId, "camera", null, function (err, response) {
      if (err) {
        console.log("ERR", err);
      } else if (response.message) {
        console.log("Error: ", response.message);
      } else {
        var _context5;
        console.log("response: ", response);
        (0, _forEach["default"])(_context5 = (0, _filter["default"])(response).call(response, function (r) {
          return !!r;
        })).call(_context5, function (r) {
          switch (r.type) {
            case "initial":
            case "add":
            case "change":
              dispatch(subscriptionDataReceived(contextId, r.new_val, "linkedEntities"));
              break;
            case "remove":
              dispatch(subscriptionDataRemoved(contextId, r.old_val.id, "linkedEntities"));
              break;
            default:
              break;
          }
        });
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(contextId, subscription.channel, "linkedEntities", subscriberRef));
    });
  };
};
// Stream Items in FOV, called by method below
exports.startCamerasLinkedItemsStream = startCamerasLinkedItemsStream;
var getItemsInFOV = function getItemsInFOV(contextId, subscriberRef, poly) {
  return function (dispatch, getState) {
    var _context7;
    var state = getState();
    _clientAppCore.eventService.subscribeActiveEvents(poly.entityData.geometry, function (err, response) {
      if (err) {
        console.log("ERR", err);
      } else {
        var _context6;
        (0, _forEach["default"])(_context6 = (0, _filter["default"])(response).call(response, function (r) {
          return !!r;
        })).call(_context6, function (r) {
          switch (r.type) {
            case "initial":
            case "add":
            case "change":
              dispatch(subscriptionDataReceived(contextId, r.new_val, "fovEvents"));
              break;
            case "remove":
              dispatch(subscriptionDataRemoved(contextId, r.old_val.id, "fovEvents"));
              break;
            default:
              break;
          }
        });
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(contextId, subscription.channel, "fovEvents", subscriberRef));
    });
    var integrations = (0, _filter["default"])(_context7 = (0, _values["default"])(state.session.userFeeds)).call(_context7, function (_int) {
      return _int.canView;
    });
    (0, _forEach["default"])(integrations).call(integrations, function (_int2) {
      _clientAppCore.feedService.subscribeFilteredFeed(_int2.source === "app" ? "system" : "external", _int2.feedId, {
        expandRefs: false,
        inclusionGeo: poly.entityData.geometry
      }, function (err, response) {
        if (err) {
          console.log(err);
        } else {
          if (response.ignoreBatches) {
            switch (response.change.type) {
              case "add":
              case "initial":
              case "change":
                dispatch(subscriptionDataReceived(contextId, response.change.new_val, "fovItems"));
                break;
              case "remove":
                dispatch(subscriptionDataRemoved(contextId, response.change.old_val.id, "fovItems"));
                break;
              default:
                break;
            }
          } else {
            var _context8, _context9, _context10, _context11, _context12, _context13, _context14, _context15, _context16;
            if (!(0, _includes["default"])(_context8 = ["all-data", "globalGeo", "globalData"]).call(_context8, response.batch)) return;
            var initial = (0, _map["default"])(_context9 = (0, _filter["default"])(_context10 = response.changes).call(_context10, function (change) {
              return change.type === "initial";
            })).call(_context9, function (change) {
              return change.new_val;
            });
            var changes = (0, _map["default"])(_context11 = (0, _filter["default"])(_context12 = response.changes).call(_context12, function (change) {
              return change.type === "change";
            })).call(_context11, function (change) {
              return change.new_val;
            });
            var additions = (0, _map["default"])(_context13 = (0, _filter["default"])(_context14 = response.changes).call(_context14, function (change) {
              return change.type === "add";
            })).call(_context13, function (change) {
              return change.new_val;
            });
            var removals = (0, _map["default"])(_context15 = (0, _filter["default"])(_context16 = response.changes).call(_context16, function (change) {
              return change.type === "remove";
            })).call(_context15, function (change) {
              return change.old_val.id;
            });
            if (removals.length) {
              (0, _each["default"])(removals, function (id) {
                return dispatch(subscriptionDataRemoved(contextId, id, "fovItems"));
              });
            }
            if (initial.length) {
              dispatch(subscriptionDataBatchReceived(contextId, initial, "fovItems"));
            }
            if (changes.length) {
              (0, _each["default"])(changes, function (change) {
                return dispatch(subscriptionDataUpdated(contextId, change, "fovItems"));
              });
            }
            if (additions.length) {
              (0, _each["default"])(additions, function (addition) {
                return dispatch(subscriptionDataReceived(contextId, addition, "fovItems"));
              });
            }
          }
        }
      }, true,
      // ignoreBatches,
      [contextId] // excludeEntities -- Do not include camera in its own FOV item stream
      ).then(function (subscription) {
        dispatch(subscriptionReceived(contextId, subscription.channel, "fovItems", subscriberRef));
      });
    });
  };
};

// Stream FOV
var startFOVItemStream = function startFOVItemStream(contextId, subscriberRef) {
  return function (dispatch) {
    _promise["default"].resolve(_clientAppCore.cameraService.streamFOVs([contextId], function (err, response) {
      if (err) {
        console.log(err);
      } else {
        var poly;
        // False is passed in order to override iterable default
        switch (response.type) {
          case "initial-batch":
            poly = response.changes[0];
            dispatch(subscriptionDataReceived(contextId, poly, "fov", false));
            break;
          case "change":
            poly = response.new_val;

            // Remove old FOV Item subscription
            dispatch((0, _Actions.unsubscribeFromFeed)(contextId, "fovItems", subscriberRef));
            if (poly) {
              dispatch(subscriptionDataReceived(contextId, poly, "fov", false));
            }
            break;
          default:
            break;
        }
        if (poly) {
          dispatch(getItemsInFOV(contextId, subscriberRef, poly));
        }
      }
    })).then(function (subscription) {
      dispatch(subscriptionReceived(contextId, subscription.channel, "fov", subscriberRef));
    });
  };
};

/*
 * Start a stream of camera objects that are in range
 */
exports.startFOVItemStream = startFOVItemStream;
var startCamerasInRangeStream = function startCamerasInRangeStream(contextId, entityType, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.associationService.streamCameraAssociations(contextId, entityType, "entity", function (err, response) {
      if (err) console.log(err);else {
        if (response.add) {
          dispatch(subscriptionDataBatchReceived(contextId, response.add, "camerasInRange"));
        } else if (response.remove) {
          var _context17;
          (0, _forEach["default"])(_context17 = response.remove).call(_context17, function (item) {
            dispatch(subscriptionDataRemoved(contextId, item.id, "camerasInRange"));
          });
        } else if (response.update) {
          var _context18;
          (0, _forEach["default"])(_context18 = response.update).call(_context18, function (update) {
            dispatch(subscriptionDataUpdated(contextId, update, "camerasInRange", false));
          });
        }
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(contextId, subscription.channel, "camerasInRange", subscriberRef));
    });
  };
};

/*
 * Start a stream of camera video for a single camera that is in range (Cameras Widget)
 */
exports.startCamerasInRangeStream = startCamerasInRangeStream;
var startCameraInRangeVideoStream = function startCameraInRangeVideoStream(contextId, cameraId, videoProfile, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.cameraService.streamVideo(cameraId, videoProfile, function (err, response) {
      if (err) console.log(err);else {
        dispatch(subscriptionDataReceived(contextId, response, "cameraInRangeVideo", false));
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(contextId, subscription.channel, "cameraInRangeVideo", subscriberRef));
    });
  };
};
exports.startCameraInRangeVideoStream = startCameraInRangeVideoStream;
var startTrackHistoryStream = function startTrackHistoryStream(contextEntity, subscriberRef, duration, forReplay) {
  return function (dispatch) {
    if (forReplay) {
      dispatch(subscriptionDataBatchReceived(contextEntity.id, [], "trackHistory", false));
    } else {
      var now = new Date();
      var startTime = new Date();
      startTime.setMinutes(now.getMinutes() - duration);
      var body = {
        fields: {
          entities: [{
            id: contextEntity.id,
            entityType: contextEntity.entityType,
            feedId: contextEntity.feedId
          }],
          startDate: startTime,
          endDate: now,
          duration: duration
        }
      };
      _clientAppCore.restClient.exec_post("/ecosystem/api/ecolink/track-history", (0, _stringify["default"])(body), function (err, result) {
        if (err) console.log(err);else {
          var data = result.data;
          // Exit if no data to return
          // This needs better error handling
          if (!data || !(0, _isArray["default"])(data[0].groups)) {
            return;
          }
          var groups = data[0].groups;
          var rowArray = [];
          if (groups.length > 0) {
            var rows = groups[0].rows;
            (0, _forEach["default"])(rows).call(rows, function (row) {
              rowArray.push({
                entityData: {
                  geometry: {
                    coordinates: [row.lng, row.lat],
                    type: "Point"
                  },
                  properties: _objectSpread(_objectSpread({}, row), {}, {
                    id: groups[0].id
                  })
                }
              });
            });
          }
          _promise["default"].resolve(dispatch(subscriptionDataBatchReceived(contextEntity.id, rowArray, "trackHistory", false))).then(function (subscription) {
            dispatch(subscriptionReceived(contextEntity.id, null, "trackHistory", subscriberRef));

            // subscribe to entity stream to get updates for track history
            _clientAppCore.feedService.streamEntityByType(contextEntity.id, "track", function (err, response) {
              if (err) console.log(err);else {
                if (!response) return;
                switch (response.type) {
                  case "initial":
                    // Add context to state
                    dispatch((0, _Actions.addContext)(contextEntity.id, response.new_val));
                    break;
                  case "change":
                    // Update context entity data (ie updated track details)
                    dispatch((0, _Actions.updateContext)(contextEntity.id, response.new_val));
                    break;
                  default:
                    break;
                }
              }
            }).then(function (subscription) {
              // Set feed subscription
              dispatch(subscriptionReceived(contextEntity.id, subscription.channel, "entity", subscriberRef));
            });
          }).then(function () {
            dispatch((0, _Actions.addSubscriber)(contextEntity.id, "trackHistory", "map"));
          });
        }
      });
    }
  };
};
exports.startTrackHistoryStream = startTrackHistoryStream;
var startRulesStream = function startRulesStream(entityId, subscriberRef) {
  return function (dispatch) {
    _clientAppCore.ruleService.streamRules(entityId, function (err, res) {
      if (err) console.log(err);else if (!res) {
        return;
      } else {
        var rule = res.new_val;

        // Ensure rule was added to state before attempting to remove it
        if (rule.deleted === true && res.old_val) {
          dispatch(subscriptionDataRemoved(entityId, res.old_val.id, "rules"));
        } else if (!rule.deleted) {
          dispatch(subscriptionDataReceived(entityId, rule, "rules"));
        }
      }
    }).then(function (subscription) {
      dispatch(subscriptionReceived(entityId, subscription.channel, "rules", subscriberRef));
    });
  };
};
exports.startRulesStream = startRulesStream;
var startProximityEntitiesStream = function startProximityEntitiesStream(contextId, geometry, radiuses, subscriberRef) {
  return function (dispatch, getState) {
    var _context19;
    var state = getState();
    var proximityEntityTypes = ["track", "shapes", "facility", "camera"];
    var integrations = (0, _filter["default"])(_context19 = state.session.user.profile.integrations).call(_context19, function (_int3) {
      return _int3.config.canView && (0, _includes["default"])(proximityEntityTypes).call(proximityEntityTypes, _int3.entityType);
    });
    (0, _forEach["default"])(integrations).call(integrations, function (_int4) {
      _clientAppCore.eventService.streamProximityEntities(contextId, _int4.feedId, geometry, radiuses, function (err, response) {
        if (err) console.log(err);
        if (!response) return;
        switch (response.type) {
          case "initial-batch":
            dispatch(subscriptionDataBatchReceived(contextId, response.changes, "proximityEntities"));
            break;
          case "add":
          case "change":
            if (response.new_val) {
              dispatch(subscriptionDataReceived(contextId, response.new_val, "proximityEntities"));
            }
            break;
          case "remove":
            dispatch(subscriptionDataRemoved(contextId, response.old_val.id, "proximityEntities"));
            break;
          default:
            break;
        }
      }).then(function (subscription) {
        dispatch(subscriptionReceived(contextId, subscription.channel, "proximityEntities", subscriberRef));
      });
    });
  };
};

// This method is used by action creators to unsubscribe from contextual data subscriptions
// Since it is being wrapped in dispatch, in order to return a function, it must have dispatch also.
// But, because it returns a dispatch, it must be passed down via a Redux container.
exports.startProximityEntitiesStream = startProximityEntitiesStream;
var unsubscribe = function unsubscribe(channel) {
  return function () {
    _clientAppCore.realtimeClient._unsubscribe(channel).then(function (data) {
      return console.log("Unsubscribed from channel: " + channel, data);
    });
  };
};

// This method does the same thing as the above method, but it is able to be imported directly into
// any file and called like a regular function. This is used mainly for camera streams at the moment,
// and solves the issue of having to pass down the unsubscribe function multiple levels for no reason.
exports.unsubscribe = unsubscribe;
var simpleUnsub = function simpleUnsub(channel) {
  _clientAppCore.realtimeClient._unsubscribe(channel).then(function (data) {
    return console.log("Unsubscribed from channel*: " + channel, data);
  });
};
exports.simpleUnsub = simpleUnsub;