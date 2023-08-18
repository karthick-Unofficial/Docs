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
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Template = _interopRequireDefault(require("./Template"));
var _material = require("@mui/material");
var _clientAppCore = require("client-app-core");
var _Actions = require("orion-components/GlobalData/Actions");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _i18n = require("orion-components/i18n");
var _UnitsPanel = require("orion-components/Dock/UnitsPanel/UnitsPanel");
var _size = _interopRequireDefault(require("lodash/size"));
var _includes = _interopRequireDefault(require("lodash/includes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var Settings = function Settings(_ref) {
  var open = _ref.open,
    closeDialog = _ref.closeDialog,
    unitMember = _ref.unitMember;
  var unitsData = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.getAllUnits)(state);
  });
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitMemberName = _useState2[0],
    setUnitMemberName = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    unit = _useState4[0],
    setUnit = _useState4[1];
  var _useState5 = (0, _react.useState)("person"),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    memberType = _useState6[0],
    setMemberType = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    phoneNumber = _useState8[0],
    setPhoneNumber = _useState8[1];
  var _useState9 = (0, _react.useState)("+1"),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    countryCode = _useState10[0],
    setCountryCode = _useState10[1];
  var _useState11 = (0, _react.useState)([]),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    selectedRoles = _useState12[0],
    setSelectedRoles = _useState12[1];
  var dispatch = (0, _reactRedux.useDispatch)();
  var unitsPanel = (0, _react.useContext)(_UnitsPanel.UnitsPanelContext);
  var memberRoleTypes = unitsPanel.memberRoleTypes,
    countryCodesArray = unitsPanel.countryCodesArray;
  (0, _react.useEffect)(function () {
    if (unitMember) {
      setUnitMemberName(unitMember.name);
      setUnit(unitMember.unitId);
      setSelectedRoles(unitMember.roles);
      setMemberType(unitMember.memberType);
      setPhoneNumber(unitMember.phone);
    }
  }, [unitMember]);
  (0, _react.useEffect)(function () {
    var phone = unitMember.phone;
    var CountryCode = (0, _size["default"])(countryCodesArray) && (0, _find["default"])(countryCodesArray).call(countryCodesArray, function (countryCodes) {
      return (0, _includes["default"])(phone, countryCodes.code);
    });
    if ((0, _size["default"])(CountryCode)) {
      setCountryCode(CountryCode.code);
      setPhoneNumber(formatPhone(phone.replace(CountryCode.code, "")));
    }
  }, [countryCodesArray]);
  var handleSave = function handleSave() {
    if (unit === "unassign") {
      unassignUnitFromUnitMember();
    } else if (unitMember.isFeed === false || unitMember.unitId !== null) {
      updateUnitMember();
    } else {
      createUnitMember();
    }
  };
  var unassignUnitFromUnitMember = function unassignUnitFromUnitMember() {
    _clientAppCore.unitService.unassignUnitFromUnitMember(unitMember.id, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      } else {
        dispatch((0, _Actions.subscribeUnitMembers)());
      }
    });
  };
  var createUnitMember = function createUnitMember() {
    var feedId = unitMember.feedId,
      entityId = unitMember.entityId,
      entityType = unitMember.entityType;
    var formattedPhone = countryCode + phoneNumber.replace(/\D/g, "");
    _clientAppCore.unitService.createUnitMember(memberType, feedId, entityId, entityType, unit, formattedPhone, selectedRoles, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      } else {
        dispatch((0, _Actions.subscribeUnitMembers)());
      }
    });
  };
  var updateUnitMember = function updateUnitMember() {
    var feedId = unitMember.feedId,
      entityId = unitMember.entityId,
      entityType = unitMember.entityType,
      id = unitMember.id;
    var formattedPhone = countryCode + phoneNumber.replace(/\D/g, "");
    _clientAppCore.unitService.updateUnitMember(id, memberType, feedId, entityId, entityType, unit, formattedPhone, selectedRoles, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      } else {
        dispatch((0, _Actions.subscribeUnitMembers)());
      }
    });
  };
  var formatPhone = function formatPhone(value) {
    var input = value;
    // Strip all characters from the input except digits
    input = input.replace(/\D/g, "");

    // Trim the remaining input to ten characters, to preserve phone number format
    input = input.substring(0, 10);

    // Based upon the length of the string, we add formatting as necessary
    var size = input.length;
    if (size === 0) {
      input = "";
    } else if (size < 4) {
      input = "(" + input;
    } else if (size < 7) {
      input = "(" + input.substring(0, 3) + ") " + input.substring(3, 6);
    } else {
      input = "(" + input.substring(0, 3) + ") " + input.substring(3, 6) + " - " + input.substring(6, 10);
    }
    return input;
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Template["default"], {
    open: open,
    closeDialog: closeDialog,
    onSubmit: handleSave,
    title: (0, _i18n.getTranslation)("global.units.components.dialog.settings.title")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: "30px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: "25px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    variant: "standard",
    value: unitMemberName,
    name: "unitMemberName",
    label: (0, _i18n.getTranslation)("global.units.components.dialog.settings.name"),
    fullWidth: true,
    inputProps: {
      readOnly: true,
      style: {
        fontSize: "12px",
        fontWeight: "300"
      }
    },
    InputLabelProps: {
      style: {
        fontSize: "14px",
        fontWeight: "300",
        color: "#5E5E60"
      }
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: "25px",
      display: "flex"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    columnSpacing: 3
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 4,
    sm: 4,
    md: 4,
    lg: 4
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    select: true,
    value: countryCode,
    variant: "standard",
    fullWidth: true,
    InputProps: {
      style: {
        fontSize: "12px",
        fontWeight: "300",
        marginRight: "10px"
      }
    },
    label: (0, _i18n.getTranslation)("global.units.components.dialog.settings.Phone"),
    InputLabelProps: {
      style: {
        fontSize: "14px",
        fontWeight: "300",
        color: "#5E5E60"
      }
    },
    defaultValue: "+1",
    onChange: function onChange(e) {
      return setCountryCode(e.target.value);
    }
  }, (0, _size["default"])(countryCodesArray) && (0, _map["default"])(countryCodesArray).call(countryCodesArray, function (countryCode) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      key: "".concat(countryCode.code, "-menu-item"),
      value: countryCode.code
    }, countryCode.name);
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 8,
    sm: 8,
    md: 8,
    lg: 8
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    variant: "standard",
    value: phoneNumber,
    name: "phoneNumber",
    fullWidth: true,
    InputLabelProps: {
      style: {
        fontSize: "14px",
        fontWeight: "300",
        color: "#5E5E60"
      }
    },
    InputProps: {
      style: {
        fontSize: "12px",
        fontWeight: "300",
        marginTop: "16px"
      }
    },
    onChange: function onChange(e) {
      setPhoneNumber(formatPhone(e.target.value));
    },
    placeholder: "(___) __ ____"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: "25px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    select: true,
    value: unit,
    variant: "standard",
    fullWidth: true,
    InputProps: {
      style: {
        fontSize: "12px",
        fontWeight: "300"
      }
    },
    InputLabelProps: {
      style: {
        fontSize: "14px",
        fontWeight: "300",
        color: "#5E5E60"
      }
    },
    label: (0, _i18n.getTranslation)("global.units.components.dialog.settings.chooseUnit"),
    onChange: function onChange(e) {
      return setUnit(e.target.value);
    }
  }, unitMember.unitId !== null ? /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    value: "unassign"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.dialog.settings.unAssign"
  })) : null, (0, _map["default"])(unitsData).call(unitsData, function (type) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      value: type.id,
      key: "".concat(type.id, "-menu-item")
    }, type.name);
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: "25px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.RadioGroup, {
    row: true,
    name: "memberType",
    defaultValue: "person",
    value: memberType,
    style: {
      display: "flex",
      flexWrap: "wrap"
    },
    onChange: function onChange(e) {
      return setMemberType(e.target.value);
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    value: "person",
    control: /*#__PURE__*/_react["default"].createElement(_material.Radio, null),
    label: (0, _i18n.getTranslation)("global.units.components.dialog.settings.person"),
    sx: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    value: "vehicle",
    control: /*#__PURE__*/_react["default"].createElement(_material.Radio, null),
    label: (0, _i18n.getTranslation)("global.units.components.dialog.settings.vehicle"),
    sx: {
      minWidth: "150px"
    }
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: "10px",
      marginBottom: "25px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "12px",
    style: {
      paddingTop: "20px",
      fontWeight: "300px",
      marginBottom: "25px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.dialog.settings.equipmentSkills"
  })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    select: true,
    value: selectedRoles,
    variant: "standard",
    fullWidth: true,
    InputProps: {
      style: {
        fontSize: "12px",
        fontWeight: "300"
      }
    },
    InputLabelProps: {
      style: {
        fontSize: "14px",
        fontWeight: "300",
        color: "#5E5E60"
      }
    },
    label: (0, _i18n.getTranslation)("global.units.components.dialog.settings.chooseRole"),
    onChange: function onChange(e) {
      return setSelectedRoles(e.target.value);
    }
  }, memberRoleTypes.length > 0 && (0, _map["default"])(memberRoleTypes).call(memberRoleTypes, function (type) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      value: type.id,
      key: "".concat(type.id, "-menu-item")
    }, type.name);
  })))))));
};
var _default = Settings;
exports["default"] = _default;