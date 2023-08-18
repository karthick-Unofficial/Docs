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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _AccessPointCard = _interopRequireDefault(require("./components/AccessPointCard"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  accessPoints: _propTypes["default"].object,
  enabled: _propTypes["default"].bool,
  order: _propTypes["default"].number
};
var defaultProps = {
  accessPoints: null,
  enabled: true
};
var AccessPointWidget = function AccessPointWidget(props) {
  var accessPoints = props.accessPoints,
    order = props.order,
    loadProfile = props.loadProfile,
    enabled = props.enabled;
  var _useState = (0, _react.useState)("widget-wrapper collapsed index-".concat(order)),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    wrapperClass = _useState2[0],
    setWrapperClass = _useState2[1];
  (0, _react.useEffect)(function () {
    setWrapperClass("widget-wrapper collapsed index-".concat(order));
  }, [order]);
  return !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: wrapperClass
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.accessPoint.accessPointOnFloorPlan.title"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content",
    style: {
      display: "flex"
    }
  }, accessPoints && accessPoints.length > 0 ? (0, _map["default"])(accessPoints).call(accessPoints, function (accessPoint, index) {
    return /*#__PURE__*/_react["default"].createElement(_AccessPointCard["default"], {
      accessPoint: accessPoint,
      key: index,
      loadProfile: loadProfile,
      canTarget: true // this  is true because there is no implementation for disabling an access point.
      ,
      readOnly: false
    });
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      margin: "12px auto"
    },
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.accessPoint.accessPointOnFloorPlan.noAcpAvailable"
  }))));
};
AccessPointWidget.propTypes = propTypes;
AccessPointWidget.defaultProps = defaultProps;
var _default = AccessPointWidget;
exports["default"] = _default;