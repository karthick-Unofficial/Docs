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
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _react = require("react");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _mapboxGlDraw = _interopRequireDefault(require("@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw"));
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./drawingToolActions.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  map: _propTypes["default"].object.isRequired,
  feature: _propTypes["default"].object,
  mode: _propTypes["default"].string.isRequired,
  updateCurrentFeature: _propTypes["default"].func.isRequired
};
var defaultProps = {
  entity: null
};
var draw = new _mapboxGlDraw["default"]();
var DrawingTool = function DrawingTool() {
  var dispatch = (0, _reactRedux.useDispatch)();
  var updateCurrentFeature = actionCreators.updateCurrentFeature;
  var baseMap = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.baseMap;
  });
  var mapTools = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.mapTools;
  });
  var feature = mapTools.feature,
    mode = mapTools.mode;
  var map = baseMap.mapRef;
  var handleDraw = function handleDraw() {
    if (feature) {
      var id = feature.id,
        properties = feature.properties,
        geometry = feature.geometry;
      draw.add({
        id: id,
        type: "Feature",
        properties: properties,
        geometry: geometry
      });
      var modeObject = mode === "simple_select" ? {
        featureIds: [id]
      } : {
        featureId: id
      };
      draw.changeMode(mode, modeObject);
    } else {
      draw.changeMode(mode);
    }
  };
  (0, _react.useEffect)(function () {
    if (map) {
      map.addControl(draw, "top-left");
      handleDraw();
      map.on("draw.update", function () {
        var _draw$getAll = draw.getAll(),
          features = _draw$getAll.features;
        if (features.length) {
          var _feature = features[0];
          dispatch(updateCurrentFeature(_feature));
        }
      });
      map.on("draw.create", function () {
        var _draw$getAll2 = draw.getAll(),
          features = _draw$getAll2.features;
        if (features.length) {
          var _feature2 = features[0];
          dispatch(updateCurrentFeature(_feature2));
        }
      });
      // cSpell:ignore modechange
      map.on("draw.modechange", function () {
        var _draw$getAll3 = draw.getAll(),
          features = _draw$getAll3.features;
        /**
         * Handle closing a polygon with insufficient points
         * Re-initializes drawing mode
         */
        if (!features.length) {
          handleDraw();
        }
      });
      // If a feature is deleted, allow user to start over
      map.on("draw.delete", function () {
        (0, _setTimeout2["default"])(function () {
          handleDraw();
        }, 200);
      });
      return function () {
        draw.deleteAll();
        map.removeControl(draw);
      };
    }
  }, [map]);
  return null;
};
DrawingTool.propTypes = propTypes;
DrawingTool.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(DrawingTool);
exports["default"] = _default;