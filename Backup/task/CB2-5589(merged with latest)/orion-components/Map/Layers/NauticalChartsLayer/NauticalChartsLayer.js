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
var _react = _interopRequireWildcard(require("react"));
var _reactMapboxGl = require("react-mapbox-gl");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  map: _propTypes["default"].object
};

// cSpell:disable
var nauticalSource = {
  type: "raster",
  tiles: [window.location.protocol + "//gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0,1,2,3,4,5,6,7,9,10"],
  tileSize: 256
};
// cSpell:enable

var NauticalChartsLayer = function NauticalChartsLayer(_ref) {
  var map = (0, _map["default"])(_ref),
    defaultOpacity = _ref.defaultOpacity;
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return state.clientConfig && state.clientConfig.mapSettings;
    }),
    nauticalChartsEnabled = _useSelector.nauticalChartsEnabled;
  var mapSettings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapSettingsSelector)(state);
  });
  var nauticalChartLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.nauticalChartLayerOpacitySelector)(state);
  });
  var opacity = defaultOpacity ? 1 : nauticalChartLayerOpacity ? nauticalChartLayerOpacity : mapSettings && mapSettings["nauticalCharts"] ? mapSettings["nauticalCharts"].opacity : 1;
  var visible = mapSettings && mapSettings.nauticalChartsVisible ? mapSettings.nauticalChartsVisible : mapSettings && mapSettings["nauticalCharts"] ? mapSettings["nauticalCharts"].visible : false;

  //we are using a ref variable reference to get recent prop values in map functions.
  var nauticalChartsVisibleRef = (0, _react.useRef)(visible);
  (0, _react.useEffect)(function () {
    nauticalChartsVisibleRef.current = visible;
  }, [visible]);
  var showNauticalCharts = (0, _react.useMemo)(function () {
    return nauticalChartsEnabled && visible;
  }, [nauticalChartsEnabled, visible]);
  var toggleNauticalVisibility = function toggleNauticalVisibility() {
    if (!nauticalChartsEnabled) {
      //null
    } else {
      if (map.getZoom() < 7 && nauticalChartsVisibleRef.current) {
        map.setLayoutProperty("ac2-nautical", "visibility", "none");
      } else if (map.getZoom() >= 7 && nauticalChartsVisibleRef.current) {
        map.setLayoutProperty("ac2-nautical", "visibility", "visible");
      }
    }
  };
  (0, _react.useEffect)(function () {
    // Hide nautical charts if zoomed out beyond useful level
    if (map) {
      map.on("zoom", function () {
        toggleNauticalVisibility();
      });
      toggleNauticalVisibility();
    }
  }, []);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, showNauticalCharts && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
    id: "ac2-nauticalCharts",
    tileJsonSource: nauticalSource
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    type: "raster",
    id: "ac2-nautical",
    sourceId: "ac2-nauticalCharts",
    paint: {
      "raster-opacity": opacity
    },
    before: "---ac2-nautical-charts-position-end"
  })));
};
NauticalChartsLayer.propTypes = propTypes;
// NauticalChartsLayer.defaultProps = defaultProps;
var _default = NauticalChartsLayer;
exports["default"] = _default;