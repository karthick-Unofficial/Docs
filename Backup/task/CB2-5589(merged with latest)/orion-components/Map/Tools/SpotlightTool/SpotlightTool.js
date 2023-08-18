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
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _react = require("react");
var _mapboxGlDraw = _interopRequireDefault(require("@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw"));
var _SpotlightMode = _interopRequireDefault(require("./SpotlightMode"));
var _styles = _interopRequireDefault(require("./styles"));
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./spotlightToolActions.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var draw = new _mapboxGlDraw["default"]({
  modes: (0, _assign["default"])({
    spotlight_mode: _SpotlightMode["default"]
  }, _mapboxGlDraw["default"].modes),
  userProperties: true,
  displayControlsDefault: false,
  styles: _styles["default"]
});
var SpotlightTool = function SpotlightTool() {
  var dispatch = (0, _reactRedux.useDispatch)();
  var updateCurrentFeature = actionCreators.updateCurrentFeature;
  var baseMap = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.baseMap;
  });
  var mapTools = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState.mapTools;
  });
  var feature = mapTools.feature;
  var map = baseMap.mapRef;
  (0, _react.useEffect)(function () {
    if (map) {
      map.addControl(draw, "top-left");
      draw.changeMode("spotlight_mode", {
        feature: feature
      });
      map.on("draw.spotlightUpdate", function (e) {
        return dispatch(updateCurrentFeature(draw.get(e.spotlight.id)));
      });
      return function () {
        draw.trash();
        draw.deleteAll();
        draw.changeMode("simple_select");
        map.removeControl(draw);
      };
    }
  }, [map]);
  return null;
};
var _default = SpotlightTool;
exports["default"] = _default;