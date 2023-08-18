"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _react = require("react");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _propTypes = _interopRequireDefault(require("prop-types"));
var propTypes = {
  map: _propTypes["default"].object,
  opacityEnabled: _propTypes["default"]["boolean"],
  defaultVisible: _propTypes["default"]["boolean"]
};
var defaultProps = {
  opacityEnabled: true,
  defaultVisible: false
};
var RoadsAndLabels = function RoadsAndLabels(_ref) {
  var map = (0, _map["default"])(_ref),
    opacityEnabled = _ref.opacityEnabled,
    defaultVisible = _ref.defaultVisible;
  var mapSettings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapSettingsSelector)(state);
  });
  var roadAndLabelLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.roadAndLabelLayerOpacitySelector)(state);
  });
  var mapStyle = mapSettings.mapStyle;
  var opacity = defaultVisible ? 1 : roadAndLabelLayerOpacity ? roadAndLabelLayerOpacity : mapSettings && mapSettings["roadsAndLabels"] ? mapSettings["roadsAndLabels"].opacity : 1;
  var visible = defaultVisible ? defaultVisible : mapSettings && mapSettings.roadsVisible ? mapSettings.roadsVisible : mapSettings["roadsAndLabels"] ? mapSettings["roadsAndLabels"].visible : false;
  (0, _react.useEffect)(function () {
    var setRoadsAndLabels = function setRoadsAndLabels() {
      var _context;
      var roadsAndLabels = (0, _filter["default"])(_context = map.getStyle().layers).call(_context, function (layer) {
        var _context2, _context3;
        return layer["source-layer"] && ((0, _includes["default"])(_context2 = layer["source-layer"]).call(_context2, "road") || (0, _includes["default"])(_context3 = layer["source-layer"]).call(_context3, "label"));
      });
      (0, _forEach["default"])(roadsAndLabels).call(roadsAndLabels, function (layer) {
        if (visible) {
          if (opacityEnabled) {
            if (layer.type === "line") {
              map.setLayoutProperty(layer.id, "visibility", "visible").setPaintProperty(layer.id, "line-opacity", opacity);
            } else if (layer.type === "symbol") {
              map.setLayoutProperty(layer.id, "visibility", "visible").setPaintProperty(layer.id, "text-opacity", opacity).setPaintProperty(layer.id, "icon-opacity", opacity);
            }
          } else {
            if (layer.type === "line") {
              map.setLayoutProperty(layer.id, "visibility", "visible");
            } else if (layer.type === "symbol") {
              map.setLayoutProperty(layer.id, "visibility", "visible");
            }
          }
        } else {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });
    };
    if (map) {
      setRoadsAndLabels();
    }
  }, [mapStyle, opacity, visible]);
  return null;
};
RoadsAndLabels.propTypes = propTypes;
RoadsAndLabels.defaultProps = defaultProps;
var _default = RoadsAndLabels;
exports["default"] = _default;