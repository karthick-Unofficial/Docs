"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _react = require("react");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _mapboxGlDraw = _interopRequireDefault(require("@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw"));
var _FloorPlanMode = _interopRequireDefault(require("./FloorPlanMode"));
var _styles = _interopRequireDefault(require("./styles"));
var _reactRedux = require("react-redux");
var _floorPlanToolActions = require("./floorPlanToolActions");
var draw = new _mapboxGlDraw["default"]({
  modes: (0, _assign["default"])({
    floor_plan_mode: _FloorPlanMode["default"]
  }, _mapboxGlDraw["default"].modes),
  userProperties: true,
  styles: _styles["default"]
});
var propTypes = {
  map: _propTypes["default"].object.isRequired,
  geometry: _propTypes["default"].shape({
    type: _propTypes["default"].string.isRequired,
    coordinates: _propTypes["default"].array.isRequired
  }).isRequired,
  setCoordinates: _propTypes["default"].func.isRequired
};
var FloorPlanTool = function FloorPlanTool() {
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return state.floorPlan;
    }),
    coordinates = _useSelector.coordinates;
  var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
      return state.mapState.baseMap;
    }),
    mapRef = _useSelector2.mapRef;
  var coordinatesCopy = (0, _map["default"])(coordinates).call(coordinates, function (coordinate) {
    return (0, _slice["default"])(coordinate).call(coordinate);
  });
  var map = mapRef;
  var geometry = {
    type: "Polygon",
    coordinates: [coordinatesCopy]
  };
  var dispatch = (0, _reactRedux.useDispatch)();
  (0, _react.useEffect)(function () {
    if (map) {
      map.addControl(draw, "top-left");
      draw.changeMode("floor_plan_mode", {
        feature: {
          geometry: geometry
        }
      });
      map.on("draw.floorPlanUpdate", function (e) {
        var _context;
        var coordinatesCopy = (0, _map["default"])(_context = e.floorPlan.coordinates[0]).call(_context, function (coordinate) {
          return (0, _slice["default"])(coordinate).call(coordinate);
        });
        return dispatch((0, _floorPlanToolActions.setCoordinates)(coordinatesCopy));
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
FloorPlanTool.propTypes = propTypes;
var _default = FloorPlanTool;
exports["default"] = _default;