"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.templatesSharedFromOrgSelector = exports.templatesSharedFromEcoSelector = exports.templatesSelector = exports.sharedTemplatesSelector = exports.sharedEventsSelector = exports.scheduledEventsSelector = exports.ownedTemplatesSelector = exports.makeGetPinnedItems = exports.makeGetEvent = exports.getEventsWithoutFiltersSelector = exports.eventsSharedFromOrgSelector = exports.eventsSharedFromEcoSelector = exports.eventsSelector = exports.eventTypesSelector = exports.currentOwnedEventsWithoutSearchAndFilter = exports.currentOwnedEventsSelector = exports.currentEventsSelector = exports.closedEventsSelector = exports.availableTemplatesSelector = exports.availableEventsSelector = exports.activeSharedEventsSelector = exports.activeOwnedEventsSelector = exports.activeEventsSelector = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _reselect = require("reselect");
var _Selectors = require("../../ContextPanel/Selectors");
var _Selectors2 = require("../../AppState/Selectors");
var _moment = _interopRequireDefault(require("moment"));
var _Selectors3 = require("orion-components/GlobalData/Selectors");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _each = _interopRequireDefault(require("lodash/each"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context12, _context13; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context12 = ownKeys(Object(source), !0)).call(_context12, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context13 = ownKeys(Object(source))).call(_context13, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _reactFastCompare["default"]);
var eventsState = function eventsState(state) {
  return state.globalData.events.events;
};
var eventTypesState = function eventTypesState(state) {
  return state.globalData.events.types;
};
var templatesState = function templatesState(state) {
  return state.globalData.events.templates;
};
var userIdSelector = function userIdSelector(state) {
  return state.session.user.profile.id;
};
var orgIdSelector = function orgIdSelector(state) {
  return state.session.user.profile.orgId;
};
var eventsSelector = (0, _reselect.createSelector)(eventsState, function (events) {
  return events;
});
exports.eventsSelector = eventsSelector;
var eventTypesSelector = (0, _reselect.createSelector)(eventTypesState, function (types) {
  return types;
});
exports.eventTypesSelector = eventTypesSelector;
var templatesSelector = (0, _reselect.createSelector)(templatesState, function (templates) {
  return templates;
});
exports.templatesSelector = templatesSelector;
var currentEventsSelector = (0, _reselect.createSelector)(eventsSelector, function (events) {
  var _context;
  return (0, _sort["default"])(_context = (0, _map["default"])(events).call(events, function (event) {
    var startDate = (0, _moment["default"])(event.startDate);
    var endDate = (0, _moment["default"])(event.endDate);
    if (endDate > (0, _moment["default"])() && startDate < (0, _moment["default"])() || event.endDate === undefined && startDate < (0, _moment["default"])()) {
      event.status = "active";
    } else if (endDate < (0, _moment["default"])()) {
      event.status = "closed";
    } else if (startDate > (0, _moment["default"])()) {
      event.status = "upcoming";
    }
    return event;
  })).call(_context, function (a, b) {
    if (a.startDate < b.startDate) {
      return 1;
    }
    if (a.startDate > b.startDate) {
      return -1;
    }
    return 0;
  });
});
exports.currentEventsSelector = currentEventsSelector;
var filterEvent = function filterEvent(event, filters) {
  var _context3;
  var template = event.template,
    startDate = event.startDate,
    endDate = event.endDate;
  var eventTemplate = "";
  if (filters.template) {
    var _context2;
    (0, _forEach["default"])(_context2 = filters.template).call(_context2, function (id) {
      if (id === template) {
        eventTemplate = id;
      }
    });
  }
  var eventStart = (0, _moment["default"])(startDate);
  var eventEnd = (0, _moment["default"])(endDate);
  var active = (0, _moment["default"])().isBetween(eventStart, eventEnd) || endDate === undefined && (0, _moment["default"])().isAfter(eventStart);
  var closed = (0, _moment["default"])().isAfter(eventEnd);
  var upcoming = (0, _moment["default"])().isBefore(eventStart);
  var filtered = {};
  (0, _each["default"])(filters, function (filter, key) {
    var activeFilter = Boolean(filter.length);
    switch (key) {
      case "status":
        if (active) {
          filtered["status"] = activeFilter && !(0, _includes["default"])(filter).call(filter, "active");
        } else if (closed) {
          filtered["status"] = activeFilter && !(0, _includes["default"])(filter).call(filter, "closed");
        } else if (upcoming) {
          filtered["status"] = activeFilter && !(0, _includes["default"])(filter).call(filter, "upcoming");
        }
        break;
      case "template":
        filtered["template"] = activeFilter && (!eventTemplate || eventTemplate && !(0, _includes["default"])(filter).call(filter, eventTemplate));
        break;
      default:
        break;
    }
  });
  return !(0, _includes["default"])(_context3 = (0, _values["default"])(filtered)).call(_context3, true);
};

// Select owned events and apply filters for event state, event type, and search value (used in Events-App)
var currentOwnedEventsSelector = createDeepEqualSelector(eventsSelector, userIdSelector, _Selectors2.eventFiltersSelector, _Selectors.eventSearchSelector, function (events, userId, filters, search) {
  var filteredEvents = (0, _pickBy["default"])(events, function (event) {
    var _context4;
    var name = event.name,
      owner = event.owner;
    return owner === userId && (0, _includes["default"])(_context4 = name.toLowerCase()).call(_context4, search) && filterEvent(event, filters);
  });
  return filteredEvents;
});
exports.currentOwnedEventsSelector = currentOwnedEventsSelector;
var currentOwnedEventsWithoutSearchAndFilter = createDeepEqualSelector(eventsSelector, userIdSelector, function (events, userId) {
  var filteredEvents = (0, _pickBy["default"])(events, function (event) {
    var owner = event.owner;
    return owner === userId;
  });
  return filteredEvents;
});

// Select owned, active events and apply filters for event type and search value (used in Map-app)
exports.currentOwnedEventsWithoutSearchAndFilter = currentOwnedEventsWithoutSearchAndFilter;
var activeOwnedEventsSelector = createDeepEqualSelector(eventsSelector, userIdSelector, _Selectors2.eventFiltersSelector, _Selectors.eventSearchSelector, function (events, userId, filters, search) {
  var filteredEvents = (0, _pickBy["default"])(events, function (event) {
    var _context5;
    var name = event.name,
      owner = event.owner,
      startDate = event.startDate,
      endDate = event.endDate;
    var eventStart = (0, _moment["default"])(startDate);
    var eventEnd = (0, _moment["default"])(endDate);
    var active = (0, _moment["default"])().isBetween(eventStart, eventEnd) || endDate === undefined && (0, _moment["default"])().isAfter(eventStart);
    return owner === userId && (0, _includes["default"])(_context5 = name.toLowerCase()).call(_context5, search ? search : "") && active && filterEvent(event, filters);
  });
  return filteredEvents;
});

// Select closed events and apply filters for event type and search value
exports.activeOwnedEventsSelector = activeOwnedEventsSelector;
var closedEventsSelector = createDeepEqualSelector(eventsSelector, _Selectors2.eventFiltersSelector, _Selectors.eventSearchSelector, function (events, filters, search) {
  var filteredEvents = (0, _pickBy["default"])(events, function (event) {
    var _context6;
    var name = event.name,
      endDate = event.endDate;
    var eventEnd = (0, _moment["default"])(endDate);
    var closed = eventEnd && (0, _moment["default"])().isAfter(eventEnd);
    return (0, _includes["default"])(_context6 = name.toLowerCase()).call(_context6, search ? search : "") && closed && filterEvent(event, filters);
  });
  return filteredEvents;
});

// Select scheduled/upcoming events and apply filters for event type and search value
exports.closedEventsSelector = closedEventsSelector;
var scheduledEventsSelector = createDeepEqualSelector(eventsSelector, _Selectors2.eventFiltersSelector, _Selectors.eventSearchSelector, function (events, filters, search) {
  var filteredEvents = (0, _pickBy["default"])(events, function (event) {
    var _context7;
    var name = event.name,
      startDate = event.startDate;
    var eventStart = (0, _moment["default"])(startDate);
    var scheduled = eventStart && (0, _moment["default"])().isBefore(eventStart);
    return (0, _includes["default"])(_context7 = name.toLowerCase()).call(_context7, search ? search : "") && scheduled && filterEvent(event, filters);
  });
  return filteredEvents;
});
exports.scheduledEventsSelector = scheduledEventsSelector;
var eventsSharedFromOrgSelector = createDeepEqualSelector(eventsSelector, userIdSelector, orgIdSelector, function (events, userId, orgId) {
  var orgEvents = (0, _pickBy["default"])(events, function (event) {
    var ownerOrg = event.ownerOrg,
      owner = event.owner;
    return ownerOrg === orgId && owner !== userId;
  });
  return orgEvents;
});
exports.eventsSharedFromOrgSelector = eventsSharedFromOrgSelector;
var eventsSharedFromEcoSelector = createDeepEqualSelector(eventsSelector, userIdSelector, orgIdSelector, function (events, userId, orgId) {
  var ecoEvents = (0, _pickBy["default"])(events, function (event) {
    var ownerOrg = event.ownerOrg,
      owner = event.owner;
    return ownerOrg !== orgId && owner !== userId;
  });
  return ecoEvents;
});

// Select shared events and apply filters for event state, event type, and search value (used in Events-App)
exports.eventsSharedFromEcoSelector = eventsSharedFromEcoSelector;
var sharedEventsSelector = createDeepEqualSelector(eventsSharedFromEcoSelector, eventsSharedFromOrgSelector, _Selectors2.eventFiltersSelector, _Selectors.eventSearchSelector, function (fromEco, fromOrg, filters, search) {
  var events = _objectSpread(_objectSpread({}, fromOrg), fromEco);
  var filteredEvents = (0, _pickBy["default"])(events, function (event) {
    var _context8;
    var name = event.name;
    return (0, _includes["default"])(_context8 = name.toLowerCase()).call(_context8, search) && filterEvent(event, filters);
  });
  return filteredEvents;
});

// Select shared, active events and apply filters for event type and search value
exports.sharedEventsSelector = sharedEventsSelector;
var activeSharedEventsSelector = createDeepEqualSelector(eventsSharedFromEcoSelector, eventsSharedFromOrgSelector, _Selectors2.eventFiltersSelector, _Selectors.eventSearchSelector, function (fromEco, fromOrg, filters, search) {
  var events = _objectSpread(_objectSpread({}, fromOrg), fromEco);
  var filteredEvents = (0, _pickBy["default"])(events, function (event) {
    var _context9;
    var name = event.name,
      startDate = event.startDate,
      endDate = event.endDate;
    var eventStart = (0, _moment["default"])(startDate);
    var eventEnd = (0, _moment["default"])(endDate);
    var active = (0, _moment["default"])().isBetween(eventStart, eventEnd) || endDate === undefined && (0, _moment["default"])().isAfter(eventStart);
    return (0, _includes["default"])(_context9 = name.toLowerCase()).call(_context9, search) && active && filterEvent(event, filters);
  });
  return filteredEvents;
});
exports.activeSharedEventsSelector = activeSharedEventsSelector;
var availableEventsSelector = createDeepEqualSelector(sharedEventsSelector, currentOwnedEventsSelector, function (shared, owned) {
  var events = _objectSpread(_objectSpread({}, shared), owned);
  return events;
});
exports.availableEventsSelector = availableEventsSelector;
var getEventsWithoutFiltersSelector = createDeepEqualSelector(sharedEventsSelector, currentOwnedEventsWithoutSearchAndFilter, function (shared, owned) {
  var events = _objectSpread(_objectSpread({}, shared), owned);
  return events;
});
exports.getEventsWithoutFiltersSelector = getEventsWithoutFiltersSelector;
var activeEventsSelector = createDeepEqualSelector(activeSharedEventsSelector, activeOwnedEventsSelector, function (shared, owned) {
  var events = _objectSpread(_objectSpread({}, shared), owned);
  return events;
});
exports.activeEventsSelector = activeEventsSelector;
var getEventById = function getEventById(state, props) {
  var event = state.globalData.events.events[props.id];
  return event;
};
var makeGetEvent = function makeGetEvent() {
  return (0, _reselect.createSelector)(getEventById, function (event) {
    return event;
  });
};
exports.makeGetEvent = makeGetEvent;
var getPinnedItems = function getPinnedItems(state, props) {
  return props.event.pinnedItems;
};
var makeGetPinnedItems = function makeGetPinnedItems() {
  return createDeepEqualSelector(getPinnedItems, _Selectors3.feedEntitiesSelector, function (pinnedItems, entities) {
    var fullItems = (0, _pickBy["default"])(entities, function (entity) {
      return (0, _includes["default"])(pinnedItems).call(pinnedItems, entity.id);
    });
    return fullItems;
  });
};
exports.makeGetPinnedItems = makeGetPinnedItems;
var ownedTemplatesSelector = createDeepEqualSelector(templatesSelector, userIdSelector, _Selectors.eventTemplateSearchSelector, function (templates, userId, search) {
  var filteredTemplates = (0, _pickBy["default"])(templates, function (template) {
    var _context10;
    var name = template.name,
      owner = template.owner;
    return owner === userId && (0, _includes["default"])(_context10 = name.toLowerCase()).call(_context10, search);
  });
  return filteredTemplates;
});
exports.ownedTemplatesSelector = ownedTemplatesSelector;
var templatesSharedFromOrgSelector = createDeepEqualSelector(templatesSelector, userIdSelector, orgIdSelector, function (templates, userId, orgId) {
  var orgTemplates = (0, _pickBy["default"])(templates, function (template) {
    var ownerOrg = template.ownerOrg,
      owner = template.owner;
    return ownerOrg === orgId && owner !== userId;
  });
  return orgTemplates;
});
exports.templatesSharedFromOrgSelector = templatesSharedFromOrgSelector;
var templatesSharedFromEcoSelector = createDeepEqualSelector(templatesSelector, userIdSelector, orgIdSelector, function (templates, userId, orgId) {
  var ecoTemplates = (0, _pickBy["default"])(templates, function (template) {
    var ownerOrg = template.ownerOrg,
      owner = template.owner;
    return ownerOrg !== orgId && owner !== userId;
  });
  return ecoTemplates;
});

// Select shared events and apply filters for event state, event type, and search value (used in Events-App)
exports.templatesSharedFromEcoSelector = templatesSharedFromEcoSelector;
var sharedTemplatesSelector = createDeepEqualSelector(templatesSharedFromEcoSelector, templatesSharedFromOrgSelector, _Selectors.eventTemplateSearchSelector, function (fromEco, fromOrg, search) {
  var templates = _objectSpread(_objectSpread({}, fromOrg), fromEco);
  var filteredTemplates = (0, _pickBy["default"])(templates, function (template) {
    var _context11;
    var name = template.name;
    return (0, _includes["default"])(_context11 = name.toLowerCase()).call(_context11, search);
  });
  return filteredTemplates;
});
exports.sharedTemplatesSelector = sharedTemplatesSelector;
var availableTemplatesSelector = createDeepEqualSelector(sharedTemplatesSelector, ownedTemplatesSelector, function (shared, owned) {
  var templates = _objectSpread(_objectSpread({}, shared), owned);
  return templates;
});
exports.availableTemplatesSelector = availableTemplatesSelector;