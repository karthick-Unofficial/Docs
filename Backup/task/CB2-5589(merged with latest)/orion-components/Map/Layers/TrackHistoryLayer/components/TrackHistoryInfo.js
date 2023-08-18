"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _react = _interopRequireWildcard(require("react"));
var _reactMapboxGl = require("react-mapbox-gl");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _CBComponents = require("orion-components/CBComponents");
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  map: _propTypes["default"].object.isRequired,
  trackHistoryContexts: _propTypes["default"].array.isRequired,
  timeFormatPreference: _propTypes["default"].string.isRequired
};
var TrackHistoryInfo = function TrackHistoryInfo(_ref) {
  var map = (0, _map["default"])(_ref),
    trackHistoryContexts = _ref.trackHistoryContexts,
    timeFormatPreference = _ref.timeFormatPreference;
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    popups = _useState2[0],
    setPopups = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    popupOrder = _useState4[0],
    setPopupOrder = _useState4[1];
  var handlePointClick = (0, _react.useCallback)(function (e) {
    var _context, _context2;
    e.preventDefault();
    var popupId = (0, _concat["default"])(_context = "".concat(e.features[0].properties.id, "-")).call(_context, e.features[0].properties.acquisitionTime);
    setPopups(_objectSpread(_objectSpread({}, popups), {}, (0, _defineProperty2["default"])({}, popupId, {
      geometry: e.features[0].geometry,
      properties: e.features[0].properties
    })));
    setPopupOrder((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(popupOrder), [popupId]));
  }, [popups, popupOrder]);
  var handleClose = (0, _react.useCallback)(function (e, id) {
    e.preventDefault();
    e.stopPropagation();
    var newPopupOrder = (0, _toConsumableArray2["default"])(popupOrder);
    (0, _splice["default"])(newPopupOrder).call(newPopupOrder, (0, _indexOf["default"])(newPopupOrder).call(newPopupOrder, id), 1);
    setPopupOrder(newPopupOrder);
    var newPopups = _objectSpread({}, popups);
    delete newPopups[id];
    setPopups(newPopups);
  }, [popups, popupOrder]);
  var handlePopupClick = (0, _react.useCallback)(function (id) {
    var newPopupOrder = (0, _toConsumableArray2["default"])(popupOrder);
    (0, _splice["default"])(newPopupOrder).call(newPopupOrder, (0, _indexOf["default"])(newPopupOrder).call(newPopupOrder, id), 1);
    newPopupOrder.push(id);
    setPopupOrder(newPopupOrder);
  }, [popupOrder]);
  (0, _react.useEffect)(function () {
    map.on("click", "ac2-track-history-points", handlePointClick);
    return function () {
      map.off("click", "ac2-track-history-points", handlePointClick);
    };
  }, [handlePointClick]);
  (0, _react.useEffect)(function () {
    var newPopupOrder = [];
    var newPopups = _objectSpread({}, popups);
    (0, _forEach["default"])(popupOrder).call(popupOrder, function (popupKey) {
      if (popups[popupKey] && (0, _indexOf["default"])(trackHistoryContexts).call(trackHistoryContexts, popups[popupKey].properties.id) > -1) {
        newPopupOrder.push(popupKey);
      } else {
        delete newPopups[popupKey];
      }
    });
    setPopupOrder(newPopupOrder);
    setPopups(newPopups);
  }, [trackHistoryContexts]);
  var popupOrderNullCheck = (0, _filter["default"])(popupOrder).call(popupOrder, function (popupId) {
    return popups[popupId];
  });
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, (0, _map["default"])(popupOrderNullCheck).call(popupOrderNullCheck, function (popupId, index) {
    return /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Popup, {
      key: popupId + "-".concat(index),
      coordinates: popups[popupId] ? popups[popupId].geometry.coordinates : [],
      offset: 12,
      onClick: function onClick() {
        return handlePopupClick(popupId);
      }
    }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      style: {
        padding: 0,
        position: "absolute",
        top: "2px",
        right: "2px"
      },
      onClick: function onClick(e) {
        return handleClose(e, popupId);
      }
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null)), popups[popupId].properties["lat"] && /*#__PURE__*/_react["default"].createElement("p", {
      key: "".concat(popupId, "-lat")
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.map.layers.trackHistoryInfo.lat"
    }), " ", /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
      sourceUnit: "decimal-degrees",
      value: popups[popupId].properties["lat"]
    })), popups[popupId].properties["lng"] && /*#__PURE__*/_react["default"].createElement("p", {
      key: "".concat(popupId, "-lng")
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.map.layers.trackHistoryInfo.lon"
    }), " ", /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
      sourceUnit: "decimal-degrees",
      value: popups[popupId].properties["lng"]
    })), (popups[popupId].properties["speed"] || popups[popupId].properties["speed"] === 0) && /*#__PURE__*/_react["default"].createElement("p", {
      key: "".concat(popupId, "-speed")
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.map.layers.trackHistoryInfo.speed"
    }), " ", popups[popupId].properties["speed"]), (popups[popupId].properties["hdg"] || popups[popupId].properties["heading"]) && /*#__PURE__*/_react["default"].createElement("p", {
      key: "".concat(popupId, "-heading")
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.map.layers.trackHistoryInfo.heading"
    }), " ", popups[popupId].properties["hdg"] ? popups[popupId].properties["hdg"] : popups[popupId].properties["heading"], "\xB0"), popups[popupId].properties["acquisitionTime"] && /*#__PURE__*/_react["default"].createElement("p", {
      key: "".concat(popupId, "-time")
    }, _clientAppCore.timeConversion.convertToUserTime(popups[popupId].properties["acquisitionTime"], timeFormatPreference ? "full_".concat(timeFormatPreference) : "full"))));
  }));
};
TrackHistoryInfo.propTypes = propTypes;
var _default = TrackHistoryInfo;
exports["default"] = _default;