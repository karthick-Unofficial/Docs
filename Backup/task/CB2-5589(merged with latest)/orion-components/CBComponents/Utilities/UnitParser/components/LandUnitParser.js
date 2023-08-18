"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _isInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-integer"));
var _react = require("react");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _convertUnits = _interopRequireDefault(require("convert-units"));
var parse = function parse(unit) {
  var output = unit;
  switch (unit) {
    case "kph":
      output = "km/h";
      break;
    case "km/h":
      output = "kph";
      break;
    case "mph":
      output = "m/h";
      break;
    case "m/h":
      output = "mph";
      break;
    default:
      break;
  }
  return output;
};
var excludeUnits = function excludeUnits(system) {
  var _context, _context2, _context3, _context4, _context5;
  var exclusion = system === "imperial" ? "metric" : "imperial";
  var lengths = (0, _map["default"])(_context = (0, _filter["default"])(_context2 = (0, _convertUnits["default"])().list("length")).call(_context2, function (unit) {
    return unit.system === exclusion;
  })).call(_context, function (unit) {
    return unit.abbr;
  });
  var speeds = (0, _map["default"])(_context3 = (0, _filter["default"])(_context4 = (0, _convertUnits["default"])().list("speed")).call(_context4, function (unit) {
    return unit.system === exclusion;
  })).call(_context3, function (unit) {
    return unit.abbr;
  });
  return (0, _concat["default"])(_context5 = []).call(_context5, (0, _toConsumableArray2["default"])(speeds), (0, _toConsumableArray2["default"])(lengths), ["knot", "m/s", "ft/s", "yd", "ft-us", "cm", "mm"]);
};
var propTypes = {
  sourceUnit: _propTypes["default"].oneOf(["kph", "mph", "m", "km", "ft", "mi"]),
  targetSystem: _propTypes["default"].string.isRequired,
  value: _propTypes["default"].number.isRequired
};
var LandUnitParser = function LandUnitParser(_ref) {
  var sourceUnit = _ref.sourceUnit,
    targetSystem = _ref.targetSystem,
    value = _ref.value;
  var toBest = function toBest(source, target, value) {
    var newUnit = (0, _convertUnits["default"])(value).from(source).to(target);
    return (0, _convertUnits["default"])(newUnit).from(target).toBest({
      exclude: excludeUnits(targetSystem)
    });
  };
  var output = (0, _convertUnits["default"])(value).from(parse(sourceUnit)).toBest({
    exclude: excludeUnits(targetSystem)
  });
  switch (targetSystem) {
    case "imperial":
      switch (sourceUnit) {
        case "kph":
          output = {
            val: (0, _convertUnits["default"])(value).from("km/h").to("m/h"),
            unit: "m/h"
          };
          break;
        case "m":
        case "km":
          output = toBest(sourceUnit, "ft", value);
          break;
        default:
          break;
      }
      break;
    case "metric":
      switch (sourceUnit) {
        case "mph":
          output = {
            val: (0, _convertUnits["default"])(value).from("m/h").to("km/h"),
            unit: "km/h"
          };
          break;
        case "mi":
        case "ft":
          output = toBest(sourceUnit, "m", value);
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  if (output) {
    var _context6;
    var _output = output,
      val = _output.val,
      unit = _output.unit;
    return (0, _concat["default"])(_context6 = "".concat((0, _isInteger["default"])(val) ? val : val.toFixed(1), " ")).call(_context6, parse(unit));
  } else {
    return value;
  }
};
LandUnitParser.propTypes = propTypes;
var _default = /*#__PURE__*/(0, _react.memo)(LandUnitParser);
exports["default"] = _default;