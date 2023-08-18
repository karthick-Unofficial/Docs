"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/slice");
var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");
var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");
var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");
var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _keyBy = _interopRequireDefault(require("lodash/keyBy"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context3; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context3 = Object.prototype.toString.call(o)).call(_context3, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = {
  events: {},
  eventStatistics: {},
  types: {},
  templates: {}
};
var events = function events() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "INITIAL_EVENT_BATCH_RECEIVED":
      {
        var newEvents = _objectSpread({}, state.events);
        var _iterator = _createForOfIteratorHelper(payload),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var event = _step.value;
            newEvents[event.id] = event;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          events: newEvents
        });
      }
    case "EVENT_RECEIVED":
      {
        var _newEvents = _objectSpread({}, state.events);
        _newEvents[payload.id] = payload;
        return _objectSpread(_objectSpread({}, state), {}, {
          events: _newEvents
        });
      }
    case "EVENT_REMOVED":
      {
        var eventId = payload.eventId;
        var _newEvents2 = _objectSpread({}, state.events);
        var newEventStatistics = _objectSpread({}, state.eventStatistics);
        delete _newEvents2[eventId];
        delete newEventStatistics[eventId];
        return _objectSpread(_objectSpread({}, state), {}, {
          events: _newEvents2,
          eventStatistics: newEventStatistics
        });
      }
    case "EVENT_UPDATED":
      {
        var _eventId = payload.eventId,
          _event = payload.event;
        var _newEvents3 = _objectSpread({}, state.events);
        _newEvents3[_eventId] = _event;
        return _objectSpread(_objectSpread({}, state), {}, {
          events: _newEvents3
        });
      }
    case "RECEIVED_EVENT_COMMENT_COUNT":
      {
        var _newEventStatistics = _objectSpread({}, state.eventStatistics);
        _newEventStatistics[payload.eventId] = payload.stats;
        return _objectSpread(_objectSpread({}, state), {}, {
          eventStatistics: _newEventStatistics
        });
      }
    case "EVENT_TYPES_RECEIVED":
      {
        var types = payload.types;
        var newTypes = _objectSpread({}, state.types);
        var update = (0, _keyBy["default"])(types, "eventTypeId");
        return _objectSpread(_objectSpread({}, state), {}, {
          types: _objectSpread(_objectSpread({}, newTypes), update)
        });
      }
    case "EVENT_TEMPLATE_RECEIVED":
      {
        var newTemplates = _objectSpread({}, state.templates);
        newTemplates[payload.id] = payload;
        return _objectSpread(_objectSpread({}, state), {}, {
          templates: newTemplates
        });
      }
    case "EVENT_TEMPLATE_REMOVED":
      {
        var _eventId2 = payload.eventId;
        var _newTemplates = _objectSpread({}, state.templates);
        delete _newTemplates[_eventId2];
        return _objectSpread(_objectSpread({}, state), {}, {
          templates: _newTemplates
        });
      }
    case "EVENT_TEMPLATE_UPDATED":
      {
        var _eventId3 = payload.eventId,
          _event2 = payload.event;
        var _newTemplates2 = _objectSpread({}, state.templates);
        _newTemplates2[_eventId3] = _event2;
        return _objectSpread(_objectSpread({}, state), {}, {
          templates: _newTemplates2
        });
      }
    default:
      return state;
  }
};
var _default = events;
exports["default"] = _default;