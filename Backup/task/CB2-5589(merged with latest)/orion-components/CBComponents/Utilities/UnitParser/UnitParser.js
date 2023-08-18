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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CoordinateParser = _interopRequireDefault(require("./components/CoordinateParser"));
var _LandUnitParser = _interopRequireDefault(require("./components/LandUnitParser"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  sourceUnit: _propTypes["default"].string.isRequired,
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
  decimalPrecision: _propTypes["default"].number
};
var UnitParser = function UnitParser(_ref) {
  var _context, _context2;
  var sourceUnit = _ref.sourceUnit,
    value = _ref.value,
    _ref$decimalPrecision = _ref.decimalPrecision,
    decimalPrecision = _ref$decimalPrecision === void 0 ? 5 : _ref$decimalPrecision;
  var unitsOfMeasurement = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.unitsOfMeasurement;
  });
  var coordinateSystem = unitsOfMeasurement.coordinateSystem,
    landUnitSystem = unitsOfMeasurement.landUnitSystem;
  switch (sourceUnit) {
    case "kn":
    case "nm":
      return (0, _concat["default"])(_context = "".concat(value, " ")).call(_context, sourceUnit);
    case "°":
      return (0, _concat["default"])(_context2 = "".concat(value)).call(_context2, sourceUnit);
    case "decimal-degrees":
      return /*#__PURE__*/_react["default"].createElement(_CoordinateParser["default"], {
        targetUnit: coordinateSystem,
        value: value,
        decimalPrecision: decimalPrecision
      });
    case "kph":
    case "mph":
    case "m":
    case "km":
    case "ft":
    case "mi":
      return /*#__PURE__*/_react["default"].createElement(_LandUnitParser["default"], {
        sourceUnit: sourceUnit,
        targetSystem: landUnitSystem,
        value: Number(value)
      });
    default:
      return value;
  }
};
UnitParser.propTypes = propTypes;
var _default = /*#__PURE__*/(0, _react.memo)(UnitParser);
exports["default"] = _default;