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
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// this can still be improved upon --- add up/down arrow incrementing of numbers, better highlighting/focusing, etc.
// cSpell:ignore ampm

var TimeInput = function TimeInput(_ref) {
  var value = _ref.value,
    timeFormatPreference = _ref.timeFormatPreference,
    disabled = _ref.disabled,
    onChange = _ref.onChange;
  var hoursRef = (0, _react.useRef)(null);
  var minutesRef = (0, _react.useRef)(null);
  var ampmRef = (0, _react.useRef)(null);
  var handleChange = function handleChange(e) {
    var newString;
    var hoursEndIndex = (0, _indexOf["default"])(value).call(value, ":");
    var minutesEndIndex = (0, _indexOf["default"])(value).call(value, " ");
    var hours = (0, _slice["default"])(value).call(value, 0, hoursEndIndex);
    var minutes = timeFormatPreference === "24-hour" ? (0, _slice["default"])(value).call(value, hoursEndIndex + 1) : (0, _slice["default"])(value).call(value, hoursEndIndex + 1, minutesEndIndex);
    var aMPM = (0, _slice["default"])(value).call(value, minutesEndIndex + 1, value.length);
    switch (e.target.name) {
      case "hours":
        {
          var _context, _context2;
          var regexp = /[^\d]/g;
          if (regexp.test(e.target.value)) {
            return;
          }
          var newHours = e.target.value.substr(0, 2).replace(/[^\d]/g, "");
          if (timeFormatPreference === "12-hour" && +newHours > 12) {
            return;
          } else if (timeFormatPreference === "24-hour" && +newHours > 23) {
            return;
          }
          newString = (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "".concat(newHours, ":")).call(_context2, minutes)).call(_context, timeFormatPreference === "24-hour" ? "" : " " + aMPM);
          if (newHours.length === 2) {
            minutesRef.current.focus();
          }
          break;
        }
      case "minutes":
        {
          var _context3, _context4;
          var _regexp = /[^\d]/g;
          if (_regexp.test(e.target.value)) {
            return;
          }
          var newMinutes = e.target.value.substr(0, 2).replace(/[^\d]/g, "");
          if (+newMinutes > 59) {
            return;
          }
          newString = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = "".concat(hours, ":")).call(_context4, newMinutes)).call(_context3, timeFormatPreference === "24-hour" ? "" : " " + aMPM);
          if (newMinutes.length === 2 && timeFormatPreference === "12-hour") {
            ampmRef.current.focus();
          }
          break;
        }
      case "ampm":
        {
          if (timeFormatPreference === "24-hour") return;
          var newValue;
          if (e.keyCode === 65) {
            newValue = "AM";
          } else if (e.keyCode === 80) {
            newValue = "PM";
          } else if (e.keyCode === 38 || e.keyCode === 40) {
            if (aMPM === "AM") {
              newValue = "PM";
            } else {
              newValue = "AM";
            }
          } else {
            return;
          }
          newString = hours + ":" + minutes + " " + newValue;
          break;
        }
      default:
        break;
    }
    onChange(newString);
  };
  var handleFocus = function handleFocus(e) {
    e.target.select();
  };
  var hoursEndIndex = (0, _indexOf["default"])(value).call(value, ":");
  var minutesEndIndex = (0, _indexOf["default"])(value).call(value, " ");
  var hoursValue = (0, _slice["default"])(value).call(value, 0, hoursEndIndex);
  var minutesValue = timeFormatPreference === "24-hour" ? (0, _slice["default"])(value).call(value, hoursEndIndex + 1) : (0, _slice["default"])(value).call(value, hoursEndIndex + 1, minutesEndIndex);
  var ampmValue = (0, _slice["default"])(value).call(value, minutesEndIndex + 1, value.length);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "time-input-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    disabled: disabled,
    name: "hours",
    ref: hoursRef,
    value: hoursValue,
    onChange: handleChange,
    onFocus: handleFocus,
    className: "time-input"
  }), /*#__PURE__*/_react["default"].createElement("span", null, ":"), /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    disabled: disabled,
    name: "minutes",
    ref: minutesRef,
    value: minutesValue,
    onChange: handleChange,
    onFocus: handleFocus,
    className: "time-input"
  }), timeFormatPreference === "12-hour" && /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    disabled: disabled,
    name: "ampm",
    ref: ampmRef,
    value: ampmValue,
    onKeyDown: handleChange,
    onFocus: handleFocus,
    className: "time-input"
  }));
};
var _default = TimeInput;
exports["default"] = _default;