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
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _xDatePickers = require("@mui/x-date-pickers");
var _moment = _interopRequireDefault(require("@date-io/moment"));
var _moment2 = _interopRequireDefault(require("moment"));
require("moment/locale/ar");
var _material = require("@mui/material");
var _DatePickerActionBar = _interopRequireDefault(require("./CustomComponents/DatePicker/DatePickerActionBar"));
var _reactRedux = require("react-redux");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var darkThemeSx = {
  "& .MuiPickersDay-dayWithMargin": {
    color: "#fff",
    backgroundColor: "#2C2C2E"
  },
  "& .MuiCalendarPicker-root": {
    color: "#fff",
    backgroundColor: "#2C2C2E"
  },
  "& .MuiTypography-h4": {
    fontSize: "1.5rem"
  },
  "& .MuiPickersToolbar-penIconButton": {
    display: "none !important"
  }
};
var lightThemeSx = {
  "& .MuiTypography-h4": {
    fontSize: "1.5rem"
  },
  "& .MuiPickersToolbar-penIconButton": {
    display: "none !important"
  }
};
var propTypes = {
  id: _propTypes["default"].string,
  label: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  handleChange: _propTypes["default"].func.isRequired,
  format: _propTypes["default"].string,
  minDate: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  clearable: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  margin: _propTypes["default"].string,
  dir: _propTypes["default"].string,
  locale: _propTypes["default"].string,
  theme: _propTypes["default"].string
};
var defaultProps = {
  id: "date-picker",
  label: "",
  format: "MM/DD/YYYY",
  value: null,
  minDate: "1900-01-01",
  clearable: true,
  disabled: false,
  margin: "normal",
  dir: "ltr",
  locale: "en",
  theme: "dark",
  clearLabel: true,
  okLabel: true,
  cancelLabel: true
};
var CBDatePicker = function CBDatePicker(_ref) {
  var id = _ref.id,
    label = _ref.label,
    fullWidth = _ref.fullWidth,
    value = _ref.value,
    handleChange = _ref.handleChange,
    minDate = _ref.minDate,
    clearable = _ref.clearable,
    disabled = _ref.disabled,
    margin = _ref.margin,
    options = _ref.options,
    dir = _ref.dir,
    okLabel = _ref.okLabel,
    cancelLabel = _ref.cancelLabel,
    clearLabel = _ref.clearLabel,
    autoOk = _ref.autoOk,
    theme = _ref.theme;
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n && state.i18n.locale;
  });
  var localeOverride = locale === "ar_kw" ? "en" : locale;
  var styles = {
    inputLabelProps: _objectSpread(_objectSpread({}, dir === "ltr" && {
      transformOrigin: "top left"
    }), dir === "rtl" && {
      transformOrigin: "top right",
      left: "unset",
      textAlign: "right"
    })
  };
  _moment2["default"].locale(localeOverride); // supports date picker localization like calendar date translation and toolbar

  var tempDate = null;
  var _useState = (0, _react.useState)(value),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    dateTime = _useState2[0],
    setDateTime = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    ok = _useState4[0],
    setOk = _useState4[1];
  var resetDateTime = function resetDateTime() {
    if (tempDate === null && dateTime === null) {
      setDateTime(null);
    } else {
      setDateTime(dateTime);
    }
  };
  var setActualDate = function setActualDate() {
    setOk(!ok);
    tempDate = dateTime;
    handleChange(dateTime);
  };
  var actions = [clearable && clearLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.clear") : null, cancelLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.cancel") : null, okLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.ok") : null];
  return /*#__PURE__*/_react["default"].createElement(_xDatePickers.LocalizationProvider, {
    dateAdapter: _moment["default"],
    localeText: localeOverride,
    adapterLocale: localeOverride
  }, /*#__PURE__*/_react["default"].createElement(_xDatePickers.MobileDatePicker, (0, _extends2["default"])({}, options, {
    id: id,
    label: label,
    onChange: function onChange(val) {
      setDateTime(val);
      handleChange(val);
    },
    value: dateTime,
    onOpen: function onOpen() {
      if (value === null && dateTime === null) {
        setDateTime(new Date());
      } else {
        setDateTime((0, _moment2["default"])(dateTime));
      }
    },
    minDate: (0, _moment2["default"])(minDate),
    disabled: disabled,
    DialogProps: {
      style: {
        direction: "ltr"
      },
      className: "cbDateTimePicker",
      sx: theme === "dark" ? darkThemeSx : lightThemeSx
    },
    dayOfWeekFormatter: function dayOfWeekFormatter(val) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          color: theme === "dark" ? "#fff" : "black"
        }
      }, val);
    },
    toolbarTitle: /*#__PURE__*/_react["default"].createElement("div", null, "\xA0"),
    closeOnSelect: autoOk,
    showToolbar: true,
    componentsProps: {
      actionBar: {
        actions: actions,
        resetDateTime: resetDateTime,
        submit: setActualDate
      }
    },
    components: {
      ActionBar: _DatePickerActionBar["default"]
    },
    renderInput: function renderInput(params) {
      return /*#__PURE__*/_react["default"].createElement(_material.TextField, (0, _extends2["default"])({}, params, {
        variant: "standard",
        value: (0, _moment2["default"])(value).format("MM/D/YYYY"),
        fullWidth: fullWidth === undefined ? true : fullWidth,
        error: value === null ? false : params.error,
        margin: margin
        ////inputProps={InputProps}
        ,
        InputLabelProps: {
          style: styles.inputLabelProps
        }
      }));
    }
  })));
};
CBDatePicker.propTypes = propTypes;
CBDatePicker.defaultProps = defaultProps;
var _default = CBDatePicker;
exports["default"] = _default;