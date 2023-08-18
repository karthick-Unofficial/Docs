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
var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _moment = _interopRequireDefault(require("moment"));
var _material = require("@mui/material");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var ElapsedTimer = function ElapsedTimer(_ref) {
  var initialActivityDate = _ref.initialActivityDate,
    eventEndDate = _ref.eventEndDate;
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  _moment["default"].locale(locale);
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    hoursPassed = _useState2[0],
    setHoursPassed = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    minutesPassed = _useState4[0],
    setMinutesPassed = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    secondsPassed = _useState6[0],
    setSecondsPassed = _useState6[1];
  var updateInterval = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }
    updateTimer();
    if (!eventEndDate) {
      updateInterval.current = (0, _setInterval2["default"])(function () {
        updateTimer();
      }, 1000);
    }
    return function () {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [eventEndDate]);
  var updateTimer = function updateTimer() {
    var formattedDateTime = (0, _moment["default"])(initialActivityDate).format("YYYY/MM/DD HH:mm:ss");
    var endTime = eventEndDate ? (0, _moment["default"])(eventEndDate) : (0, _moment["default"])();
    var timeDiff = endTime.diff((0, _moment["default"])(formattedDateTime, "YYYY/MM/DD HH:mm:ss"));
    setMinutesPassed(_moment["default"].utc(timeDiff).format("m"));
    setSecondsPassed(_moment["default"].utc(timeDiff).format("ss"));
    setHoursPassed(endTime.diff(initialActivityDate, "hours"));
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      color: "#fff",
      fontSize: 22,
      lineHeight: "unset"
    }
  }, hoursPassed > 0 && "".concat(hoursPassed, "h "), minutesPassed, "m ", secondsPassed, "s");
};
var _default = /*#__PURE__*/(0, _react.memo)(ElapsedTimer);
exports["default"] = _default;