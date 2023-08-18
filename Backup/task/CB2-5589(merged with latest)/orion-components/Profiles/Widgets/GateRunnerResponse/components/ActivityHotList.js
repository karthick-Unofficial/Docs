"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _size = _interopRequireDefault(require("lodash/size"));
var _isArray = _interopRequireDefault(require("lodash/isArray"));
var _ActivityCard = _interopRequireDefault(require("./ActivityCard"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  dir: _propTypes["default"].string
};
var defaultProps = {
  dir: "ltr"
};
var ActivityHotList = function ActivityHotList(_ref) {
  var detections = _ref.detections,
    handleSelectDetection = _ref.handleSelectDetection,
    dir = _ref.dir;
  var styles = {
    timeline: _objectSpread({
      color: "#FFFFFF",
      fontSize: 12,
      margin: "5px 0 10px 0"
    }, dir === "rtl" && {
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, (0, _size["default"])(detections) && (0, _isArray["default"])(detections) ? /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      maxHeight: 540,
      overflowY: "scroll"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.timeline
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.activityHotList.chooseAlert"
  })), (0, _map["default"])(detections).call(detections, function (detection, index) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_ActivityCard["default"], {
      key: "activity-card-".concat(detection.id),
      detection: detection,
      handleSelectDetection: handleSelectDetection,
      dir: dir
    }), index !== detections.length - 1 ? /*#__PURE__*/_react["default"].createElement(_material.Divider, {
      style: {
        borderColor: "#494D53"
      }
    }) : null);
  })) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null));
};
ActivityHotList.propTypes = propTypes;
ActivityHotList.defaultProps = defaultProps;
var _default = ActivityHotList;
exports["default"] = _default;