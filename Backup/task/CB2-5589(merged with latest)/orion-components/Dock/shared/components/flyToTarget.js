"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _jquery = _interopRequireDefault(require("jquery"));
// cSpell:ignore unproject

var flyToTarget = function flyToTarget(entityGeo, map, appState) {
  // this.mouseEnter(this.state.x, this.state.y, entityGeo);

  // if ($(window).width() < 1023) this.props.showListPanel();

  var origCoords = entityGeo.coordinates;
  var offsetCoords;
  switch (entityGeo.type) {
    case "Point":
      {
        // Account for  entity profile being open
        var pointVal = map.project(entityGeo.coordinates);
        pointVal = {
          x: pointVal.x - 360,
          y: pointVal.y
        };
        offsetCoords = map.unproject(pointVal);
        break;
      }
    case "LineString":
      {
        var _context;
        // Get Line Center
        var lineVal = (0, _reduce["default"])(_context = entityGeo.coordinates).call(_context, function (x, y) {
          return [x[0] + y[0] / entityGeo.coordinates.length, x[1] + y[1] / entityGeo.coordinates.length];
        }, [0, 0]);
        origCoords = lineVal;
        lineVal = map.project(lineVal);
        lineVal = {
          x: lineVal.x - 360,
          y: lineVal.y
        };
        offsetCoords = map.unproject(lineVal);
        break;
      }
    case "Polygon":
      {
        // Get Polygon center
        var a = 0;
        var b = 0;
        var c = 0;
        var length = entityGeo.coordinates[0].length;
        var x = function x(i) {
          return entityGeo.coordinates[0][i % length][0];
        };
        var y = function y(i) {
          return entityGeo.coordinates[0][i % length][1];
        };
        for (var i = 0; i < entityGeo.coordinates[0].length; i++) {
          var m = x(i) * y(i + 1) - x(i + 1) * y(i);
          a += m;
          b += (x(i) + x(i + 1)) * m;
          c += (y(i) + y(i + 1)) * m;
        }
        var n = 3 * a;
        var polyCenter = [b / n, c / n];
        origCoords = polyCenter;
        var polyVal = map.project(polyCenter);
        polyVal = {
          x: polyVal.x - 360,
          y: polyVal.y
        };
        offsetCoords = map.unproject(polyVal);
        break;
      }
    default:
      break;
  }
  var currentZoom = map.getZoom();
  appState.isOpen && appState.isListPanelOpen && (0, _jquery["default"])(window).width() > 1023 ?
  // only zoom in tight if the target is a point or track
  entityGeo.type === "Point" ? map.flyTo({
    center: currentZoom > 11 ? offsetCoords : /*tweak for entity profile offset*/[origCoords[0] - 0.1, origCoords[1]],
    zoom: currentZoom > 11 ? currentZoom : 11,
    curve: Math.pow(6, 0.25)
  }) : map.flyTo({
    center: offsetCoords,
    zoom: currentZoom,
    curve: Math.pow(6, 0.25)
  }) : entityGeo.type === "Point" ? map.flyTo({
    center: origCoords,
    zoom: currentZoom > 11 ? currentZoom : 11,
    curve: Math.pow(6, 0.25)
  }) : map.flyTo({
    center: origCoords,
    zoom: currentZoom,
    curve: Math.pow(6, 0.25)
  });
};
var _default = flyToTarget;
exports["default"] = _default;