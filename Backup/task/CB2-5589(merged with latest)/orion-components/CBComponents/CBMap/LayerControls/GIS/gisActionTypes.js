(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.gisActionTypes = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var GIS_SERVICES_RECEIVED = exports.GIS_SERVICES_RECEIVED = "GIS_SERVICES_RECEIVED";
  var CREATE_SERVICE_SUCCESS = exports.CREATE_SERVICE_SUCCESS = "CREATE_SERVICE_SUCCESS";
  var GIS_LAYERS_RECEIVED = exports.GIS_LAYERS_RECEIVED = "GIS_LAYERS_RECEIVED";
  var CREATE_SERVICE_FAILURE = exports.CREATE_SERVICE_FAILURE = "CREATE_SERVICE_FAILURE";
  var CREATE_SERVICE_REQUEST = exports.CREATE_SERVICE_REQUEST = "CREATE_SERVICE_REQUEST";
  var CREATE_SERVICE_RESET = exports.CREATE_SERVICE_RESET = "CREATE_SERVICE_RESET";
  var GIS_SERVICE_REMOVED = exports.GIS_SERVICE_REMOVED = "GIS_SERVICE_REMOVED";
  var GIS_SERVICE_RECEIVED = exports.GIS_SERVICE_RECEIVED = "GIS_SERVICE_RECEIVED";
});