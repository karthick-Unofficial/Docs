"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _MapMarkerRadiusIcon = _interopRequireDefault(require("mdi-react/MapMarkerRadiusIcon"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var DockedControls = function DockedControls(_ref) {
  var userCameras = _ref.userCameras,
    addToDock = _ref.addToDock,
    cameraPosition = _ref.cameraPosition,
    dockedCameras = _ref.dockedCameras,
    setFindNearestMode = _ref.setFindNearestMode,
    cameraView = _ref.cameraView,
    findNearestMode = _ref.findNearestMode,
    findNearestPosition = _ref.findNearestPosition,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    cameraSearch = _useState2[0],
    setCameraSearch = _useState2[1];
  var handleUpdateInput = function handleUpdateInput(event, camera) {
    setCameraSearch(camera.entityData.properties.name);
    dispatch(addToDock(camera.id, cameraPosition, dockedCameras));
  };
  var handleToggleNearestCameraMode = function handleToggleNearestCameraMode() {
    dispatch(setFindNearestMode(cameraPosition));
  };
  var searchableCameras = (0, _map["default"])(userCameras).call(userCameras, function (item) {
    return item;
  });
  var controlStyles = {
    addCamera: _objectSpread({
      backgroundColor: "#41454A",
      borderRadius: "5px",
      marginTop: "15%",
      fontSize: "10px",
      fontWeight: "bold",
      padding: "6px 0"
    }, findNearestMode[cameraPosition] && findNearestPosition === cameraPosition ? {} : {
      color: "#fff"
    }),
    searchCamera: {
      backgroundColor: "#2C2B2D"
    },
    dockedControls: _objectSpread({
      fontWeight: "bold"
    }, dir === "rtl" ? {
      paddingLeft: 16,
      paddingRight: 8
    } : {
      paddingLeft: 8,
      paddingRight: 16
    }),
    mapMarkerRadiusIcon: _objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: 12,
      marginRight: 0
    }), dir === "rtl" && {
      marginRight: 12,
      marginLeft: 0
    })
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "camera-dock-controls",
    style: cameraView ? {
      paddingBottom: "15%"
    } : {}
  }, cameraView && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    style: controlStyles.addCamera,
    primary: findNearestMode[cameraPosition] && findNearestPosition === cameraPosition,
    onClick: handleToggleNearestCameraMode
  }, /*#__PURE__*/_react["default"].createElement(_MapMarkerRadiusIcon["default"], {
    style: controlStyles.mapMarkerRadiusIcon
  }), /*#__PURE__*/_react["default"].createElement("span", {
    style: controlStyles.dockedControls
  }, findNearestMode[cameraPosition] && findNearestPosition === cameraPosition ? (0, _i18n.getTranslation)("global.dock.cameras.dockedControls.selectNearestCam") : (0, _i18n.getTranslation)("global.dock.cameras.dockedControls.mapLocation"))), cameraView && /*#__PURE__*/_react["default"].createElement("p", {
    style: {
      color: "#fff"
    }
  }, " ", /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.cameras.dockedControls.or"
  }), " "), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: 256
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Autocomplete, {
    freeSolo: true,
    id: "free-solo",
    className: "search-for-camera",
    renderInput: function renderInput(params) {
      return /*#__PURE__*/_react["default"].createElement(_material.TextField, (0, _extends2["default"])({}, params, {
        variant: "standard",
        placeholder: (0, _i18n.getTranslation)("global.dock.cameras.dockedControls.searchForCam")
      }));
    },
    options: searchableCameras,
    getOptionLabel: function getOptionLabel(option) {
      if ((0, _keys["default"])(option).length === 0) {
        return "";
      } else {
        return option.entityData.properties.name;
      }
    },
    openOnFocus: true,
    onChange: handleUpdateInput,
    value: cameraSearch,
    disableClearable: true
  }))));
};
var _default = DockedControls;
exports["default"] = _default;