"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = require("react");
var _helpers = require("@turf/helpers");
var _bbox = _interopRequireDefault(require("@turf/bbox"));
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _Selectors2 = require("orion-components/AppState/Selectors");
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var usePreviousValue = function usePreviousValue(value) {
  var ref = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    ref.current = value;
  });
  return ref.current;
};
var FocusEntitiesBound = function FocusEntitiesBound(_ref) {
  var items = _ref.items;
  var secondaryOpen = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.contextPanelState)(state).secondaryOpen;
  });
  var map = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.mapObject)(state);
  });
  var settings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.mapSettingsSelector)(state);
  });
  var zoom = settings.mapZoom;
  var center = settings.mapCenter;
  var _useState = (0, _react.useState)(zoom),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    prevZoom = _useState2[0],
    setPrevZoom = _useState2[1];
  var _useState3 = (0, _react.useState)(center),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    prevCenter = _useState4[0],
    setPrevCenter = _useState4[1];
  var prevItems = usePreviousValue(items);
  var handleUpdateBounds = function handleUpdateBounds() {
    var filterItems = items;
    if (filterItems.length) {
      var _context;
      var features = (0, _map["default"])(_context = (0, _filter["default"])(filterItems).call(filterItems, function (data) {
        return data.geometry && !(0, _isEmpty["default"])(data.geometry);
      })).call(_context, function (data) {
        return (0, _helpers.point)(data.geometry.coordinates);
      });
      var featureCollection = (0, _helpers.featureCollection)(features);
      var newBounds = (0, _bbox["default"])(featureCollection);
      // Prevent if a profile is loaded
      if (!secondaryOpen) {
        map.fitBounds(newBounds, {
          maxZoom: 15,
          padding: {
            top: 20,
            bottom: 20,
            left: 450,
            right: 100
          }
        });
      }
    }
  };
  (0, _react.useEffect)(function () {
    componentUpdate();
  }, [items]);
  var componentUpdate = function componentUpdate() {
    if (!(0, _reactFastCompare["default"])(items, prevItems)) {
      handleUpdateBounds();
      map.on("dragend", function () {
        setPrevZoom(map.getZoom());
        setPrevCenter(map.getCenter());
      });
    } else if (prevItems.length > 0 && items.length === 0) {
      // Zoom out to previous level on clear
      map.setZoom(prevZoom);
      map.setCenter(prevCenter);
    }
  };
  return null;
};
var _default = FocusEntitiesBound;
exports["default"] = _default;