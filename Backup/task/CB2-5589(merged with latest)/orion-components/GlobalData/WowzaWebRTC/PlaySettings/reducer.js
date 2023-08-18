"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var PlaySettingsActions = _interopRequireWildcard(require("./actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = [];
var webRTCPlaySettingsReducer = function webRTCPlaySettingsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case PlaySettingsActions.SET_PLAY_SETTINGS:
      {
        var streamName = action.streamName;
        var newState = (0, _toConsumableArray2["default"])(state);
        var existingItemIndex = (0, _findIndex["default"])(newState).call(newState, function (item) {
          return item.streamName === streamName;
        });
        if (existingItemIndex === -1) {
          var newItem = {
            signalingURL: action.signalingURL,
            applicationName: action.applicationName,
            streamName: action.streamName,
            playStart: false,
            playStarting: false,
            playStop: false,
            playStopping: false
          };
          newState.push(newItem);
        } else {
          newState[existingItemIndex].signalingURL = action.signalingURL;
          newState[existingItemIndex].applicationName = action.applicationName;
          newState[existingItemIndex].streamName = action.streamName;
        }
        return newState;
      }
    case PlaySettingsActions.SET_PLAY_FLAGS:
      return (0, _map["default"])(state).call(state, function (playFlagsState) {
        var _action$playStart, _action$playStarting, _action$playStop, _action$playStopping;
        if (playFlagsState.streamName !== action.streamName) {
          return playFlagsState;
        }
        return _objectSpread(_objectSpread({}, playFlagsState), {}, {
          playStart: (_action$playStart = action.playStart) !== null && _action$playStart !== void 0 ? _action$playStart : playFlagsState.playStart,
          playStarting: (_action$playStarting = action.playStarting) !== null && _action$playStarting !== void 0 ? _action$playStarting : playFlagsState.playStarting,
          playStop: (_action$playStop = action.playStop) !== null && _action$playStop !== void 0 ? _action$playStop : playFlagsState.playStop,
          playStopping: (_action$playStopping = action.playStopping) !== null && _action$playStopping !== void 0 ? _action$playStopping : playFlagsState.playStopping
        });
      });
    case PlaySettingsActions.RESET_PLAY_SETTINGS:
      return (0, _filter["default"])(state).call(state, function (item) {
        return item.streamName !== action.data.streamName;
      });
    default:
      return state;
  }
};
var _default = webRTCPlaySettingsReducer;
exports["default"] = _default;