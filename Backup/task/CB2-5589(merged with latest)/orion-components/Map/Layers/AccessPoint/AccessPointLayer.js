"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Layers = require("orion-components/Map/Layers");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _values2 = _interopRequireDefault(require("lodash/values"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _includes = _interopRequireDefault(require("lodash/includes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var jsonata = require("jsonata");
var propTypes = {
  labelsVisible: _propTypes["default"].bool,
  feedId: _propTypes["default"].string,
  setMapEntities: _propTypes["default"].func,
  mapTools: _propTypes["default"].object,
  before: _propTypes["default"].string
};
var defaultProps = {
  labelsVisible: false
};
var profileIconTemplates = {};
var AccessPointWrapper = function AccessPointWrapper(_ref) {
  var _context;
  var labelsVisible = _ref.labelsVisible,
    loadProfile = _ref.loadProfile,
    mapTools = _ref.mapTools,
    secondary = _ref.secondary,
    feedId = _ref.feedId,
    setMapEntities = _ref.setMapEntities,
    filters = _ref.filters,
    before = _ref.before;
  var facilityId = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.primaryContextSelector)(state);
  });
  var facility = (0, _reactRedux.useSelector)(function (state) {
    return state.contextualData[facilityId];
  });
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return state.mapState.baseMap;
    }),
    mapRef = _useSelector.mapRef;
  var accessPoints = facility && facility.floorPlanAccessPoints ? facility.floorPlanAccessPoints : [];
  var map = mapRef;
  var userFeedState = (0, _reactRedux.useSelector)(function (state) {
    return state.session.userFeeds;
  });
  var userFeedsSelector = (0, _values2["default"])(userFeedState);
  (0, _forEach["default"])(_context = (0, _values["default"])(userFeedsSelector)).call(_context, function (feed) {
    if (feed.entityType === "accessPoint") {
      profileIconTemplates[feed.feedId] = feed.mapIconTemplate && jsonata(feed.mapIconTemplate);
    }
  });
  return /*#__PURE__*/_react["default"].createElement(AccessPointLayer, {
    accessPoints: accessPoints,
    labelsVisible: labelsVisible,
    loadProfile: loadProfile,
    map: map,
    mapTools: mapTools,
    secondary: secondary,
    feedId: feedId,
    setMapEntities: setMapEntities,
    filters: filters,
    before: before
  });
};
var AccessPointLayer = function AccessPointLayer(_ref2) {
  var _context3;
  var accessPoints = _ref2.accessPoints,
    labelsVisible = _ref2.labelsVisible,
    loadProfile = _ref2.loadProfile,
    map = (0, _map["default"])(_ref2),
    mapTools = _ref2.mapTools,
    feedId = _ref2.feedId,
    setMapEntities = _ref2.setMapEntities,
    filters = _ref2.filters,
    before = _ref2.before;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    filteredAccessPoint = _useState2[0],
    setFilteredAccessPoint = _useState2[1];
  (0, _react.useEffect)(function () {
    var filtered = {};
    if (!(0, _values["default"])(accessPoints).length || (0, _values["default"])(accessPoints).length === 0) {
      // -- clear out facility entities once context changes
      setFilteredAccessPoint({});
    } else {
      var _context2;
      (0, _forEach["default"])(_context2 = (0, _keys["default"])(accessPoints)).call(_context2, function (accessPoint) {
        if (profileIconTemplates[accessPoints[accessPoint].feedId]) {
          accessPoints[accessPoint].entityData.properties.mapIcon = profileIconTemplates[accessPoints[accessPoint].feedId].evaluate(accessPoints[accessPoint].entityData);
        }
        if (!filters || (0, _isEmpty["default"])(filters) || (0, _includes["default"])(filters, accessPoint)) {
          filtered[accessPoint] = _objectSpread({}, accessPoints[accessPoint]);
        }
      });
      setFilteredAccessPoint(filtered);
      if (feedId && setMapEntities) {
        dispatch(setMapEntities((0, _defineProperty2["default"])({}, feedId, filtered)));
      }
    }
  }, [feedId, setMapEntities, map, mapTools, accessPoints, filters, setFilteredAccessPoint]);
  var handleClick = (0, _react.useCallback)(function (accessPointId, accessPointName) {
    dispatch(loadProfile(accessPointId, accessPointName, "accessPoint", "profile", "secondary"));
  }, [loadProfile]);
  var featureData = (0, _map["default"])(_context3 = (0, _keys["default"])(filteredAccessPoint)).call(_context3, function (accessPoint) {
    return filteredAccessPoint[accessPoint].entityData;
  });
  return (0, _keys["default"])(filteredAccessPoint).length && map ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_Layers.BasicLayer, {
    labelsVisible: labelsVisible,
    map: map,
    handleClick: handleClick,
    layer: {
      type: "symbol",
      name: feedId ? feedId : "accessPoint",
      layerTypes: ["symbol"],
      paint: {
        symbol: {
          "text-color": "#000000",
          "text-halo-color": "rgba(255, 255, 255, 1)",
          "text-halo-width": 2
        }
      },
      layout: {
        symbol: {
          "icon-image": mapTools && mapTools.feature ? ["case", ["==", ["get", "id"], "".concat(mapTools.feature.id)], "", "case", ["has", "mapIcon"], ["get", "mapIcon"], "Sensor_gray"] : ["case", ["has", "mapIcon"], ["get", "mapIcon"], "Sensor_gray"],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "text-field": labelsVisible ? "{name}" : "",
          "text-offset": [2, 0],
          "icon-rotation-alignment": "map",
          "text-anchor": "left",
          "text-transform": "uppercase",
          "text-optional": true,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-letter-spacing": 0
        }
      },
      data: {
        type: "FeatureCollection",
        features: featureData
      }
    },
    before: before
  })) : null;
};
AccessPointWrapper.propTypes = propTypes;
AccessPointWrapper.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(AccessPointWrapper, function (prevProps, nextProps) {
  if (!(0, _reactFastCompare["default"])(prevProps, nextProps)) {
    return false;
  }
  return true;
});
exports["default"] = _default;