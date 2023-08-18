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
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _xDatePickers = require("@mui/x-date-pickers");
var _moment = _interopRequireDefault(require("@date-io/moment"));
var _moment2 = _interopRequireDefault(require("moment"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _DateTimePickerActionBar = _interopRequireDefault(require("./CustomComponents/DateTimePicker/DateTimePickerActionBar"));
var _hijri = _interopRequireDefault(require("@date-io/hijri"));
var _AccessTime = _interopRequireDefault(require("@mui/icons-material/AccessTime"));
var _DateRange = _interopRequireDefault(require("@mui/icons-material/DateRange"));
var _reactRedux = require("react-redux");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  id: _propTypes["default"].string,
  label: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]),
  value: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].number]),
  handleChange: _propTypes["default"].func.isRequired,
  format: _propTypes["default"].string,
  minDate: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  disabled: _propTypes["default"].bool,
  margin: _propTypes["default"].string,
  dir: _propTypes["default"].string,
  locale: _propTypes["default"].string,
  theme: _propTypes["default"].string
};
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
    border: "1px solid #1688BD",
    backgroundColor: "#1688BD"
  },
  "& .MuiTypography-subtitle1": {
    fontSize: "1.5rem"
  },
  "& .MuiTypography-h3": {
    fontSize: "2rem"
  },
  "& .MuiTypography-h4": {
    fontSize: "1rem"
  },
  "& .MuiPickersToolbar-penIconButton": {
    display: "none !important"
  }
};
var lightThemeSx = {
  "& .MuiTypography-subtitle1": {
    fontSize: "1.5rem"
  },
  "& .MuiTypography-h3": {
    fontSize: "2rem"
  },
  "& .MuiTypography-h4": {
    fontSize: "1rem"
  },
  "& .MuiPickersToolbar-penIconButton": {
    display: "none !important"
  },
  "& .MuiTabs-indicator": {
    border: "1px solid #F50057",
    backgroundColor: "#F50057"
  }
};
var defaultProps = {
  id: "date-time-picker",
  label: "",
  format: "full_12-hour",
  value: null,
  minDate: "1900-01-01",
  maxDate: "2100-01-01",
  disabled: false,
  margin: "normal",
  dir: "ltr",
  locale: "en",
  theme: "dark",
  clearLabel: true,
  okLabel: true,
  cancelLabel: true
};
var CBDateTimePicker = function CBDateTimePicker(_ref) {
  var _context;
  var id = _ref.id,
    label = _ref.label,
    value = _ref.value,
    handleChange = _ref.handleChange,
    format = _ref.format,
    minDate = _ref.minDate,
    maxDate = _ref.maxDate,
    disabled = _ref.disabled,
    margin = _ref.margin,
    dir = _ref.dir,
    okLabel = _ref.okLabel,
    cancelLabel = _ref.cancelLabel,
    clearLabel = _ref.clearLabel,
    clearable = _ref.clearable,
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
  var formatDateTime = function formatDateTime(date, invalidLabel, format) {
    return date === null ? "" : format && date ? _clientAppCore.timeConversion.convertToUserTime(date, format, localeOverride) : invalidLabel;
  };
  var clearableValue;
  if (clearable === undefined) {
    clearableValue = true;
  } else {
    clearableValue = clearable;
  }
  _moment2["default"].locale(localeOverride); // supports date picker localization like calendar date translation and toolbar
  var twelveHourFormat = !(0, _includes["default"])(format).call(format, "24-hour") || (0, _includes["default"])(_context = format.toLowerCase()).call(_context, "hh:mm a");
  var tempDate = null;
  var _useState = (0, _react.useState)("date"),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    tab = _useState2[0],
    setTab = _useState2[1];
  var _useState3 = (0, _react.useState)(value),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    dateTime = _useState4[0],
    setDateTime = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    ok = _useState6[0],
    setOk = _useState6[1];
  (0, _react.useEffect)(function () {
    setDateTime(value);
  }, [value]);
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
  var actions = [clearableValue && clearLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.clear") : null, cancelLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.cancel") : null, okLabel ? (0, _i18n.getTranslation)("global.CBComponents.DateTime.ok") : null];
  return /*#__PURE__*/_react["default"].createElement(_xDatePickers.LocalizationProvider, {
    dateAdapter: locale === "ar" ? _hijri["default"] : _moment["default"],
    localeText: localeOverride,
    adapterLocale: localeOverride
  }, /*#__PURE__*/_react["default"].createElement(_xDatePickers.MobileDateTimePicker, {
    id: id || "date-time-picker",
    label: label,
    closeOnSelect: false,
    value: dateTime,
    onChange: function onChange(val) {
      setDateTime(val);
      handleChange(val);
    },
    onOpen: function onOpen() {
      if (value === null && dateTime === null) {
        setDateTime(new Date());
      } else {
        setDateTime((0, _moment2["default"])(dateTime));
      }
    },
    minDate: (0, _moment2["default"])(minDate),
    showToolbar: true,
    maxDate: (0, _moment2["default"])(maxDate),
    disabled: disabled,
    dayOfWeekFormatter: function dayOfWeekFormatter(val) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          color: theme === "dark" ? "#fff" : "black"
        }
      }, val);
    },
    DialogProps: {
      disableEnforceFocus: true,
      sx: theme === "dark" ? darkThemeSx : lightThemeSx,
      style: {
        direction: "ltr"
      },
      className: theme === "dark" ? "cbDateTimePicker" : "lightcbDateTimePicker"
    },
    dateRangeIcon: /*#__PURE__*/_react["default"].createElement(_DateRange["default"], {
      style: {
        color: tab === "date" ? "#ACDAF5" : "#fff"
      },
      onClick: function onClick() {
        return setTab("date");
      }
    }),
    timeIcon: /*#__PURE__*/_react["default"].createElement(_AccessTime["default"], {
      style: {
        color: tab === "time" ? "#ACDAF5" : "#fff"
      },
      onClick: function onClick() {
        return setTab("time");
      }
    }),
    hideTabs: false,
    toolbarTitle: /*#__PURE__*/_react["default"].createElement("div", null),
    toolbarPlaceholder: null,
    componentsProps: {
      actionBar: {
        actions: actions,
        resetDateTime: resetDateTime,
        submit: setActualDate
      }
    },
    components: {
      ActionBar: _DateTimePickerActionBar["default"]
    },
    ampm: twelveHourFormat // cSpell:ignore ampm
    ,
    renderInput: function renderInput(params) {
      params.inputProps.value = formatDateTime(dateTime, "Invalid Date", format);
      return /*#__PURE__*/_react["default"].createElement(_material.TextField, (0, _extends2["default"])({}, params, {
        defaultValue: null,
        error: value === null ? false : params.error,
        fullWidth: true,
        margin: margin,
        variant: "standard",
        InputLabelProps: {
          style: styles.inputLabelProps
        }
      }));
    }
  }));
};
CBDateTimePicker.propTypes = propTypes;
CBDateTimePicker.defaultProps = defaultProps;
var _default = CBDateTimePicker;
exports["default"] = _default;