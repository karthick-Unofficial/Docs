"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _Selectors = require("../../GlobalData/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var synth = window.speechSynthesis;
var propTypes = {
  activeAlerts: _propTypes["default"].object,
  tts: _propTypes["default"].object,
  isInitialBatch: _propTypes["default"].bool
};
var defaultProps = {
  activeAlerts: {},
  tts: {
    enabled: false
  },
  isInitialBatch: true
};
var AudioAlertPlayer = function AudioAlertPlayer() {
  var activeAlerts = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.alertSelector)(state);
  });
  var isInitialBatch = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.alertStateSelector)(state);
  });
  var globalState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global;
  });
  var tts = globalState.tts;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    voice = _useState2[0],
    setVoice = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    initialLoaded = _useState4[0],
    setInitialLoaded = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    playedIds = _useState6[0],
    setPlayedIds = _useState6[1];
  (0, _react.useEffect)(function () {
    var voices = synth.getVoices();
    var voice = (0, _filter["default"])(voices).call(voices, function (item) {
      return item.lang === "en-US";
    });
    setVoice(voice[0]);
  }, []);
  (0, _react.useEffect)(function () {
    var alertsArr = (0, _values["default"])(activeAlerts);
    playAlerts(alertsArr, tts.enabled);
  }, [activeAlerts]);

  // Add alert to array of played ids
  var setAlertPlayed = function setAlertPlayed(id) {
    var _context;
    setPlayedIds((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(playedIds), [id]));
  };

  // Render fragment components for each alert that needs to be played
  var playAlerts = function playAlerts(alerts, enabled) {
    if (alerts.length) {
      // Set initial alerts as played
      if (!initialLoaded && isInitialBatch) {
        var ids = (0, _map["default"])(alerts).call(alerts, function (item) {
          return item.id;
        });
        setInitialLoaded(true);
        setPlayedIds(ids);
      } else {
        // Alerts that have not been marked as played
        var filteredAlerts = (0, _filter["default"])(alerts).call(alerts, function (item) {
          return !(0, _includes["default"])(playedIds).call(playedIds, item.id);
        });

        // If audio alerts are not enabled, mark all incoming alerts as played
        if (!enabled) {
          (0, _forEach["default"])(filteredAlerts).call(filteredAlerts, function (item) {
            setAlertPlayed(item.id);
          });
        }
        // Otherwise, if alerts are to be played, play them
        else if (filteredAlerts.length) {
          return playVoice(filteredAlerts);
        }
      }
    }
    return null;
  };
  var playVoice = function playVoice(filteredAlerts) {
    var alertText = (0, _map["default"])(filteredAlerts).call(filteredAlerts, function (alert) {
      var alertStr = "";
      if (alert.audioSettings) {
        if (alert.audioSettings.speakAlertText) alertStr += alert.audioSettings.alertText ? alert.audioSettings.alertText : "Alert, Alert";
        if (alert.audioSettings.speakAlertNotification) alertStr += " " + alert.summary;
      } else {
        alertStr = "Alert, Alert " + alert.summary;
      }
      return {
        text: alertStr,
        id: alert.id
      };
    });
    if (alertText.length) {
      var data = (0, _map["default"])(alertText).call(alertText, function (alert) {
        var audio = new SpeechSynthesisUtterance(alert.text);
        audio.voice = voice;

        // End handler
        audio.onend = function () {
          setAlertPlayed(alert.id);
        };
        synth.speak(audio);
      });
      return data;
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null);
};
AudioAlertPlayer.propTypes = propTypes;
AudioAlertPlayer.defaultProps = defaultProps;
var _default = AudioAlertPlayer;
exports["default"] = _default;