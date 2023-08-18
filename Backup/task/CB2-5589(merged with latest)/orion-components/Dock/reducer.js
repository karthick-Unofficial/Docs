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
exports.initialState = exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context7, _context8; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context7 = ownKeys(Object(source), !0)).call(_context7, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context8 = ownKeys(Object(source))).call(_context8, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = {
  tab: "Notifications",
  isOpen: false,
  hasError: false,
  rejectedNots: [],
  newAlerts: [],
  WavCam: false,
  expandedAlert: null,
  showWavCamLabels: true
};
exports.initialState = initialState;
var Dock = function Dock() {
  var _context, _context2, _context3, _context4, _context5;
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var payload = action.payload;
  switch (action.type) {
    case "SET_ALERTS_TAB":
      return (0, _assign["default"])({}, state, {
        tab: action.tab,
        newAlerts: []
      });
    case "TOGGLE_CLOSE":
      return (0, _assign["default"])({}, state, {
        newAlerts: []
      });
    case "TOGGLE_OPEN":
      return (0, _assign["default"])({}, state, {
        isOpen: !state.isOpen
      });
    case "TOGGLE_WAV_CAM":
      return _objectSpread(_objectSpread({}, state), {}, {
        WavCam: !state.WavCam
      });
    case "TOGGLE_WAV_CAM_LABELS":
      return _objectSpread(_objectSpread({}, state), {}, {
        showWavCamLabels: !state.showWavCamLabels
      });
    // specific open functionality for the 'add camera to dock' button
    case "CAMERA_TO_DOCK_MODE":
      return (0, _assign["default"])({}, state, {
        tab: "Cameras",
        isOpen: true
      });
    case "CLOSE_NOTIFICATION_FAILED":
      return (0, _assign["default"])({}, state, {
        hasError: true,
        rejectedNots: (0, _concat["default"])(_context = [action.notificationId]).call(_context, (0, _toConsumableArray2["default"])(state.rejectedNots))
      });
    case "CLOSE_NOTIFICATIONS_FAILED":
      return (0, _assign["default"])({}, state, {
        hasError: true,
        rejectedNots: (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(action.notificationIds), (0, _toConsumableArray2["default"])(state.rejectedNots))
      });
    case "REOPEN_NOTIFICATION_FAILED":
      return (0, _assign["default"])({}, state, {
        hasError: true,
        rejectedNots: (0, _concat["default"])(_context3 = [action.notificationId]).call(_context3, (0, _toConsumableArray2["default"])(state.rejectedNots))
      });
    case "REOPEN_NOTIFICATIONS_FAILED":
      return (0, _assign["default"])({}, state, {
        hasError: true,
        rejectedNots: (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(action.notificationIds), (0, _toConsumableArray2["default"])(state.rejectedNots))
      });
    case "GET_ARCHIVE_FAILED":
      return (0, _assign["default"])({}, state, {
        hasError: true,
        rejectedNots: []
      });
    case "GET_ARCHIVE_SUCCESS":
      return (0, _assign["default"])({}, state, {
        hasError: false,
        rejectedNots: []
      });
    case "CLOSE_NOTIFICATION_COMPLETE":
      return (0, _assign["default"])({}, state, {
        hasError: false,
        rejectedNots: []
      });
    case "CLOSE_NOTIFICATIONS_COMPLETE":
      return (0, _assign["default"])({}, state, {
        hasError: false,
        rejectedNots: []
      });
    case "SHOW_ALERT":
      return (0, _assign["default"])({}, state, {
        newAlerts: (0, _concat["default"])(_context5 = []).call(_context5, (0, _toConsumableArray2["default"])(state.newAlerts), [action.notification])
      });
    case "HIDE_ALERT":
      {
        var _context6;
        var newState = (0, _filter["default"])(_context6 = state.newAlerts).call(_context6, function (notification) {
          return notification.id !== action.notificationId;
        });
        return (0, _assign["default"])({}, state, {
          newAlerts: newState
        });
      }
    case "OPEN_ALERT_PROFILE":
      {
        var id = payload.id;
        return _objectSpread(_objectSpread({}, state), {}, {
          expandedAlert: id
        });
      }
    case "CLOSE_ALERT_PROFILE":
      return _objectSpread(_objectSpread({}, state), {}, {
        expandedAlert: null
      });
    default:
      return state;
  }
};
var _default = Dock;
exports["default"] = _default;