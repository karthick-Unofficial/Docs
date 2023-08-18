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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _moment = _interopRequireDefault(require("moment"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var EventReOpenAndClose = function EventReOpenAndClose(_ref) {
  var startDate = _ref.startDate,
    endDate = _ref.endDate,
    onSave = _ref.onSave;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isEventActive = _useState2[0],
    setIsEventActive = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    isCloseButtonDisabled = _useState4[0],
    setIsCloseButtonDisabled = _useState4[1];
  (0, _react.useEffect)(function () {
    var eventClosed = endDate && (0, _moment["default"])(endDate) < (0, _moment["default"])(new Date());
    var isPastStartDate = (0, _moment["default"])(startDate) > (0, _moment["default"])(new Date());
    setIsCloseButtonDisabled(isPastStartDate);
    setIsEventActive(eventClosed);
  }, [startDate, endDate]);
  var handleSave = function handleSave() {
    var now = new Date().toISOString();
    var action = isEventActive ? "re-open" : "close";
    onSave(action, now);
  };
  var buttonLabel = (0, _react.useMemo)(function () {
    return /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: isEventActive ? "global.profiles.eventProfile.components.eventReopenAndClose.reopen" : "global.profiles.eventProfile.components.eventReopenAndClose.close"
    });
  }, [isEventActive]);
  var styles = (0, _react.useMemo)(function () {
    return {
      button: {
        color: "#fff",
        padding: "8px 40px"
      }
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "contained",
    color: "primary",
    style: styles.button,
    onClick: handleSave,
    disabled: isEventActive ? false : isCloseButtonDisabled
  }, buttonLabel));
};
EventReOpenAndClose.propTypes = {
  startDate: _propTypes["default"].instanceOf(Date).isRequired,
  endDate: _propTypes["default"].instanceOf(Date),
  onSave: _propTypes["default"].func.isRequired
};
var _default = /*#__PURE__*/_react["default"].memo(EventReOpenAndClose);
exports["default"] = _default;