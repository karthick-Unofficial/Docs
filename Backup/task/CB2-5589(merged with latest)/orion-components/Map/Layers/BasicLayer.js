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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _react = _interopRequireWildcard(require("react"));
var _reactMapboxGl = require("react-mapbox-gl");
var _includes = _interopRequireDefault(require("lodash/includes"));
var _each = _interopRequireDefault(require("lodash/each"));
var _map2 = _interopRequireDefault(require("lodash/map"));
var _uniq = _interopRequireDefault(require("lodash/uniq"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var BasicLayer = function BasicLayer(_ref) {
  var map = (0, _map["default"])(_ref),
    layer = _ref.layer,
    labelsVisible = _ref.labelsVisible,
    layerTypes = _ref.layerTypes,
    handleClick = _ref.handleClick,
    before = _ref.before;
  var prevPropLabelsVisible = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    prevPropLabelsVisible.current = labelsVisible;
  }, [labelsVisible]);
  (0, _react.useEffect)(function () {
    var _context2, _context3;
    var layerTypes = layer.layerTypes,
      name = layer.name;
    var primaryType = getPrimaryLayerType(layerTypes);
    var features = layer.features || layer.data.features || [];
    var mapboxType = features && features[0] && features[0].geometry.type ? features[0].geometry.type : "-unknown";
    // Remove labels if labelsVisible is false
    if (!labelsVisible) {
      var _context;
      map.setLayoutProperty((0, _concat["default"])(_context = "ac2-".concat(name, "-")).call(_context, mapboxType, "-symbol"), "text-field", "");
    }
    if ((0, _includes["default"])(layerTypes, "symbol")) {
      handleLoadImages();
    }
    map.on("click", (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "ac2-".concat(name, "-")).call(_context3, mapboxType, "-")).call(_context2, primaryType), function (e) {
      if (e.features[0]) {
        var _e$features$0$propert = e.features[0].properties,
          id = _e$features$0$propert.id,
          _name = _e$features$0$propert.name;
        handleClick(id, _name, layer.id);
      }
    });
  }, []);
  (0, _react.useEffect)(function () {
    var name = layer.name;
    var features = layer.features || layer.data.features || [];
    var mapboxType = features && features[0] && features[0].geometry.type ? features[0].geometry.type : "-unknown";
    if (!labelsVisible && prevPropLabelsVisible) {
      var _context4;
      map.setLayoutProperty((0, _concat["default"])(_context4 = "ac2-".concat(name, "-")).call(_context4, mapboxType, "-symbol"), "text-field", "");
    }
    if (labelsVisible && !prevPropLabelsVisible) {
      var _context5;
      map.setLayoutProperty((0, _concat["default"])(_context5 = "ac2-".concat(name, "-")).call(_context5, mapboxType, "-symbol"), "text-field", ["case", ["has", "text-field"], ["get", "text-field"], ["get", "name"]]);
    }
    if ((0, _includes["default"])(layerTypes, "symbol")) {
      handleLoadImages();
    }
  }, [labelsVisible]);
  var handleLoadImages = function handleLoadImages() {
    var images = layer.images,
      serviceId = layer.serviceId;
    (0, _each["default"])(images, function (image) {
      var url = image.url,
        id = image.id;
      var resourceUrl = url;
      if ((0, _indexOf["default"])(url).call(url, "http://") < 0 && (0, _indexOf["default"])(url).call(url, "https://") < 0) {
        var _context6;
        var sID = "".concat(serviceId, "-");
        var removeSID = new RegExp(sID, "g");
        var layerId = layer.id.replace(removeSID, "");
        resourceUrl = (0, _concat["default"])(_context6 = "".concat(layerId, "/images/")).call(_context6, url);
      }
      if (!map.hasImage(id)) {
        var _context7;
        map.loadImage((0, _concat["default"])(_context7 = "/gis-app/api/proxy-resource?serviceId=".concat(serviceId, "&resourceUrl=")).call(_context7, resourceUrl), function (err, data) {
          if (err) {
            console.log("ERROR", err);
          } else {
            map.addImage(id, data);
          }
        });
      }
    });
  };

  /**
   * Grab primary layer type
   * @param {array} layerTypes - all the layer types used to build features on map
   * All layers will have a symbol type for displaying names. For example, polygons may have
   * a fill, line (for outlines), and a symbol layer. We want to ensure that the fill layer
   * is selected for click interactions, etc.
   */
  var getPrimaryLayerType = function getPrimaryLayerType(layerTypes) {
    if ((0, _includes["default"])(layerTypes, "fill")) {
      return "fill";
    } else if ((0, _includes["default"])(layerTypes, "line")) {
      return "line";
    } else if ((0, _includes["default"])(layerTypes, "circle")) {
      return "circle";
    } else {
      return "symbol";
    }
  };
  var renderLayers = function renderLayers() {
    var name = layer.name,
      layerTypes = layer.layerTypes,
      layout = layer.layout,
      paint = layer.paint;
    var features = layer.features || layer.data.features || [];
    var mapboxType = features && features[0] && features[0].geometry.type ? features[0].geometry.type : "-unknown";
    var sourceId = "".concat(name, "-source");
    var beforeLayer = before ? before.replace("{mapboxType}", mapboxType.toLowerCase()) : null;
    var layers = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
      id: "ac2-".concat(sourceId),
      geoJsonSource: {
        type: "geojson",
        data: layer.data ? layer.data : layer
      }
    }), (0, _map2["default"])((0, _uniq["default"])(layerTypes), function (type) {
      var _context8, _context9, _context10;
      return /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
        key: (0, _concat["default"])(_context8 = "".concat(name, "-")).call(_context8, type),
        id: (0, _concat["default"])(_context9 = (0, _concat["default"])(_context10 = "ac2-".concat(name, "-")).call(_context10, mapboxType, "-")).call(_context9, type),
        sourceId: "ac2-".concat(sourceId),
        type: type,
        layout: layout[type],
        paint: paint[type],
        before: beforeLayer
      });
    }));
    return layers;
  };
  return renderLayers();
};
var _default = BasicLayer;
exports["default"] = _default;