"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.floorPlanSelector = exports.cameraMapFeatures = exports.accessPointMapFeatures = void 0;
_Object$defineProperty(exports, "getFacilities", {
  enumerable: true,
  get: function get() {
    return _FacilitiesSelectors.getFacilities;
  }
});
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _reselect = require("reselect");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _Selectors2 = require("orion-components/ContextualData/Selectors");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _merge = _interopRequireDefault(require("lodash/merge"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _keyBy = _interopRequireDefault(require("lodash/keyBy"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
var _FacilitiesSelectors = require("orion-components/Map/Selectors/FacilitiesSelectors");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _reactFastCompare["default"]);
var cameraProps = function cameraProps(state) {
  var globalDataIds = (0, _keys["default"])(state && state.globalGeo ? state.globalGeo : {});
  var cameras = {};
  (0, _forEach["default"])(globalDataIds).call(globalDataIds, function (id) {
    if ((0, _includes["default"])(id).call(id, "cameras")) {
      cameras = (0, _merge["default"])(cameras, (0, _cloneDeep["default"])(state.globalData[id]));
    }
  });
  return cameras && cameras.data ? cameras.data : {};
};
var accessPointProps = function accessPointProps(state) {
  var globalDataIds = (0, _keys["default"])(state && state.globalGeo ? state.globalGeo : {});
  var accessPoints = {};
  (0, _forEach["default"])(globalDataIds).call(globalDataIds, function (id) {
    if ((0, _includes["default"])(id).call(id, "accessPoint")) {
      accessPoints = (0, _merge["default"])(accessPoints, (0, _cloneDeep["default"])(state.globalData[id]));
    }
  });
  return accessPoints && accessPoints.data ? accessPoints.data : {};
};
var cameraGeo = function cameraGeo(state) {
  var globalGeoIds = (0, _keys["default"])(state && state.globalGeo ? state.globalGeo : {});
  var cameras = {};
  (0, _forEach["default"])(globalGeoIds).call(globalGeoIds, function (id) {
    if ((0, _includes["default"])(id).call(id, "cameras")) {
      cameras = (0, _merge["default"])(cameras, (0, _cloneDeep["default"])(state.globalGeo[id]));
    }
  });
  return cameras && cameras.data ? cameras.data : {};
};
var accessPointGeo = function accessPointGeo(state) {
  var globalGeoIds = (0, _keys["default"])(state && state.globalGeo ? state.globalGeo : {});
  var accessPoints = {};
  (0, _forEach["default"])(globalGeoIds).call(globalGeoIds, function (id) {
    if ((0, _includes["default"])(id).call(id, "accessPoint")) {
      accessPoints = (0, _merge["default"])(accessPoints, (0, _cloneDeep["default"])(state.globalGeo[id]));
    }
  });
  return accessPoints && accessPoints.data ? accessPoints.data : {};
};
var floorPlan = function floorPlan(state) {
  return state.floorPlan;
};
var floorPlanSelector = (0, _reselect.createSelector)(floorPlan, function (floorPlan) {
  var _ref = floorPlan || {},
    selectedFloor = _ref.selectedFloor,
    coordinates = _ref.coordinates,
    creating = _ref.creating,
    preLoaded = _ref.preLoaded,
    image = _ref.image;
  return {
    selectedFloor: selectedFloor,
    coordinates: coordinates,
    creating: creating,
    image: image,
    preLoaded: preLoaded
  };
});
exports.floorPlanSelector = floorPlanSelector;
var cameraMapFeatures = function cameraMapFeatures(id) {
  return createDeepEqualSelector((0, _Selectors2.contextById)(id), cameraGeo, cameraProps, _Selectors.mapFiltersSelector, function (context, cameraGeo, cameraProps, filters) {
    var _context2;
    var mapFeatures = {};
    if (context && context.entity) {
      var fov = context.fov,
        fovItems = context.fovItems,
        entity = context.entity,
        fovEvents = context.fovEvents,
        linkedEntities = context.linkedEntities;
      mapFeatures = (0, _defineProperty2["default"])({}, entity.id, entity);
      if (linkedEntities) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), (0, _keyBy["default"])(linkedEntities, "id"));
      }
      if (fovItems) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), (0, _keyBy["default"])(fovItems, "id"));
      }
      if (fovEvents) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), (0, _keyBy["default"])(fovEvents, "id"));
      }
      if (fov && !(0, _isArray["default"])(fov)) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), {}, (0, _defineProperty2["default"])({}, fov.id, fov));
      }
    } else {
      var cameras = cameraGeo ? (0, _merge["default"])(cameraProps, cameraGeo) : cameraProps;
      if (filters && (0, _keys["default"])(filters).length) {
        mapFeatures = (0, _pickBy["default"])(cameras, function (camera) {
          var _context;
          return (0, _includes["default"])(_context = (0, _keys["default"])(filters)).call(_context, camera.id);
        });
      } else {
        mapFeatures = cameras;
      }
    }

    //Filter out non-map display types
    var filteredMapFeatures = {};
    (0, _forEach["default"])(_context2 = (0, _keys["default"])(mapFeatures)).call(_context2, function (key) {
      if ((mapFeatures[key].entityData.displayType || "map").toLowerCase() === "map") {
        filteredMapFeatures[key] = mapFeatures[key];
        if (!mapFeatures[key].entityData.properties.entityType) {
          filteredMapFeatures[key].entityData.properties["entityType"] = filteredMapFeatures[key].entityType;
        }
      }
    });
    return filteredMapFeatures;
  });
};
exports.cameraMapFeatures = cameraMapFeatures;
var accessPointMapFeatures = function accessPointMapFeatures(id) {
  return createDeepEqualSelector((0, _Selectors2.contextById)(id), accessPointGeo, accessPointProps, _Selectors.mapFiltersSelector, function (context, accessPointGeo, accessPointProps, filters) {
    var _context4;
    var mapFeatures = {};
    if (context && context.entity) {
      var fov = context.fov,
        fovItems = context.fovItems,
        entity = context.entity,
        fovEvents = context.fovEvents,
        linkedEntities = context.linkedEntities;
      mapFeatures = (0, _defineProperty2["default"])({}, entity.id, entity);
      if (linkedEntities) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), (0, _keyBy["default"])(linkedEntities, "id"));
      }
      if (fovItems) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), (0, _keyBy["default"])(fovItems, "id"));
      }
      if (fovEvents) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), (0, _keyBy["default"])(fovEvents, "id"));
      }
      if (fov && !(0, _isArray["default"])(fov)) {
        mapFeatures = _objectSpread(_objectSpread({}, mapFeatures), {}, (0, _defineProperty2["default"])({}, fov.id, fov));
      }
    } else {
      var accessPoints = accessPointGeo ? (0, _merge["default"])(accessPointProps, accessPointGeo) : accessPointProps;
      if (filters && (0, _keys["default"])(filters).length) {
        mapFeatures = (0, _pickBy["default"])(accessPoints, function (accessPoint) {
          var _context3;
          return (0, _includes["default"])(_context3 = (0, _keys["default"])(filters)).call(_context3, accessPoint.id);
        });
      } else {
        mapFeatures = accessPoints;
      }
    }

    //Filter out non-map display types
    var filteredMapFeatures = {};
    (0, _forEach["default"])(_context4 = (0, _keys["default"])(mapFeatures)).call(_context4, function (key) {
      if ((mapFeatures[key].entityData.displayType || "map").toLowerCase() === "map") {
        filteredMapFeatures[key] = mapFeatures[key];
        if (!mapFeatures[key].entityData.properties.entityType) {
          filteredMapFeatures[key].entityData.properties["entityType"] = filteredMapFeatures[key].entityType;
        }
      }
    });
    return filteredMapFeatures;
  });
};
exports.accessPointMapFeatures = accessPointMapFeatures;