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
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _react = _interopRequireWildcard(require("react"));
var _reactMapboxGl = require("react-mapbox-gl");
var actionCreators = _interopRequireWildcard(require("./actions.js"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/GlobalData/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var AlertLayer = function AlertLayer(props) {
  var dispatch = (0, _reactRedux.useDispatch)();
  var map = (0, _map["default"])(props),
    forReplay = props.forReplay,
    before = props.before;
  var openAlertProfile = actionCreators.openAlertProfile;
  var alerts = (0, _reactRedux.useSelector)(function (state) {
    return props.alerts || (0, _Selectors.priorityNotificationSelector)(state);
  });
  (0, _react.useEffect)(function () {
    map.on("click", "alerts", function (e) {
      var features = map.queryRenderedFeatures(e.point);
      var properties = features[0].properties;
      if (properties) {
        var alert = alerts[properties.id];
        if (alert) {
          dispatch(openAlertProfile(alert, forReplay));
        }
      }
    });
  }, []);
  var getAlertGeoJSON = function getAlertGeoJSON() {
    var _context;
    var features = (0, _map["default"])(_context = (0, _values["default"])(alerts)).call(_context, function (alert) {
      var geometry = alert.geometry,
        id = alert.id;
      var data = {
        geometry: geometry,
        properties: {
          id: id
        }
      };
      return data;
    });
    return features;
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Source, {
    id: "ac2-alerts",
    geoJsonSource: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: getAlertGeoJSON()
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_reactMapboxGl.Layer, {
    key: "alerts",
    id: "ac2-alerts",
    sourceId: "ac2-alerts",
    type: "symbol",
    layout: {
      "icon-image": "alert",
      "icon-size": 1,
      "icon-allow-overlap": true
    },
    before: before
  }));
};
var _default = AlertLayer;
exports["default"] = _default;