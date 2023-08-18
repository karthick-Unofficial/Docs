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
var _clientAppCore = require("client-app-core");
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _moment = _interopRequireDefault(require("moment"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _map = _interopRequireDefault(require("lodash/map"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _EventReOpenAndClose = _interopRequireDefault(require("./EventReOpenAndClose"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
// TODO: Add PropTypes
var EventDialog = function EventDialog(props) {
  var editing = props.editing,
    closeDialog = props.closeDialog,
    open = props.open,
    allTemplates = props.allTemplates,
    selectedEvent = props.selectedEvent,
    dir = props.dir,
    isTemplate = props.isTemplate;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    name = _useState2[0],
    setName = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    description = _useState4[0],
    setDescription = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    startDate = _useState6[0],
    setStartDate = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    startTime = _useState8[0],
    setStartTime = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    endDate = _useState10[0],
    setEndDate = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    endTime = _useState12[0],
    setEndTime = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    checkTemplate = _useState14[0],
    setCheckTemplate = _useState14[1];
  var _useState15 = (0, _react.useState)(-1),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    template = _useState16[0],
    setTemplate = _useState16[1];
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var theme = (0, _styles.useTheme)();
  var isXS = (0, _material.useMediaQuery)(theme.breakpoints.only("xs"));
  var handleChange = function handleChange(name, setState) {
    return function (event) {
      // Date Picker event does not have target prop, returns a moment date object
      var value = event && event.target && !(0, _isNil["default"])(event.target.value) ? event.target.value : event;
      if (name === "startDate") {
        setStartTime(new Date());
        setStartDate(value);
      }
      if (name === "endDate") {
        setEndTime(new Date());
        setEndDate(value);
      }
      if (name === "endTime") {
        setEndDate(value);
      }
      if (name === "startTime") {
        setStartDate(value);
      }
      setState(value);
    };
  };
  var handleSave = function handleSave() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var currentDateTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var event = _objectSpread(_objectSpread({}, selectedEvent), {}, {
      name: name,
      desc: description,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      isTemplate: checkTemplate
    });
    if (type != null) {
      if (type === "close") {
        event.endDate = currentDateTime;
      } else if (type === "re-open") {
        event.endDate = null;
      }
    }
    if (template && template !== -1) event["template"] = template;
    if (event.entityData && event.entityData.properties) {
      event.entityData.properties.name = name;
    }
    editing ? _clientAppCore.eventService.updateEvent(selectedEvent.id, event, function (err, response) {
      if (err) console.log(err, response);
    }) : _clientAppCore.eventService.createEvent(event, function (err, response) {
      if (err) console.log(err, response);
    });
    handleClose();
  };
  var handleClose = function handleClose() {
    if (editing) {
      dispatch(closeDialog("eventEditDialog"));
    } else {
      closeDialog("eventCreateDialog");
    }
    setName("");
    setDescription("");
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setCheckTemplate(false);
    setTemplate(-1);
  };
  var newTemplate = isTemplate;
  if (checkTemplate === false && newTemplate === true) {
    setCheckTemplate(true);
  }

  // -- minDate prop on TimePicker doesn't work in the current stable release of material-ui-pickers
  // -- so we are checking the values manually
  var validEndDate = !endDate || endDate > startDate;

  // StartDate is required for Events but not for Templates
  var disabled = Boolean(!name && checkTemplate || (!name || !startDate) && !checkTemplate || !validEndDate);
  var styles = {
    pickers: {
      display: "flex",
      justifyContent: "space-between"
    },
    spacer: {
      padding: 16
    }
  };
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    if (prevProps && !prevProps.open && open && selectedEvent) {
      var _name = selectedEvent.name,
        desc = selectedEvent.desc,
        _startDate = selectedEvent.startDate,
        _endDate = selectedEvent.endDate,
        _isTemplate = selectedEvent.isTemplate,
        _template = selectedEvent.template;
      setName(_name);
      setDescription(desc);
      setStartDate(_startDate ? (0, _moment["default"])(_startDate) : null);
      setStartTime(_startDate ? _startDate : null);
      setEndDate(_endDate ? (0, _moment["default"])(_endDate) : null);
      setEndTime(_endDate ? _endDate : null);
      setCheckTemplate(_isTemplate ? _isTemplate : false);
      setTemplate(_template ? _template : -1);
    }
  }, [props]);
  var dialogActions = function dialogActions() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "4%"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", null, editing && /*#__PURE__*/_react["default"].createElement(_EventReOpenAndClose["default"], {
      startDate: startDate,
      endDate: endDate,
      onSave: handleSave
    })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      style: {
        color: "#B2B6BB"
      },
      variant: "text",
      onClick: handleClose,
      key: "close-action-button"
    }, (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
      color: "primary",
      variant: "text",
      onClick: function onClick() {
        return handleSave();
      },
      key: "save-action-button",
      disabled: disabled
    }, editing ? (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.update") : (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.create"))));
  };
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: open,
    dir: dir,
    dialogContentStyles: {
      padding: "20px 24px 8px 24px"
    },
    actions: true,
    DialogActionsFunction: dialogActions
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: isXS ? "auto" : 500
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "name",
    key: "name",
    label: checkTemplate ? (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.templateName") : (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.eventName"),
    value: name,
    handleChange: handleChange("name", setName),
    fullWidth: true,
    required: true,
    autoFocus: !editing,
    dir: dir,
    inputLabelStyle: {
      fontSize: 14,
      color: "rgb(181, 185, 190)"
    }
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "description",
    key: "description",
    label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.description"),
    value: description,
    handleChange: handleChange("description", setDescription),
    fullWidth: true,
    dir: dir,
    inputLabelStyle: {
      fontSize: 14,
      color: "rgb(181, 185, 190)"
    }
  }), !selectedEvent && !checkTemplate ? /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "template",
    key: "template",
    label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.template"),
    value: template,
    handleChange: handleChange("template", setTemplate),
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "0",
    value: -1,
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.eventProfile.eventDialog.fieldLabel.none"
  })), (0, _map["default"])(allTemplates, function (template) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      key: template.id,
      value: template.id,
      style: {
        display: "flex"
      }
    }, template.name);
  })) : "", !checkTemplate && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.pickers
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.DatePicker, {
    id: "start-date",
    key: "start-date",
    label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.startDate"),
    value: startDate,
    handleChange: handleChange("startDate", setStartDate),
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.spacer
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.TimePicker, {
    id: "start-time",
    key: "start-time",
    label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.startTime"),
    value: startTime,
    handleChange: handleChange("startTime", setStartTime),
    format: "time_".concat(timeFormatPreference),
    dir: dir
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.pickers
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.DatePicker, {
    id: "end-date",
    key: "end-date",
    label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.endDate"),
    value: endDate,
    handleChange: handleChange("endDate", setEndDate),
    minDate: startDate,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.spacer
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.TimePicker, {
    id: "end-time",
    key: "end-time",
    label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventDialog.fieldLabel.endTime"),
    value: endTime,
    handleChange: handleChange("endTime", setEndTime),
    minDate: startTime,
    format: "time_".concat(timeFormatPreference),
    dir: dir
  })), !validEndDate && /*#__PURE__*/_react["default"].createElement("p", {
    style: dir === "rtl" ? {
      color: "red",
      fontSize: 12,
      marginRight: 266
    } : {
      color: "red",
      fontSize: 12,
      marginLeft: 266
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.eventProfile.eventDialog.fieldLabel.endTimeText"
  })))));
};
EventDialog.propTypes = {
  editing: _propTypes["default"].bool.isRequired,
  closeDialog: _propTypes["default"].func.isRequired,
  open: _propTypes["default"].bool.isRequired,
  allTemplates: _propTypes["default"].array.isRequired,
  selectedEvent: _propTypes["default"].object.isRequired,
  dir: _propTypes["default"].string.isRequired,
  isTemplate: _propTypes["default"].bool.isRequired
};
var _default = EventDialog;
exports["default"] = _default;