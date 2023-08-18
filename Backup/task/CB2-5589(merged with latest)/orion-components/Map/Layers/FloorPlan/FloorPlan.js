"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _react = require("react");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _area = _interopRequireDefault(require("@turf/area"));
var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./floorPlanActions.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  id: _propTypes["default"].string.isRequired,
  image: _propTypes["default"].string.isRequired,
  coordinates: _propTypes["default"].array,
  editing: _propTypes["default"].bool,
  before: _propTypes["default"].string
};
var defaultProps = {
  coordinates: null,
  setCoordinates: null
};
var FloorPlan = function FloorPlan(props) {
  var dispatch = (0, _reactRedux.useDispatch)();
  var setCoordinates = actionCreators.setCoordinates;
  var image = props.image,
    id = props.id,
    editing = props.editing,
    before = props.before;
  var floorPlan = (0, _reactRedux.useSelector)(function (state) {
    return state.floorPlan;
  });
  var mapState = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState;
  });
  var map = mapState.baseMap.mapRef;
  var coordinates = props.coordinates ? props.coordinates : floorPlan ? floorPlan.coordinates : null;
  var imgSrc = image ? image : floorPlan && floorPlan.image ? typeof floorPlan.image === "string" ? floorPlan.image : _url["default"].createObjectURL(floorPlan.image) : "";
  (0, _react.useEffect)(function () {
    var addFloorPlan = function addFloorPlan() {
      var parseDim = function parseDim(coords) {
        return (0, _values["default"])(map.unproject(coords));
      };
      var img = new Image();
      img.src = imgSrc;
      img.onload = function () {
        var _context, _context2;
        var height = img.height;
        var width = img.width;
        var center = map.project(map.getCenter());
        var x = center.x,
          y = center.y;
        var imgXMax = x + width / 10;
        var imgXMin = x - width / 10;
        var imgYMax = y + height / 10;
        var imgYMin = y - height / 10;
        var dimA = parseDim({
          x: imgXMin,
          y: imgYMax
        });
        var dimB = parseDim({
          x: imgXMax,
          y: imgYMax
        });
        var dimC = parseDim({
          x: imgXMax,
          y: imgYMin
        });
        var dimD = parseDim({
          x: imgXMin,
          y: imgYMin
        });
        var _map$getBounds = map.getBounds(),
          _ne = _map$getBounds._ne,
          _sw = _map$getBounds._sw;
        if (!coordinates && !map.getSource("ac2-".concat(id, "-floor-plan-source")) && (0, _area["default"])((0, _bboxPolygon["default"])((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])((0, _values["default"])(_ne)), (0, _toConsumableArray2["default"])((0, _values["default"])(_sw))))) < (0, _area["default"])((0, _bboxPolygon["default"])((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(dimA), (0, _toConsumableArray2["default"])(dimC))))) {
          var _context3;
          map.fitBounds((0, _concat["default"])(_context3 = []).call(_context3, (0, _toConsumableArray2["default"])(dimA), (0, _toConsumableArray2["default"])(dimC)), {
            padding: 300
          });
        }
        if (!coordinates) {
          dispatch(setCoordinates([dimD, dimC, dimB, dimA, dimD]));
        } else {
          var _context4;
          dispatch(setCoordinates(coordinates.length < 5 ? (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(coordinates), [coordinates[0]]) : coordinates));
        }
        var sourceData = {
          type: "image",
          url: imgSrc,
          coordinates: coordinates ? (0, _filter["default"])(coordinates).call(coordinates, function (coord, index) {
            return index < 4;
          }) : [dimD, dimC, dimB, dimA]
        };
        if (!map.getSource("ac2-".concat(id, "-floor-plan-source"))) {
          map.addSource("ac2-".concat(id, "-floor-plan-source"), sourceData);
          map.addLayer({
            id: "ac2-".concat(id, "-floor-plan-overlay"),
            source: "ac2-".concat(id, "-floor-plan-source"),
            type: "raster",
            paint: {
              "raster-opacity": editing ? 0.7 : 1.0
            }
          }, before);
        }
      };
    };
    if (map && !map.getSource("ac2-".concat(id, "-floor-plan-source")) && imgSrc) {
      addFloorPlan();
    }
  }, [map, imgSrc, coordinates]);
  (0, _react.useEffect)(function () {
    if (map && map.getSource("ac2-".concat(id, "-floor-plan-source")) && coordinates) {
      var imgSource = map.getSource("ac2-".concat(id, "-floor-plan-source"));
      imgSource.updateImage(_objectSpread(_objectSpread({}, imgSource), {}, {
        coordinates: coordinates
      }));
    }
  }, [map, coordinates]);
  (0, _react.useEffect)(function () {
    return function () {
      if (map) {
        if (map.getLayer("ac2-".concat(id, "-floor-plan-overlay"))) {
          map.removeLayer("ac2-".concat(id, "-floor-plan-overlay"));
        }
        if (map.getSource("ac2-".concat(id, "-floor-plan-source"))) {
          map.removeSource("ac2-".concat(id, "-floor-plan-source"));
        }
      }
    };
  }, [map, id]);
  return null;
};
FloorPlan.propTypes = propTypes;
FloorPlan.defaultProps = defaultProps;
var _default = FloorPlan;
exports["default"] = _default;