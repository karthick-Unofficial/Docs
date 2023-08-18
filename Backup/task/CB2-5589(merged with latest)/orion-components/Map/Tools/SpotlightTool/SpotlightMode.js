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
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _midpoint = _interopRequireDefault(require("@turf/midpoint"));
var _helpers = require("@turf/helpers");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var SpotlightMode = {};
SpotlightMode.addHandles = function (coordinates) {
  var _this = this;
  var handles = {};
  var getMidpoint = function getMidpoint(indexA, indexB) {
    return (0, _midpoint["default"])((0, _helpers.point)(coordinates[indexA]), (0, _helpers.point)(coordinates[indexB]));
  };
  (0, _forEach["default"])(coordinates).call(coordinates, function (c, index) {
    var mid = null;
    if (index !== coordinates.length - 1) {
      mid = getMidpoint(index, index + 1);
    } else {
      mid = getMidpoint(index, 0);
    }
    var handle = _this.newFeature(_objectSpread(_objectSpread({}, mid), {}, {
      properties: _objectSpread(_objectSpread({}, mid.properties), {}, {
        index: index,
        movement: index % 2 === 0 ? "lat" : "lng"
      })
    }));
    _this.addFeature(handle);
    _this.setSelected(handle.id);
    handles[handle.id] = handle;
  });
  return handles;
};
SpotlightMode.removeHandles = function (state) {
  var _context,
    _this2 = this;
  var handles = state.handles;
  (0, _forEach["default"])(_context = (0, _keys["default"])(handles)).call(_context, function (id) {
    return _this2.deleteFeature(id);
  });
  state.handles = {};
};
SpotlightMode.dragMove = function (state, e) {
  var _context2;
  var lngLat = e.lngLat;
  var dragMoveLocation = state.dragMoveLocation,
    spotlight = state.spotlight;
  var delta = {
    lng: lngLat.lng - dragMoveLocation.lng,
    lat: lngLat.lat - dragMoveLocation.lat
  };
  var moveCoordinates = function moveCoordinates(coord) {
    var point = {
      lng: coord[0] + delta.lng,
      lat: coord[1] + delta.lat
    };
    return [point.lng, point.lat];
  };
  var newCoords = (0, _map["default"])(_context2 = spotlight.coordinates[0]).call(_context2, moveCoordinates);
  (0, _forEach["default"])(newCoords).call(newCoords, function (c, index) {
    spotlight.updateCoordinate("0.".concat(index), c[0], c[1]);
  });
  state.dragMoveLocation = lngLat;
};
SpotlightMode.onSetup = function (opts) {
  var _opts$feature = opts.feature,
    id = _opts$feature.id,
    _opts$feature$propert = _opts$feature.properties,
    properties = _opts$feature$propert === void 0 ? {} : _opts$feature$propert,
    geometry = _opts$feature.geometry;
  var spotlight = this.newFeature(_objectSpread(_objectSpread({
    type: "Feature",
    geometry: geometry
  }, id && {
    id: id
  }), properties && {
    properties: properties
  }));
  this.addFeature(spotlight);
  this.setSelected(spotlight.id);
  this.setActionableState({
    trash: true
  });
  (0, _map["default"])(this).getCanvas().style.cursor = "";
  var handles = this.addHandles(spotlight.coordinates[0]);
  return {
    spotlight: spotlight,
    handles: handles
  };
};
SpotlightMode.onMouseDown = function (state, e) {
  var handles = state.handles;
  var featureTarget = e.featureTarget,
    lngLat = e.lngLat;
  if (featureTarget) {
    (0, _map["default"])(this).dragPan.disable();
    var id = featureTarget.properties.id;
    if (handles[id]) {
      state.activeHandle = handles[id];
    } else {
      state.dragSpotlight = true;
      state.dragMoveLocation = lngLat;
    }
  }
};
SpotlightMode.onDrag = function (state, e) {
  var _e$lngLat = e.lngLat,
    lng = _e$lngLat.lng,
    lat = _e$lngLat.lat;
  var activeHandle = state.activeHandle,
    dragSpotlight = state.dragSpotlight,
    handles = state.handles;
  if (dragSpotlight) {
    this.removeHandles(state, e);
    this.dragMove(state, e);
  } else if (activeHandle) {
    var _activeHandle$propert = activeHandle.properties,
      index = _activeHandle$propert.index,
      movement = _activeHandle$propert.movement;
    var getHandle = function getHandle(index) {
      var _context3;
      return (0, _find["default"])(_context3 = (0, _values["default"])(handles)).call(_context3, function (handle) {
        return handle.properties.index === index;
      });
    };
    var preIndex = index === 0 ? 3 : index - 1;
    var postIndex = index === 3 ? 0 : index + 1;
    var longitude = function longitude(index) {
      return movement === "lng" ? lng : state.spotlight.coordinates[0][index][0];
    };
    var latitude = function latitude(index) {
      return movement === "lat" ? lat : state.spotlight.coordinates[0][index][1];
    };
    state.spotlight.updateCoordinate("0.".concat(index), longitude(index), latitude(index));
    state.spotlight.updateCoordinate("0.".concat(postIndex), longitude(postIndex), latitude(postIndex));
    var getNewMid = function getNewMid(index) {
      var newMid = index === 3 ? (0, _midpoint["default"])((0, _helpers.point)(state.spotlight.coordinates[0][index]), (0, _helpers.point)(state.spotlight.coordinates[0][0])) : (0, _midpoint["default"])((0, _helpers.point)(state.spotlight.coordinates[0][index]), (0, _helpers.point)(state.spotlight.coordinates[0][index + 1]));
      return newMid.geometry.coordinates;
    };
    getHandle(preIndex).updateCoordinate("0", getNewMid(preIndex)[0], getNewMid(preIndex)[1]);
    getHandle(postIndex).updateCoordinate("0", getNewMid(postIndex)[0], getNewMid(postIndex)[1]);
    if (movement === "lng") {
      activeHandle.updateCoordinate("0", lng, activeHandle.coordinates[1]);
    } else {
      activeHandle.updateCoordinate("0", activeHandle.coordinates[0], lat);
    }
  }
};
SpotlightMode.onMouseUp = function (state, e) {
  var dragSpotlight = state.dragSpotlight,
    spotlight = state.spotlight;
  (0, _map["default"])(this).dragPan.enable();
  (0, _map["default"])(this).fire("draw.spotlightUpdate", {
    spotlight: spotlight
  });
  state.activeHandle = null;
  if (dragSpotlight) {
    var handles = this.addHandles(spotlight.coordinates[0]);
    state.dragSpotlight = false;
    state.handles = handles;
  }
};
SpotlightMode.onMouseMove = function (state, e) {
  var handles = state.handles;
  var featureTarget = e.featureTarget;
  if (featureTarget) {
    var id = featureTarget.properties.id;
    var handle = handles[id];
    if (handle) {
      (0, _map["default"])(this).getCanvas().style.cursor = handle.properties.movement === "lng" ? "ew-resize" : "ns-resize";
    } else {
      (0, _map["default"])(this).getCanvas().style.cursor = "move";
    }
  }
};
SpotlightMode.toDisplayFeatures = function (state, geojson, display) {
  display(geojson);
};
var _default = SpotlightMode;
exports["default"] = _default;