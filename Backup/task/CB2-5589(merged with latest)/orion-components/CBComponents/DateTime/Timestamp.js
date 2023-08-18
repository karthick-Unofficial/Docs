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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
_moment["default"].relativeTimeThreshold("h", 24);
var propTypes = {
  timestamp: _propTypes["default"].string.isRequired,
  format: _propTypes["default"].string,
  locale: _propTypes["default"].string
};
var defaultProps = {
  format: "L",
  locale: "en"
};
var Timestamp = function Timestamp(_ref) {
  var timestamp = _ref.timestamp,
    format = _ref.format,
    useTimeAgo = _ref.useTimeAgo,
    locale = _ref.locale;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    display = _useState2[0],
    setDisplay = _useState2[1];
  var secondInterval = false;
  var minuteInterval = false;
  (0, _react.useEffect)(function () {
    getTimestamp();
    handleRefresh();
    return function () {
      clearInterval(secondInterval);
      clearInterval(minuteInterval);
    };
  }, []);
  var getDuration = function getDuration() {
    var x = (0, _moment["default"])(timestamp);
    var y = (0, _moment["default"])();
    var duration = _moment["default"].duration(y.diff(x));
    return duration;
  };
  var getTimestamp = function getTimestamp() {
    var _context;
    var momentTimestamp = (0, _moment["default"])(timestamp).locale(locale);
    var display = useTimeAgo ? (0, _concat["default"])(_context = "".concat(momentTimestamp.fromNow(), " (")).call(_context, _clientAppCore.timeConversion.convertToUserTime(momentTimestamp, "L", locale), ")") : "".concat(_clientAppCore.timeConversion.convertToUserTime(momentTimestamp, format, locale));
    setDisplay(display);
  };
  var handleRefresh = function handleRefresh() {
    var duration = getDuration();
    var seconds = duration.asSeconds();
    var minutes = duration.asMinutes();
    if (minutes < 1) {
      if (!secondInterval) secondInterval = (0, _setInterval2["default"])(function () {
        return handleRefresh();
      }, 10000);
    }
    if (seconds > 59 && minutes < 59) {
      clearInterval(secondInterval);
      if (!minuteInterval) minuteInterval = (0, _setInterval2["default"])(function () {
        return handleRefresh();
      }, 60000);
    }
    if (minutes === 59) {
      clearInterval(minuteInterval);
    }
    getTimestamp();
  };
  return /*#__PURE__*/_react["default"].createElement("span", null, display);
};
Timestamp.propTypes = propTypes;
Timestamp.defaultProps = defaultProps;
var _default = Timestamp;
exports["default"] = _default;