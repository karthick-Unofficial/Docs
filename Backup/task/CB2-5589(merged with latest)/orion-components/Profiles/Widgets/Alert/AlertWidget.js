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
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _flatMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flat-map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Apm = require("../../../Apm");
var _moment = _interopRequireDefault(require("moment"));
var _ChevronRight = _interopRequireDefault(require("@mui/icons-material/ChevronRight"));
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Material UI

var AlertWidget = function AlertWidget(_ref) {
  var _context5, _context6, _context7, _context8;
  var contextId = _ref.contextId,
    loadProfile = _ref.loadProfile,
    notifications = _ref.notifications,
    closeNotification = _ref.closeNotification,
    order = _ref.order,
    enabled = _ref.enabled;
  var dispatch = (0, _reactRedux.useDispatch)();
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  _moment["default"].locale(locale); // support date localization

  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var getSummary = function getSummary(alert) {
    var object = alert.object,
      target = alert.target,
      summary = alert.summary;
    var message;
    // Allow linking to other entities involved in alert
    if (object.id !== contextId) {
      var _context, _context2;
      message = (0, _slice["default"])(_context = (0, _flatMap["default"])(_context2 = summary.split(object.name)).call(_context2, function (item, index) {
        return [item, /*#__PURE__*/_react["default"].createElement("a", {
          key: "object-link-".concat(index),
          onClick: function onClick() {
            return dispatch(loadProfile(object.id, object.name, object.type, "profile", "primary"));
          }
        }, object.name)];
      })).call(_context, 0, -1);
    } else if (target.id !== contextId) {
      var _context3, _context4;
      message = (0, _slice["default"])(_context3 = (0, _flatMap["default"])(_context4 = summary.split(target.name)).call(_context4, function (item, index) {
        return [item, /*#__PURE__*/_react["default"].createElement("a", {
          key: "target-link-".concat(index),
          onClick: function onClick() {
            return dispatch(loadProfile(target.id, target.name, target.type, "profile", "primary"));
          }
        }, target.name)];
      })).call(_context3, 0, -1);
    }
    return /*#__PURE__*/_react["default"].createElement("p", {
      className: "message"
    }, message);
  };
  var handleExpand = function handleExpand() {
    setExpanded(!expanded);
  };
  var activeAlerts = (0, _filter["default"])(_context5 = (0, _filter["default"])(_context6 = (0, _sort["default"])(_context7 = (0, _values["default"])(notifications.activeItemsById)).call(_context7, function (a, b) {
    return _moment["default"].utc(b.createdDate) - _moment["default"].utc(a.createdDate);
  })).call(_context6, function (item) {
    return item.isPriority === true && item.viewed === false;
  })).call(_context5, function (item) {
    return item.object && item.object.id === contextId || item.target && item.target.id === contextId;
  });
  _moment["default"].relativeTimeThreshold("h", 24);
  var alertCount = activeAlerts.length;
  return !enabled || !alertCount ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("section", {
    className: "widget-wrapper alert-widget ".concat("index-" + order)
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "alert-list"
  }, (0, _map["default"])(_context8 = (0, _filter["default"])(activeAlerts).call(activeAlerts, function (alert, index) {
    if (!expanded) {
      return index === 0;
    } else {
      return alert;
    }
  })).call(_context8, function (alert, index) {
    var _context9;
    var id = alert.id,
      createdDate = alert.createdDate;
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: index,
      className: (0, _concat["default"])(_context9 = "notification-item ".concat("item-" + index, " ")).call(_context9, expanded && alertCount > 1 ? "expanded" : "closed")
    }, index === 0 && alertCount > 1 && /*#__PURE__*/_react["default"].createElement("div", {
      className: "show-hide",
      onClick: handleExpand
    }, expanded ? /*#__PURE__*/_react["default"].createElement(_ExpandMore["default"], null) : /*#__PURE__*/_react["default"].createElement(_ChevronRight["default"], null)), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-container"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "info-icon-wrapper"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        width: !expanded && alertCount.toString().length > 2 ? alertCount.toString().length * 13 : ""
      }
    }, expanded ? "!" : alertCount))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "text-wrapper"
    }, getSummary(alert), /*#__PURE__*/_react["default"].createElement("p", {
      className: "time"
    }, (0, _moment["default"])(createdDate).fromNow())), /*#__PURE__*/_react["default"].createElement("i", {
      className: "material-icons",
      onClick: function onClick() {
        return dispatch(closeNotification(id));
      }
    }, "cancel"));
  })));
};
var _default = (0, _Apm.withSpan)("alert-widget", "profile-widget")(AlertWidget);
exports["default"] = _default;