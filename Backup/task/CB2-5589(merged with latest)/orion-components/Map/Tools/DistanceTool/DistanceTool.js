"use strict";

var _typeof3 = require("@babel/runtime-corejs3/helpers/typeof");
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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _values2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _lineSegment = _interopRequireDefault(require("@turf/line-segment"));
var _bearing = _interopRequireDefault(require("@turf/bearing"));
var _length = _interopRequireDefault(require("@turf/length"));
var _helpers = require("@turf/helpers");
var _distance = _interopRequireDefault(require("@turf/distance"));
var _midpoint = _interopRequireDefault(require("@turf/midpoint"));
var _reactMapboxGl = require("react-mapbox-gl");
var _lodash = _interopRequireDefault(require("lodash"));
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _UnitSelect = _interopRequireDefault(require("../components/UnitSelect"));
var _CBComponents = require("../../../CBComponents");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Actions = require("orion-components/Map/Tools/Actions");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context18, _context19; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context18 = ownKeys(Object(source), !0)).call(_context18, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context19 = ownKeys(Object(source))).call(_context19, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var DistanceToolWrapper = function DistanceToolWrapper(_ref) {
  var activePath = _ref.activePath,
    before = _ref.before;
  var track = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.feedEntitiesGeoByTypeSelector)("track")(state);
  }, _reactRedux.shallowEqual);
  var landUnitSystem = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.unitsOfMeasurement.landUnitSystem;
  });
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return state.mapState;
    }, _reactRedux.shallowEqual),
    baseMap = _useSelector.baseMap,
    distanceTool = _useSelector.distanceTool,
    mapTools = _useSelector.mapTools;
  var map = baseMap.mapRef;
  var tracks = track || {};
  var toolType = mapTools.type;
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  return /*#__PURE__*/_react["default"].createElement(MemoedDistanceTool, {
    activePath: activePath,
    distanceTool: distanceTool,
    map: map,
    tracks: tracks,
    landUnitSystem: landUnitSystem,
    toolType: toolType,
    dir: dir,
    before: before
  });
};
var DistanceTool = function DistanceTool(props) {
  var dispatch = (0, _reactRedux.useDispatch)();
  var landUnitSystem = props.landUnitSystem,
    toolType = props.toolType,
    dir = props.dir,
    before = props.before,
    distanceTool = props.distanceTool;
  var stateRef = (0, _react.useRef)({
    currentPath: {
      id: null,
      coordinates: [],
      segments: [],
      distance: null,
      eta: null,
      index: null,
      name: null,
      zoomLevel: null,
      tracks: [],
      // Tracks associated with path,
      trackData: []
    },
    paths: [],
    editing: false,
    dragging: false,
    hovering: false,
    adding: null,
    pointFocus: null,
    count: 1,
    tooltipParent: null,
    tooltip: null,
    distanceTool: distanceTool
  });
  (0, _react.useEffect)(function () {
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      distanceTool: distanceTool
    });
  }, [distanceTool]);
  (0, _react.useEffect)(function () {
    var map = (0, _map["default"])(props);
    map.on("click", function (e) {
      return handleDraw(e);
    });
    map.on("touchend", function (e) {
      return handleDraw(e);
    });
    map.on("mouseenter", "circles", function (e) {
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        hovering: true,
        pointFocus: e.features[0].properties.id,
        pathFocus: e.features[0].properties.pathId
      });
      setPopup(e.features[0]);
    });
    map.on("mouseleave", "circles", function () {
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        hovering: false,
        pointFocus: null,
        pathFocus: null,
        tooltip: null
      });
    });
    map.on("mousedown", "circles", function (e) {
      // Set the target and target's path
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        target: e.features[0],
        targetPath: props.activePath
      });
      mouseDown();
    });
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      tooltipParent: document.getElementsByClassName("mapboxgl-map")[0]
    });
  }, []);
  var setPopup = function setPopup(feature) {
    var coordinates = feature.geometry.coordinates;
    var name = feature.properties.name;
    if (coordinates && coordinates.length === 2) {
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        tooltip: /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Popup, {
          coordinates: coordinates,
          offset: 12
        }, /*#__PURE__*/_react["default"].createElement("div", null, name && /*#__PURE__*/_react["default"].createElement("p", null, "Name: ", name), /*#__PURE__*/_react["default"].createElement("p", null, "Lat: ", /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
          sourceUnit: "decimal-degrees",
          value: coordinates[1]
        })), /*#__PURE__*/_react["default"].createElement("p", null, "Lon: ", /*#__PURE__*/_react["default"].createElement(_CBComponents.UnitParser, {
          sourceUnit: "decimal-degrees",
          value: coordinates[0]
        }))))
      });
    }
  };
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    if (prevProps) {
      var map = (0, _map["default"])(props),
        _distanceTool = props.distanceTool,
        _toolType = props.toolType;
      var paths = _distanceTool.paths,
        activePath = _distanceTool.activePath;
      var completedPaths = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], paths, function (path) {
        return path && path.id;
      });
      _lodash["default"].each(completedPaths, function (path) {
        var _context;
        if ((0, _filter["default"])(_context = path.tracks).call(_context, function (t) {
          return !!t;
        }).length > 0) {
          updatePathEvent(path);
        }
      });
      if (!stateRef.current.currentPath.id && !prevProps.distanceTool.activePath && activePath) {
        stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
          editing: true,
          adding: true,
          currentPath: activePath,
          unit: activePath.unit,
          distanceTool: _distanceTool
        });
        var canvas = map.getCanvasContainer();
        canvas.style.cursor = "pointer";
        dispatch((0, _Actions.setMapTools)({
          type: "distance"
        }));
      }
      if (prevProps.toolType === "distance" && !_toolType) {
        handleClear();
      }
    }
  }, [props]);
  var handleDraw = function handleDraw(e) {
    var _stateRef$current = stateRef.current,
      unit = _stateRef$current.unit,
      distanceTool = _stateRef$current.distanceTool;
    var pathArray = (0, _values["default"])(distanceTool.paths);
    if (stateRef.current.editing === true) {
      var _context2, _context3, _context4, _context5;
      // Check to see if user is clicking on a track
      var features = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], (0, _map["default"])(props).queryRenderedFeatures(e.point), function (feature) {
        return feature.properties.type === "Track" || feature.properties.entityType === "track";
      });
      // Get the coordinates of the track or the user click
      var coords = features.length > 0 ? features[0].geometry.coordinates : (0, _values["default"])(e.lngLat);

      // Save the name of the first track you click on
      if (features[0] && !stateRef.current.pathName) {
        var _newPath = _objectSpread(_objectSpread({}, stateRef.current.currentPath), {}, {
          name: features[0].properties.name
        });
        stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
          currentPath: _newPath
        });
      }

      // Add the click coordinates to the currentPath's coordinates
      var coordinateUpdate = _objectSpread(_objectSpread({}, stateRef.current.currentPath), {}, {
        coordinates: (0, _concat["default"])(_context2 = [coords]).call(_context2, (0, _toConsumableArray2["default"])(stateRef.current.currentPath.coordinates))
      });
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        currentPath: coordinateUpdate
      });
      var currentPath = stateRef.current.currentPath;

      // Check to see if user is adding to an existing path
      var isAdding = stateRef.current.adding !== null;

      // Get the individual line segments of the path in order to get distances
      // Made a reusable method
      var segments = getSegments(currentPath.coordinates, currentPath.unit, currentPath.trackData);
      var path = {
        id: isAdding ? currentPath.id : "path" + (pathArray.length + 1),
        segments: segments,
        distance: currentPath.coordinates.length > 1 ? getDistance(currentPath.coordinates, unit) : 0,
        eta: getETA(segments),
        unit: unit
      };

      // -- get track speed value and make sure it's in knots
      var trackSpeed = null;
      if (features[0] && features[0].properties.speed) {
        var speedObj = features[0].properties.speed;
        if (typeof speedObj === "number") trackSpeed = speedObj;else if ((0, _typeof2["default"])(speedObj) === "object") {
          var val = speedObj.val,
            _unit = speedObj.unit;
          if (_unit === "mph") trackSpeed = val / 1.151;else if (_unit === "kph") trackSpeed = val / 1.852;else if (_unit === "knot" || _unit === "kn") trackSpeed = val;
        }
      }
      var newTrackData = features.length > 0 && trackSpeed ? {
        id: features[0].properties.id,
        speed: trackSpeed
      } : null;
      var newPath = _objectSpread(_objectSpread({}, stateRef.current.currentPath), {}, {
        id: path.id,
        segments: path.segments,
        distance: path.distance,
        eta: path.eta,
        index: isAdding ? currentPath.index : pathArray.length,
        tracks: features.length > 0 ? (0, _concat["default"])(_context3 = [features[0].properties.id]).call(_context3, (0, _toConsumableArray2["default"])(stateRef.current.currentPath.tracks)) : (0, _concat["default"])(_context4 = [null]).call(_context4, (0, _toConsumableArray2["default"])(stateRef.current.currentPath.tracks)),
        trackData: (0, _concat["default"])(_context5 = []).call(_context5, (0, _toConsumableArray2["default"])(stateRef.current.currentPath.trackData), [newTrackData]),
        name: currentPath.name ? currentPath.name : (0, _i18n.getTranslation)("global.map.tools.distanceTool.path") + (pathArray.length + 1),
        zoomLevel: isAdding ? currentPath.zoomLevel : (0, _map["default"])(props).getZoom(),
        unit: unit
      });
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        currentPath: newPath
      });
      dispatch((0, _Actions.setActivePath)(newPath));
    }
  };

  /*
   * Used when a path has a trackId(s). Pass in the path and an array of tracks. If the tracks have different
   * coordinate data, an updated path will return. Else a null value will return.
   */
  var updatePathEvent = function updatePathEvent(path) {
    var _context6;
    var tracks = props.tracks,
      distanceTool = props.distanceTool;
    var unit = stateRef.current.unit;
    var trackArr = (0, _values2["default"])(_lodash["default"]).call(_lodash["default"], tracks);
    var update = false;
    // Check if the path has a track id at the index of the coordinate and if so, replace it with the related tracks coordinates
    var coordinates = (0, _map["default"])(_context6 = path.coordinates).call(_context6, function (coord, index) {
      var track = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], trackArr, function (track) {
        return track.id === path.tracks[index];
      });
      if (track) {
        update = true;
        return track.entityData.geometry.coordinates;
      } else return coord;
    });
    if (update) {
      var segments = path.segments.length > 0 ? getSegments(coordinates, path.unit, path.trackData) : [];
      var newPath = _objectSpread({}, path);
      if (newPath) {
        newPath.coordinates = coordinates;
        newPath.segments = segments;
        newPath.distance = coordinates.length > 1 ? getDistance(coordinates, unit || newPath.unit) : null;
        newPath.eta = getETA(segments);
        newPath.unit = unit || newPath.unit;
      }
      var newPaths = _objectSpread({}, distanceTool.paths);
      if (newPath && newPaths[newPath.id]) {
        newPaths[newPath.id] = newPath;
      } else {
        newPaths = _objectSpread(_objectSpread({}, newPaths), {}, {
          newPath: newPath
        });
      }
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        paths: newPaths
      });
      dispatch((0, _Actions.updatePaths)(_lodash["default"].keyBy(newPaths, "id")));
    }
  };

  // Get the individual line segments of the path in order to get distances
  // Made reusable in order to update distances on line edit
  var getSegments = function getSegments(path, unit, trackData) {
    if (path.length > 0) {
      var _context7;
      var lineString = path.length > 1 ? (0, _helpers.lineString)(path) : (0, _helpers.point)(path[0]);
      var segmentsArr = lineString.geometry.coordinates.length > 0 ? (0, _lineSegment["default"])(lineString) : [];
      segmentsArr = segmentsArr.features ? (0, _map["default"])(_context7 = segmentsArr.features).call(_context7, function (segment) {
        return segment.geometry;
      }) : [];
      var trackSpeedMPH = trackData[0] ? trackData[0].speed * 1.151 : null;
      var segments = segmentsArr.length > 0 ? (0, _map["default"])(segmentsArr).call(segmentsArr, function (feature, index) {
        var coords = feature.coordinates;
        var a = coords[0];
        var b = coords[1];
        var distance = (0, _distance["default"])(a, b, {
          units: "miles"
        });
        var bearing = (0, _bearing["default"])(b, a);
        var eta = trackSpeedMPH ? distance / trackSpeedMPH * 60 : null;
        var id = index;
        var segment = {
          id: id,
          segment: [a, b],
          distance: unit.type === "nautical-miles" ? distance / 1.151 : distance,
          bearing: bearing > 0 ? bearing : 360 + bearing,
          // Convert bearing from 180/-180 deg to 360 deg
          eta: eta
        };
        return segment;
      }) : [];
      return segments;
    }
  };

  // Called when you start dragging points around
  var mouseDown = function mouseDown() {
    var map = (0, _map["default"])(props);

    // Check to see if cursor is over a point
    if (!stateRef.current.hovering) {
      return;
    }

    // Allow dragging
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      dragging: true
    });
    map.getCanvasContainer().style.cursor = "grab";

    // Keep map from trying to pan on drag
    map.dragPan.disable();

    // Controls coordinate updates
    map.on("mousemove", function (e) {
      handleMove(e);
    });

    // Clears target and target's path from state
    map.on("mouseup", mouseUp);
  };
  var handleMove = function handleMove(e) {
    var _context8;
    var map = (0, _map["default"])(props);
    var _stateRef$current2 = stateRef.current,
      target = _stateRef$current2.target,
      editing = _stateRef$current2.editing,
      currentPath = _stateRef$current2.currentPath,
      dragging = _stateRef$current2.dragging;
    if (!editing) {
      return;
    }

    // Check to see if dragging is allowed
    if (!dragging) {
      return;
    }

    // Get the coordinates of the cursor
    var coords = e.lngLat;
    var newCoords = [coords.lng, coords.lat];
    map.getCanvasContainer().style.cursor = "grabbing";

    // Get the currentPath's array of coordinates and replace the coords at the targets index with the newCoords
    var pathCoords = (0, _slice["default"])(_context8 = currentPath.coordinates).call(_context8);
    (0, _splice["default"])(pathCoords).call(pathCoords, target.properties.index, 1, newCoords);

    // Update the segments of the based on the new coordinates array
    var newSegments = getSegments(pathCoords, currentPath.unit, currentPath.trackData);

    // Update the coordinates/segments/distance on the new path
    var newPath = {
      id: currentPath.id,
      segments: newSegments,
      distance: getDistance(pathCoords, currentPath.unit),
      eta: getETA(newSegments),
      coordinates: pathCoords,
      name: currentPath.name,
      tracks: currentPath.tracks,
      index: currentPath.index,
      zoomLevel: currentPath.zoomLevel,
      unit: currentPath.unit,
      trackData: currentPath.trackData
    };

    // Replace the old path with the new path
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      currentPath: newPath
    });
    dispatch((0, _Actions.setActivePath)(newPath));
  };
  var mouseUp = function mouseUp() {
    var map = (0, _map["default"])(props);

    // Don't reset state if still dragging point
    if (!stateRef.current.dragging) {
      return;
    }
    map.getCanvasContainer().style.cursor = "";

    // Disable ability to drag points
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      dragging: false
    });

    // Allow drag panning again
    map.dragPan.enable();

    // Unbind mouse events and clear out the state
    map.off("mousemove", handleMove);
    map.off("mouseup", mouseUp);
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      target: null,
      targetPath: [[]]
    });
  };
  var handleEdit = function handleEdit(unit) {
    var map = (0, _map["default"])(props),
      distanceTool = props.distanceTool;
    var _stateRef$current3 = stateRef.current,
      adding = _stateRef$current3.adding,
      editing = _stateRef$current3.editing,
      count = _stateRef$current3.count,
      currentPath = _stateRef$current3.currentPath;
    var paths = distanceTool.paths;
    // unit is for measurement via turf (does not accept nautical miles)
    var unitData;
    switch (unit) {
      case "kilometers":
        unitData = {
          type: unit,
          measurement: unit,
          display: (0, _i18n.getTranslation)("global.map.tools.distanceTool.km")
        };
        break;
      case "miles":
        unitData = {
          type: unit,
          measurement: unit,
          display: (0, _i18n.getTranslation)("global.map.tools.distanceTool.mi")
        };
        break;
      case "nautical-miles":
        unitData = {
          type: unit,
          measurement: unit,
          display: (0, _i18n.getTranslation)("global.map.tools.distanceTool.nm")
        };
        break;
      default:
        break;
    }
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      unit: unitData
    });
    // get the maps canvas in order to change the cursor in edit mode
    var canvas = map.getCanvasContainer();
    // If adding, replace path being edited with the current path on save
    if (adding !== null && editing) {
      var newPaths = _objectSpread(_objectSpread({}, paths), {}, {
        currentPath: currentPath
      });
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        paths: (0, _values["default"])(newPaths),
        adding: null
      });
      dispatch((0, _Actions.updatePath)(currentPath));
      canvas.style.cursor = "";
      handleClear();
      // Save off the current path and reset if a path has been drawn
    } else if (editing && currentPath.coordinates.length > 1) {
      var _context9;
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        paths: (0, _concat["default"])(_context9 = []).call(_context9, (0, _toConsumableArray2["default"])((0, _values["default"])(paths)), [currentPath]),
        count: count + 1
      });
      dispatch((0, _Actions.updatePath)(currentPath));
      dispatch((0, _Actions.setActivePath)(null));
      handleClear();
      canvas.style.cursor = "";
    } else {
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
        editing: true
      });
      // Set app state to prevent entity profile from opening if clicking on a track
      dispatch((0, _Actions.setMapTools)({
        type: "distance"
      }));
      canvas.style.cursor = "pointer";
    }
  };

  // Cancel drawing a path
  var handleClear = function handleClear() {
    var map = (0, _map["default"])(props);
    var canvas = map.getCanvasContainer();
    dispatch((0, _Actions.setMapTools)({
      type: null
    }));
    stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), {}, {
      editing: false,
      adding: null,
      currentPath: {
        id: null,
        coordinates: [],
        segments: [],
        distance: null,
        eta: null,
        index: null,
        name: null,
        zoomLevel: null,
        tracks: [],
        trackData: []
      }
    });
    dispatch((0, _Actions.setActivePath)(null));
    canvas.style.cursor = "";
  };
  var getPathData = function getPathData() {
    var _context10, _context17;
    var map = (0, _map["default"])(props),
      distanceTool = props.distanceTool;
    var _stateRef$current4 = stateRef.current,
      editing = _stateRef$current4.editing,
      pointFocus = _stateRef$current4.pointFocus,
      pathFocus = _stateRef$current4.pathFocus;
    var tracks = (0, _values2["default"])(_lodash["default"]).call(_lodash["default"], props.tracks);
    var paths = distanceTool.paths,
      activePath = distanceTool.activePath;
    var filteredPaths = (0, _values["default"])(paths);
    if (editing) {
      filteredPaths = (0, _filter["default"])(filteredPaths).call(filteredPaths, function (path) {
        if (activePath) {
          return activePath.id !== path.id;
        }
        return true;
      });
    }
    if (activePath) {
      filteredPaths.push(activePath);
    }

    // Ensure that the current path user is creating shows up on map
    var allPaths = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], filteredPaths, function (path) {
      return path.id;
    });

    // Set the GeoJSON for all paths
    var pathFeatures = allPaths.length > 0 && allPaths[0].coordinates.length > 0 ? (0, _map["default"])(_context10 = (0, _filter["default"])(allPaths).call(allPaths, function (path) {
      return path !== undefined;
    })).call(_context10, function (path) {
      var _context11, _context13, _context16;
      var trackArr = _lodash["default"].compact(path.tracks).length > 0 ? (0, _filter["default"])(_context11 = _lodash["default"].compact((0, _values2["default"])(_lodash["default"]).call(_lodash["default"], tracks))).call(_context11, function (track) {
        var _context12;
        return (0, _includes["default"])(_context12 = path.tracks).call(_context12, track.entityData.properties.id);
      }) : [];

      // Paths disappear once user zooms out a certain distance relative to the zoom level on creation.
      var pathVisible = path.zoomLevel - map.getZoom() > 4 ? 0 : 1;

      // Check if the path has a track id at the index of the coordinate and if so, replace it with the related tracks coordinates
      var coordinateData = (0, _map["default"])(_context13 = path.coordinates).call(_context13, function (coord, index) {
        var track = (0, _filter["default"])(trackArr).call(trackArr, function (track) {
          return track.entityData.properties.id === path.tracks[index];
        });
        if (trackArr.length > 0 && track[0] && path.tracks[index] === track[0].entityData.properties.id) {
          var newCoords = track[0].entityData.geometry.coordinates;
          return {
            coords: newCoords,
            name: track[0].entityData && track[0].entityData.properties ? track[0].entityData.properties.name : track[0].id || null
          };
        } else {
          return {
            coords: coord
          };
        }
      });
      var coordinates = (0, _map["default"])(coordinateData).call(coordinateData, function (data) {
        return data.coords;
      });

      // Get all the vertices from the path for the circles coordinates
      var points = (0, _map["default"])(coordinateData).call(coordinateData, function (_ref2, index) {
        var coords = _ref2.coords,
          name = _ref2.name;
        // Check if point is associated with a track (for setting radius)
        var onTrack = path.tracks.length > 0 && path.tracks[index] !== null;
        var pointFeatures = {
          type: "Feature",
          properties: {
            id: "point" + index,
            pathId: path.id,
            index: index,
            color: editing && pointFocus === "point" + index && pathFocus === path.id ? "#35b7f3" : "#666",
            radius: onTrack ? 20 : map.getZoom() / 2,
            subtype: "Circle",
            pathVisibility: pathVisible
          },
          geometry: {
            type: "Point",
            coordinates: coords
          }
        };
        if (name) pointFeatures.properties["name"] = name;
        return pointFeatures;
      });

      // Get all the line segments (for displaying distances)
      var pathSegments = getSegments(coordinates, path.unit, path.trackData);
      var segments = path.segments.length > 0 ? _lodash["default"].flatten((0, _map["default"])(pathSegments).call(pathSegments, function (segment) {
        var _context14, _context15;
        // Labels disappear once user zooms out a certain distance relative to the zoom level on creation.
        var labelsVisible = path.zoomLevel - map.getZoom() > 0.9 ? 0 : 1;

        // Find the midpoint of the segment (for label placement)
        var p1 = (0, _helpers.point)(segment.segment[0]);
        var p2 = (0, _helpers.point)(segment.segment[1]);
        var midpoint = (0, _midpoint["default"])(p1, p2);
        var coords = midpoint.geometry.coordinates;
        var distance = segment.distance ? segment.distance.toFixed(2) + " ".concat(path.unit ? path.unit.display : "") : 0;
        var bearing = segment.bearing ? segment.bearing.toFixed(2) + "\xB0" : null;
        var etaString = segment.eta ? "\nETA: ".concat(segment.eta.toFixed(2), " min") : "";
        var segmentFeatures = [{
          type: "Feature",
          properties: segment.id !== null ? {
            id: segment.id,
            pathId: path.id,
            subtype: segment.eta ? "EtaSegment" : "Segment",
            // differentiate Paths from Segments when rendering layers
            labelVisibility: labelsVisible,
            labelText: (0, _concat["default"])(_context14 = (0, _concat["default"])(_context15 = "".concat(distance, "\n")).call(_context15, bearing)).call(_context14, etaString)
          } : {},
          geometry: {
            type: "Point",
            coordinates: coords
          }
        }];
        return segmentFeatures;
      })) : [];

      // Concat all the paths, points, and segments
      var features = (0, _concat["default"])(_context16 = [{
        type: "LineString",
        properties: path.id ? {
          id: path.id,
          distance: coordinates.length > 1 ? getDistance(coordinates, path.unit).toFixed(2) + " ".concat(path.unit.display) : null,
          subtype: "Path",
          // differentiate Paths from Segments when rendering layers
          name: path.name,
          pathVisibility: pathVisible
        } : {},
        geometry: {
          type: "LineString",
          coordinates: coordinates
        }
      }]).call(_context16, (0, _toConsumableArray2["default"])(points), (0, _toConsumableArray2["default"])(segments));
      return features;
    }) : [];

    // Reduce all the features down to a single array to fit GeoJSON syntax
    // Filter to remove incomplete paths and segments
    var allFeatures = (0, _filter["default"])(_context17 = (0, _reduce["default"])(pathFeatures).call(pathFeatures, function (a, b) {
      return (0, _concat["default"])(a).call(a, b);
    }, [])).call(_context17, function (feature) {
      return feature.geometry.coordinates.length > 0;
    });
    var pathData = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: allFeatures
      }
    };
    return pathData;
  };
  var getDistance = function getDistance(coordinates, unit) {
    var type = unit.type;
    var length = (0, _length["default"])((0, _helpers.lineString)(coordinates), {
      units: "miles"
    });
    if (type === "nautical-miles") {
      return length * 0.86897624;
    } else {
      return length;
    }
  };
  var getETA = function getETA(segments) {
    return (0, _reduce["default"])(segments).call(segments, function (totalEta, segment) {
      var eta = segment.eta ? segment.eta : 0;
      return totalEta + eta;
    }, 0);
  };
  var _stateRef$current5 = stateRef.current,
    lightMap = _stateRef$current5.lightMap,
    editing = _stateRef$current5.editing,
    tooltip = _stateRef$current5.tooltip,
    tooltipParent = _stateRef$current5.tooltipParent;
  var pathData = getPathData();
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, pathData && pathData.data.features && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
    id: "pathSource",
    geoJsonSource: pathData
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "ac2-distance-tool-segment-info",
    type: "symbol",
    sourceId: "pathSource",
    layout: {
      "symbol-avoid-edges": true,
      "symbol-placement": "point",
      "text-field": "{labelText}",
      "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
      "text-size": 11,
      "text-letter-spacing": 0,
      "text-ignore-placement": true,
      "text-max-width": 15,
      "text-anchor": "center",
      "text-justify": "center",
      "text-allow-overlap": true
    },
    paint: {
      "text-color": "#fff",
      "text-opacity": {
        type: "identity",
        property: "labelVisibility"
      }
    },
    filter: ["any", ["==", "subtype", "Segment"], ["==", "subtype", "EtaSegment"]],
    before: before
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "ac2-distance-tool-segment-info-circle",
    type: "circle",
    sourceId: "pathSource",
    filter: ["any", ["==", "subtype", "Segment"], ["==", "subtype", "EtaSegment"]],
    paint: {
      "circle-color": "#666",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-radius": ["case", ["==", ["get", "subtype"], "EtaSegment"], 45, 25],
      "circle-opacity": {
        type: "identity",
        property: "labelVisibility"
      },
      "circle-stroke-opacity": {
        type: "identity",
        property: "labelVisibility"
      }
    },
    before: "ac2-distance-tool-segment-info"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "ac2-distance-tool-circles",
    type: "circle",
    sourceId: "pathSource",
    paint: {
      "circle-radius": {
        type: "identity",
        property: "radius"
      },
      "circle-color": {
        type: "identity",
        property: "color"
      },
      "circle-stroke-width": 2,
      "circle-stroke-color": lightMap ? "#000000" : "#FFFFFF",
      "circle-stroke-opacity": {
        type: "identity",
        property: "pathVisibility"
      },
      "circle-opacity": {
        type: "identity",
        property: "pathVisibility"
      }
    },
    filter: ["==", "subtype", "Circle"],
    before: "ac2-distance-tool-segment-info-circle"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "ac2-distance-tool-paths",
    type: "line",
    sourceId: "pathSource",
    paint: {
      "line-color": lightMap ? "#000000" : "#FFFFFF",
      "line-width": 2,
      "line-opacity": {
        type: "identity",
        property: "pathVisibility"
      }
    },
    filter: ["==", "subtype", "Path"],
    before: "ac2-distance-tool-circles"
  }), !editing && tooltip && tooltipParent && /*#__PURE__*/_reactDom["default"].createPortal(tooltip, tooltipParent)), !toolType && /*#__PURE__*/_react["default"].createElement(_UnitSelect["default"], {
    handleSelect: handleEdit,
    landUnitSystem: landUnitSystem,
    dir: dir
  }));
};
var MemoedDistanceTool = /*#__PURE__*/(0, _react.memo)(DistanceTool, function (prevProps, nextProps) {
  return (0, _reactFastCompare["default"])(prevProps, nextProps);
});
var _default = DistanceToolWrapper;
exports["default"] = _default;