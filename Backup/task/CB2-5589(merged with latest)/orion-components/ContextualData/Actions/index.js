"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSubscriber = exports.removeProfileSubscription = exports.removeFeed = exports.removeContext = exports.getContextListCategory = exports.addSubscriber = exports.addContext = void 0;
_Object$defineProperty(exports, "simpleUnsub", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.simpleUnsub;
  }
});
_Object$defineProperty(exports, "startActivityStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startActivityStream;
  }
});
_Object$defineProperty(exports, "startAttachmentStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startAttachmentStream;
  }
});
_Object$defineProperty(exports, "startCameraInRangeVideoStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startCameraInRangeVideoStream;
  }
});
_Object$defineProperty(exports, "startCamerasInRangeStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startCamerasInRangeStream;
  }
});
_Object$defineProperty(exports, "startCamerasLinkedItemsStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startCamerasLinkedItemsStream;
  }
});
_Object$defineProperty(exports, "startEventActivityStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startEventActivityStream;
  }
});
_Object$defineProperty(exports, "startEventCameraStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startEventCameraStream;
  }
});
_Object$defineProperty(exports, "startEventPinnedItemsStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startEventPinnedItemsStream;
  }
});
_Object$defineProperty(exports, "startFOVItemStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startFOVItemStream;
  }
});
_Object$defineProperty(exports, "startFloorPlanAccessPointsStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startFloorPlanAccessPointsStream;
  }
});
_Object$defineProperty(exports, "startFloorPlanCameraStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startFloorPlanCameraStream;
  }
});
_Object$defineProperty(exports, "startGateRunnerActivityStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startGateRunnerActivityStream;
  }
});
_Object$defineProperty(exports, "startListStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startListStream;
  }
});
_Object$defineProperty(exports, "startLiveCameraStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startLiveCameraStream;
  }
});
_Object$defineProperty(exports, "startProximityEntitiesStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startProximityEntitiesStream;
  }
});
_Object$defineProperty(exports, "startRulesStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startRulesStream;
  }
});
_Object$defineProperty(exports, "startTrackHistoryStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startTrackHistoryStream;
  }
});
_Object$defineProperty(exports, "subscriptionReceived", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.subscriptionReceived;
  }
});
_Object$defineProperty(exports, "unsubscribe", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.unsubscribe;
  }
});
exports.updateContextProperty = exports.updateContext = exports.unsubscribeFromFeed = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
var _contextStreaming = require("../contextStreaming");
var _includes2 = _interopRequireDefault(require("lodash/includes"));
var _isArray = _interopRequireDefault(require("lodash/isArray"));
var _each = _interopRequireDefault(require("lodash/each"));
var _size = _interopRequireDefault(require("lodash/size"));
var _keys = _interopRequireDefault(require("lodash/keys"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* Add the entity context to the state
 * @param entity: entity object to be set on context
 */
var addContext = function addContext(id, entity) {
  return {
    type: t.ADD_CONTEXT,
    payload: {
      id: id,
      entity: entity
    }
  };
};

/* Update context in state (ie if a tracks course)
 * @param contextId: entity that owns that subscription
 * @param update: updated entity object
 */
exports.addContext = addContext;
var updateContext = function updateContext(contextId, update) {
  return {
    type: t.UPDATE_CONTEXT,
    payload: {
      contextId: contextId,
      update: update
    }
  };
};

/* Update property on context in state (ie camerasInRange on entity)
 * @param contextId: entity that owns that subscription
 * @param updateProp: updated entity property
 * @param updateVal: updated entity property value
 */
exports.updateContext = updateContext;
var updateContextProperty = function updateContextProperty(contextId, updateProp, updateVal) {
  return {
    type: t.UPDATE_CONTEXT_PROPERTY,
    payload: {
      contextId: contextId,
      updateProp: updateProp,
      updateVal: updateVal
    }
  };
};
exports.updateContextProperty = updateContextProperty;
var updateContextListCategories = function updateContextListCategories(contextId, categories) {
  return {
    type: t.UPDATE_CONTEXT_LIST_CATEGORIES,
    payload: {
      contextId: contextId,
      categories: categories
    }
  };
};
var getContextListCategory = function getContextListCategory(categoryId, contextId) {
  return function (dispatch) {
    _clientAppCore.listCategoryService.getListCategory(categoryId, function (err, response) {
      if (err) {
        console.log(err);
      }
      if (!response) {
        return;
      }
      dispatch(updateContextListCategories(contextId, [response]));
    });
  };
};

/*
 * Completely remove a context object
 * @param contextId: ID of entity used as context
 */
exports.getContextListCategory = getContextListCategory;
var removeContext = function removeContext(contextId) {
  return {
    type: t.REMOVE_CONTEXT,
    payload: {
      contextId: contextId
    }
  };
};

/*
 * Completely remove a subscription and related data
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 */
exports.removeContext = removeContext;
var removeFeed = function removeFeed(contextId, subscriptionId) {
  return {
    type: t.REMOVE_SUBSCRIPTION,
    payload: {
      contextId: contextId,
      subscriptionId: subscriptionId
    }
  };
};

/*
 * Remove a subscribed component from the subscribers array
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 * @param subscriberRef: Reference to component accessing a feed
 */
exports.removeFeed = removeFeed;
var removeSubscriber = function removeSubscriber(contextId, subscriptionId, subscriberRef) {
  return {
    type: t.REMOVE_SUBSCRIBER,
    payload: {
      contextId: contextId,
      subscriptionId: subscriptionId,
      subscriberRef: subscriberRef
    }
  };
};

/*
 * Add a subscribed component to the subscribers array
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 * @param subscriberRef: Reference to component accessing a feed
 */
exports.removeSubscriber = removeSubscriber;
var addSubscriber = function addSubscriber(contextId, subscriptionId, subscriberRef) {
  return {
    type: t.ADD_SUBSCRIBER,
    payload: {
      contextId: contextId,
      subscriptionId: subscriptionId,
      subscriberRef: subscriberRef
    }
  };
};

/*
 * Check whether a feed should be unsubscribed from
 * @param subscriptions: A context object's subscriptions object
 * @param subscriptionId: ID of feed and related subscription
 */
exports.addSubscriber = addSubscriber;
var shouldUnsubscribeFeed = function shouldUnsubscribeFeed(subscriptions, subscriptionId, subscriberRef) {
  return function (dispatch) {
    var subscription = subscriptions[subscriptionId];

    // Error catch in the case of multiple unsubscribe calls
    if (!subscription) {
      return false;
      // Unsubscribe if this is the last subscriber
    } else if (subscription.subscribers.length === 0 || subscription.subscribers.length === 1 && (0, _includes2["default"])(subscription.subscribers, subscriberRef)) {
      if (subscription.subscription) {
        // If there is a valid subscription
        var channel = subscription.subscription;

        // Iterate over subscriptions involving multiple channels
        (0, _isArray["default"])(channel) ? (0, _each["default"])(channel, function (channel) {
          return dispatch((0, _contextStreaming.unsubscribe)(channel));
        }) : dispatch((0, _contextStreaming.unsubscribe)(channel));
      }
      return true;
    } else {
      return false;
    }
  };
};

/*
 * May need to pass subscriptions from passed props
 * @param contextId: ID of entity used as context
 * @param subscriptionId: ID of feed and related subscription
 * @param subscriberRef: Reference to component accessing a feed
 */
var unsubscribeFromFeed = function unsubscribeFromFeed(contextId, subscriptionId, subscriberRef, forReplay) {
  return function (dispatch, getState) {
    // Exit if context doesn't exist
    if (!getState().contextualData[contextId]) return;
    var subscriptions = getState().contextualData[contextId].subscriptions;
    var context = getState().contextualData[contextId];
    if (!(context.trackHistory && subscriptionId === "entity")) {
      // Check if this is the last subscriber
      if (dispatch(shouldUnsubscribeFeed(subscriptions, subscriptionId, subscriberRef))) {
        // Remove feed from context
        dispatch(removeFeed(contextId, subscriptionId));
        // Check if this is the last subscription to context
        if ((0, _size["default"])(subscriptions) <= 1 && !forReplay) {
          // Remove context entirely
          dispatch(removeContext(contextId));
        }
      } else {
        // Remove subscriber from subscriber array
        dispatch(removeSubscriber(contextId, subscriptionId, subscriberRef));
      }
    }
  };
};

// Clear all contexts that are only being subscribed to by profile on close
exports.unsubscribeFromFeed = unsubscribeFromFeed;
var removeProfileSubscription = function removeProfileSubscription() {
  return function (dispatch, getState) {
    var _getState = getState(),
      contextualData = _getState.contextualData,
      appState = _getState.appState;
    var selectedContext = appState.contextPanel.contextPanelData.selectedContext;
    (0, _each["default"])(contextualData, function (context, contextId) {
      var _context;
      if (!context.trackHistory && (0, _includes["default"])(_context = (0, _values["default"])(selectedContext)).call(_context, contextId)) {
        var subscriptionIds = (0, _keys["default"])(context.subscriptions);
        (0, _each["default"])(subscriptionIds, function (subscriptionId) {
          return dispatch(unsubscribeFromFeed(contextId, subscriptionId, "profile"));
        });
      }
    });
  };
};
exports.removeProfileSubscription = removeProfileSubscription;