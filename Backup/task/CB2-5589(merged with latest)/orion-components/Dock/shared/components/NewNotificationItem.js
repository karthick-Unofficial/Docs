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
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Person = _interopRequireDefault(require("@mui/icons-material/Person"));
var _Error = _interopRequireDefault(require("@mui/icons-material/Error"));
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _material = require("@mui/material");
var _moment = _interopRequireDefault(require("moment"));
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Material UI

// Moment

// Create variable that will hold setTimeout for clearing notification
var clearItem = undefined;
var NewNotificationItem = function NewNotificationItem(_ref) {
  var clearNotification = _ref.clearNotification,
    notification = _ref.notification,
    timeFormatPreference = _ref.timeFormatPreference,
    firstPriority = _ref.firstPriority;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    undone = _useState2[0],
    setUndone = _useState2[1];
  (0, _react.useEffect)(function () {
    // Assign setTimeout to variable. Will complete normally if undo is not clicked on user feedback toast
    clearItem = (0, _setTimeout2["default"])(function () {
      return dispatch(clearNotification(notification.id));
    }, 5000);
  }, []);
  var handleUndo = function handleUndo() {
    notification.undoFunc();
    setUndone(true);
    // Clear initial setTimeout and set a new one
    // Prevents toast from clearing before user can visualize feedback after clicking undo
    window.clearTimeout(clearItem);
    (0, _setTimeout2["default"])(function () {
      return dispatch(clearNotification(notification.id));
    }, 5000);
  };
  var alertIconStyles = {
    borderRadius: "30px",
    backgroundColor: "white",
    height: "28px",
    width: "28`px"
  };
  var infoIconStyles = {
    height: "30px",
    width: "30px",
    color: "//" // <-- Garbage value to overwrite mat-ui and use var
  };

  var createdDate = notification.createdDate,
    summary = notification.summary,
    isPriority = notification.isPriority,
    feedback = notification.feedback,
    undoFunc = notification.undoFunc;
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  _moment["default"].locale(locale); // support date localization

  _moment["default"].relativeTimeThreshold("h", 100000);
  var twoDaysAgo = new Date().getTime() - 2 * 24 * 60 * 60 * 1000;
  var isMoreThanTwoDaysAgo = new Date(createdDate).getTime() < twoDaysAgo;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "new-alert-item notification-item" + (isPriority ? " is-priority" : "") + (feedback ? " feedback" : "") + (undone ? " undone" : ""),
    id: "".concat(firstPriority ? "first-priority" : "")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "icon-container"
  }, feedback ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "info-icon-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_Person["default"], {
    style: infoIconStyles
  })) : isPriority ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "info-icon-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_Error["default"], {
    style: alertIconStyles,
    color: "#c64849"
  })) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "info-icon-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_Info["default"], {
    style: infoIconStyles,
    className: "info-icon"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "text-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("p", {
    className: "message"
  }, summary.length > 50 ? (0, _slice["default"])(summary).call(summary, 0, 50) + "..." : summary), /*#__PURE__*/_react["default"].createElement("p", {
    className: "time"
  }, isMoreThanTwoDaysAgo ? _clientAppCore.timeConversion.convertToUserTime(createdDate, "full_".concat(timeFormatPreference ? timeFormatPreference : "12-hour")) : (0, _moment["default"])(createdDate).fromNow())), !!undoFunc && /*#__PURE__*/_react["default"].createElement("div", {
    className: "undo-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: undone ? null : handleUndo,
    variant: "text",
    style: {
      color: "#fff"
    }
  }, undone ? (0, _i18n.getTranslation)("global.dock.shared.newNotificationItem.cancelled") : (0, _i18n.getTranslation)("global.dock.shared.newNotificationItem.undo"))));
};
var _default = NewNotificationItem;
exports["default"] = _default;