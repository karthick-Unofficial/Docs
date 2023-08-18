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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var TileOptions = function TileOptions(_ref) {
  var setMapStyle = _ref.setMapStyle;
  var dispatch = (0, _reactRedux.useDispatch)();
  var mapSettings = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.persisted.mapSettings;
  });
  var baseMaps = (0, _reactRedux.useSelector)(function (state) {
    return state.baseMaps;
  });
  var selected = mapSettings && mapSettings.mapStyle ? mapSettings.mapStyle : "satellite";
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    layer = _useState4[0],
    setLayer = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    BaseMaps = _useState6[0],
    setBaseMaps = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    thumbNail = _useState8[0],
    setThumbNail = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    anchorEl = _useState10[0],
    setAnchorEl = _useState10[1];
  (0, _react.useEffect)(function () {
    if (baseMaps.length > 0) {
      var selectedThumbnail = (0, _filter["default"])(baseMaps).call(baseMaps, function (element) {
        return element.name === selected;
      })[0];
      setBaseMaps(baseMaps);
      setLayer(selectedThumbnail.name);
      setThumbNail(selectedThumbnail.thumbnail);
    }
  }, [selected]);
  var toggleOpen = function toggleOpen() {
    setOpen(!open);
  };
  var handleRequestClose = function handleRequestClose() {
    setOpen(false);
    setAnchorEl(null);
  };
  var SetMapStyle = function SetMapStyle(style) {
    dispatch(setMapStyle(style));
    setOpen(false);
  };
  var allOptions = (0, _map["default"])(BaseMaps).call(BaseMaps, function (tileLayer, index) {
    // Return all but the currently selected layer
    return tileLayer.name !== layer && /*#__PURE__*/_react["default"].createElement("div", {
      className: "map-sample-square hilite",
      onClick: function onClick() {
        SetMapStyle(tileLayer.name);
      },
      key: index
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "thumb",
      style: {
        backgroundImage: "url(".concat(tileLayer.thumbnail, ")")
      }
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: dir === "rtl" ? "labelRTL" : "label"
    }, tileLayer.label));
  });
  var getLabel = (0, _map["default"])(BaseMaps).call(BaseMaps, function (value) {
    if (value.name === selected) {
      return value.label;
    }
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "map-selector-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "map-tile-options drop"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "map-sample-square",
    onClick: function onClick() {
      return toggleOpen();
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(".concat(thumbNail, ")")
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: dir === "rtl" ? "labelRTL" : "label"
  }, getLabel), /*#__PURE__*/_react["default"].createElement("div", {
    className: "dropper"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons"
  }, "keyboard_arrow_down")))), /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    style: {
      backgroundColor: "transparent"
    },
    open: open
    //animation={PopoverAnimationVertical}
    ,
    anchorEl: anchorEl,
    className: dir === "rtl" ? "map-selectionRTL" : "map-selection",
    onClose: function onClose() {
      return handleRequestClose();
    },
    PaperProps: {
      className: "customPopOver"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    style: {
      width: "242px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "map-tile-options"
  }, allOptions))));
};
var _default = /*#__PURE__*/(0, _react.memo)(TileOptions);
exports["default"] = _default;