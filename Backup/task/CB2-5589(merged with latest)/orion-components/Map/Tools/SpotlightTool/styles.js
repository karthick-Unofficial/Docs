"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var styles = [{
  id: "gl-draw-polygon-stroke-active",
  type: "line",
  filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
  paint: {
    "line-color": ["case", ["has", "user_strokeColor"], ["get", "user_strokeColor"], "#35b7f3"],
    "line-width": 10
  }
}, {
  id: "highlight-active-points",
  type: "symbol",
  filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"]],
  paint: {
    "text-color": "#FFF",
    "text-halo-color": "#FFF",
    "text-halo-width": 1
  },
  layout: {
    "text-field": "|",
    "text-rotate": ["case", ["==", ["get", "user_movement"], "lng"], 0, 90]
  }
}];
var _default = styles;
exports["default"] = _default;