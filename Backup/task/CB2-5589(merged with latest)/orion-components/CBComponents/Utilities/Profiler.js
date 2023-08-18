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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = require("prop-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  id: _propTypes.PropTypes.string.isRequired,
  reportInterval: _propTypes.PropTypes.number,
  pollInterval: _propTypes.PropTypes.number
};
var defaultProps = {
  reportInterval: 15000,
  pollInterval: 5000
};
var CBProfiler = function CBProfiler(_ref) {
  var reportInterval = _ref.reportInterval,
    pollInterval = _ref.pollInterval,
    id = _ref.id,
    children = _ref.children;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    total = _useState2[0],
    setTotal = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    previous = _useState4[0],
    setPrevious = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    current = _useState6[0],
    setCurrent = _useState6[1];
  var _useState7 = (0, _react.useState)([]),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    perPoll = _useState8[0],
    setPerPoll = _useState8[1];
  (0, _react.useEffect)(function () {
    (0, _setInterval2["default"])(function () {
      logMetrics();
    }, reportInterval);
    (0, _setInterval2["default"])(function () {
      var _context;
      setPerPoll.apply(void 0, (0, _concat["default"])(_context = (0, _toConsumableArray2["default"])(perPoll)).call(_context, [current]));
      setPrevious(current);
      setCurrent([]);
    }, pollInterval);
  }, []);
  var getRenderCounts = function getRenderCounts() {
    var difference = Math.round(current.length - previous.length);
    var renderCount = (0, _map["default"])(perPoll).call(perPoll, function (poll) {
      return poll.length;
    });
    var pollAverage = Math.round((0, _reduce["default"])(renderCount).call(renderCount, function (a, b) {
      return a + b;
    }, 0) / perPoll.length);
    console.groupCollapsed("%c# of Render Calculations / ".concat(pollInterval / 1000, " seconds"), "font-weight: bold");
    console.log("Average Per Poll: %c".concat(pollAverage), "font-weight: bold");
    console.log("Previous Poll: ".concat(previous.length));
    console.log("Current Poll: ".concat(current.length));
    console.log("Difference: %c".concat(Math.abs(difference)), "color: ".concat(difference > 0 ? "red" : "green"));
    console.groupEnd();
  };
  var getRenderTimes = function getRenderTimes() {
    var getAverage = function getAverage(key, inputArray) {
      var _context2;
      var result = (0, _reduce["default"])(_context2 = (0, _map["default"])(inputArray).call(inputArray, function (item) {
        return item[key];
      })).call(_context2, function (a, b) {
        return a + b;
      }, 0) / inputArray.length;
      return result;
    };
    var getNestedAverage = function getNestedAverage(key, inputArray) {
      var _context3;
      var result = (0, _reduce["default"])(_context3 = (0, _map["default"])(inputArray).call(inputArray, function (poll) {
        return getAverage(key, poll);
      })).call(_context3, function (a, b) {
        return a + b;
      }, 0) / inputArray.length;
      return result;
    };
    var totalActualTime = getAverage("actualTime", total);
    var totalBaseTime = getAverage("baseTime", total);
    var totalStartToCommit = getAverage("commitTime", total) - getAverage("startTime", total);
    var actualTime = getNestedAverage("actualTime", perPoll);
    var baseTime = getNestedAverage("baseTime", perPoll);
    var startToCommit = getNestedAverage("commitTime", perPoll) - getNestedAverage("startTime", perPoll);
    console.groupCollapsed("%cRender Times / ".concat(pollInterval / 1000, " seconds"), "font-weight: bold");
    console.group("Overall");
    console.log("Average Actual Time: %c".concat(totalActualTime), "font-weight: bold");
    console.log("Average Base Time: %c".concat(totalBaseTime), "font-weight: bold");
    console.log("Average Time from Start to Commit: %c".concat(totalStartToCommit), "font-weight: bold");
    console.groupEnd();
    console.group("Per Poll");
    console.log("Average Actual Time: %c".concat(actualTime), "font-weight: bold");
    console.log("Average Base Time: %c".concat(baseTime), "font-weight: bold");
    console.log("Average Time from Start to Commit: %c".concat(startToCommit), "font-weight: bold");
    console.groupEnd();
    console.groupEnd();
  };
  var logMetrics = function logMetrics() {
    console.group("%c".concat(id, " Component Render Metrics"), "background-color: black; color: white;");
    getRenderCounts();
    getRenderTimes();
    console.groupEnd();
  };
  var handleRender = function handleRender(id, phase, actualTime, baseTime, startTime, commitTime) {
    var metrics = {
      id: id,
      phase: phase,
      actualTime: actualTime,
      baseTime: baseTime,
      startTime: startTime,
      commitTime: commitTime
    };
    if (phase !== "mount") {
      total.push(metrics);
      current.push(metrics);
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_react.unstable_Profiler, {
    id: id,
    onRender: handleRender
  }, children);
};
CBProfiler.propTypes = propTypes;
CBProfiler.defaultProps = defaultProps;
var _default = CBProfiler;
exports["default"] = _default;