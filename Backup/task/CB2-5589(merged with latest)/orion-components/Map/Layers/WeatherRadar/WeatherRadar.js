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
var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactMapboxGl = require("react-mapbox-gl");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  weatherReload: _propTypes["default"]["boolean"],
  defaultOpacity: _propTypes["default"]["boolean"]
};
var defaultProps = {
  weatherReload: true,
  defaultOpacity: false
};
var WeatherRadar = function WeatherRadar(_ref) {
  var weatherReload = _ref.weatherReload,
    defaultOpacity = _ref.defaultOpacity;
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return state.clientConfig && state.clientConfig.mapSettings;
    }),
    weatherEnabled = _useSelector.weatherEnabled,
    aerisKey = _useSelector.AERIS_API_KEY;
  var weatherRadarLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.weatherRadarLayerOpacitySelector)(state);
  });
  var mapSettings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapSettingsSelector)(state);
  });
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    wxSource = _useState2[0],
    setWxSource = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    reloadWeather = _useState4[0],
    setReloadWeather = _useState4[1];
  var opacity = defaultOpacity ? 1 : weatherRadarLayerOpacity ? weatherRadarLayerOpacity : mapSettings && mapSettings["weather"] ? mapSettings["weather"].opacity : 1;
  var visible = mapSettings && mapSettings.weatherVisible ? mapSettings.weatherVisible : mapSettings && mapSettings["weather"] ? mapSettings["weather"].visible : false;
  var _startWeatherReload = function _startWeatherReload() {
    var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;
    (0, _setInterval2["default"])(function () {
      setReloadWeather(true);
      setReloadWeather(false);
    }, interval * 1000);
  };
  (0, _react.useEffect)(function () {
    setWxSource({
      type: "raster",
      tiles: [window.location.protocol + "//maps1.aerisapi.com/".concat(aerisKey, "/radar/{z}/{x}/{y}/current.png"), window.location.protocol + "//maps2.aerisapi.com/".concat(aerisKey, "/radar/{z}/{x}/{y}/current.png"), window.location.protocol + "//maps3.aerisapi.com/".concat(aerisKey, "/radar/{z}/{x}/{y}/current.png"), window.location.protocol + "//maps4.aerisapi.com/".concat(aerisKey, "/radar/{z}/{x}/{y}/current.png")]
    });
  }, [aerisKey]);
  (0, _react.useEffect)(function () {
    // Start timer for reloading current radar overlay
    if (weatherReload) _startWeatherReload(300);
    return function () {
      clearInterval(reloadInterval);
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, weatherEnabled && !reloadWeather && visible && wxSource && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
    id: "ac2-currentRadarTiles",
    tileJsonSource: wxSource
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    type: "raster",
    id: "ac2-current-radar",
    sourceId: "ac2-currentRadarTiles",
    paint: {
      "raster-opacity": opacity
    },
    before: "---ac2-weather-position-end"
  })));
};
WeatherRadar.propTypes = propTypes;
WeatherRadar.defaultProps = defaultProps;
var _default = WeatherRadar;
exports["default"] = _default;