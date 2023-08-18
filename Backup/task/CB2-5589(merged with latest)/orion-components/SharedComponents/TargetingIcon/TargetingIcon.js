"use strict";

var _typeof3 = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _TargetingLine = _interopRequireDefault(require("./TargetingLine"));
var _Icons = require("orion-components/CBComponents/Icons");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _jquery = _interopRequireDefault(require("jquery"));
var _reactRedux = require("react-redux");
var _Actions = require("../../AppState/Actions");
var _Selectors = require("orion-components/AppState/Selectors");
var _Selectors2 = require("orion-components/ContextPanel/Selectors");
var _Selectors3 = require("orion-components/GlobalData/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  selectFloor: _propTypes["default"].func,
  iconContainerStyle: _propTypes["default"].object,
  multipleTargets: _propTypes["default"].bool,
  setFocus: _propTypes["default"].func
};
var defaultProps = {
  selectFloor: function selectFloor() {},
  iconContainerStyle: {},
  multipleTargets: false,
  setFocus: function setFocus() {}
};
var TargetingIcon = function TargetingIcon(props) {
  var _context;
  var selectFloor = props.selectFloor,
    iconContainerStyle = props.iconContainerStyle,
    movement = props.movement,
    config = props.config,
    id = props.id,
    multipleTargets = props.multipleTargets,
    setFocus = props.setFocus,
    targetIds = props.targetIds;
  var dispatch = (0, _reactRedux.useDispatch)();
  var getEntity = (0, _Selectors3.makeGetEntity)();
  var getMapAppState = (0, _Selectors.mapStateSelector)();
  var mapAppState = (0, _reactRedux.useSelector)(function (state) {
    return getMapAppState(state);
  });
  var map = (0, _reactRedux.useSelector)(function (state) {
    return (0, _map["default"])(props) ? (0, _map["default"])(props) : state.replayMapState ? state.replayMapState.replayBaseMap.mapRef : state.mapState ? state.mapState.baseMap.mapRef : null;
  });
  var filters = (0, _reactRedux.useSelector)(function (state) {
    return mapAppState ? (0, _Selectors2.mapFiltersById)(state) : null;
  });
  var disabledFeeds = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.disabledFeedsSelector)(state);
  });
  var geometry = (0, _reactRedux.useSelector)(function (state) {
    return state.replayMapState ? null : props.geometry;
  });
  //Get entity
  var entity = (0, _reactRedux.useSelector)(function (state) {
    return mapAppState && mapAppState.entities[props.feedId] ? getEntity(state, props) : null;
  });
  //Check if entity's displayType is map (or not set)
  if (entity && entity.entityData && (0, _includes["default"])(_context = ["map", "facility"]).call(_context, (entity.entityData.displayType || "map").toLowerCase())) {
    if (!geometry || (0, _typeof2["default"])(geometry) !== "object") {
      geometry = entity.entityData.geometry;
    }
  } else if ((0, _typeof2["default"])(geometry) !== "object") {
    geometry = false;
  }
  var mapVisible = (0, _reactRedux.useSelector)(function (state) {
    return state.replayMapState ? state.replayMapState.replayBaseMap.visible : state.mapState ? state.mapState.baseMap.visible : false;
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    draw = _useState2[0],
    setDraw = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    x = _useState4[0],
    setX = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    y = _useState6[0],
    setY = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    rerender = _useState8[0],
    setRerender = _useState8[1];
  var mouseEnter = function mouseEnter(e) {
    var pos = e.target.getBoundingClientRect();
    setDraw(true);
    setX(pos.right - pos.width / 2 - 6);
    setY(pos.top - 36);
    var rerender = (0, _setInterval2["default"])(function () {
      return setDraw(true);
    }, 10);
    setRerender(rerender);
    map.on("move", function () {
      return rerender;
    });
    map.on("moveend", function () {
      // cSpell:ignore moveend
      clearInterval(rerender);
    });
  };
  var mouseLeave = function mouseLeave() {
    clearInterval(rerender);
    setDraw(false);
    setX(null);
    setY(null);
    setRerender(null);
  };
  var onTargetClick = function onTargetClick(e, geometry, map, movement) {
    if (multipleTargets) {
      setFocus();
    } else {
      dispatch((0, _Actions.moveToTarget)(e, geometry, map, movement));
      if (selectFloor !== null) {
        dispatch(selectFloor(props));
      }
    }
  };
  var isDisabled = !entity ? false : entity.entityType === "shapes" ? (0, _includes["default"])(disabledFeeds).call(disabledFeeds, entity.entityData.properties.type === "LineString" ? "Line" : entity.entityData.properties.type) : (0, _includes["default"])(disabledFeeds).call(disabledFeeds, entity.feedId);
  var shouldRender = !isDisabled && map && mapVisible && geometry && (!filters || !filters.length || (multipleTargets && targetIds.length > 0 ? (0, _some["default"])(targetIds).call(targetIds, function (key) {
    return (0, _includes["default"])(filters).call(filters, key);
  }) : (0, _includes["default"])(filters).call(filters, id)));
  var checkFilters = function checkFilters(data) {
    if (filters && filters.length) {
      if (data.targetEntityId) {
        return (0, _includes["default"])(filters).call(filters, data.targetEntityId);
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  return shouldRender ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, multipleTargets ? geometry && (0, _map["default"])(geometry).call(geometry, function (data) {
    return draw && checkFilters(data) && (0, _jquery["default"])(window).width() > 1023 && /*#__PURE__*/_react["default"].createElement(_TargetingLine["default"], {
      draw: draw,
      x: x,
      y: y,
      map: map,
      geometry: data,
      config: config || {}
    });
  }) : draw && (0, _jquery["default"])(window).width() > 1023 && /*#__PURE__*/_react["default"].createElement(_TargetingLine["default"], {
    draw: draw,
    x: x,
    y: y,
    map: map,
    geometry: geometry,
    config: config || {}
  }), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: _objectSpread(_objectSpread({}, {
      opacity: 1
    }), iconContainerStyle),
    onClick: function onClick(e) {
      return onTargetClick(e, geometry, map, movement);
    }
  }, /*#__PURE__*/_react["default"].createElement(_Icons.Target, {
    handleMouseEnter: mouseEnter,
    handleMouseLeave: mouseLeave
  }))) : null;
};
TargetingIcon.propTypes = propTypes;
TargetingIcon.defaultProps = defaultProps;
var _default = TargetingIcon;
exports["default"] = _default;