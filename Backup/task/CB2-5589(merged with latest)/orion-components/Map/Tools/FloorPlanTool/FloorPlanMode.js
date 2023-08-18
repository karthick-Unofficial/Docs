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
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _midpoint = _interopRequireDefault(require("@turf/midpoint"));
var _helpers = require("@turf/helpers");
var _distance = _interopRequireDefault(require("@turf/distance"));
var _center = _interopRequireDefault(require("@turf/center"));
var _bearing = _interopRequireDefault(require("@turf/bearing"));
var _transformRotate = _interopRequireDefault(require("@turf/transform-rotate"));
var _destination = _interopRequireDefault(require("@turf/destination"));
var _transformScale = _interopRequireDefault(require("@turf/transform-scale"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context7, _context8; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context7 = ownKeys(Object(source), !0)).call(_context7, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context8 = ownKeys(Object(source))).call(_context8, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var FloorPlanMode = {};
FloorPlanMode.getHandle = function (coordinates) {
  var polyBearing = (0, _bearing["default"])(coordinates[0], coordinates[1]);
  var polyCenter = (0, _center["default"])({
    type: "Polygon",
    coordinates: [coordinates]
  });
  var pointA = (0, _helpers.point)(coordinates[1]);
  var pointB = (0, _helpers.point)(coordinates[2]);
  var sideMidpoint = (0, _midpoint["default"])(pointA, pointB);
  var distanceFromSide = (0, _distance["default"])(pointA, pointB) / 3;
  var distanceFromCenter = (0, _distance["default"])(sideMidpoint, polyCenter);
  var handlePoint = (0, _destination["default"])(polyCenter, distanceFromSide + distanceFromCenter, polyBearing);
  return handlePoint;
};
FloorPlanMode.addHandles = function (coordinates, _ref) {
  var _this = this;
  var initial = _ref.initial;
  var handles = {};
  var rotateArm;
  var rotateHandle;
  if (initial) {
    var handlePoint = this.getHandle(coordinates);
    rotateHandle = this.newFeature(_objectSpread(_objectSpread({}, handlePoint), {}, {
      properties: {
        rotateHandle: true
      }
    }));
    rotateArm = this.newFeature(_objectSpread({}, (0, _helpers.lineString)([handlePoint.geometry.coordinates, (0, _midpoint["default"])(coordinates[1], coordinates[2]).geometry.coordinates])));
    this.addFeature(rotateHandle);
    this.addFeature(rotateArm);
    this.setSelected(rotateHandle.id);
    this.setSelected(rotateArm.id);
  }
  (0, _forEach["default"])(coordinates).call(coordinates, function (coordinates, index) {
    var handle = _this.newFeature({
      geometry: {
        type: "Point",
        coordinates: coordinates
      },
      properties: {
        index: index
      }
    });
    _this.addFeature(handle);
    _this.setSelected(handle.id);
    handles[handle.id] = handle;
  });
  return {
    handles: handles,
    rotateHandle: rotateHandle,
    rotateArm: rotateArm
  };
};
FloorPlanMode.setRotationHandle = function (state) {
  var floorPlan = state.floorPlan;
  var pointA = (0, _helpers.point)(floorPlan.coordinates[0][1]);
  var pointB = (0, _helpers.point)(floorPlan.coordinates[0][2]);
  var sideMidpoint = (0, _midpoint["default"])(pointA, pointB);
  var newHandle = this.getHandle(floorPlan.coordinates[0]);
  state.rotateArm.updateCoordinate("0", sideMidpoint.geometry.coordinates[0], sideMidpoint.geometry.coordinates[1]);
  state.rotateArm.updateCoordinate("1", newHandle.geometry.coordinates[0], newHandle.geometry.coordinates[1]);
  state.rotateHandle.updateCoordinate("0", newHandle.geometry.coordinates[0], newHandle.geometry.coordinates[1]);
};
FloorPlanMode.removeHandles = function (state) {
  var _context,
    _this2 = this;
  var handles = state.handles,
    hovered = state.hovered;
  (0, _forEach["default"])(_context = (0, _keys["default"])(handles)).call(_context, function (id) {
    return _this2.deleteFeature(id);
  });
  if (hovered) {
    this.deleteFeature(hovered);
    state.hovered = false;
  }
  state.handles = {};
};
FloorPlanMode.dragMove = function (state, e) {
  var _context2;
  var lngLat = e.lngLat;
  var dragMoveLocation = state.dragMoveLocation,
    floorPlan = state.floorPlan;
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
  var newCoords = (0, _map["default"])(_context2 = floorPlan.coordinates[0]).call(_context2, moveCoordinates);
  (0, _forEach["default"])(newCoords).call(newCoords, function (c, index) {
    floorPlan.updateCoordinate("0.".concat(index), c[0], c[1]);
  });
  state.dragMoveLocation = lngLat;
};
FloorPlanMode.onSetup = function (opts) {
  var _opts$feature = opts.feature,
    id = _opts$feature.id,
    _opts$feature$propert = _opts$feature.properties,
    properties = _opts$feature$propert === void 0 ? {} : _opts$feature$propert,
    geometry = _opts$feature.geometry;
  var floorPlan = this.newFeature(_objectSpread(_objectSpread({
    type: "Feature",
    geometry: geometry
  }, id && {
    id: id
  }), properties && {
    properties: properties
  }));
  this.addFeature(floorPlan);
  this.setSelected(floorPlan.id);
  this.setActionableState({
    trash: true
  });
  (0, _map["default"])(this).getCanvas().style.cursor = "";
  var _this$addHandles = this.addHandles(floorPlan.coordinates[0], {
      initial: true
    }),
    handles = _this$addHandles.handles,
    rotateHandle = _this$addHandles.rotateHandle,
    rotateArm = _this$addHandles.rotateArm;
  return {
    floorPlan: floorPlan,
    handles: handles,
    rotateHandle: rotateHandle,
    rotateArm: rotateArm
  };
};
FloorPlanMode.onMouseDown = function (state, e) {
  var handles = state.handles,
    activeHandle = state.activeHandle,
    hovered = state.hovered;
  var featureTarget = e.featureTarget,
    lngLat = e.lngLat;
  if (featureTarget) {
    (0, _map["default"])(this).dragPan.disable();
    var _featureTarget$proper = featureTarget.properties,
      id = _featureTarget$proper.id,
      user_rotateHandle = _featureTarget$proper.user_rotateHandle;
    if (user_rotateHandle) {
      state.rotating = true;
      state.activeHandle = handles[id];
    } else if (hovered || activeHandle) {
      var _context3, _context4;
      (0, _map["default"])(this).getCanvas().style.cursor = "grabbing";
      state.prevLng = lngLat.lng;
      state.prevLat = lngLat.lat;
      state.origin = activeHandle.properties.index > 1 ? (0, _find["default"])(_context3 = (0, _values["default"])(handles)).call(_context3, function (handle) {
        return handle.properties.index === activeHandle.properties.index - 2;
      }) : (0, _find["default"])(_context4 = (0, _values["default"])(handles)).call(_context4, function (handle) {
        return handle.properties.index === activeHandle.properties.index + 2;
      });
    } else {
      state.dragFloorPlan = true;
      state.dragMoveLocation = lngLat;
    }
  }
};
FloorPlanMode.onDrag = function (state, e) {
  var _e$lngLat = e.lngLat,
    lng = _e$lngLat.lng,
    lat = _e$lngLat.lat;
  var activeHandle = state.activeHandle,
    dragFloorPlan = state.dragFloorPlan,
    rotating = state.rotating,
    floorPlan = state.floorPlan,
    rotateHandle = state.rotateHandle;
  this.removeHandles(state, e);
  if (rotating) {
    var _context5;
    var polyCenter = (0, _center["default"])(floorPlan);
    var prevBearing = (0, _bearing["default"])(polyCenter, (0, _helpers.point)(rotateHandle.coordinates));
    var newBearing = (0, _bearing["default"])(polyCenter, (0, _helpers.point)([lng, lat]));
    var newPoly = (0, _transformRotate["default"])(floorPlan, newBearing - prevBearing, {
      pivot: polyCenter
    });
    (0, _forEach["default"])(_context5 = newPoly.coordinates[0]).call(_context5, function (coord, index) {
      state.floorPlan.updateCoordinate("0.".concat(index), coord[0], coord[1]);
    });
  } else if (dragFloorPlan) {
    this.dragMove(state, e);
  } else if (activeHandle) {
    this.handleScale(state, e);
  }
  this.setRotationHandle(state);
};
FloorPlanMode.handleScale = function (state, e) {
  var _context6;
  var lngLat = e.lngLat;
  var floorPlan = state.floorPlan,
    prevLng = state.prevLng,
    prevLat = state.prevLat,
    origin = state.origin;
  var lng = lngLat.lng,
    lat = lngLat.lat;
  var prevDistance = (0, _distance["default"])([prevLng, prevLat], origin);
  var newDistance = (0, _distance["default"])([lng, lat], origin);
  var factor = newDistance / prevDistance;
  var newPlan = (0, _transformScale["default"])(floorPlan, factor, {
    origin: origin.coordinates
  });
  (0, _forEach["default"])(_context6 = newPlan.coordinates[0]).call(_context6, function (coord, index) {
    state.floorPlan.updateCoordinate("0.".concat(index), coord[0], coord[1]);
  });
  state.prevLng = lng;
  state.prevLat = lat;
};
FloorPlanMode.onMouseUp = function (state) {
  var floorPlan = state.floorPlan;
  (0, _map["default"])(this).dragPan.enable();
  (0, _map["default"])(this).fire("draw.floorPlanUpdate", {
    floorPlan: floorPlan
  });
  state.activeHandle = null;
  if (!(0, _values["default"])(state.handles).length) {
    var _this$addHandles2 = this.addHandles(floorPlan.coordinates[0], {
        initial: false
      }),
      handles = _this$addHandles2.handles;
    state.handles = handles;
  }
  state.dragFloorPlan = false;
  state.rotating = false;
  state.initialShape = null;
};
FloorPlanMode.onMouseMove = function (state, e) {
  var handles = state.handles,
    hovered = state.hovered;
  var featureTarget = e.featureTarget;
  if (featureTarget) {
    var id = featureTarget.properties.id;
    var handle = handles[id];
    if (id && !handle) {
      (0, _map["default"])(this).getCanvas().style.cursor = "move";
      if (hovered) {
        this.deleteFeature(hovered);
        state.hovered = false;
      }
    } else {
      (0, _map["default"])(this).getCanvas().style.cursor = "pointer";
      state.activeHandle = handles[id];
      if (id && !hovered) {
        var hoverPoint = this.newFeature({
          geometry: featureTarget.geometry,
          properties: {
            hover: true
          }
        });
        this.addFeature(hoverPoint);
        this.setSelected(hoverPoint.id);
        state.hovered = hoverPoint.id;
      }
    }
  } else {
    (0, _map["default"])(this).getCanvas().style.cursor = "grab";
    if (hovered) {
      this.deleteFeature(hovered);
      state.hovered = false;
      state.activeHandle = null;
    }
  }
};
FloorPlanMode.toDisplayFeatures = function (state, geojson, display) {
  display(geojson);
};
var _default = FloorPlanMode;
exports["default"] = _default;