"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _moment = _interopRequireDefault(require("moment"));
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _styles = require("@mui/styles");
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var useStyles = (0, _styles.makeStyles)({
  scrollPaper: {
    width: "75%",
    margin: "0px auto"
  }
});
var parseDate = function parseDate(date) {
  return (0, _moment["default"])(date).set({
    hour: 0,
    minute: 0,
    second: 0
  })._d;
};
var SetScheduleDialog = function SetScheduleDialog(_ref) {
  var _context3;
  var closeDialog = _ref.closeDialog,
    isOpen = _ref.isOpen,
    dir = _ref.dir,
    editing = _ref.editing,
    defaultPriority = _ref.defaultPriority,
    priorityScheduleRow = _ref.priorityScheduleRow,
    facilityId = _ref.facilityId;
  var classes = useStyles();
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var endOfYear = new Date();
  endOfYear.setMonth(11);
  endOfYear.setDate(31);
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    dialogError = _useState2[0],
    setDialogError = _useState2[1];
  var _useState3 = (0, _react.useState)(true),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    conditionIndefiniteValue = _useState4[0],
    setConditionIndefiniteValue = _useState4[1];
  var _useState5 = (0, _react.useState)(true),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    conditionAnyTimeValue = _useState6[0],
    setConditionAnyTimeValue = _useState6[1];
  var _useState7 = (0, _react.useState)(parseDate(new Date())),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    startDateValue = _useState8[0],
    setStartDateValue = _useState8[1];
  var _useState9 = (0, _react.useState)(endOfYear),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    endDateValue = _useState10[0],
    setEndDateValue = _useState10[1];
  var _useState11 = (0, _react.useState)([0, 1, 2, 3, 4, 5, 6]),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    weekdaysValue = _useState12[0],
    setWeekdaysValue = _useState12[1];
  var _useState13 = (0, _react.useState)(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM"),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    beforeTimeValue = _useState14[0],
    setBeforeTimeValue = _useState14[1];
  var _useState15 = (0, _react.useState)(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM"),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    afterTimeValue = _useState16[0],
    setAfterTimeValue = _useState16[1];
  var _useState17 = (0, _react.useState)(false),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    mounted = _useState18[0],
    setMounted = _useState18[1];
  (0, _react.useEffect)(function () {
    if (editing) {
      if (priorityScheduleRow) {
        var schedule = priorityScheduleRow.schedule;
        if (schedule) {
          if (hasOwn(schedule, "indefinite")) {
            setConditionIndefiniteValue(schedule.indefinite);
          }
          if (schedule.startDate) {
            setStartDateValue(schedule.startDate);
          }
          if (schedule.endDate) {
            setEndDateValue(schedule.endDate);
          }
          setWeekdaysValue(schedule.weekdays);
          setConditionAnyTimeValue(schedule.anyTimeOfDay);
          var timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
          if (!schedule.anyTimeOfDay) {
            if (schedule.startTime) {
              setBeforeTimeValue(_momentTimezone["default"].utc(schedule.startTime, "h:mm A").tz(_momentTimezone["default"].tz.guess()).format(timeFormat));
            }
            if (schedule.endTime) {
              setAfterTimeValue(_momentTimezone["default"].utc(schedule.endTime, "h:mm A").tz(_momentTimezone["default"].tz.guess()).format(timeFormat));
            }
          }
        }
      }
    }
  }, [editing, priorityScheduleRow]);
  var handleConditionDialogClose = function handleConditionDialogClose() {
    var endOfYear = new Date();
    endOfYear.setMonth(11);
    endOfYear.setDate(31);
    setConditionIndefiniteValue(true);
    setConditionAnyTimeValue(true);
    setStartDateValue(parseDate(new Date()));
    setEndDateValue(endOfYear);
    setBeforeTimeValue(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM");
    setAfterTimeValue(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM");
    setWeekdaysValue([0, 1, 2, 3, 4, 5, 6]);
    closeDialog();
    setDialogError("");
  };
  var checkIndefinite = function checkIndefinite(value) {
    setConditionIndefiniteValue(value === "indefinite" ? true : false);
  };
  var handleStartDateSelect = function handleStartDateSelect(date) {
    var value = _clientAppCore.timeConversion.convertToUserTime(date, "L");
    setStartDateValue(parseDate(value));
  };
  var handleEndDateSelect = function handleEndDateSelect(date) {
    var value = _clientAppCore.timeConversion.convertToUserTime(date, "L");
    setEndDateValue(parseDate(value));
  };
  var toggleWeekday = function toggleWeekday(value) {
    var newState = (0, _toConsumableArray2["default"])(weekdaysValue);
    if ((0, _includes["default"])(newState).call(newState, value)) {
      newState = (0, _filter["default"])(newState).call(newState, function (item) {
        return item !== value;
      });
    } else {
      var _context, _context2;
      newState = (0, _sort["default"])(_context = (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(newState), [value])).call(_context, function (a, b) {
        return a - b;
      });
    }
    setWeekdaysValue(newState);
  };
  var checkAnyTime = function checkAnyTime(value) {
    setConditionAnyTimeValue(value === "all-day" ? true : false);
  };
  var handleBeforeTimeChange = function handleBeforeTimeChange(newValue) {
    setBeforeTimeValue(newValue);
  };
  var handleAfterTimeChange = function handleAfterTimeChange(newValue) {
    setAfterTimeValue(newValue);
  };
  var handleSchedule = function handleSchedule() {
    var timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
    var beforeTime = _momentTimezone["default"].tz(beforeTimeValue, timeFormat, _momentTimezone["default"].tz.guess());
    var afterTime = _momentTimezone["default"].tz(afterTimeValue, timeFormat, _momentTimezone["default"].tz.guess());
    if (beforeTimeValue.charAt(0) === ":" || afterTimeValue.charAt(0) === ":") {
      setDialogError((0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.dialogError.validTimeValue"));
    } else if (!afterTime || !beforeTime) {
      // Check to see if user entered a valid time
      setDialogError((0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.dialogError.validTimeValue"));
    } else if (!conditionAnyTimeValue && afterTime._i === beforeTime._i) {
      //Check to see if times are different.
      setDialogError((0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.dialogError.startEndTimeDiff"));
    } else if (weekdaysValue.length === 1 && beforeTime.isAfter(afterTime)) {
      //Check to see if start time is before the end time value, if there is only 1 day selected.
      setDialogError((0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.dialogError.startBeforeEndTime"));
    } else if (!conditionIndefiniteValue && (0, _moment["default"])(startDateValue).unix() > (0, _moment["default"])(endDateValue).unix()) {
      setDialogError((0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.dialogError.fallAfterStart"));
    } else if (weekdaysValue.length === 0) {
      setDialogError((0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.dialogError.atLeastOneDay"));
    }
    //else if (
    //	weekdaysValue.length === 7 &&
    //	conditionAnyTimeValue &&
    //	conditionIndefiniteValue
    //) {
    //	// Your condition does nothing
    //	setDialogError(getTranslation("global.profiles.widgets.facilityCondition.setSchedule.dialogError.atLeastOneLimitingFactor"));
    //}
    else {
      var newCondition = {
        indefinite: conditionIndefiniteValue,
        anyTimeOfDay: conditionAnyTimeValue,
        startDate: conditionIndefiniteValue ? null : startDateValue,
        endDate: conditionIndefiniteValue ? null : endDateValue,
        weekdays: weekdaysValue,
        // -- not updating time format here because we want to store the times in a consistent format
        startTime: conditionAnyTimeValue ? null : beforeTime.tz("UTC").format("h:mm A"),
        endTime: conditionAnyTimeValue ? null : afterTime.tz("UTC").format("h:mm A")
      };
      if (editing) {
        //send update object to facility json
        var id = priorityScheduleRow.id;
        newCondition.id = id;
        var prioritySchedules = {
          priority: priorityScheduleRow.priority,
          schedule: newCondition
        };
        _clientAppCore.facilityService.updatePrioritySchedule(facilityId, prioritySchedules, id, function (err, response) {
          if (err) {
            console.log("ERROR:", err, response);
          }
        });
        handleConditionDialogClose();
      } else {
        //send new schedule object to facility json
        var _prioritySchedules = {
          priority: defaultPriority,
          schedule: newCondition
        };
        _clientAppCore.facilityService.createPrioritySchedule(facilityId, _prioritySchedules, function (err, response) {
          if (err) {
            console.log("ERROR:", err, response);
          }
        });
        handleConditionDialogClose();
      }
    }
  };

  // Enter to submit
  var _handleKeyDown = function _handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSchedule();
    }
  };
  (0, _react.useEffect)(function () {
    setMounted(true);
    return function () {
      document.removeEventListener("keydown", _handleKeyDown);
    };
  }, []);
  if (!mounted) {
    document.addEventListener("keydown", _handleKeyDown);
    setMounted(true);
  }
  var isMobile = window.matchMedia("(max-width: 600px)").matches;
  var buttonStyles = isMobile ? {
    fontSize: "13px"
  } : {};
  var datePickerStyles = {
    display: "inline-block",
    margin: "16px 6px"
  };
  var inputStyles = {
    fontSize: 11,
    backgroundColor: "rgb(31, 31, 33)",
    width: 90,
    height: 34,
    padding: "0 10px",
    letterSpacing: 1,
    fontFamily: "Roboto, sans-serif",
    display: "inline-block",
    position: "relative",
    cursor: "pointer"
  };
  var dialogStyles = {
    border: "none",
    maxWidth: "500px"
  };
  var overrides = {
    paperProps: _objectSpread({
      width: "100%",
      borderRadius: "2px"
    }, dialogStyles),
    dialogTitle: {
      padding: "24px 24px 20px",
      color: "rgb(255, 255, 255)",
      fontSize: "22px",
      lineHeight: "32px",
      fontWeight: 400,
      letterSpacing: "unset"
    },
    menuItem: {
      padding: "6px 24px",
      fontSize: "15px",
      height: "32px",
      letterSpacing: "unset",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)"
      }
    },
    dialogActions: _objectSpread({}, dir === "rtl" && {
      justifyContent: "flex-start !important"
    })
  };
  var dialogActions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "cancel-action-button",
    className: "themedButton",
    variant: "text",
    style: buttonStyles,
    onClick: handleConditionDialogClose
  }, (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "save-cancel-button",
    className: "themedButton",
    variant: "text",
    style: _objectSpread(_objectSpread({}, buttonStyles), {}, {
      margin: 0
    }),
    onClick: handleSchedule
  }, editing ? (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.update") : (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.save"))];
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    PaperProps: {
      sx: overrides.paperProps
    },
    open: isOpen,
    onClose: handleConditionDialogClose,
    classes: {
      scrollPaper: classes.scrollPaper
    },
    sx: {
      zIndex: "1200"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, {
    sx: overrides.dialogTitle
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.setSchedule.title"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "schedule-dialog-wrapper",
    style: {
      padding: "0px 24px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "schedule-dialog"
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    className: "condition-subheader"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.setSchedule.dateRange"
  })), /*#__PURE__*/_react["default"].createElement(_material.RadioGroup, {
    row: true,
    name: "date-range",
    onChange: function onChange(e) {
      return checkIndefinite(e.target.value);
    },
    defaultValue: conditionIndefiniteValue ? "indefinite" : "set-range",
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    className: "rulesRadio",
    value: "indefinite",
    control: /*#__PURE__*/_react["default"].createElement(_material.Radio, null),
    label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.indefinite"),
    sx: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    className: "rulesRadio",
    value: "set-range",
    control: /*#__PURE__*/_react["default"].createElement(_material.Radio, null),
    label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.setRange"),
    sx: {
      minWidth: "150px"
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "date-pickers-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: conditionIndefiniteValue ? "disabled date-wrapper" : "date-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.DatePicker, {
    style: datePickerStyles,
    value: (0, _moment["default"])(startDateValue)._d,
    handleChange: function handleChange(date) {
      return handleStartDateSelect((0, _moment["default"])(date).locale("en"));
    },
    minDate: editing ? null : new Date(),
    disabled: conditionIndefiniteValue,
    dir: dir,
    fullWidth: false,
    InputProps: {
      style: inputStyles,
      disableUnderline: true
    },
    autoOk: true,
    okLabel: false,
    clearable: false
  }), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.setSchedule.to"
  })), /*#__PURE__*/_react["default"].createElement(_CBComponents.DatePicker, {
    style: datePickerStyles,
    value: (0, _moment["default"])(endDateValue)._d,
    handleChange: function handleChange(date) {
      return handleEndDateSelect((0, _moment["default"])(date).locale("en"));
    },
    disabled: conditionIndefiniteValue,
    dir: dir,
    locale: locale,
    fullWidth: false,
    InputProps: {
      style: inputStyles,
      disableUnderline: true
    },
    autoOk: true,
    okLabel: false,
    clearable: false
  })), /*#__PURE__*/_react["default"].createElement("h3", {
    className: "condition-subheader"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.setSchedule.days"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "weekday-selector"
  }, (0, _map["default"])(_context3 = ["Su", "M", "T", "W", "Th", "F", "Sa"]).call(_context3, function (day, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: index,
      className: (0, _includes["default"])(weekdaysValue).call(weekdaysValue, index) ? "weekday toggled" : "weekday",
      onClick: function onClick() {
        return toggleWeekday(index);
      }
    }, day);
  })), /*#__PURE__*/_react["default"].createElement("h3", {
    className: "condition-subheader"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.setSchedule.timePeriod"
  })), /*#__PURE__*/_react["default"].createElement(_material.RadioGroup, {
    row: true,
    name: "date-range",
    onChange: function onChange(e) {
      return checkAnyTime(e.target.value);
    },
    defaultValue: conditionAnyTimeValue ? "all-day" : "set-period",
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    className: "rulesRadio",
    value: "all-day",
    control: /*#__PURE__*/_react["default"].createElement(_material.Radio, null),
    label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.allDay"),
    sx: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    className: "rulesRadio",
    value: "set-period",
    control: /*#__PURE__*/_react["default"].createElement(_material.Radio, null),
    label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setSchedule.setPeriod"),
    sx: {
      minWidth: "150px"
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: conditionAnyTimeValue ? "disabled time-wrapper" : "time-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.TimeInput, {
    disabled: conditionAnyTimeValue,
    onChange: handleBeforeTimeChange,
    value: beforeTimeValue,
    timeFormatPreference: timeFormatPreference
  }), /*#__PURE__*/_react["default"].createElement("span", null, "To"), /*#__PURE__*/_react["default"].createElement(_CBComponents.TimeInput, {
    disabled: conditionAnyTimeValue,
    onChange: handleAfterTimeChange,
    value: afterTimeValue,
    timeFormatPreference: timeFormatPreference
  }))), /*#__PURE__*/_react["default"].createElement("span", {
    className: "dialog-error"
  }, dialogError))), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, {
    sx: overrides.dialogActions
  }, dialogActions));
};
var _default = SetScheduleDialog;
exports["default"] = _default;