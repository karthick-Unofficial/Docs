"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _lodash = _interopRequireDefault(require("lodash"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialContextPanelState = {
  primaryOpen: true,
  secondaryOpen: false,
  viewingHistory: [],
  selectedContext: {
    primary: null,
    secondary: null
  }
};
var contextPanelData = function contextPanelData() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialContextPanelState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "OPEN_PRIMARY":
      return _objectSpread(_objectSpread({}, state), {}, {
        primaryOpen: true
      });
    case "OPEN_SECONDARY":
      return _objectSpread(_objectSpread({}, state), {}, {
        secondaryOpen: true
      });
    case "CLOSE_PRIMARY":
      return _objectSpread(_objectSpread({}, state), {}, {
        primaryOpen: false
      });
    case "CLOSE_SECONDARY":
      return _objectSpread(_objectSpread({}, state), {}, {
        secondaryOpen: false
      });
    case "EXPAND_SECONDARY":
      return _objectSpread(_objectSpread({}, state), {}, {
        secondaryExpanded: true
      });
    case "SHRINK_SECONDARY":
      return _objectSpread(_objectSpread({}, state), {}, {
        secondaryExpanded: false
      });
    case "UPDATE_VIEWING_HISTORY":
      {
        var id = payload.id,
          name = payload.name,
          _type = payload.type,
          profileRef = payload.profileRef,
          context = payload.context,
          options = payload.options;
        var newHistory;
        if (!id) {
          newHistory = _lodash["default"].drop(state.viewingHistory);
        } else {
          var _context;
          newHistory = (0, _concat["default"])(_context = [_objectSpread({
            id: id,
            name: name,
            type: _type,
            profileRef: profileRef,
            context: context
          }, options)]).call(_context, (0, _toConsumableArray2["default"])(state.viewingHistory));
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          viewingHistory: newHistory
        });
      }
    case "DATA_RECEIVED":
    case "SUBSCRIPTION_DATA_RECEIVED":
    case "SUBSCRIPTION_DATA_UPDATED":
      {
        var data = payload.data;

        // Check if incoming data is stored in viewing history
        if (data && (0, _find["default"])(_lodash["default"]).call(_lodash["default"], state.viewingHistory, {
          id: data.id
        })) {
          var _newHistory = (0, _toConsumableArray2["default"])(state.viewingHistory);
          var dataId = data.id;
          var previous = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], _newHistory, {
            id: dataId
          });
          // Check if the name of an entity has changed
          if (previous && data.entityData.properties && previous.name !== data.entityData.properties.name) {
            // Update the name of each instance of entity and return new state
            _lodash["default"].each(_newHistory, function (item) {
              if (item.id === dataId) item.name = data.entityData.properties.name;
            });
            return _objectSpread(_objectSpread({}, state), {}, {
              viewingHistory: _newHistory
            });
          } else return state;
        } else return state;
      }
    case "DATA_BATCH_RECEIVED":
    case "SUBSCRIPTION_DATA_BATCH_RECEIVED":
      {
        var _data = payload.data;
        // Check if any of the incoming data is being stored in viewing history
        if (_lodash["default"].size(_lodash["default"].intersection((0, _map["default"])(_lodash["default"]).call(_lodash["default"], _data, "id"), (0, _map["default"])(_lodash["default"]).call(_lodash["default"], state.viewingHistory, "id")))) {
          var newIds = _lodash["default"].intersection((0, _map["default"])(_lodash["default"]).call(_lodash["default"], _data, "id"), (0, _map["default"])(_lodash["default"]).call(_lodash["default"], state.viewingHistory, "id"));
          var _newHistory2 = (0, _toConsumableArray2["default"])(state.viewingHistory);
          // Handle whether state should be updated
          var update = false;
          _lodash["default"].each(newIds, function (id) {
            var item = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], _data, {
              id: id
            });
            var previous = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], _newHistory2, {
              id: id
            });
            // Check if the name of an entity has changed
            if (item.entityData.properties && item.entityData.properties.name && item.entityData.properties.name !== previous.name) {
              // If name has changed, set update to true
              update = true;
              // Update the name of each instance of entity and return new state
              _lodash["default"].each(_newHistory2, function (previous) {
                if (previous.id === id) previous.name = item.entityData.properties.name;
              });
            }
          });
          // Only update state if a name has changed
          if (update) return _objectSpread(_objectSpread({}, state), {}, {
            viewingHistory: _newHistory2
          });else return state;
        } else return state;
      }
    case "EVENT_UPDATED":
      {
        var event = payload.event;
        // Check if incoming event is being stored in viewing history
        if ((0, _find["default"])(_lodash["default"]).call(_lodash["default"], state.viewingHistory, {
          id: event.id
        })) {
          var _newHistory3 = (0, _toConsumableArray2["default"])(state.viewingHistory);
          var eventId = event.id;
          var _previous = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], _newHistory3, {
            id: eventId
          });
          // Check if name has changed
          if (_previous && _previous.name !== event.name) {
            // Update the name of each instance of event and return new state
            _lodash["default"].each(_newHistory3, function (item) {
              if (item.id === eventId) item.name = event.name;
            });
            return _objectSpread(_objectSpread({}, state), {}, {
              viewingHistory: _newHistory3
            });
          } else return state;
        } else return state;
      }
    case "DATA_REMOVED":
    case "SUBSCRIPTION_DATA_REMOVED":
      {
        var _dataId = payload.dataId;
        // Check if removed data is being stored in viewing history
        if ((0, _find["default"])(_lodash["default"]).call(_lodash["default"], state.viewingHistory, {
          id: _dataId
        })) {
          var _newHistory4 = (0, _toConsumableArray2["default"])(state.viewingHistory);
          // Remove each instance from viewing history and update state
          _lodash["default"].remove(_newHistory4, function (item) {
            return item.id === _dataId;
          });
          return _objectSpread(_objectSpread({}, state), {}, {
            viewingHistory: _newHistory4
          });
        } else return state;
      }
    case "EVENT_REMOVED":
      {
        var _eventId = payload.eventId;
        // Check if removed event is being stored in viewing history
        if ((0, _find["default"])(_lodash["default"]).call(_lodash["default"], state.viewingHistory, {
          id: _eventId
        })) {
          var _newHistory5 = (0, _toConsumableArray2["default"])(state.viewingHistory);
          // Remove each instance from viewing history and update state
          _lodash["default"].remove(_newHistory5, function (item) {
            return item.id === _eventId;
          });
          return _objectSpread(_objectSpread({}, state), {}, {
            viewingHistory: _newHistory5
          });
        } else return state;
      }
    case "SET_SELECTED_CONTEXT":
      {
        var entityId = payload.entityId,
          _context2 = payload.context;
        return _objectSpread(_objectSpread({}, state), {}, {
          selectedContext: _objectSpread(_objectSpread({}, state.selectedContext), {}, (0, _defineProperty2["default"])({}, _context2, entityId))
        });
      }
    case "CLEAR_SELECTED_CONTEXT":
      {
        var contexts = payload.contexts;
        var newSelectedContext = _objectSpread({}, state.selectedContext);
        _lodash["default"].each(contexts, function (context) {
          return newSelectedContext[context] = null;
        });
        return _objectSpread(_objectSpread({}, state), {}, {
          selectedContext: newSelectedContext
        });
      }
    case "CLEAR_VIEWING_HISTORY":
      return _objectSpread(_objectSpread({}, state), {}, {
        viewingHistory: []
      });
    default:
      return state;
  }
};
var _default = contextPanelData;
exports["default"] = _default;