"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _parseFloat2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-float"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _convertUnits = _interopRequireDefault(require("convert-units"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _CBComponents = require("orion-components/CBComponents");
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  globalState: _propTypes["default"].object.isRequired,
  updateGlobalSettings: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var useStyles = (0, _styles.makeStyles)({
  disabled: {
    color: "#fff!important",
    opacity: "0.3"
  }
});
var SpotlightProximity = function SpotlightProximity(_ref) {
  var globalState = _ref.globalState,
    updateGlobalSettings = _ref.updateGlobalSettings,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var classes = useStyles();
  var unitsOfMeasurement = globalState.unitsOfMeasurement,
    spotlightProximity = globalState.spotlightProximity;
  var landUnitSystem = unitsOfMeasurement.landUnitSystem;
  var outputUnit = landUnitSystem === "metric" ? "km" : "mi";
  var initialProximity = spotlightProximity ? (0, _parseFloat2["default"])((0, _convertUnits["default"])(spotlightProximity.value).from(spotlightProximity.unit).to(outputUnit).toFixed(3)) : 0.3;
  var _useState = (0, _react.useState)(initialProximity),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    proximity = _useState2[0],
    setProximity = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    modified = _useState6[0],
    setModified = _useState6[1];
  var handleUpdate = function handleUpdate(e) {
    var value = e.target.value;
    setProximity(e.target.value);
    var decimals = value.split(".")[1];
    if (value.toString() !== spotlightProximity.value.toString()) {
      setModified(true);
    } else {
      setModified(false);
    }
    if (isNaN(value) || Number(value) === 0) {
      setError("global.sharedComponents.optionsDrawer.spotlightProx.errorText.invalidProx");
    } else if (decimals && decimals.length > 3) {
      setError("global.sharedComponents.optionsDrawer.spotlightProx.errorText.limitedValue");
    } else {
      setError(false);
    }
  };
  var handleClear = function handleClear() {
    setProximity(initialProximity);
    setError(false);
    setModified(false);
  };
  var handleSave = function handleSave() {
    dispatch(updateGlobalSettings(_objectSpread(_objectSpread({}, globalState), {}, {
      spotlightProximity: {
        value: Number(proximity),
        unit: outputUnit
      }
    })));
    setModified(false);
  };
  return /*#__PURE__*/_react["default"].createElement("section", null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "subtitle1"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.optionsDrawer.spotlightProx.title"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    label: (0, _i18n.getTranslation)("global.sharedComponents.optionsDrawer.spotlightProx.defaultProx"),
    value: proximity,
    handleChange: handleUpdate,
    dir: dir,
    error: !!error,
    disableFocusError: true,
    inputLabelStyle: {
      fontSize: 14
    },
    endAdornment: outputUnit == "km" ? (0, _i18n.getTranslation)("global.sharedComponents.optionsDrawer.spotlightProx.km") : (0, _i18n.getTranslation)("global.sharedComponents.optionsDrawer.spotlightProx.mi"),
    endAdornmentStyles: {},
    formControlStyles: {
      margin: 0
    },
    helperText: !!error && (0, _i18n.getTranslation)(error),
    inputStyles: {
      marginRight: 0
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleSave,
    classes: {
      disabled: classes.disabled
    },
    color: "primary",
    disabled: !proximity || !modified || !!error,
    sx: {
      width: "48px",
      height: "48px",
      padding: "12px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Done, null)), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleClear,
    classes: {
      disabled: classes.disabled
    },
    disabled: !modified,
    sx: {
      width: "48px",
      height: "48px",
      padding: "12px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Clear, null))));
};
SpotlightProximity.propTypes = propTypes;
var _default = /*#__PURE__*/(0, _react.memo)(SpotlightProximity);
exports["default"] = _default;