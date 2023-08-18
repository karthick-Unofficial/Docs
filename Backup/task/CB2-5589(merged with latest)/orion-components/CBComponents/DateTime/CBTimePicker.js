"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _xDatePickers = require("@mui/x-date-pickers");
var _moment = _interopRequireDefault(require("@date-io/moment"));
var _hijri = _interopRequireDefault(require("@date-io/hijri"));
var _moment2 = _interopRequireDefault(require("moment"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _DateTimePickerActionBar = _interopRequireDefault(require("./CustomComponents/DateTimePicker/DateTimePickerActionBar"));
var _reactRedux = require("react-redux");
var _i18n = require("orion-components/i18n");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var darkThemeSx = {
  "& .MuiPickersDay-dayWithMargin": {
    color: "#fff",
    backgroundColor: "#2C2C2E"
  },
  "& .MuiCalendarPicker-root": {
    color: "#fff",
    backgroundColor: "#2C2C2E"
  },
  "& .MuiTabs-flexContainer": {
    backgroundColor: "#2C2C2E"
  },
  "& .MuiTabs-indicator": {
    border: "2px solid #88134A",
    backgroundColor: "#88134A"
  }
};
var propTypes = {
  id: _propTypes["default"].string,
  label: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]),
  value: _propTypes["default"].object,
  handleChange: _propTypes["default"].func.isRequired,
  format: _propTypes["default"].string,
  minDate: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  disabled: _propTypes["default"].bool,
  margin: _propTypes["default"].string,
  dir: _propTypes["default"].string,
  locale: _propTypes["default"].string,
  theme: _propTypes["default"].string
};
var defaultProps = {
  id: "time-picker",
  label: "",
  format: "time_12-hour",
  value: null,
  minDate: "1900-01-01",
  disabled: false,
  margin: "normal",
  locale: "en",
  theme: "dark",
  clearLabel: true,
  okLabel: true,
  cancelLabel: true
};
var CBTimePicker = function CBTimePicker(_ref) {
  var _context;
  var id = _ref.id,
    label = _ref.label,
    value = _ref.value,
    handleChange = _ref.handleChange,
    format = _ref.format,
    minDate = _ref.minDate,
    disabled = _ref.disabled,
    margin = _ref.margin,
    dir = _ref.dir,
    okLabel = _ref.okLabel,
    cancelLabel = _ref.cancelLabel,
    clearLabel = _ref.clearLabel,
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
  var formatTime = function formatTime(date, invalidLabel, format) {
    return date === null ? "" : format && date ? _clientAppCore.timeConversion.convertToUserTime(date, format, localeOverride) : invalidLabel;
  };
  _moment2["default"].locale(localeOverride);
  var twelveHourFormat = !(0, _includes["default"])(format).call(format, "24-hour") || (0, _includes["default"])(_context = format.toLowerCase()).call(_context, "hh:mm a");
  var actions = [clearLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.clear") : null, cancelLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.cancel") : null, okLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.ok") : null];
  return /*#__PURE__*/_react["default"].createElement(_xDatePickers.LocalizationProvider, {
    dateAdapter: locale === "ar" ? _hijri["default"] : _moment["default"],
    localeText: localeOverride,
    adapterLocale: localeOverride
  }, /*#__PURE__*/_react["default"].createElement(_xDatePickers.MobileTimePicker, {
    id: id,
    label: label,
    value: (0, _moment2["default"])(value),
    onChange: handleChange,
    showToolbar: true,
    closeOnSelect: false,
    minDate: (0, _moment2["default"])(minDate),
    disabled: disabled,
    ampm: twelveHourFormat // cSpell:ignore ampm
    ,
    renderInput: function renderInput(params) {
      params.inputProps.value = formatTime(value, "Invalid Time", format);
      return /*#__PURE__*/_react["default"].createElement(_material.TextField, (0, _extends2["default"])({}, params, {
        fullWidth: true,
        margin: margin,
        error: value === null ? false : params.error,
        variant: "standard",
        InputLabelProps: {
          style: styles.inputLabelProps
        }
      }));
    },
    DialogProps: {
      sx: theme === "dark" ? darkThemeSx : {},
      style: {
        direction: "ltr"
      },
      className: theme === "dark" ? "cbDateTimePicker" : "lightcbDateTimePicker"
    },
    toolbarTitle: /*#__PURE__*/_react["default"].createElement("div", null, "\xA0"),
    toolbarPlaceholder: null,
    componentsProps: {
      actionBar: {
        actions: actions
      }
    },
    components: {
      ActionBar: _DateTimePickerActionBar["default"]
    }
  }));
};
CBTimePicker.propTypes = propTypes;
CBTimePicker.defaultProps = defaultProps;
var _default = CBTimePicker;
exports["default"] = _default;