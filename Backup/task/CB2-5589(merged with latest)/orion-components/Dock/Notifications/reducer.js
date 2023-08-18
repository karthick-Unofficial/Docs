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
var _Symbol$toPrimitive = require("@babel/runtime-corejs3/core-js-stable/symbol/to-primitive");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports["default"] = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[_Symbol$toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context13, _context14; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context13 = ownKeys(Object(source), !0)).call(_context13, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context14 = ownKeys(Object(source))).call(_context14, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var activeItems = function activeItems() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "INITIAL_NOTIFICATIONS_RECEIVED":
      {
        var _context, _context2;
        var ids = [];
        (0, _forEach["default"])(_context = action.notifications).call(_context, function (item) {
          if (item) {
            ids.push(item.id);
          }
        });
        var newState = (0, _concat["default"])(_context2 = []).call(_context2, ids);
        return newState;
      }
    case "NOTIFICATION_BATCH_RECEIVED":
      {
        var _context3, _context4;
        var _ids = [];
        (0, _forEach["default"])(_context3 = action.notifications).call(_context3, function (item) {
          if (item) {
            _ids.push(item.id);
          }
        });
        var _newState = (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(state), _ids);
        return _newState;
      }
    case "CLOSE_NOTIFICATION":
      {
        var _newState2 = (0, _slice["default"])(state).call(state);
        _newState2 = (0, _filter["default"])(_newState2).call(_newState2, function (id) {
          return id !== action.notificationId;
        });
        return _newState2;
      }
    case "CLOSE_NOTIFICATIONS":
      {
        var _newState3 = (0, _slice["default"])(state).call(state);
        _newState3 = (0, _filter["default"])(_newState3).call(_newState3, function (id) {
          var _context5;
          return !(0, _includes["default"])(_context5 = action.notificationIds).call(_context5, id);
        });
        return _newState3;
      }
    default:
      return state;
  }
};
var activeItemsById = function activeItemsById() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "INITIAL_NOTIFICATIONS_RECEIVED":
      {
        var _context6;
        return (0, _reduce["default"])(_context6 = action.notifications).call(_context6, function (acc, not) {
          if (not) {
            return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, not.id, not));
          } else {
            return _objectSpread({}, acc);
          }
        }, {});
      }
    case "NOTIFICATION_BATCH_RECEIVED":
      {
        var _context7;
        var not = (0, _reduce["default"])(_context7 = action.notifications).call(_context7, function (acc, not) {
          if (not) {
            return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, not.id, not));
          } else {
            return _objectSpread({}, acc);
          }
        }, {});
        return _objectSpread(_objectSpread({}, state), not);
      }
    case "CLOSE_NOTIFICATION":
      {
        var _context8;
        var newState = _objectSpread({}, state);
        var _action$notificationI = action.notificationId,
          omit = newState[_action$notificationI],
          remainder = (0, _objectWithoutProperties2["default"])(newState, (0, _map["default"])(_context8 = [_action$notificationI]).call(_context8, _toPropertyKey));
        return remainder;
      }
    case "CLOSE_NOTIFICATIONS":
      {
        var _context9;
        var _newState4 = _objectSpread({}, state);

        // omit all removed ids from itemsById
        _newState4 = (0, _reduce["default"])(_context9 = action.notificationIds).call(_context9, function (acc, notId) {
          var _context10;
          var omit = acc[notId],
            newAcc = (0, _objectWithoutProperties2["default"])(acc, (0, _map["default"])(_context10 = [notId]).call(_context10, _toPropertyKey));
          return newAcc;
        }, _newState4);
        return _newState4;
      }
    default:
      return state;
  }
};
var archiveItems = function archiveItems() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "GET_ARCHIVE_SUCCESS":
      {
        var _context11;
        var ids = (0, _map["default"])(_context11 = action.notifications).call(_context11, function (item) {
          return item.id;
        });
        return ids;
      }
    case "REOPEN_NOTIFICATION":
      {
        var notificationId = action.notificationId;
        var newState = (0, _filter["default"])(state).call(state, function (id) {
          return id !== notificationId;
        });
        return newState;
      }
    case "DUMP_ARCHIVE":
      {
        var _newState5 = [];
        return _newState5;
      }
    default:
      return state;
  }
};
var archiveItemsById = function archiveItemsById() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "GET_ARCHIVE_SUCCESS":
      {
        var _context12;
        var reducedNotifications = (0, _reduce["default"])(_context12 = action.notifications).call(_context12, function (a, b) {
          return (0, _assign["default"])(a, (0, _defineProperty2["default"])({}, b.id, b));
        }, {});
        return reducedNotifications;
      }
    case "REOPEN_NOTIFICATION":
      {
        var notificationId = action.notificationId;
        var newState = _objectSpread({}, state);
        delete newState[notificationId];
        return newState;
      }
    case "DUMP_ARCHIVE":
      {
        var _newState6 = {};
        return _newState6;
      }
    default:
      return state;
  }
};
var initialState = {
  initial: false,
  activeItems: [],
  activeItemsById: {},
  archiveItems: [],
  archiveItemsById: {}
};
exports.initialState = initialState;
var notifications = function notifications() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "INITIAL_NOTIFICATIONS_RECEIVED":
      return _objectSpread(_objectSpread({}, state), {}, {
        initial: true,
        activeItems: activeItems(state.activeItems, action),
        activeItemsById: activeItemsById(state.activeItemsById, action)
      });
    case "NOTIFICATION_BATCH_RECEIVED":
    case "CLOSE_NOTIFICATION":
    case "CLOSE_NOTIFICATIONS":
      return _objectSpread(_objectSpread({}, state), {}, {
        initial: false,
        activeItems: activeItems(state.activeItems, action),
        activeItemsById: activeItemsById(state.activeItemsById, action)
      });
    case "DUMP_ARCHIVE":
    case "GET_ARCHIVE_SUCCESS":
    case "REOPEN_NOTIFICATION":
      return _objectSpread(_objectSpread({}, state), {}, {
        archiveItems: archiveItems(state.archiveItems, action),
        archiveItemsById: archiveItemsById(state.archiveItemsById, action)
      });
    default:
      return state;
  }
};
var _default = notifications;
exports["default"] = _default;