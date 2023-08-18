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
    global.actionTypes = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  // TODO: Both actions need better naming/name-spacing
  var SET_ALERTS_TAB = exports.SET_ALERTS_TAB = "SET_ALERTS_TAB";
  var TOGGLE_OPEN = exports.TOGGLE_OPEN = "TOGGLE_OPEN";
});