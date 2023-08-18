"use strict";

var _context9;
var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  dataBatchReceived: true,
  dataReceived: true,
  removeData: true,
  setDataSubscription: true,
  runQueue: true,
  subscribeData: true,
  ignoreEntity: true,
  subscribeFeed: true,
  unsubscribeGlobalFeed: true,
  getAllEvents: true,
  getEventTypes: true,
  updateEvent: true,
  getAllTemplates: true,
  subscribeCameras: true,
  subscribeCollections: true,
  subscribeRules: true,
  subscribeFeedPermissions: true,
  setFeedPermissions: true,
  subscribeAppFeedPermissions: true,
  fetchGISData: true,
  subscribeFOVs: true,
  unsubscribeFOVs: true,
  getAllLists: true,
  createList: true,
  getLookupValues: true,
  updateList: true,
  deleteList: true,
  streamLists: true,
  duplicateList: true,
  getAllListCategories: true,
  getListCategory: true,
  createListCategory: true,
  updateListCategory: true,
  deleteListCategory: true,
  streamListCategories: true,
  subscribeExclusions: true,
  subscribeFloorPlansWithFacilityFeedId: true,
  subscribeUnitMembers: true,
  subscribeUnits: true
};
_Object$defineProperty(exports, "createList", {
  enumerable: true,
  get: function get() {
    return _actions8.createList;
  }
});
_Object$defineProperty(exports, "createListCategory", {
  enumerable: true,
  get: function get() {
    return _actions9.createListCategory;
  }
});
exports.dataReceived = exports.dataBatchReceived = void 0;
_Object$defineProperty(exports, "deleteList", {
  enumerable: true,
  get: function get() {
    return _actions8.deleteList;
  }
});
_Object$defineProperty(exports, "deleteListCategory", {
  enumerable: true,
  get: function get() {
    return _actions9.deleteListCategory;
  }
});
_Object$defineProperty(exports, "duplicateList", {
  enumerable: true,
  get: function get() {
    return _actions8.duplicateList;
  }
});
_Object$defineProperty(exports, "fetchGISData", {
  enumerable: true,
  get: function get() {
    return _actions6.fetchGISData;
  }
});
_Object$defineProperty(exports, "getAllEvents", {
  enumerable: true,
  get: function get() {
    return _actions.getAllEvents;
  }
});
_Object$defineProperty(exports, "getAllListCategories", {
  enumerable: true,
  get: function get() {
    return _actions9.getAllListCategories;
  }
});
_Object$defineProperty(exports, "getAllLists", {
  enumerable: true,
  get: function get() {
    return _actions8.getAllLists;
  }
});
_Object$defineProperty(exports, "getAllTemplates", {
  enumerable: true,
  get: function get() {
    return _actions.getAllTemplates;
  }
});
_Object$defineProperty(exports, "getEventTypes", {
  enumerable: true,
  get: function get() {
    return _actions.getEventTypes;
  }
});
_Object$defineProperty(exports, "getListCategory", {
  enumerable: true,
  get: function get() {
    return _actions9.getListCategory;
  }
});
_Object$defineProperty(exports, "getLookupValues", {
  enumerable: true,
  get: function get() {
    return _actions8.getLookupValues;
  }
});
exports.setDataSubscription = exports.runQueue = exports.removeData = exports.ignoreEntity = void 0;
_Object$defineProperty(exports, "setFeedPermissions", {
  enumerable: true,
  get: function get() {
    return _actions5.setFeedPermissions;
  }
});
_Object$defineProperty(exports, "streamListCategories", {
  enumerable: true,
  get: function get() {
    return _actions9.streamListCategories;
  }
});
_Object$defineProperty(exports, "streamLists", {
  enumerable: true,
  get: function get() {
    return _actions8.streamLists;
  }
});
_Object$defineProperty(exports, "subscribeAppFeedPermissions", {
  enumerable: true,
  get: function get() {
    return _actions5.subscribeAppFeedPermissions;
  }
});
_Object$defineProperty(exports, "subscribeCameras", {
  enumerable: true,
  get: function get() {
    return _actions2.subscribeCameras;
  }
});
_Object$defineProperty(exports, "subscribeCollections", {
  enumerable: true,
  get: function get() {
    return _actions3.subscribeCollections;
  }
});
exports.subscribeData = void 0;
_Object$defineProperty(exports, "subscribeExclusions", {
  enumerable: true,
  get: function get() {
    return _actions10.subscribeExclusions;
  }
});
_Object$defineProperty(exports, "subscribeFOVs", {
  enumerable: true,
  get: function get() {
    return _actions7.subscribeFOVs;
  }
});
exports.subscribeFeed = void 0;
_Object$defineProperty(exports, "subscribeFeedPermissions", {
  enumerable: true,
  get: function get() {
    return _actions5.subscribeFeedPermissions;
  }
});
_Object$defineProperty(exports, "subscribeFloorPlansWithFacilityFeedId", {
  enumerable: true,
  get: function get() {
    return _actions11.subscribeFloorPlansWithFacilityFeedId;
  }
});
_Object$defineProperty(exports, "subscribeRules", {
  enumerable: true,
  get: function get() {
    return _actions4.subscribeRules;
  }
});
_Object$defineProperty(exports, "subscribeUnitMembers", {
  enumerable: true,
  get: function get() {
    return _actions12.subscribeUnitMembers;
  }
});
_Object$defineProperty(exports, "subscribeUnits", {
  enumerable: true,
  get: function get() {
    return _actions13.subscribeUnits;
  }
});
_Object$defineProperty(exports, "unsubscribeFOVs", {
  enumerable: true,
  get: function get() {
    return _actions7.unsubscribeFOVs;
  }
});
exports.unsubscribeGlobalFeed = void 0;
_Object$defineProperty(exports, "updateEvent", {
  enumerable: true,
  get: function get() {
    return _actions.updateEvent;
  }
});
_Object$defineProperty(exports, "updateList", {
  enumerable: true,
  get: function get() {
    return _actions8.updateList;
  }
});
_Object$defineProperty(exports, "updateListCategory", {
  enumerable: true,
  get: function get() {
    return _actions9.updateListCategory;
  }
});
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _clientAppCore = require("client-app-core");
var t = _interopRequireWildcard(require("./actionTypes"));
var _index = require("../../ContextPanel/Actions/index");
var _each = _interopRequireDefault(require("lodash/each"));
var _actions = require("../Events/actions");
var _Actions = require("../../ContextualData/Actions");
var _contextStreaming = require("../../ContextualData/contextStreaming");
var _Selectors = require("../../ContextPanel/Selectors");
var _Actions2 = require("../../ContextPanel/Actions");
var _index2 = require("orion-components/Dock/Actions/index");
var _actions2 = require("../Cameras/actions");
var _actions3 = require("../Collections/actions");
var _actions4 = require("../Rules/actions");
var _actions5 = require("../Feeds/actions");
var _actions6 = require("../GIS/actions");
var _actions7 = require("../FOVs/actions");
var _actions8 = require("../Lists/actions");
var _actions9 = require("../ListCategories/actions");
var _actions10 = require("../Exclusions/actions");
var _Actions3 = require("orion-components/Map/Controls/Actions");
_forEachInstanceProperty2(_context9 = _Object$keys(_Actions3)).call(_context9, function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _Actions3[key]) return;
  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Actions3[key];
    }
  });
});
var _actions11 = require("../FloorPlan/actions");
var _actions12 = require("../UnitMembers/actions");
var _actions13 = require("../Units/actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Add an initial batch of data to state
 * @param data: an array of data objects
 * @param feedId: id of updated feed
 * @param key: key to store data by
 */
var dataBatchReceived = function dataBatchReceived(data, feedId, batch) {
  var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "id";
  return {
    type: t.DATA_BATCH_RECEIVED,
    payload: {
      data: data,
      feedId: feedId,
      batch: batch,
      key: key
    }
  };
};

/*
 * Add or update a data in state
 * @param data: a data object
 * @param feedId: id of updated feed
 * @param key: key to store data by
 */
exports.dataBatchReceived = dataBatchReceived;
var dataReceived = function dataReceived(data, feedId, batch) {
  var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "id";
  return {
    type: t.DATA_RECEIVED,
    payload: {
      data: data,
      feedId: feedId,
      batch: batch,
      key: key
    }
  };
};

/*
 * Remove data in state
 * @param dataId: id of data being removed
 * @param feedId: id of updated feed
 */
exports.dataReceived = dataReceived;
var dataRemoved = function dataRemoved(dataId, feedId, batch) {
  return {
    type: t.DATA_REMOVED,
    payload: {
      dataId: dataId,
      feedId: feedId,
      batch: batch
    }
  };
};

/*
 * Check if entity is loaded in profile then remove data in state
 * @param id: id of data being removed
 * @param feedId: id of updated feed
 * @param deleting: whether entity is being deleted to control profile and context state.
 */
var removeData = function removeData(id, feedId, batch) {
  var deleting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return function (dispatch, getState) {
    var appState = getState().appState;
    var selectedEntity = appState && appState.contextPanel && appState.contextPanel.profile ? appState.contextPanel.profile.selectedEntity : null;
    // Close profile on delete
    if (deleting && selectedEntity && selectedEntity.id === id) dispatch((0, _index.closeSecondary)());
    dispatch(dataRemoved(id, feedId, batch));
  };
};

/*
 * Set reference to feed's subscription
 * @param channel: reference to subscription channel for unsubscribing
 */
exports.removeData = removeData;
var setDataSubscription = function setDataSubscription(channel, feedId, batch) {
  return {
    type: t.SET_DATA_SUBSCRIPTION,
    payload: {
      channel: channel,
      feedId: feedId,
      batch: batch
    }
  };
};
exports.setDataSubscription = setDataSubscription;
var runQueue = function runQueue(feedId, batch) {
  return {
    type: t.RUN_QUEUE,
    payload: {
      feedId: feedId,
      batch: batch
    }
  };
};

/*
 * Subscribe to a global feed using a system-based changefeed.
 */
exports.runQueue = runQueue;
var subscribeData = function subscribeData(feedId) {
  return function (dispatch) {
    // Now that global reducers are dynamically generated, we needed to add
    // FOVs to the array of reducers to generate. FOVs, however, are not a
    // subscribable feed type for this method, so we ignore them.
    if (feedId === "fovs") return;
    _clientAppCore.feedService.subscribeGlobalFeed(feedId, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      // If data is streaming in one by one
      // *This is the case for some internal feeds like cameras and shapes
      if (response.type) {
        switch (response.type) {
          case "add":
          case "initial":
          case "change":
            dispatch(dataReceived(response.new_val, feedId, response.batch));
            break;
          case "remove":
            dispatch(removeData(response.old_val.id, feedId, response.batch));
            break;
          default:
            break;
        }
      } else if (response && response.changes) {
        var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8;
        var batch = response.batch;
        var initial = (0, _map["default"])(_context = (0, _filter["default"])(_context2 = response.changes).call(_context2, function (change) {
          return change.type === "initial";
        })).call(_context, function (change) {
          return change.new_val;
        });
        var changes = (0, _map["default"])(_context3 = (0, _filter["default"])(_context4 = response.changes).call(_context4, function (change) {
          return change.type === "change";
        })).call(_context3, function (change) {
          return change.new_val;
        });
        var additions = (0, _map["default"])(_context5 = (0, _filter["default"])(_context6 = response.changes).call(_context6, function (change) {
          return change.type === "add";
        })).call(_context5, function (change) {
          return change.new_val;
        });
        var removals = (0, _map["default"])(_context7 = (0, _filter["default"])(_context8 = response.changes).call(_context8, function (change) {
          return change.type === "remove";
        })).call(_context7, function (change) {
          return change.old_val.id;
        });
        if (initial.length) {
          dispatch(dataBatchReceived(initial, feedId, batch));
        }
        if (changes.length) {
          dispatch(dataBatchReceived(changes, feedId, batch));
        }
        if (removals.length) {
          (0, _each["default"])(removals, function (id) {
            return dispatch(removeData(id, feedId, batch));
          });
        }
        if (additions.length) {
          dispatch(dataBatchReceived(additions, feedId, batch));
        }
      }
    }).then(function (subscription) {
      // Passing "all" as the batch allows the subscription to be set
      // on all streams created by this method
      dispatch(setDataSubscription(subscription.channel, feedId, "all"));
    });
  };
};

/**
 * Add an entity to authExclusion to ignore it on the front end
 * @param {string} entityId
 * @param {string} entityType
 * @param {string} feedId
 * @param {function} appData -- Function that returns either an array of batches to update in global state, or an app id to do custom state removal
 */
exports.subscribeData = subscribeData;
var ignoreEntity = function ignoreEntity(entityId, entityType, feedId, appData) {
  return function (dispatch, getState) {
    _clientAppCore.authExclusionService.ignoreEntity(entityId, entityType, feedId, function (err, res) {
      if (err) {
        console.log("Error ignoring entity:", err);
      }
      if (res) {
        if (res.result.inserted === 1) {
          // Get batch types per app to update in
          var appDataObj = appData(entityType);
          var appSpecifics = appDataObj.appSpecifics,
            isGlobal = appDataObj.isGlobal;

          // If entity is a camera, check to see if we should remove it from the camera dock
          if (entityType === "camera") {
            dispatch((0, _index2.removeDockedCameraById)(entityId));
          }

          // If the data is stored in global state, update it
          // All data in map-app, events in events app, cameras in cameras app
          if (isGlobal) {
            var availableReducers = appSpecifics;

            // For each batch type, remove the entity from that batch
            (0, _forEach["default"])(availableReducers).call(availableReducers, function (batch) {
              if (feedId === "event") {
                dispatch((0, _index.closeSecondary)());
                dispatch((0, _actions.eventRemoved)(entityId));
              } else {
                dispatch(removeData(entityId, feedId, batch));
              }
            });
          }
          // If the data is not stored in global state, update it where it is stored per app
          else {
            var app = appSpecifics;
            var contextPanelData = getState().appState.contextPanel.contextPanelData;
            var selectedContext = contextPanelData.selectedContext;
            var primary = selectedContext.primary;
            var contextUpdateId = primary;
            var viewingHistory = (0, _Selectors.viewingHistorySelector)(getState());
            switch (app) {
              // In events app, any non-event entity is stored as a pinned item on the primary event context
              case "events":
                {
                  dispatch((0, _Actions2.viewPrevious)(viewingHistory));
                  dispatch((0, _contextStreaming.subscriptionDataRemoved)(contextUpdateId, entityId, "pinnedItems"));
                  break;
                }
              // In cameras app, any non-camera entity is stored as an fov item on the primary camera context
              case "cameras":
                {
                  dispatch((0, _Actions2.viewPrevious)(viewingHistory));
                  dispatch((0, _contextStreaming.subscriptionDataRemoved)(contextUpdateId, entityId, "fovItems"));
                  break;
                }
              default:
                console.log("No case for ".concat(app, " exists when hiding entity"));
                break;
            }
          }
        }
      }
    });
  };
};

/*
 * Subscribe to a feed
 * @param feedId: id of feed to subscribe to
 * @param source: app or int (found on integration object)
 */
exports.ignoreEntity = ignoreEntity;
var subscribeFeed = function subscribeFeed(feedId) {
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "app";
  return function (dispatch) {
    dispatch(subscribeData(feedId, source));
  };
};
exports.subscribeFeed = subscribeFeed;
var unsub = function unsub(feedId) {
  return {
    type: t.UNSUB_GLOBAL_FEED,
    payload: {
      feedId: feedId,
      batch: "all"
    }
  };
};
var unsubscribeGlobalFeed = function unsubscribeGlobalFeed(feedId, channel) {
  return function (dispatch) {
    dispatch((0, _Actions.unsubscribe)(channel));
    dispatch(unsub(feedId));
  };
};
exports.unsubscribeGlobalFeed = unsubscribeGlobalFeed;