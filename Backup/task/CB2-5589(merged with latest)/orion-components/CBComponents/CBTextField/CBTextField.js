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
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  id: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
  handleChange: _propTypes["default"].func.isRequired,
  endAdornment: _propTypes["default"].node,
  required: _propTypes["default"].bool,
  error: _propTypes["default"].bool,
  helperText: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  type: _propTypes["default"].string,
  adornmentClick: _propTypes["default"].func,
  dir: _propTypes["default"].string,
  inputLabelStyle: _propTypes["default"].object,
  placeholder: _propTypes["default"].string,
  labelShrink: _propTypes["default"].string,
  endAdornmentStyles: _propTypes["default"].object,
  inputStyles: _propTypes["default"].object,
  disableFocusError: _propTypes["default"].bool,
  dottedInputUnderline: _propTypes["default"].bool
};
var defaultProps = {
  label: "",
  required: false,
  error: false,
  helperText: "",
  disabled: false,
  type: "text",
  adornmentClick: function adornmentClick() {}
};
var styles = {
  root: {
    width: "100%"
  },
  underline: {
    "&:before": {
      borderBottom: "1px solid rgb(181, 185, 190)!important"
    },
    "&:after": {
      borderBottom: "2px solid rgb(22, 136, 189)"
    }
  },
  dottedUnderline: {
    "&:before": {
      borderBottom: "1px solid rgb(181, 185, 190)!important"
    },
    "&:after": {
      borderBottom: "2px solid rgb(22, 136, 189)"
    },
    "&.MuiInput-underline.Mui-disabled:before": {
      borderBottomStyle: "dotted!important"
    }
  },
  formControl: {
    transform: "translate(14px, 24px) scale(1)"
  },
  shrink: {
    transform: "translate(14px, 1.5px) scale(0.75)"
  }
};
var CBTextField = function CBTextField(_ref) {
  var classes = _ref.classes,
    id = _ref.id,
    label = _ref.label,
    value = _ref.value,
    handleChange = _ref.handleChange,
    endAdornment = _ref.endAdornment,
    multiline = _ref.multiline,
    formControlStyles = _ref.formControlStyles,
    required = _ref.required,
    error = _ref.error,
    helperText = _ref.helperText,
    disabled = _ref.disabled,
    fullWidth = _ref.fullWidth,
    type = _ref.type,
    adornmentClick = _ref.adornmentClick,
    autoFocus = _ref.autoFocus,
    dir = _ref.dir,
    inputLabelStyle = _ref.inputLabelStyle,
    placeholder = _ref.placeholder,
    labelShrink = _ref.labelShrink,
    endAdornmentStyles = _ref.endAdornmentStyles,
    inputStyles = _ref.inputStyles,
    disableFocusError = _ref.disableFocusError,
    dottedInputUnderline = _ref.dottedInputUnderline;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    focus = _useState2[0],
    setFocus = _useState2[1];
  var styles = {
    withEA: _objectSpread(_objectSpread({}, dir === "rtl" && {
      marginLeft: "48px"
    }), dir === "ltr" && {
      marginRight: "48px"
    }),
    icon: _objectSpread(_objectSpread({
      position: "relative"
    }, dir === "rtl" && {
      right: -48
    }), dir === "rtl" && {
      right: 48
    }),
    inputLabel: _objectSpread(_objectSpread(_objectSpread({}, dir === "ltr" && {
      left: "-15px"
    }), dir === "rtl" && {
      left: "unset",
      transformOrigin: "top right",
      right: "15px"
    }), inputLabelStyle),
    formHelperText: _objectSpread(_objectSpread({
      overflowWrap: "break-word"
    }, dir === "rtl" && {
      textAlign: "right"
    }), {}, {
      margin: "3px 0 0 0"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.FormControl, {
    required: required,
    className: classes.root,
    margin: "normal",
    style: formControlStyles,
    error: disableFocusError ? error : !focus && error,
    disabled: disabled,
    fullWidth: fullWidth,
    onFocus: function onFocus() {
      return setFocus(true);
    },
    onBlur: function onBlur() {
      return setFocus(false);
    }
  }, label && /*#__PURE__*/_react["default"].createElement(_material.InputLabel, {
    style: styles.inputLabel,
    classes: {
      formControl: classes.formControl,
      shrink: classes.shrink
    },
    shrink: labelShrink
  }, label), /*#__PURE__*/_react["default"].createElement(_material.Input, {
    id: id,
    type: type || "text",
    style: inputStyles || (endAdornment ? styles.withEA : {}),
    fullWidth: fullWidth,
    multiline: multiline,
    value: value,
    onChange: handleChange,
    endAdornment: endAdornment ? /*#__PURE__*/_react["default"].createElement(_material.InputAdornment, {
      style: endAdornmentStyles || styles.icon,
      position: dir && dir == "rtl" ? "start" : "end",
      onClick: adornmentClick
    }, endAdornment) : "",
    autoComplete: "off",
    autoFocus: autoFocus,
    classes: {
      underline: dottedInputUnderline ? classes.dottedUnderline : classes.underline
    },
    placeholder: placeholder
  }), helperText && /*#__PURE__*/_react["default"].createElement(_material.FormHelperText, {
    sx: styles.formHelperText
  }, helperText));
};
CBTextField.propTypes = propTypes;
CBTextField.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(CBTextField);
exports["default"] = _default;