"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _parseFloat2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-float"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _react = require("react");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _mtGeo = _interopRequireDefault(require("mt-geo"));
var propTypes = {
  targetUnit: _propTypes["default"].string.isRequired,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number, _propTypes["default"].array, _propTypes["default"].shape({
    x: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
    y: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired
  }), _propTypes["default"].shape({
    lon: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
    lat: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired
  }), _propTypes["default"].shape({
    lng: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
    lat: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired
  })]).isRequired,
  decimalPrecision: _propTypes["default"].number.isRequired
};
var CoordinateParser = function CoordinateParser(_ref) {
  var targetUnit = _ref.targetUnit,
    value = _ref.value,
    decimalPrecision = _ref.decimalPrecision;
  var getKeys = function getKeys(object) {
    var _context, _context2, _context3;
    if ((0, _isArray["default"])(object)) {
      return {
        lngKey: 0,
        latKey: 0
      };
    } else if ((0, _includes["default"])(_context = (0, _keys["default"])(value)).call(_context, "x")) {
      return {
        lngKey: "x",
        latKey: "y"
      };
    } else if ((0, _includes["default"])(_context2 = (0, _keys["default"])(value)).call(_context2, "lng")) {
      return {
        lngKey: "lng",
        latKey: "lat"
      };
    } else if ((0, _includes["default"])(_context3 = (0, _keys["default"])(value)).call(_context3, "lon")) {
      return {
        lngKey: "lon",
        latKey: "lat"
      };
    }
  };
  var output = value;
  if (targetUnit === "decimal-degrees") {
    switch ((0, _typeof2["default"])(value)) {
      case "string":
        output = (0, _parseFloat2["default"])(value).toFixed(decimalPrecision);
        break;
      case "number":
        output = value.toFixed(decimalPrecision);
        break;
      case "object":
        {
          var _context4;
          var _getKeys = getKeys(value),
            lngKey = _getKeys.lngKey,
            latKey = _getKeys.latKey;
          output = (0, _concat["default"])(_context4 = "".concat((0, _parseFloat2["default"])(value[latKey]).toFixed(decimalPrecision), "9\xB0, ")).call(_context4, (0, _parseFloat2["default"])(value[lngKey]).toFixed(decimalPrecision), "9\xB0");
        }
        break;
      default:
        break;
    }
  } else {
    var format = targetUnit === "degrees-min-sec" ? "dms" : "dm";
    switch ((0, _typeof2["default"])(value)) {
      case "string":
        output = _mtGeo["default"].toDMS((0, _parseFloat2["default"])(value));
        break;
      case "number":
        output = _mtGeo["default"].toDMS(value);
        break;
      case "object":
        {
          var _context5;
          var _getKeys2 = getKeys(value),
            _lngKey = _getKeys2.lngKey,
            _latKey = _getKeys2.latKey;
          output = (0, _concat["default"])(_context5 = "".concat(_mtGeo["default"].toLat(value[_latKey], format), ", ")).call(_context5, _mtGeo["default"].toLon(value[_lngKey], format));
        }
        break;
      default:
        break;
    }
  }
  return output;
};
CoordinateParser.propTypes = propTypes;
var _default = /*#__PURE__*/(0, _react.memo)(CoordinateParser);
exports["default"] = _default;