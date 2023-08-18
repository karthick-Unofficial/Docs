"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _shared = require("../shared");
var _reactSortableHoc = require("react-sortable-hoc");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Selectors = require("../../../ContextPanel/Selectors");
var actionCreators = _interopRequireWildcard(require("./floorPlanWidgetActions"));
var _Selectors2 = require("orion-components/Map/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  floorPlans: _propTypes["default"].object.isRequired,
  handleSelect: _propTypes["default"].func.isRequired,
  selectedFloor: _propTypes["default"].object,
  setFloorOrder: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var defaultProps = {
  selectedId: null,
  floorPlans: [],
  dir: "rtl"
};
var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref) {
  var item = _ref.item,
    selected = _ref.selected,
    onSelect = _ref.onSelect,
    dir = _ref.dir;
  var styles = {
    listItem: _objectSpread({
      zIndex: 999,
      backgroundColor: selected && selected.id === item.id ? "#1688bd" : "#494D53",
      marginBottom: 8
    }, dir === "rtl" && {
      flexDirection: "row-reverse"
    }),
    listItemIcon: _objectSpread({}, dir === "rtl" && {
      justifyContent: "end"
    }),
    listItemText: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      color: "white",
      textAlign: dir == "rtl" ? "right" : "left"
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    onClick: function onClick() {
      return onSelect(item);
    },
    style: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
    style: styles.listItemIcon
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Reorder, null)), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: styles.listItemText,
    primary: item.name,
    primaryTypographyProps: {
      noWrap: true
    }
  }), selected && selected.id === item.id && /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
    style: styles.listItemIcon
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Visibility, null)));
});
var SortableList = (0, _reactSortableHoc.SortableContainer)(function (_ref2) {
  var items = _ref2.items,
    selected = _ref2.selected,
    onSelect = _ref2.onSelect,
    dir = _ref2.dir;
  return /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(items).call(items, function (item, index) {
    return /*#__PURE__*/_react["default"].createElement(SortableItem, {
      key: index,
      index: index,
      item: item,
      selected: selected,
      onSelect: onSelect,
      dir: dir
    });
  }));
});
var FloorPlanWidget = function FloorPlanWidget(_ref3) {
  var floorPlans = _ref3.floorPlans,
    handleSelect = _ref3.handleSelect,
    removeFloorPlanCameraSub = _ref3.removeFloorPlanCameraSub,
    removeFloorPlanAccessPointsSub = _ref3.removeFloorPlanAccessPointsSub,
    clearFloorPlan = _ref3.clearFloorPlan,
    startFloorPlanCameraStream = _ref3.startFloorPlanCameraStream,
    startFloorPlanAccessPointsStream = _ref3.startFloorPlanAccessPointsStream,
    cameras = _ref3.cameras,
    selectFloorPlan = _ref3.selectFloorPlan,
    setFloorPlans = _ref3.setFloorPlans,
    facilityId = _ref3.facilityId,
    facilityFeedId = _ref3.facilityFeedId,
    order = _ref3.order,
    widgetsLaunchable = _ref3.widgetsLaunchable,
    contextId = _ref3.contextId,
    enabled = _ref3.enabled,
    getSelectedFloorPlan = _ref3.getSelectedFloorPlan;
  var dispatch = (0, _reactRedux.useDispatch)();
  var setFloorOrder = actionCreators.setFloorOrder;
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.selectedContextSelector)(state);
  });
  var selectedFloor = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.floorPlanSelector)(state).selectedFloor || {};
  });
  var subscriptions = context && context.subscriptions ? context.subscriptions.floorPlanCameras : null;
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  (0, _react.useEffect)(function () {
    if ((0, _values["default"])(floorPlans).length && facilityId) {
      var _context;
      var defaultFloor = (0, _find["default"])(_context = (0, _values["default"])(floorPlans)).call(_context, function (floor) {
        return floor.order === 1;
      });
      if (defaultFloor && (!selectedFloor || selectedFloor.facilityId !== facilityId)) {
        dispatch(handleSelect(defaultFloor, facilityFeedId));
      }
    }
  }, [facilityId, floorPlans, selectFloorPlan]);
  (0, _react.useEffect)(function () {
    if (cameras && facilityId) {
      if (subscriptions && (!selectedFloor || selectedFloor.facilityId !== facilityId)) {
        dispatch(removeFloorPlanCameraSub(facilityId, "floorPlanCameras"));
      }
      if (!subscriptions && selectedFloor && selectedFloor.id && selectedFloor.facilityId === facilityId) {
        dispatch(startFloorPlanCameraStream(facilityId, selectedFloor.id, "profile"));
      }
    }
    if (facilityId && startFloorPlanAccessPointsStream) {
      if (subscriptions && (!selectedFloor || selectedFloor.facilityId !== facilityId)) {
        dispatch(removeFloorPlanAccessPointsSub(facilityId, "floorPlanAccessPoints"));
      }
      if (!subscriptions && selectedFloor && selectedFloor.id && selectedFloor.facilityId === facilityId) {
        dispatch(startFloorPlanAccessPointsStream(facilityId, selectedFloor.id, "profile"));
      }
    }
    if (selectedFloor) {
      getSelectedFloorPlan(selectedFloor);
    }
  }, [selectedFloor, facilityId, removeFloorPlanCameraSub, startFloorPlanCameraStream, removeFloorPlanAccessPointsSub, startFloorPlanAccessPointsStream, subscriptions]);
  (0, _react.useEffect)(function () {
    return function () {
      if (facilityId) {
        dispatch(setFloorPlans([]));
      }
    };
  }, [facilityId, setFloorPlans]);
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    moving = _useState2[0],
    setMoving = _useState2[1];
  var getFloors = function getFloors(floors) {
    var _context2;
    return (0, _sort["default"])(_context2 = (0, _values["default"])(floors)).call(_context2, function (a, b) {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
      return 0;
    });
  };
  var handleSortEnd = (0, _react.useCallback)(function (_ref4) {
    var oldIndex = _ref4.oldIndex,
      newIndex = _ref4.newIndex;
    var newItems = (0, _reactSortableHoc.arrayMove)(getFloors(floorPlans), oldIndex, newIndex);
    (0, _forEach["default"])(newItems).call(newItems, function (floor, index) {
      return floor.order = index + 1;
    });
    dispatch(setFloorOrder(newItems));
    setMoving(false);
  }, [floorPlans, setFloorOrder]);
  var handleSelectFloor = (0, _react.useCallback)(function (floor) {
    if (selectedFloor) {
      if (selectedFloor.id === floor.id) {
        dispatch(clearFloorPlan(floor));
      } else {
        dispatch(removeFloorPlanCameraSub(selectedFloor.facilityId, "floorPlanCameras"));
        dispatch(removeFloorPlanAccessPointsSub(selectedFloor.facilityId, "floorPlanAccessPoints"));
        dispatch(handleSelect(floor, facilityFeedId));
      }
    } else {
      dispatch(handleSelect(floor, facilityFeedId));
    }
  }, [handleSelect, clearFloorPlan, selectedFloor]);
  var handleLaunch = function handleLaunch() {
    window.open("/facilities-app/#/entity/".concat(contextId));
  };
  return !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement(_shared.BaseWidget, {
    title: (0, _i18n.getTranslation)("global.profiles.widgets.floorPlanWidget.floorPlans"),
    order: order,
    launchable: widgetsLaunchable,
    handleLaunch: handleLaunch,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(SortableList, {
    items: getFloors(floorPlans),
    onSortEnd: handleSortEnd,
    distance: 12,
    selected: moving ? null : selectedFloor,
    onSelect: handleSelectFloor,
    onSortStart: function onSortStart() {
      return setMoving(true);
    },
    dir: dir
  }));
};
FloorPlanWidget.propTypes = propTypes;
FloorPlanWidget.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(FloorPlanWidget);
exports["default"] = _default;