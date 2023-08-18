"use strict";

var _context3;
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  globalGeo: true,
  orgRoleSelector: true,
  globalData: true,
  notificationById: true,
  priorityNotificationSelector: true,
  userFacilitySelector: true,
  activeAlertsSelector: true,
  feedInfoSelector: true,
  userIntegrations: true,
  feedEntitiesSelector: true,
  feedEntitiesByTypeSelector: true,
  feedEntitiesGeoByTypeSelector: true,
  feedEntitiesWithGeoByTypeSelector: true,
  collectionMemberSelector: true,
  sharedEntitiesSelector: true,
  feedEntityGeoSelector: true,
  getEntityId: true,
  getGeo: true,
  getGeoMemoized: true,
  getFeedId: true,
  feedDataSelector: true,
  feedSelector: true,
  alertStateSelector: true,
  alertSelector: true,
  layerSourcesSelector: true,
  makeGetEntity: true,
  userFeedsByTypeSelector: true,
  getFeedEntitiesByProperty: true,
  userFeedsSelector: true,
  collectionsSelector: true,
  makeGetCollection: true,
  makeGetCollectionMembers: true,
  rulesSelector: true,
  floorPlanSelector: true,
  eventsSelector: true,
  eventTypesSelector: true,
  currentEventsSelector: true,
  currentOwnedEventsSelector: true,
  activeOwnedEventsSelector: true,
  eventsSharedFromOrgSelector: true,
  eventsSharedFromEcoSelector: true,
  sharedEventsSelector: true,
  activeSharedEventsSelector: true,
  availableEventsSelector: true,
  getEventsWithoutFiltersSelector: true,
  activeEventsSelector: true,
  makeGetEvent: true,
  makeGetPinnedItems: true,
  templatesSelector: true,
  ownedTemplatesSelector: true,
  templatesSharedFromOrgSelector: true,
  templatesSharedFromEcoSelector: true,
  sharedTemplatesSelector: true,
  availableTemplatesSelector: true,
  usedEventTemplatesSelector: true,
  closedEventsSelector: true,
  scheduledEventsSelector: true,
  userExclusionSelector: true,
  getUnassignedMembers: true,
  unitMemberSelector: true,
  getAllUnits: true,
  getUnits: true,
  unitMemberMemoized: true,
  getPlaySettings: true,
  getWebrtcPlay: true
};
exports.activeAlertsSelector = void 0;
_Object$defineProperty(exports, "activeEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.activeEventsSelector;
  }
});
_Object$defineProperty(exports, "activeOwnedEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.activeOwnedEventsSelector;
  }
});
_Object$defineProperty(exports, "activeSharedEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.activeSharedEventsSelector;
  }
});
exports.alertStateSelector = exports.alertSelector = void 0;
_Object$defineProperty(exports, "availableEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.availableEventsSelector;
  }
});
_Object$defineProperty(exports, "availableTemplatesSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.availableTemplatesSelector;
  }
});
_Object$defineProperty(exports, "closedEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.closedEventsSelector;
  }
});
exports.collectionMemberSelector = void 0;
_Object$defineProperty(exports, "collectionsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors2.collectionsSelector;
  }
});
_Object$defineProperty(exports, "currentEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.currentEventsSelector;
  }
});
_Object$defineProperty(exports, "currentOwnedEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.currentOwnedEventsSelector;
  }
});
_Object$defineProperty(exports, "eventTypesSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.eventTypesSelector;
  }
});
_Object$defineProperty(exports, "eventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.eventsSelector;
  }
});
_Object$defineProperty(exports, "eventsSharedFromEcoSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.eventsSharedFromEcoSelector;
  }
});
_Object$defineProperty(exports, "eventsSharedFromOrgSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.eventsSharedFromOrgSelector;
  }
});
exports.feedSelector = exports.feedInfoSelector = exports.feedEntityGeoSelector = exports.feedEntitiesWithGeoByTypeSelector = exports.feedEntitiesSelector = exports.feedEntitiesGeoByTypeSelector = exports.feedEntitiesByTypeSelector = exports.feedDataSelector = void 0;
_Object$defineProperty(exports, "floorPlanSelector", {
  enumerable: true,
  get: function get() {
    return _selectors5.floorPlanSelector;
  }
});
_Object$defineProperty(exports, "getAllUnits", {
  enumerable: true,
  get: function get() {
    return _selectors9.getAllUnits;
  }
});
exports.getEntityId = void 0;
_Object$defineProperty(exports, "getEventsWithoutFiltersSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.getEventsWithoutFiltersSelector;
  }
});
exports.getGeoMemoized = exports.getGeo = exports.getFeedId = exports.getFeedEntitiesByProperty = void 0;
_Object$defineProperty(exports, "getPlaySettings", {
  enumerable: true,
  get: function get() {
    return _selectors10.getPlaySettings;
  }
});
_Object$defineProperty(exports, "getUnassignedMembers", {
  enumerable: true,
  get: function get() {
    return _selectors8.getUnassignedMembers;
  }
});
_Object$defineProperty(exports, "getUnits", {
  enumerable: true,
  get: function get() {
    return _selectors9.getUnits;
  }
});
_Object$defineProperty(exports, "getWebrtcPlay", {
  enumerable: true,
  get: function get() {
    return _selectors11.getWebrtcPlay;
  }
});
exports.layerSourcesSelector = exports.globalGeo = exports.globalData = void 0;
_Object$defineProperty(exports, "makeGetCollection", {
  enumerable: true,
  get: function get() {
    return _selectors2.makeGetCollection;
  }
});
_Object$defineProperty(exports, "makeGetCollectionMembers", {
  enumerable: true,
  get: function get() {
    return _selectors2.makeGetCollectionMembers;
  }
});
exports.makeGetEntity = void 0;
_Object$defineProperty(exports, "makeGetEvent", {
  enumerable: true,
  get: function get() {
    return _selectors6.makeGetEvent;
  }
});
_Object$defineProperty(exports, "makeGetPinnedItems", {
  enumerable: true,
  get: function get() {
    return _selectors6.makeGetPinnedItems;
  }
});
exports.orgRoleSelector = exports.notificationById = void 0;
_Object$defineProperty(exports, "ownedTemplatesSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.ownedTemplatesSelector;
  }
});
exports.priorityNotificationSelector = void 0;
_Object$defineProperty(exports, "rulesSelector", {
  enumerable: true,
  get: function get() {
    return _selectors3.rulesSelector;
  }
});
_Object$defineProperty(exports, "scheduledEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.scheduledEventsSelector;
  }
});
exports.sharedEntitiesSelector = void 0;
_Object$defineProperty(exports, "sharedEventsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.sharedEventsSelector;
  }
});
_Object$defineProperty(exports, "sharedTemplatesSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.sharedTemplatesSelector;
  }
});
_Object$defineProperty(exports, "templatesSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.templatesSelector;
  }
});
_Object$defineProperty(exports, "templatesSharedFromEcoSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.templatesSharedFromEcoSelector;
  }
});
_Object$defineProperty(exports, "templatesSharedFromOrgSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.templatesSharedFromOrgSelector;
  }
});
_Object$defineProperty(exports, "unitMemberMemoized", {
  enumerable: true,
  get: function get() {
    return _selectors9.unitMemberMemoized;
  }
});
_Object$defineProperty(exports, "unitMemberSelector", {
  enumerable: true,
  get: function get() {
    return _selectors9.unitMemberSelector;
  }
});
_Object$defineProperty(exports, "usedEventTemplatesSelector", {
  enumerable: true,
  get: function get() {
    return _selectors6.usedEventTemplatesSelector;
  }
});
_Object$defineProperty(exports, "userExclusionSelector", {
  enumerable: true,
  get: function get() {
    return _selectors7.userExclusionSelector;
  }
});
exports.userFeedsByTypeSelector = exports.userFacilitySelector = void 0;
_Object$defineProperty(exports, "userFeedsSelector", {
  enumerable: true,
  get: function get() {
    return _selectors.userFeedsSelector;
  }
});
exports.userIntegrations = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _reselect = require("reselect");
var _lodash = _interopRequireDefault(require("lodash"));
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _selectors = require("../Feeds/selectors");
var _Selectors = require("../../AppState/Selectors");
var _selectors2 = require("../Collections/selectors");
var _selectors3 = require("../Rules/selectors");
var _selectors4 = require("../GIS/selectors");
_forEachInstanceProperty(_context3 = _Object$keys(_selectors4)).call(_context3, function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _selectors4[key]) return;
  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _selectors4[key];
    }
  });
});
var _selectors5 = require("../FloorPlan/selectors");
var _selectors6 = require("../Events/selectors");
var _selectors7 = require("../Exclusions/selectors");
var _selectors8 = require("../UnitMembers/selectors");
var _selectors9 = require("../Units/selectors");
var _selectors10 = require("../WowzaWebRTC/PlaySettings/selectors");
var _selectors11 = require("../WowzaWebRTC/WebRTCPlay/selectors");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var globalGeo = function globalGeo(state) {
  return state.globalGeo;
};
exports.globalGeo = globalGeo;
var userIdSelector = function userIdSelector(state) {
  return state.session ? state.session.user.profile.id : null;
};
var orgRoleSelector = function orgRoleSelector(state) {
  return state.session.user.profile.orgRole;
};
exports.orgRoleSelector = orgRoleSelector;
var globalData = function globalData(state, props) {
  return props && props.feedId ? state.globalData[props.feedId] : state.globalData;
};
exports.globalData = globalData;
var notifications = function notifications(state) {
  return state.globalData.notifications;
};
var userFeedState = function userFeedState(state) {
  return state.session.userFeeds;
};
var notificationById = function notificationById(id) {
  return (0, _reselect.createSelector)(notifications, function (notifications) {
    var activeItemsById = notifications.activeItemsById,
      archiveItemsById = notifications.archiveItemsById;
    var allNotifications = _objectSpread(_objectSpread({}, activeItemsById), archiveItemsById);
    return allNotifications[id];
  });
};
exports.notificationById = notificationById;
var priorityNotificationSelector = (0, _reselect.createSelector)(notifications, function (notifications) {
  var activeItemsById = notifications.activeItemsById;
  var alerts = _lodash["default"].pickBy(activeItemsById, function (item) {
    return item.isPriority;
  });
  return alerts;
});
exports.priorityNotificationSelector = priorityNotificationSelector;
var userFacilitySelector = (0, _reselect.createSelector)(globalData, function (globalData) {
  var userFacilities = [];
  _lodash["default"].forOwn(globalData, function (value) {
    if (value.data && !_lodash["default"].isEmpty(value.data)) {
      _lodash["default"].forOwn(value.data, function (facility) {
        if (facility.entityType === "facility") {
          userFacilities.push(facility);
        }
      });
    }
  });
  return userFacilities;
});
exports.userFacilitySelector = userFacilitySelector;
var activeAlertsSelector = (0, _reselect.createSelector)(notifications, function (notifications) {
  var activeItemsById = notifications.activeItemsById;
  var alerts = (0, _map["default"])(_lodash["default"]).call(_lodash["default"], _lodash["default"].pickBy(activeItemsById, function (item) {
    return item.isPriority && !item.viewed;
  }), function (item) {
    return _lodash["default"].size(item.object) && item.object.id;
  });
  return alerts;
});
exports.activeAlertsSelector = activeAlertsSelector;
var integrations = function integrations(state) {
  var integrations = state.session.user.profile.integrations;
  return integrations;
};
var feedInfoSelector = function feedInfoSelector(feedId) {
  return (0, _reselect.createSelector)(integrations, function (feeds) {
    var feed = (0, _find["default"])(feeds).call(feeds, function (feed) {
      return feedId === feed.feedId;
    });
    return feed;
  });
};

// Returns all non-disabled feeds a user has access to.
exports.feedInfoSelector = feedInfoSelector;
var userIntegrations = (0, _reselect.createSelector)(_selectors.userFeedsSelector, _Selectors.disabledFeedsSelector, function (userFeeds, disabled) {
  var integrations = _lodash["default"].pickBy(userFeeds, function (integration) {
    return integration.canView && !(0, _includes["default"])(disabled).call(disabled, integration);
  });
  return integrations;
});
exports.userIntegrations = userIntegrations;
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _reactFastCompare["default"]);
// Grabs all entities, minus GeoJSON, from feeds you have access to and are not disabled
// Data Type: Array
var feedEntitiesSelector = createDeepEqualSelector(globalData, userIntegrations, function (globalData, integrations) {
  var entities = {};
  _lodash["default"].each(_lodash["default"].pickBy(integrations, function (integration) {
    return globalData[integration.feedId];
  }), function (integration) {
    entities = _objectSpread(_objectSpread({}, entities), globalData[integration.feedId].data);
  });
  return entities;
});
exports.feedEntitiesSelector = feedEntitiesSelector;
var feedEntitiesByTypeSelector = function feedEntitiesByTypeSelector(entityType) {
  return createDeepEqualSelector(globalData, userIntegrations, function (globalData, integrations) {
    var entities = {};
    _lodash["default"].each(_lodash["default"].pickBy(integrations, function (integration) {
      return integration.entityType === entityType && globalData[integration.feedId];
    }), function (integration) {
      entities = _objectSpread(_objectSpread({}, entities), globalData[integration.feedId].data);
    });
    return entities;
  });
};
exports.feedEntitiesByTypeSelector = feedEntitiesByTypeSelector;
var feedEntitiesGeoByTypeSelector = function feedEntitiesGeoByTypeSelector(entityType) {
  return createDeepEqualSelector(globalGeo, userIntegrations, function (globalGeo, integrations) {
    var entities = {};
    _lodash["default"].each(_lodash["default"].pickBy(integrations, function (integration) {
      return integration.entityType === entityType && globalGeo[integration.feedId];
    }), function (integration) {
      entities = _objectSpread(_objectSpread({}, entities), globalGeo[integration.feedId].data);
    });
    return entities;
  });
};
exports.feedEntitiesGeoByTypeSelector = feedEntitiesGeoByTypeSelector;
var feedEntitiesWithGeoByTypeSelector = function feedEntitiesWithGeoByTypeSelector(entityType) {
  return createDeepEqualSelector(globalData, globalGeo, userIntegrations, function (globalData, globalGeo, integrations) {
    var entities = {};
    _lodash["default"].each(_lodash["default"].pickBy(integrations, function (integration) {
      return integration.entityType === entityType && globalData[integration.feedId];
    }), function (integration) {
      entities = _objectSpread(_objectSpread(_objectSpread({}, entities), globalData[integration.feedId].data), globalGeo ? _objectSpread({}, globalGeo[integration.feedId].data) : {});
    });
    return entities;
  });
};

/**
 * Grab collection members from available entities based on entity ID
 * @param {Array} members - An array of entity IDs
 */
exports.feedEntitiesWithGeoByTypeSelector = feedEntitiesWithGeoByTypeSelector;
var collectionMemberSelector = function collectionMemberSelector(members) {
  return createDeepEqualSelector(feedEntitiesSelector, function (entities) {
    var filteredMembers = _lodash["default"].pickBy(_lodash["default"].cloneDeep(entities), function (entity) {
      return (0, _includes["default"])(_lodash["default"]).call(_lodash["default"], members, entity.id);
    });
    return filteredMembers;
  });
};
exports.collectionMemberSelector = collectionMemberSelector;
var sharedEntitiesSelector = (0, _reselect.createSelector)(userIdSelector, feedEntitiesSelector, function (userId, entities) {
  var sharedEntities = _lodash["default"].pickBy(entities, function (entity) {
    var owner = entity.owner;
    return owner && owner !== userId;
  });
  return sharedEntities;
});

// Grabs the GeoJSON for all entities from feeds you have access to and are not disabled
// Data Type: Object
exports.sharedEntitiesSelector = sharedEntitiesSelector;
var feedEntityGeoSelector = (0, _reselect.createSelector)(globalGeo, userIntegrations, function (globalGeo, integrations) {
  var geoObj = {};
  _lodash["default"].each((0, _filter["default"])(_lodash["default"]).call(_lodash["default"], integrations, function (integration) {
    return globalGeo ? globalGeo[integration.feedId] : false;
  }), function (integration) {
    geoObj = _objectSpread(_objectSpread({}, geoObj), globalGeo ? globalGeo[integration.feedId].data : {});
  });
  return geoObj;
});
exports.feedEntityGeoSelector = feedEntityGeoSelector;
var getEntityId = function getEntityId(state, props) {
  return props.entity ? props.entity.id : null;
};
exports.getEntityId = getEntityId;
var getGeo = (0, _reselect.createSelector)(feedEntityGeoSelector, getEntityId, function (geos, id) {
  // cSpell:ignore geos
  var geo = geos[id];
  return geo ? geo : null;
});
exports.getGeo = getGeo;
var getGeoMemoized = createDeepEqualSelector(getGeo, function (geo) {
  return geo;
});
exports.getGeoMemoized = getGeoMemoized;
var getFeedId = function getFeedId(state, props) {
  return props.feedId;
};
exports.getFeedId = getFeedId;
var globalDataSelector = createDeepEqualSelector(globalData, function (globalData) {
  return globalData;
});
var feedDataSelector = createDeepEqualSelector(globalDataSelector, function (global) {
  return global ? global.data : {};
});
exports.feedDataSelector = feedDataSelector;
var feedSelector = function feedSelector(state, props) {
  if (props && state.globalData[props.feedId] && state.globalData[props.feedId].data) {
    return state.globalData[props.feedId].data;
  }
};
exports.feedSelector = feedSelector;
var feedGeoSelector = function feedGeoSelector(state, props) {
  if (props && state.globalGeo[props.feedId] && state.globalGeo[props.feedId].data) {
    return state.globalGeo[props.feedId].data;
  }
};
var notificationSelector = function notificationSelector(state) {
  if (state.globalData && state.globalData.notifications && state.globalData.notifications.activeItemsById) {
    return state.globalData.notifications.activeItemsById;
  }
};
var alertStateSelector = function alertStateSelector(state) {
  if (state.globalData && state.globalData.notifications) {
    return state.globalData.notifications.initial;
  }
};
exports.alertStateSelector = alertStateSelector;
var alertSelector = createDeepEqualSelector(notificationSelector, function (notifications) {
  return _lodash["default"].pickBy(notifications, function (notification) {
    return notification.isPriority && notification.viewed === false;
  });
});
exports.alertSelector = alertSelector;
var layerSourcesSelector = (0, _reselect.createSelector)(feedGeoSelector, function (geo) {
  return geo ? geo : {};
});
exports.layerSourcesSelector = layerSourcesSelector;
var getEntityById = function getEntityById(state, props) {
  var id = props.id,
    feedId = props.feedId;
  var entity = state.appState["mapRef"].entities[feedId] ? state.appState["mapRef"].entities[feedId][id] : null;
  return entity;
};
var makeGetEntity = function makeGetEntity() {
  return createDeepEqualSelector(getEntityById, function (entity) {
    return entity;
  });
};
exports.makeGetEntity = makeGetEntity;
var userFeedsByTypeSelector = function userFeedsByTypeSelector(entityType) {
  return (0, _reselect.createSelector)(userFeedState, function (userFeed) {
    var items = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], userFeed, function (feed) {
      return feed && feed.entityType === entityType;
    });
    return items;
  });
};
exports.userFeedsByTypeSelector = userFeedsByTypeSelector;
var getFeedEntitiesByProperty = function getFeedEntitiesByProperty(state, feedId, property, value) {
  if (state.globalData[feedId] && state.globalData[feedId].data) {
    var _globalData = state.globalData[feedId].data;
    var items = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], _globalData, function (feed) {
      return feed && feed.entityData.properties[property] === value;
    });
    return items;
  }
};
exports.getFeedEntitiesByProperty = getFeedEntitiesByProperty;