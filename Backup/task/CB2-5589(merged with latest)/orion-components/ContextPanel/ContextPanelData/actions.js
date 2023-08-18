"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.viewPrevious = exports.updateViewingHistory = exports.updateSelectedContext = exports.shrinkSecondary = exports.shouldUpdateViewingHistory = exports.openSecondary = exports.openPrimary = exports.loadProfileOffline = exports.loadProfile = exports.loadGISProfile = exports.expandSecondary = exports.closeSecondary = exports.closePrimary = exports.clearViewingHistory = exports._closeSecondary = void 0;
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _clientAppCore = require("client-app-core");
var t = _interopRequireWildcard(require("./actionTypes"));
var _Actions = require("../../AppState/Actions");
var _Actions2 = require("../../ContextualData/Actions");
var _index = require("../../Profiles/ProfileState/Actions/index");
var _index2 = require("../../ContextualData/Actions/index");
var _lodash = _interopRequireDefault(require("lodash"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Open List Panel
var openPrimary = function openPrimary() {
  return {
    type: t.OPEN_PRIMARY
  };
};

// Close List Panel
exports.openPrimary = openPrimary;
var closePrimary = function closePrimary() {
  return {
    type: t.CLOSE_PRIMARY
  };
};

// Open Profile
exports.closePrimary = closePrimary;
var openSecondary = function openSecondary() {
  return {
    type: t.OPEN_SECONDARY
  };
};

// Close Profile
exports.openSecondary = openSecondary;
var _closeSecondary = function _closeSecondary() {
  return {
    type: t.CLOSE_SECONDARY
  };
};

// Expand Secondary Profile
exports._closeSecondary = _closeSecondary;
var expandSecondary = function expandSecondary() {
  return {
    type: t.EXPAND_SECONDARY
  };
};

// Shrink Secondary Profile
exports.expandSecondary = expandSecondary;
var shrinkSecondary = function shrinkSecondary() {
  return {
    type: t.SHRINK_SECONDARY
  };
};
exports.shrinkSecondary = shrinkSecondary;
var closeSecondary = function closeSecondary() {
  return function (dispatch) {
    dispatch((0, _index2.removeProfileSubscription)());
    dispatch((0, _index.clearSelectedEntity)());
    dispatch(clearSelectedContext());
    dispatch(_closeSecondary());
  };
};

/**
 * Used by loadProfile to check whether viewing history needs to be updated
 * @param {Array} history - array of previous selected entities
 * @param {string} id - id of entity to load in the profile
 */
exports.closeSecondary = closeSecondary;
var shouldUpdateViewingHistory = function shouldUpdateViewingHistory(history, id) {
  if (history.length === 0 || history[0].id !== id) {
    return true;
  } else {
    return false;
  }
};
exports.shouldUpdateViewingHistory = shouldUpdateViewingHistory;
var updateViewingHistory = function updateViewingHistory(id, name, type, profileRef, context, options) {
  return {
    type: t.UPDATE_VIEWING_HISTORY,
    payload: {
      id: id,
      name: name,
      type: type,
      profileRef: profileRef,
      context: context,
      options: options
    }
  };
};

// View the previous profile based on viewing history
exports.updateViewingHistory = updateViewingHistory;
var viewPrevious = function viewPrevious(history) {
  return function (dispatch) {
    var previous = history[1];
    var id = previous.id,
      name = previous.name,
      type = previous.type,
      profileRef = previous.profileRef,
      context = previous.context,
      layerId = previous.layerId;
    dispatch(updateViewingHistory());
    if (type === "gis") {
      dispatch(loadGISProfile(id, name, layerId, type, profileRef, context));
    } else {
      dispatch(loadProfile(id, name, type, profileRef, context));
    }
  };
};

/*
 * Set selected context
 * @param entityId: ID of entity being set as prescribed context
 * @param context: Whether primary or secondary context is being set
 */
exports.viewPrevious = viewPrevious;
var setSelectedContext = function setSelectedContext(entityId, context) {
  return {
    type: t.SET_SELECTED_CONTEXT,
    payload: {
      entityId: entityId,
      context: context
    }
  };
};

/*
 * Clear selected context
 * @param contexts: Which contexts are being cleared. Defaults to both.
 */
var clearSelectedContext = function clearSelectedContext() {
  var contexts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ["primary", "secondary"];
  return {
    type: t.CLEAR_SELECTED_CONTEXT,
    payload: {
      contexts: contexts
    }
  };
};

/*
 * Update selected context
 * @param entityId: new selected entity ID
 * @param context: Whether entity is primary or secondary context (e.x. camera or event)
 */
var updateSelectedContext = function updateSelectedContext(entityId) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "secondary";
  return function (dispatch, getState) {
    var selectedContext = getState().appState.contextPanel.contextPanelData.selectedContext;

    // Get contexts that have already been set
    var setContexts = _lodash["default"].pickBy(selectedContext, function (context) {
      return context !== null;
    });
    switch (context) {
      case "primary":
        // If there are set contexts
        if (!_lodash["default"].isEmpty(setContexts)) {
          _lodash["default"].each((0, _filter["default"])(_lodash["default"]).call(_lodash["default"], (0, _values["default"])(_lodash["default"]).call(_lodash["default"], setContexts), function (contextId) {
            return contextId !== entityId;
          }), function (contextId) {
            // Unsubscribe profile from old context
            if (getState().contextualData[contextId]) {
              _lodash["default"].each((0, _keys["default"])(_lodash["default"]).call(_lodash["default"], getState().contextualData[contextId].subscriptions), function (subscriptionId) {
                return dispatch((0, _index2.unsubscribeFromFeed)(contextId, subscriptionId, "profile"));
              });
            }
          });
          // Clear all from selectedContext state
          dispatch(clearSelectedContext((0, _keys["default"])(_lodash["default"]).call(_lodash["default"], setContexts)));
        }
        // Set primary selected context
        dispatch(setSelectedContext(entityId, context));
        break;
      case "secondary":
        // If there is a secondary context selected
        if ((0, _includes["default"])(_lodash["default"]).call(_lodash["default"], (0, _keys["default"])(_lodash["default"]).call(_lodash["default"], setContexts), "secondary") && setContexts["secondary"] !== entityId) {
          dispatch(
          // Unsubscribe profile from old context
          (0, _index2.unsubscribeFromFeed)(setContexts["secondary"], "entity", "profile"));
          // Clear secondary context from selectedContext state
          dispatch(clearSelectedContext(["secondary"]));
        }
        // Set secondary selected context
        dispatch(setSelectedContext(entityId, context));
        break;
      default:
        break;
    }
  };
};

// Local flag to disallow multiple profile load attempts within a short time
exports.updateSelectedContext = updateSelectedContext;
var loadingId = null;

// Action fired when an entity is clicked on
// Load correct profile and set state
var loadProfile = function loadProfile(entityId, entityName, entityType, profileRef) {
  var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "primary";
  return function (dispatch, getState) {
    // If another profile load was attempted within 1 sec, bail out
    if (loadingId) {
      return;
    }
    loadingId = entityId;

    // Allow subsequent loads after 1 sec
    (0, _setTimeout2["default"])(function () {
      loadingId = null;
    }, 1000);
    var _getState$appState$co = getState().appState.contextPanel,
      contextPanelData = _getState$appState$co.contextPanelData,
      profile = _getState$appState$co.profile;
    var selectedEntity = profile.selectedEntity;
    if (selectedEntity && selectedEntity.id === entityId) {
      return;
    }
    dispatch((0, _index.clearSelectedEntity)());
    if (shouldUpdateViewingHistory(contextPanelData.viewingHistory, entityId)) {
      dispatch(updateViewingHistory(entityId, entityName, entityType, profileRef, context));
    }
    dispatch(openSecondary());

    // Set loading to true
    dispatch((0, _Actions.setLoading)("profile", true));

    // Call to fetch entity data
    _clientAppCore.feedService.streamEntityByType(entityId, entityType, function (err, response) {
      if (err) console.log(err);else {
        if (!response) return;
        switch (response.type) {
          case "initial":
            // Add context to state
            dispatch((0, _Actions2.addContext)(entityId, response.new_val));
            dispatch((0, _index.setSelectedEntity)(response.new_val, entityType));
            break;
          case "change":
            // Update context entity data (ie updated track details)
            dispatch((0, _Actions2.updateContext)(entityId, response.new_val));
            break;
          default:
            break;
        }
      }
    }).then(function (subscription) {
      // Set feed subscription and add profile to subscriber array
      dispatch((0, _Actions2.subscriptionReceived)(entityId, subscription.channel, "entity", profileRef));

      // Add or update the currently selected context
      dispatch(updateSelectedContext(entityId, context));

      // Set loading to false
      dispatch((0, _Actions.setLoading)("profile", false));
    });
  };
};
exports.loadProfile = loadProfile;
var loadProfileOffline = function loadProfileOffline(entityId, entityName, entityType, entity, profileRef) {
  var context = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "primary";
  return function (dispatch, getState) {
    // If another profile load was attempted within 1 sec, bail out
    if (loadingId) {
      return;
    }
    loadingId = entityId;

    // Allow subsequent loads after 1 sec
    (0, _setTimeout2["default"])(function () {
      loadingId = null;
    }, 1000);
    var _getState$appState$co2 = getState().appState.contextPanel,
      contextPanelData = _getState$appState$co2.contextPanelData,
      profile = _getState$appState$co2.profile;
    var selectedEntity = profile.selectedEntity;
    if (selectedEntity && selectedEntity.id === entityId) {
      return;
    }
    dispatch((0, _index.clearSelectedEntity)());
    if (shouldUpdateViewingHistory(contextPanelData.viewingHistory, entityId)) {
      dispatch(updateViewingHistory(entityId, entityName, entityType, profileRef, context));
    }
    dispatch(openSecondary());

    // Set loading to true
    dispatch((0, _Actions.setLoading)("profile", true));
    dispatch((0, _Actions2.addContext)(entityId, entity));
    dispatch((0, _index.setSelectedEntity)(entity, entityType));

    // Add or update the currently selected context
    dispatch(updateSelectedContext(entityId, context));

    // Set loading to false
    dispatch((0, _Actions.setLoading)("profile", false));
  };
};
exports.loadProfileOffline = loadProfileOffline;
var loadGISProfile = function loadGISProfile(id, name, layerId, type, profileRef) {
  var context = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "primary";
  return function (dispatch, getState) {
    // If another profile load was attempted within 1 sec, bail out
    if (loadingId) {
      return;
    }
    loadingId = id;
    // Allow subsequent loads after 1 sec
    (0, _setTimeout2["default"])(function () {
      loadingId = null;
    }, 1000);
    var _getState$appState$co3 = getState().appState.contextPanel,
      contextPanelData = _getState$appState$co3.contextPanelData,
      profile = _getState$appState$co3.profile;
    var selectedEntity = profile.selectedEntity;
    if (selectedEntity && selectedEntity.id === id) {
      return;
    }
    var features = getState().globalData.gisData.layers[layerId].features;
    var feature = (0, _find["default"])(features).call(features, function (feature) {
      return feature.properties.id === id;
    });
    var entity = {
      id: id,
      entityType: "gis",
      entityData: feature
    };
    dispatch((0, _index.clearSelectedEntity)());
    if (shouldUpdateViewingHistory(contextPanelData.viewingHistory, id)) {
      dispatch(updateViewingHistory(id, name, type, profileRef, context, {
        layerId: layerId
      }));
    }
    dispatch(openSecondary());
    dispatch((0, _Actions.setLoading)("profile", true));
    dispatch((0, _Actions2.addContext)(id, entity));
    dispatch((0, _index.setSelectedEntity)(entity, "gis"));
    dispatch(updateSelectedContext(id, context));
    dispatch((0, _Actions.setLoading)("profile", false));
  };
};

// Clear viewing history
exports.loadGISProfile = loadGISProfile;
var clearViewingHistory = function clearViewingHistory() {
  return {
    type: t.CLEAR_VIEWING_HISTORY
  };
};
exports.clearViewingHistory = clearViewingHistory;