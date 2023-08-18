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
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _clientAppCore = require("client-app-core");
var _Collections = _interopRequireDefault(require("./Collections"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var CollectionsCard = function CollectionsCard(_ref) {
  var title = _ref.title,
    id = _ref.id,
    collectionsData = _ref.collectionsData;
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    collection = _useState2[0],
    setCollection = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    selectedCollection = _useState4[0],
    setSelectedCollection = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    value = _useState6[0],
    setValue = _useState6[1];
  (0, _react.useEffect)(function () {
    _clientAppCore.unitService.getAppSettingsByKey("units-app", id, function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      } else {
        if (response.value) {
          setValue(response.value);
        }
      }
    });
  }, []);
  var updateAppSettings = function updateAppSettings(data) {
    _clientAppCore.unitService.updateAppSettingsByKey("units-app", id, data, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  var getSelectedCollection = function getSelectedCollection() {
    (0, _map["default"])(collectionsData).call(collectionsData, function (data) {
      if (data.id === value) {
        setCollection(data);
        setSelectedCollection(value);
      }
    });
  };
  (0, _react.useEffect)(function () {
    getSelectedCollection();
  }, [value]);
  var changeCollection = function changeCollection(valueData) {
    setSelectedCollection(valueData);
    (0, _forEach["default"])(collectionsData).call(collectionsData, function (element) {
      if (element.id === valueData) {
        setCollection(element);
        updateAppSettings(valueData);
      }
    });
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "collectionsCardContainer",
    style: {
      backgroundColor: "#3D3F42",
      margin: "25px 5px 0px 5px",
      padding: "20px 15px",
      borderRadius: "5px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "collectionsCardHeader"
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "14px",
    style: {
      fontWeight: "600",
      marginBottom: "10px",
      textAlign: "center"
    }
  }, title), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    select: true,
    value: selectedCollection,
    variant: "standard",
    fullWidth: true,
    label: (0, _i18n.getTranslation)("global.units.components.collectionsCard.chooseCollection"),
    InputProps: {
      style: {
        fontSize: "11px"
      }
    },
    InputLabelProps: {
      shrink: selectedCollection !== null ? true : false
    },
    onChange: function onChange(e) {
      return changeCollection(e.target.value);
    }
  }, collectionsData && (0, _map["default"])(collectionsData).call(collectionsData, function (element) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      value: element.id,
      key: "".concat(element.id, "-menu-item")
    }, element.name);
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "collectionsCardBody"
  }, collection && (0, _keys["default"])(collection).length !== 0 ? /*#__PURE__*/_react["default"].createElement(_Collections["default"], {
    collection: collection,
    titleId: id
  }) : null));
};
var _default = CollectionsCard;
exports["default"] = _default;