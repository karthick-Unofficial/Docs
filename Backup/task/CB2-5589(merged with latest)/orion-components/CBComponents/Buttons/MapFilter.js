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
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _helpers = require("@turf/helpers");
var _bbox = _interopRequireDefault(require("@turf/bbox"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _Selectors2 = require("orion-components/AppState/Selectors");
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _size = _interopRequireDefault(require("lodash/size"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  filters: _propTypes["default"].object,
  map: _propTypes["default"].object,
  items: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]).isRequired,
  id: _propTypes["default"].string.isRequired,
  addToMapFilters: _propTypes["default"].func.isRequired,
  removeFromMapFilters: _propTypes["default"].func.isRequired
};
var defaultProps = {
  map: null,
  filters: {}
};
var MapFilter = function MapFilter(_ref) {
  var addToMapFilters = _ref.addToMapFilters,
    removeFromMapFilters = _ref.removeFromMapFilters,
    id = _ref.id,
    items = _ref.items;
  var dispatch = (0, _reactRedux.useDispatch)();
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
  var filters = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapFiltersSelector)(state);
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    filtered = _useState2[0],
    setFiltered = _useState2[1];
  var _useState3 = (0, _react.useState)(zoom),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    prevZoom = _useState4[0],
    setPrevZoom = _useState4[1];
  var _useState5 = (0, _react.useState)(center),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    prevCenter = _useState6[0],
    setPrevCenter = _useState6[1];
  var usePreviousValue = function usePreviousValue(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    });
    return ref.current;
  };
  var prevFilters = usePreviousValue(filters);
  var handleUpdateBounds = function handleUpdateBounds() {
    var _context;
    var filterItems = (0, _map["default"])(_context = (0, _values["default"])(filters)).call(_context, function (filter) {
      return filter.entityData;
    });
    if (filterItems.length) {
      var _context2;
      var features = (0, _map["default"])(_context2 = (0, _filter["default"])(filterItems).call(filterItems, function (data) {
        return data.geometry && !(0, _isEmpty["default"])(data.geometry);
      })).call(_context2, function (data) {
        var geometry;
        var type = filters[data.properties.id].entityType === "accessPoint" ? filters[data.properties.id].entityType : data.properties.type;
        switch (type.toLowerCase()) {
          case "point":
          case "track":
          case "camera":
          case "accesspoint": // cSpell:ignore accesspoint
          case "facility":
            geometry = (0, _helpers.point)(data.geometry.coordinates);
            break;
          case "polygon":
          case "fov":
            geometry = (0, _helpers.polygon)(data.geometry.coordinates);
            break;
          case "line":
          case "linestring":
            geometry = (0, _helpers.lineString)(data.geometry.coordinates);
            break;
          default:
            break;
        }
        return geometry;
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
  var handleFilter = function handleFilter() {
    var filterItems = (0, _isArray["default"])(items) ? items : (0, _values["default"])(items);
    if (!filtered) {
      dispatch(addToMapFilters(id, filterItems));
      setFiltered(true);
    } else {
      dispatch(removeFromMapFilters(id));
      setFiltered(false);
    }
  };
  (0, _react.useEffect)(function () {
    componentUpdate();
  }, [filters, prevFilters]);
  var componentUpdate = function componentUpdate() {
    if (!(0, _reactFastCompare["default"])(filters, prevFilters) && (0, _size["default"])(filters) > 0) {
      handleUpdateBounds();
      map.on("dragend", function () {
        setPrevZoom(map.getZoom());
        setPrevCenter(map.getCenter());
      });
    } else if ((0, _size["default"])(prevFilters) > 0 && (0, _size["default"])(filters) === 0) {
      // Zoom out to previous level on clear
      map.setZoom(prevZoom);
      map.setCenter(prevCenter);
      setFiltered(false);
    }
  };
  return map ? /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
    color: "primary",
    checked: filtered,
    onChange: handleFilter,
    icon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Visibility, null),
    checkedIcon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Visibility, null)
  }) : null;
};
MapFilter.propTypes = propTypes;
MapFilter.defaultProps = defaultProps;
var _default = MapFilter;
exports["default"] = _default;