"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/slice");
var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");
var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");
var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");
var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _urlSearchParams = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url-search-params"));
var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
var _jsCookie = _interopRequireDefault(require("js-cookie"));
var PlaySettingsActions = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/PlaySettings/actions"));
var PlaySettingsActionTypes = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/PlaySettings/actionTypes"));
var _Cookie = require("./utils/Cookie");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context2; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context2 = Object.prototype.toString.call(o)).call(_context2, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var playUrlParametersMap = {
  "signalingURL": "playSignalingURL",
  "applicationName": "playApplicationName",
  "streamName": "playStreamName"
};
var CookieName = "wowzaWebrtcValues";
var PlaySettingsForm = function PlaySettingsForm() {
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    initialized = _useState2[0],
    setInitialized = _useState2[1];
  var playSettings = (0, _reactRedux.useSelector)(function (state) {
    return state.playSettings;
  });
  var webrtcPlay = (0, _reactRedux.useSelector)(function (state) {
    return state.webrtcPlay;
  });

  // load play settings from cookie and URL on mount
  (0, _react.useEffect)(function () {
    var cookieValues = (0, _Cookie.getCookieValues)(CookieName);
    var urlParams = new _urlSearchParams["default"](window.location.search);
    var qs = {};
    var _iterator = _createForOfIteratorHelper((0, _entries["default"])(urlParams).call(urlParams)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];
        qs[key] = value;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var savedValues = _objectSpread(_objectSpread({}, cookieValues), qs);
    for (var paramKey in playUrlParametersMap) {
      if (savedValues[playUrlParametersMap[paramKey]] != null) {
        switch (playUrlParametersMap[paramKey]) {
          case "playSignalingURL":
            dispatch({
              type: PlaySettingsActionTypes.SET_PLAY_SIGNALING_URL,
              signalingURL: savedValues[playUrlParametersMap[paramKey]]
            });
            break;
          case "playApplicationName":
            dispatch({
              type: PlaySettingsActionTypes.SET_PLAY_APPLICATION_NAME,
              applicationName: savedValues[playUrlParametersMap[paramKey]]
            });
            break;
          case "playStreamName":
            dispatch({
              type: PlaySettingsActionTypes.SET_PLAY_STREAM_NAME,
              streamName: savedValues[playUrlParametersMap[paramKey]]
            });
            break;
          default:
        }
      }
    }
    setInitialized(true);
  }, [dispatch]);

  // save values to Cookie
  (0, _react.useEffect)(function () {
    var _context;
    var cookieValues = (0, _Cookie.getCookieValues)(CookieName);
    for (var paramKey in playUrlParametersMap) {
      if (playSettings[paramKey] != null) {
        cookieValues[playUrlParametersMap[paramKey]] = playSettings[paramKey];
      }
    }

    // Set the cookie with an expiry of 1 day		
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    document.cookie = (0, _concat["default"])(_context = "".concat(CookieName, "=").concat(cookieValues, ";expires=")).call(_context, expiryDate.toUTCString(), ";path=/");
  }, [playSettings]);
  if (!initialized) return null;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-md-4 col-sm-12",
    id: "play-settings"
  }, /*#__PURE__*/_react["default"].createElement("form", {
    id: "play-settings-form"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "playSdpURL"
  }, "Signaling URL"), /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    className: "form-control",
    id: "playSignalingURL",
    name: "playSignalingURL",
    maxLength: "1024",
    placeholder: "wss://[ssl-certificate-domain-name]/webrtc-session.json",
    value: playSettings.signalingURL,
    onChange: function onChange(e) {
      return dispatch({
        type: PlaySettingsActionTypes.SET_PLAY_SIGNALING_URL,
        signalingURL: e.target.value
      });
    }
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "playApplicationName"
  }, "Application Name"), /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    className: "form-control",
    id: "playApplicationName",
    name: "playApplicationName",
    maxLength: "256",
    value: playSettings.applicationName,
    onChange: function onChange(e) {
      return dispatch({
        type: PlaySettingsActionTypes.SET_PLAY_APPLICATION_NAME,
        applicationName: e.target.value
      });
    }
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    htmlFor: "playStreamName"
  }, "Stream Name"), /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    className: "form-control",
    id: "playStreamName",
    name: "playStreamName",
    maxLength: "256",
    value: playSettings.streamName,
    onChange: function onChange(e) {
      return dispatch({
        type: PlaySettingsActionTypes.SET_PLAY_STREAM_NAME,
        streamName: e.target.value
      });
    }
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-10"
  }, !webrtcPlay.connected && /*#__PURE__*/_react["default"].createElement("button", {
    id: "play-toggle",
    type: "button",
    className: "btn",
    disabled: playSettings.playStarting,
    onClick: function onClick(e) {
      return dispatch(PlaySettingsActions.startPlay());
    }
  }, "Play"), webrtcPlay.connected && /*#__PURE__*/_react["default"].createElement("button", {
    id: "play-toggle",
    type: "button",
    className: "btn",
    onClick: function onClick(e) {
      return dispatch(PlaySettingsActions.stopPlay());
    }
  }, "Stop")))));
};
var _default = PlaySettingsForm;
exports["default"] = _default;