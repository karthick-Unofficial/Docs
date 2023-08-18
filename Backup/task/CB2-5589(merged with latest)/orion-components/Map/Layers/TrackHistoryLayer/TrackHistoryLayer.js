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
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactMapboxGl = require("react-mapbox-gl");
var _map2 = _interopRequireDefault(require("lodash/map"));
var _keys2 = _interopRequireDefault(require("lodash/keys"));
var _each = _interopRequireDefault(require("lodash/each"));
var _size = _interopRequireDefault(require("lodash/size"));
var _Selectors = require("orion-components/ContextualData/Selectors");
var _reactRedux = require("react-redux");
var _TrackHistoryInfo = _interopRequireDefault(require("./components/TrackHistoryInfo"));
var _Selectors2 = require("orion-components/AppState/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  map: _propTypes["default"].object
};
var TrackHistoryLayer = function TrackHistoryLayer(_ref) {
  var map = (0, _map["default"])(_ref);
  var disabledFeeds = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.disabledFeedsSelector)(state);
  });
  var trackHistory = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.trackHistorySelector)(state, disabledFeeds);
  });
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var getTrackHistoryGeoJSON = function getTrackHistoryGeoJSON() {
    var historyGeoJSON = (0, _map2["default"])((0, _keys2["default"])(trackHistory), function (id) {
      return {
        geometry: {
          type: "LineString",
          coordinates: (0, _map2["default"])(trackHistory[id], function (entry) {
            return entry.entityData.geometry.coordinates;
          })
        }
      };
    });
    var source = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: historyGeoJSON
      }
    };
    return source;
  };
  var getTrackHistoryGeoJSONPoints = function getTrackHistoryGeoJSONPoints() {
    var trackHistoryPoints = [];
    (0, _each["default"])(trackHistory, function (history) {
      return (0, _each["default"])(history, function (entry) {
        return trackHistoryPoints.push(entry.entityData);
      });
    });
    var source = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: trackHistoryPoints
      }
    };
    return source;
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, (0, _size["default"])(trackHistory) > 0 && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
    id: "thLineSource",
    geoJsonSource: getTrackHistoryGeoJSON()
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
    id: "thPointSource",
    geoJsonSource: getTrackHistoryGeoJSONPoints()
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "ac2-track-history-points",
    type: "circle",
    sourceId: "thPointSource",
    paint: {
      "circle-color": "white",
      "circle-radius": 3
    },
    before: "---ac2-track-history-position-end"
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    id: "ac2-track-history-lines",
    type: "line",
    sourceId: "thLineSource",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "#35b7f3",
      "line-width": 1
    },
    before: "ac2-track-history-points"
  }), map && /*#__PURE__*/_react["default"].createElement(_TrackHistoryInfo["default"], {
    map: map,
    trackHistoryContexts: (0, _keys["default"])(trackHistory),
    timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour"
  })));
};
TrackHistoryLayer.propTypes = propTypes;
var _default = TrackHistoryLayer;
exports["default"] = _default;