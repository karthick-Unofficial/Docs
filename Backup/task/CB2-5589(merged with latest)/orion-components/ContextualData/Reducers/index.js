"use strict";

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
exports["default"] = void 0;
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _lodash = _interopRequireDefault(require("lodash"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context14, _context15; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context14 = ownKeys(Object(source), !0)).call(_context14, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context15 = ownKeys(Object(source))).call(_context15, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialContextualData = {};
var contextualData = function contextualData() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialContextualData;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "ADD_CONTEXT":
      {
        var id = payload.id,
          entity = payload.entity;
        var extantContext = state[id];
        if (!extantContext) {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, id, {
            entity: entity,
            subscriptions: {}
          }));
        } else {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, id, _objectSpread(_objectSpread({}, extantContext), {}, {
            entity: entity
          })));
        }
      }
    case "UPDATE_CONTEXT":
      {
        var contextId = payload.contextId,
          update = payload.update;
        var newContext = _objectSpread(_objectSpread({}, state[contextId]), {}, {
          entity: update
        });
        if (newContext.trackHistory) {
          var trackHistory = newContext.trackHistory;
          // if track has not moved in during the duration the trackHistory will be empty and we need to base the last known position on the pre-update entity.
          var lastKnownPosition = (0, _stringify["default"])(state[contextId].entity.entityData.geometry.coordinates);
          if (trackHistory[trackHistory.length - 1]) {
            // if track history was populated, base the last known position on what is in trackHistory
            lastKnownPosition = (0, _stringify["default"])(trackHistory[trackHistory.length - 1].entityData.geometry.coordinates);
          } else {
            // else we need to populate trackHistory ourselves with some initial data
            trackHistory.push({
              entityData: state[contextId].entity.entityData
            });
          }
          if (lastKnownPosition !== (0, _stringify["default"])(update.entityData.geometry.coordinates && update.entityData && update.entityData.properties && update.entityData.geometry)) {
            var _update$entityData$pr = update.entityData.properties,
              name = _update$entityData$pr.name,
              mmsid = _update$entityData$pr.mmsi,
              imo = _update$entityData$pr.imo,
              callsign = _update$entityData$pr.callsign,
              acquisitionTime = _update$entityData$pr.timestamp,
              speed = _update$entityData$pr.speed,
              hdg = _update$entityData$pr.hdg,
              course = _update$entityData$pr.course;
            newContext.trackHistory.push({
              entityData: {
                geometry: update.entityData.geometry,
                properties: {
                  name: name,
                  mmsid: mmsid,
                  acquisitionTime: acquisitionTime,
                  imo: imo,
                  callsign: callsign,
                  speed: speed,
                  hdg: hdg,
                  course: course,
                  id: update.id,
                  lat: update.entityData.geometry.coordinates[1],
                  lng: update.entityData.geometry.coordinates[0]
                }
              }
            });
          }
        }
        return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, contextId, _objectSpread({}, newContext)));
      }
    case "UPDATE_CONTEXT_PROPERTY":
      {
        var _contextId = payload.contextId,
          updateProp = payload.updateProp,
          updateVal = payload.updateVal;
        var context = _objectSpread({}, state[_contextId]);

        // If no context, abort
        if (!context) {
          return state;
        } else {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId, _objectSpread(_objectSpread({}, context), {}, (0, _defineProperty2["default"])({}, updateProp, updateVal))));
        }
      }
    case "UPDATE_CONTEXT_LIST_CATEGORIES":
      {
        var _contextId2 = payload.contextId,
          categories = payload.categories;
        var batch = _lodash["default"].keyBy(categories, "id");
        return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId2, _objectSpread(_objectSpread({}, state[_contextId2]), {}, {
          listCategories: _objectSpread(_objectSpread({}, state[_contextId2]["listCategories"]), batch)
        })));
      }
    case "REMOVE_CONTEXT":
      {
        var _contextId3 = payload.contextId;
        var newState = _objectSpread({}, state);
        delete newState[_contextId3];
        return newState;
      }
    case "SET_SUBSCRIPTION":
      {
        var _contextId4 = payload.contextId,
          subscription = payload.subscription,
          subscriptionId = payload.subscriptionId,
          subscriberRef = payload.subscriberRef;
        var _context = _objectSpread({}, state[_contextId4]);
        if (!_context || _lodash["default"].isEmpty(_context)) {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId4, {
            subscriptions: (0, _defineProperty2["default"])({}, subscriptionId, {
              subscription: subscription,
              subscribers: [subscriberRef]
            })
          }));
        } else if (_context.subscriptions[subscriptionId]) {
          var _context2;
          // Check if theres already an existing subscription
          var extantSub = _objectSpread({}, _context.subscriptions[subscriptionId]);
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId4, _objectSpread(_objectSpread({}, _context), {}, {
            subscriptions: _objectSpread(_objectSpread({}, _context.subscriptions), {}, (0, _defineProperty2["default"])({}, subscriptionId, _objectSpread(_objectSpread({}, _context.subscriptions[subscriptionId]), {}, {
              // If subscription exists already (subscriptionId involves multiple feed subscriptions)
              // concatenate into an array
              subscription: extantSub.subscription ? (0, _concat["default"])(_lodash["default"]).call(_lodash["default"], extantSub.subscription, subscription) : _context.subscriptions[subscriptionId].subscription,
              // Insure that there are no duplicate values
              subscribers: _lodash["default"].uniq((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(_context.subscriptions[subscriptionId].subscribers), [subscriberRef]))
            })))
          })));
        } else if (_context && !_context.subscriptions[subscriptionId]) {
          var _objectSpread12;
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId4, _objectSpread(_objectSpread({}, _context), {}, (_objectSpread12 = {}, (0, _defineProperty2["default"])(_objectSpread12, subscriptionId, _context[subscriptionId] ? _context[subscriptionId] : []), (0, _defineProperty2["default"])(_objectSpread12, "subscriptions", _objectSpread(_objectSpread({}, _context.subscriptions), {}, (0, _defineProperty2["default"])({}, subscriptionId, {
            subscription: subscription,
            subscribers: [subscriberRef]
          }))), _objectSpread12))));
        }
      }
      break;
    case "SUBSCRIPTION_DATA_RECEIVED":
      {
        var _contextId5 = payload.contextId,
          data = payload.data,
          _subscriptionId = payload.subscriptionId,
          iterable = payload.iterable;
        var _context3 = _objectSpread({}, state[_contextId5]);

        // If no context, abort
        if (!_context3) {
          return state;
          // If context exists, and subscription already has data, add more new data
        } else if (_context3[_subscriptionId]) {
          var _context4;
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId5, _objectSpread(_objectSpread({}, _context3), {}, (0, _defineProperty2["default"])({}, _subscriptionId, iterable ? _lodash["default"].uniqBy((0, _concat["default"])(_context4 = [data]).call(_context4, (0, _toConsumableArray2["default"])(_context3[_subscriptionId])), "id") // Prevent duplicates on re-subscriptions
          : data))));
          // Otherwise, create subscription data key and add item
        } else {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId5, _objectSpread(_objectSpread({}, _context3), {}, (0, _defineProperty2["default"])({}, _subscriptionId, iterable ? [data] : data))));
        }
      }
    case "SUBSCRIPTION_DATA_BATCH_RECEIVED":
      {
        var _contextId6 = payload.contextId,
          _data = payload.data,
          _subscriptionId2 = payload.subscriptionId,
          _iterable = payload.iterable;
        var _context5 = _objectSpread({}, state[_contextId6]);

        // If no context, abort
        if (!_context5) {
          return state;
          // If context exists, and subscription already has data, add more new data
        } else if (_context5[_subscriptionId2]) {
          var _context6;
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId6, _objectSpread(_objectSpread({}, _context5), {}, (0, _defineProperty2["default"])({}, _subscriptionId2, _iterable ? _lodash["default"].uniqBy((0, _concat["default"])(_context6 = []).call(_context6, (0, _toConsumableArray2["default"])(_data), (0, _toConsumableArray2["default"])(_context5[_subscriptionId2])), "id") // Prevent duplicates on re-subscriptions
          : _data))));
          // Otherwise, create subscription data key and add item
        } else {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId6, _objectSpread(_objectSpread({}, _context5), {}, (0, _defineProperty2["default"])({}, _subscriptionId2, _data))));
        }
      }
    case "SUBSCRIPTION_DATA_REMOVED":
      {
        var _contextId7 = payload.contextId,
          dataId = payload.dataId,
          _subscriptionId3 = payload.subscriptionId;
        var _context7 = state[_contextId7] ? _objectSpread({}, state[_contextId7]) : null;
        var newData;
        if (_context7) {
          var _context8;
          newData = (0, _filter["default"])(_context8 = _context7[_subscriptionId3]).call(_context8, function (item) {
            return item.id !== dataId;
          });
        }
        if (!_context7) {
          return state;
        } else {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId7, _objectSpread(_objectSpread({}, _context7), {}, (0, _defineProperty2["default"])({}, _subscriptionId3, (0, _toConsumableArray2["default"])(newData)))));
        }
      }
    case "SUBSCRIPTION_DATA_UPDATED":
      {
        var _contextId8 = payload.contextId,
          _data2 = payload.data,
          _subscriptionId4 = payload.subscriptionId;
        var _context9 = state[_contextId8] ? _objectSpread({}, state[_contextId8]) : null;
        var updatedData;
        if (_context9) {
          var oldData = (0, _toConsumableArray2["default"])(_context9[_subscriptionId4]);
          updatedData = (0, _map["default"])(oldData).call(oldData, function (item) {
            if (item.id === _data2.id) {
              if (_data2.entityType === "list") {
                item.name = _data2.name;
                item.rows = _lodash["default"].cloneDeep(_data2.rows);
              } else {
                if (_data2.entityData.geometry) item.entityData.geometry = _objectSpread(_objectSpread({}, item.entityData.geometry), _data2.entityData.geometry);
                if (_data2.entityData.properties) item.entityData.properties = _objectSpread(_objectSpread({}, item.entityData.properties), _data2.entityData.properties);
                if (item.entityType === "camera") item.slewLock = _data2.slewLock;
              }
            }
            return item;
          });
        }
        if (!_context9) {
          return state;
        } else {
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId8, _objectSpread(_objectSpread({}, _context9), {}, (0, _defineProperty2["default"])({}, _subscriptionId4, (0, _toConsumableArray2["default"])(updatedData)))));
        }
      }
    case "REMOVE_SUBSCRIBER":
      {
        var _contextId9 = payload.contextId,
          _subscriptionId5 = payload.subscriptionId,
          _subscriberRef = payload.subscriberRef;
        var _context10 = _objectSpread({}, state[_contextId9]);
        var newSubscribers = _context10.subscriptions[_subscriptionId5] ? (0, _toConsumableArray2["default"])(_context10.subscriptions[_subscriptionId5].subscribers) : [];

        // Remove subscriber from array
        _lodash["default"].pull(newSubscribers, _subscriberRef);
        return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId9, _objectSpread(_objectSpread({}, _context10), {}, {
          subscriptions: _objectSpread(_objectSpread({}, _context10.subscriptions), {}, (0, _defineProperty2["default"])({}, _subscriptionId5, _objectSpread(_objectSpread({}, _context10.subscriptions[_subscriptionId5]), {}, {
            subscribers: newSubscribers
          })))
        })));
      }
    case "ADD_SUBSCRIBER":
      {
        var _context12;
        var _contextId10 = payload.contextId,
          _subscriptionId6 = payload.subscriptionId,
          _subscriberRef2 = payload.subscriberRef;
        var _context11 = _objectSpread({}, state[_contextId10]);
        var _newSubscribers = (0, _concat["default"])(_context12 = []).call(_context12, (0, _toConsumableArray2["default"])(_context11.subscriptions[_subscriptionId6].subscribers), [_subscriberRef2]);
        return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId10, _objectSpread(_objectSpread({}, _context11), {}, {
          subscriptions: _objectSpread(_objectSpread({}, _context11.subscriptions), {}, (0, _defineProperty2["default"])({}, _subscriptionId6, _objectSpread(_objectSpread({}, _context11.subscriptions[_subscriptionId6]), {}, {
            subscribers: _newSubscribers
          })))
        })));
      }
    case "REMOVE_SUBSCRIPTION":
      {
        var _contextId11 = payload.contextId,
          _subscriptionId7 = payload.subscriptionId;
        if (state[_contextId11]) {
          var _context13 = _objectSpread({}, state[_contextId11]);
          var newSubscriptions = _objectSpread({}, state[_contextId11].subscriptions);

          // Remove feed and related data
          delete _context13[_subscriptionId7];
          delete newSubscriptions[_subscriptionId7];
          return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _contextId11, _objectSpread(_objectSpread({}, _context13), {}, {
            subscriptions: newSubscriptions
          })));
        } else {
          return state;
        }
      }

    // case "CONTEXT_DATA_RECEIVED": {
    // 	const { contextId, feedId, data } = payload;
    // 	const context = { ...state[contextId] };
    // 	return {
    // 		...state,
    // 		[contextId]: {
    // 			...context,
    // 			[feedId]: {
    // 				...context[feedId],
    // 				[data.id]: data
    // 			}
    // 		}
    // 	};
    // }

    // case "CONTEXT_DATA_REMOVED": {
    // 	const { contextId, feedId, dataId } = payload;
    // 	const context = { ...state[contextId] };
    // 	const newFeedData = { ...context[feedId] };

    // 	delete newFeedData[dataId];

    // 	return {
    // 		...state,
    // 		[contextId]: {
    // 			...context,
    // 			[feedId]: newFeedData
    // 		}
    // 	};
    // }

    default:
      return state;
  }
};
var _default = contextualData;
exports["default"] = _default;