"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
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
exports.updateShape = exports.updatePaths = exports.updatePath = exports.updateCurrentFeature = exports.setSpotlight = exports.setMapTools = exports.setActivePath = exports.restoreShape = exports.restartSpotlight = exports.removeSpotlight = exports.deleteShape = exports.deletePath = exports.createShape = exports.addSpotlight = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
var _index = require("orion-components/Dock/Actions/index.js");
var _center = _interopRequireDefault(require("@turf/center"));
var _helpers = require("orion-components/Map/helpers");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var restoreShape = function restoreShape(id) {
  return _clientAppCore.shapeService.restore(id, function (err, res) {
    if (err) {
      console.log(err, res);
    }
  });
};
exports.restoreShape = restoreShape;
var deleteShape = function deleteShape(id, name, undoing) {
  return function (dispatch) {
    _clientAppCore.shapeService["delete"](id, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        if (!undoing) {
          var undoFunc = function undoFunc() {
            dispatch(restoreShape(id));
          };
          dispatch((0, _index.createUserFeedback)(name + " has been deleted.", undoFunc));
        }
      }
    });
  };
};
exports.deleteShape = deleteShape;
var createShape = function createShape(data) {
  return function (dispatch) {
    var properties = data.properties,
      geometry = data.geometry;
    var name = properties.name,
      description = properties.description,
      symbol = properties.symbol,
      polyFill = properties.polyFill,
      polyStroke = properties.polyStroke,
      polyFillOpacity = properties.polyFillOpacity,
      lineWidth = properties.lineWidth,
      lineType = properties.lineType;
    var type = geometry.type;
    var shape = {
      entityData: {
        type: type,
        properties: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
          name: name,
          symbol: symbol,
          description: description,
          type: type === "LineString" ? "Line" : type
        }, polyFill && {
          polyFill: polyFill
        }), polyStroke && {
          polyStroke: polyStroke
        }), polyFillOpacity && {
          polyFillOpacity: polyFillOpacity
        }), lineWidth && {
          lineWidth: lineWidth
        }), lineType && {
          lineType: lineType
        }),
        geometry: geometry
      }
    };
    _clientAppCore.shapeService.create(shape, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        var id = response.generated_keys[0];
        var undo = true;
        var undoFunc = function undoFunc() {
          dispatch(deleteShape(id, name, undo));
        };
        dispatch((0, _index.createUserFeedback)(name + " has been created.", undoFunc));
      }
    });
  };
};
exports.createShape = createShape;
var updateShape = function updateShape(id, entityData, inScope) {
  return function () {
    var shape = {
      entityData: entityData
    };
    if (inScope !== undefined) {
      shape.inScope = inScope;
    }
    _clientAppCore.shapeService.update(id, shape, function (err, response) {
      if (err) {
        console.log(err, response);
      }
    });
  };
};
exports.updateShape = updateShape;
var updateCurrentFeature = function updateCurrentFeature(feature) {
  return {
    type: t.UPDATE_CURRENT_FEATURE,
    payload: {
      feature: feature
    }
  };
};
exports.updateCurrentFeature = updateCurrentFeature;
var setMapTools = function setMapTools(_ref) {
  var type = _ref.type,
    mode = _ref.mode,
    feature = _ref.feature;
  return {
    type: t.SET_MAP_TOOLS,
    payload: {
      type: type,
      mode: mode,
      feature: feature
    }
  };
};
exports.setMapTools = setMapTools;
var updatePath = function updatePath(path) {
  return {
    type: t.PATH_UPDATE,
    payload: {
      path: path
    }
  };
};
exports.updatePath = updatePath;
var updatePaths = function updatePaths(paths) {
  return {
    type: t.PATHS_UPDATE,
    payload: {
      paths: paths
    }
  };
};
exports.updatePaths = updatePaths;
var deletePath = function deletePath(id) {
  return {
    type: t.PATH_DELETE,
    payload: {
      id: id
    }
  };
};
exports.deletePath = deletePath;
var setActivePath = function setActivePath(path) {
  return {
    type: t.ACTIVE_PATH_SET,
    payload: {
      path: path
    }
  };
};
exports.setActivePath = setActivePath;
var removeSpotlight = function removeSpotlight(id) {
  return {
    type: t.SPOTLIGHT_REMOVE,
    payload: {
      id: id
    }
  };
};
exports.removeSpotlight = removeSpotlight;
var setSpotlight = function setSpotlight(spotlight) {
  return {
    type: t.SPOTLIGHT_SET,
    payload: {
      spotlight: spotlight
    }
  };
};
exports.setSpotlight = setSpotlight;
var restartSpotlight = function restartSpotlight(spotlight) {
  return {
    type: t.SPOTLIGHT_RESTART,
    payload: {
      spotlight: spotlight
    }
  };
};
exports.restartSpotlight = restartSpotlight;
var addSpotlight = function addSpotlight(feature) {
  return function (dispatch, getState) {
    var mapRef = getState().mapState.baseMap.mapRef;
    if (feature.geometry.type !== "Polygon") {
      feature.geometry = (0, _helpers.getSpotlight)({
        center: (0, _center["default"])(feature.geometry),
        spotlightProximity: feature.spotlightProximity
      }).geometry;
    } else {
      feature.type = "Feature";
    }
    _clientAppCore.spotlightService.create(feature, function (err, res) {
      if (err) {
        console.log("Error creating spotlight", err);
      } else {
        var spotlight = res.spotlight;
        dispatch(setSpotlight(spotlight));
        mapRef.flyTo({
          center: (0, _center["default"])(spotlight.geometry).geometry.coordinates
        });
      }
    });
  };
};
exports.addSpotlight = addSpotlight;