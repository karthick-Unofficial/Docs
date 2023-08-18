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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Layers = require("orion-components/Map/Layers");
var _lodash = _interopRequireDefault(require("lodash"));
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _Actions = require("orion-components/AppState/Actions");
var _Selectors2 = require("orion-components/Map/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  feedId: _propTypes["default"].string,
  before: _propTypes["default"].string
};
var FacilitiesWrapper = function FacilitiesWrapper(props) {
  var loadProfile = props.loadProfile,
    secondary = props.secondary,
    feedId = props.feedId,
    before = props.before,
    filters = props.filters;
  var settings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapSettingsSelector)(state);
  });
  var labelsVisible = settings && settings.entityLabels ? settings.entityLabels.visible : settings.entityLabelsVisible ? settings.entityLabelsVisible : false;
  var map = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.baseMap.mapRef;
  });
  var mapTools = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.mapTools;
  });
  var facilities = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.getFacilities)(state)(state, props);
  });
  return /*#__PURE__*/_react["default"].createElement(FacilitiesLayer, {
    facilities: facilities,
    labelsVisible: labelsVisible,
    loadProfile: loadProfile,
    map: map,
    mapTools: mapTools,
    secondary: secondary,
    feedId: feedId,
    setMapEntities: _Actions.setMapEntities,
    filters: filters,
    before: before
  });
};
var FacilitiesLayer = /*#__PURE__*/(0, _react.memo)(function (props) {
  var _context2;
  var dispatch = (0, _reactRedux.useDispatch)();
  var facilities = props.facilities,
    labelsVisible = props.labelsVisible,
    loadProfile = props.loadProfile,
    map = (0, _map["default"])(props),
    mapTools = props.mapTools,
    secondary = props.secondary,
    feedId = props.feedId,
    setMapEntities = props.setMapEntities,
    filters = props.filters,
    before = props.before;
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    filteredFacilities = _useState2[0],
    setFilteredFacilities = _useState2[1];
  (0, _react.useEffect)(function () {
    var filtered = {};
    if (!(0, _values["default"])(facilities).length || (0, _values["default"])(facilities).length === 0) {
      // -- clear out facility entities once context changes
      setFilteredFacilities({});
    } else {
      var _context;
      (0, _forEach["default"])(_context = (0, _keys["default"])(facilities)).call(_context, function (facility) {
        if (!filters || _lodash["default"].isEmpty(filters) || (0, _includes["default"])(_lodash["default"]).call(_lodash["default"], filters, facility)) {
          filtered[facility] = _objectSpread({}, facilities[facility]);
        }
      });
      setFilteredFacilities(filtered);
      if (feedId && setMapEntities) {
        dispatch(setMapEntities((0, _defineProperty2["default"])({}, feedId, filtered)));
      }
    }
  }, [feedId, setMapEntities, map, mapTools, facilities, filters, setFilteredFacilities]);
  (0, _react.useEffect)(function () {
    return function () {
      dispatch(setMapEntities((0, _defineProperty2["default"])({}, feedId, {})));
    };
  }, []);
  var handleClick = (0, _react.useCallback)(function (facilityId, facilityName) {
    dispatch(loadProfile(facilityId, facilityName, "facility", "profile", secondary ? "secondary" : "primary"));
  }, [loadProfile]);
  var featureData = (0, _map["default"])(_context2 = (0, _keys["default"])(filteredFacilities)).call(_context2, function (facility) {
    var _mapTools$feature;
    var feature = filteredFacilities[facility].entityData;
    feature.properties.mapIcon = (mapTools === null || mapTools === void 0 ? void 0 : (_mapTools$feature = mapTools.feature) === null || _mapTools$feature === void 0 ? void 0 : _mapTools$feature.id) === facility ? "" : feature.properties.mapIcon || "Facility_blue";
    return feature;
  });
  return (0, _keys["default"])(filteredFacilities).length && map ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_Layers.BasicLayer, {
    labelsVisible: labelsVisible,
    map: map,
    handleClick: handleClick,
    layer: {
      type: "symbol",
      name: feedId ? feedId : "facilities",
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
          "icon-image": "{mapIcon}",
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
}, function (prevProps, nextProps) {
  if (!(0, _reactFastCompare["default"])(prevProps, nextProps)) {
    return false;
  }
  return true;
});
FacilitiesWrapper.propTypes = propTypes;
var _default = FacilitiesWrapper;
exports["default"] = _default;