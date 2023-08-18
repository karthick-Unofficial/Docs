(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./DistanceTool/DistanceToolContainer", "./DrawingTool/DrawingTool"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./DistanceTool/DistanceToolContainer"), require("./DrawingTool/DrawingTool"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.DistanceToolContainer, global.DrawingTool);
    global.index = mod.exports;
  }
})(this, function (exports, _DistanceToolContainer, _DrawingTool) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "DistanceTool", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_DistanceToolContainer).default;
    }
  });
  Object.defineProperty(exports, "DrawingTool", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_DrawingTool).default;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});