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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _i18n = require("orion-components/i18n");
var _material = require("@mui/material");
var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));
var _setScheduleDialog = _interopRequireDefault(require("orion-components/Profiles/Widgets/FacilityCondition/components/setScheduleDialog"));
var _moment = _interopRequireDefault(require("moment/moment"));
var _clientAppCore = require("client-app-core");
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _reactRedux = require("react-redux");
var _CBComponents = require("orion-components/CBComponents");
var _Actions = require("orion-components/AppState/Actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var FacilityCondition = function FacilityCondition(_ref) {
  var enabled = _ref.enabled,
    order = _ref.order,
    dir = _ref.dir,
    facilityId = _ref.facilityId,
    context = _ref.context,
    locale = _ref.locale,
    priorityOptions = _ref.priorityOptions,
    initialDefaultPriority = _ref.initialDefaultPriority;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    criticalTarget = _useState2[0],
    setCriticalTarget = _useState2[1];
  var _useState3 = (0, _react.useState)(initialDefaultPriority),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    defaultPriority = _useState4[0],
    setDefaultPriority = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    dialogOpen = _useState6[0],
    setDialogOpen = _useState6[1];
  var _useState7 = (0, _react.useState)([]),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    schedule = _useState8[0],
    setSchedule = _useState8[1];
  var _useState9 = (0, _react.useState)([]),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    priorityScheduleRow = _useState10[0],
    setPriorityScheduleRow = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    editing = _useState12[0],
    setEditing = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    removeDialog = _useState14[0],
    setRemoveDialog = _useState14[1];
  var _useState15 = (0, _react.useState)("widget-wrapper collapsed index-".concat(order)),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    wrapperClass = _useState16[0],
    setWrapperClass = _useState16[1];
  var defPriorityVal = defaultPriority;
  var dispatch = (0, _reactRedux.useDispatch)();
  (0, _react.useEffect)(function () {
    setWrapperClass("widget-wrapper collapsed index-".concat(order));
  }, [order]);
  _moment["default"].locale(locale);
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var timeZoneName = _moment["default"].tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("z");
  var timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
  var getDestructuredKeys = (0, _react.useCallback)(function (type) {
    var valuesArr = [];
    var values;
    switch (type) {
      case "week":
        values = (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.weekDays");
        break;
      default:
        values = [];
    }
    for (var key in values) {
      valuesArr.push(values[key]);
    }
    return valuesArr;
  }, []);
  var priorityValues = priorityOptions;
  var weekDays = getDestructuredKeys("week");
  var openScheduleDialog = function openScheduleDialog(value) {
    setEditing(!editing);
    setDialogOpen(!dialogOpen);
    setPriorityScheduleRow(value);
  };
  (0, _react.useEffect)(function () {
    if (context) {
      if (context.conditions) {
        setCriticalTarget(context.conditions.critical);
        setDefaultPriority(context.conditions.defaultPriority);
        setSchedule(context.conditions.prioritySchedules);
      }
    }
  }, [context]);
  var convertUtcTime = function convertUtcTime(time) {
    return _momentTimezone["default"].utc(time, "h:mm A").tz(_momentTimezone["default"].tz.guess()).format(timeFormat);
  };
  var closeScheduleDialog = function closeScheduleDialog() {
    setDialogOpen(!dialogOpen);
    setEditing(editing ? !editing : editing);
  };
  var toggleConditions = function toggleConditions(control) {
    var data = {
      defaultPriority: defPriorityVal
    };
    if (control === "criticalTarget") data["critical"] = !criticalTarget;
    _clientAppCore.facilityService.toggleConditions(facilityId, data, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  var removePrioritySchedule = function removePrioritySchedule() {
    _clientAppCore.facilityService.removePrioritySchedule(facilityId, priorityScheduleRow.id, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  var updatePriority = function updatePriority(prioritySchedules, priority) {
    prioritySchedules.priority = priority;
    _clientAppCore.facilityService.updatePrioritySchedule(facilityId, prioritySchedules, prioritySchedules.id, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  return !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: wrapperClass
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header",
    style: {
      direction: dir
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.title"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content",
    style: {
      display: "flex",
      padding: "0px 6px",
      direction: dir
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      style: {
        transform: "scale(1.1)"
      },
      checked: criticalTarget,
      onChange: function onChange() {
        setCriticalTarget(!criticalTarget);
        toggleConditions("criticalTarget");
      }
    }),
    style: {
      fontSize: "14px"
    },
    label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.criticalTarget")
  }), criticalTarget ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: "15px",
      display: "flex"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: 11,
    style: {
      padding: "12px 0px"
    }
  }, (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.prioritySchedules")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    size: "small",
    startIcon: dir === "ltr" ? /*#__PURE__*/_react["default"].createElement(_Add["default"], {
      fontSize: "11px",
      style: {
        marginRight: "-1px !important"
      }
    }) : null,
    endIcon: dir === "rtl" ? /*#__PURE__*/_react["default"].createElement(_Add["default"], {
      fontSize: "11px",
      style: {
        marginLeft: "-1px !important"
      }
    }) : null,
    style: {
      fontSize: "11px",
      textTransform: "none"
    },
    onClick: function onClick() {
      setDialogOpen(!dialogOpen);
      setEditing(editing ? !editing : editing);
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.addNew"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    style: {
      marginTop: "15px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 4,
    sm: 4,
    md: 4,
    lg: 4
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    select: true,
    value: defaultPriority,
    onChange: function onChange(e) {
      setDefaultPriority(e.target.value);
      defPriorityVal = e.target.value;
      toggleConditions("defaultPriority");
    },
    variant: "standard",
    label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.priority")
  }, priorityValues && (0, _map["default"])(priorityValues).call(priorityValues, function (priorityValue) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      key: "priority-value-".concat(priorityValue.value, "-menu-item"),
      value: priorityValue.value
    }, priorityValue.label);
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 8,
    sm: 8,
    md: 8,
    lg: 8
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: 11,
    style: {
      padding: "12px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.facilityCondition.defaultPriorityLabel"
  })))), schedule && schedule.length > 0 ? /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      background: "#626466",
      marginTop: "20px"
    }
  }) : null, schedule && (0, _map["default"])(schedule).call(schedule, function (element) {
    var _context;
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        position: "relative"
      },
      key: "".concat(element.priority, "-schedule-list-div")
    }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      container: true,
      style: {
        marginTop: "15px"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 3,
      sm: 3,
      md: 3,
      lg: 3
    }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
      select: true,
      value: element.priority,
      onChange: function onChange(e) {
        updatePriority(element, e.target.value);
      },
      variant: "standard",
      label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.priority"),
      style: {
        marginTop: "12px"
      }
    }, priorityValues && (0, _map["default"])(priorityValues).call(priorityValues, function (priorityValue) {
      return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
        key: "priority-value-".concat(priorityValue.value, "-menu-item"),
        value: priorityValue.value
      }, priorityValue.label);
    }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 6,
      sm: 6,
      md: 6,
      lg: 6
    }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "text",
      size: "small",
      style: {
        fontSize: "11px",
        marginLeft: "-10px",
        textTransform: "none"
      },
      onClick: function onClick() {
        return openScheduleDialog(element);
      }
    }, (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.setScheduleLabel")), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        marginTop: "-12px"
      }
    }, element.schedule.anyTimeOfDay ? /*#__PURE__*/_react["default"].createElement(_material.Typography, null, (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.allDay")) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      fontSize: 11
    }, convertUtcTime(element.schedule.startTime), " ", timeZoneName, " to", " ", convertUtcTime(element.schedule.endTime), " ", timeZoneName), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      fontSize: 11
    }, (0, _map["default"])(_context = element.schedule.weekdays).call(_context, function (day, index) {
      return /*#__PURE__*/_react["default"].createElement("span", {
        key: "weekdays-".concat(index, "-span")
      }, weekDays[day], element.schedule.weekdays.length - 1 !== index ? ", " : "");
    }))))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 3,
      sm: 3,
      md: 3,
      lg: 3
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "text",
      size: "small",
      style: {
        fontSize: "11px",
        position: "absolute",
        bottom: 0,
        textTransform: "none"
      },
      onClick: function onClick() {
        setRemoveDialog("scheduleDeletionDialog");
        setPriorityScheduleRow(element);
      }
    }, (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.remove")))));
  })) : null), /*#__PURE__*/_react["default"].createElement(_setScheduleDialog["default"], {
    dir: dir,
    isOpen: dialogOpen,
    defaultPriority: defaultPriority,
    closeDialog: closeScheduleDialog,
    editing: editing,
    priorityScheduleRow: priorityScheduleRow,
    facilityId: facilityId
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: removeDialog === "scheduleDeletionDialog",
    title: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.removeDialog.title"),
    textContent: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.removeDialog.confirmationText"),
    confirm: {
      action: function action() {
        dispatch((0, _Actions.closeDialog)("scheduleDeletionDialog"));
        setRemoveDialog("");
        removePrioritySchedule();
      },
      label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.removeDialog.confirm")
    },
    abort: {
      action: function action() {
        dispatch((0, _Actions.closeDialog)("scheduleDeletionDialog"));
        setRemoveDialog("");
      },
      label: (0, _i18n.getTranslation)("global.profiles.widgets.facilityCondition.removeDialog.cancel")
    }
  }));
};
var _default = FacilityCondition;
exports["default"] = _default;