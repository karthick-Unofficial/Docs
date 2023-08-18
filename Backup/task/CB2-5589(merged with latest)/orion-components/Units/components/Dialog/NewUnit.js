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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _UnitMemberRows = _interopRequireDefault(require("../UnitMemberRows"));
var _clientAppCore = require("client-app-core");
var _Template = _interopRequireDefault(require("./Template"));
var _Actions = require("orion-components/GlobalData/Actions");
var _reactRedux = require("react-redux");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var NewUnit = function NewUnit(_ref) {
  var open = _ref.open,
    closeDialog = _ref.closeDialog,
    members = _ref.members;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitMembers = _useState2[0],
    setUnitMembers = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    selectedUnitMembers = _useState4[0],
    setSelectedUnitMembers = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    unitName = _useState6[0],
    setUnitName = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    unitNameError = _useState8[0],
    setUnitNameError = _useState8[1];
  var dispatch = (0, _reactRedux.useDispatch)();
  (0, _react.useEffect)(function () {
    setUnitMembers(members);
  }, [members]);
  var getSelectedUnitMembers = function getSelectedUnitMembers(selectedMembers) {
    var selectedArr = selectedUnitMembers;
    selectedArr.push(selectedMembers.id);
    setSelectedUnitMembers(selectedArr);
  };
  var createNewUnit = function createNewUnit() {
    _clientAppCore.unitService.createUnit(unitName, selectedUnitMembers, function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      }
      if (response) {
        dispatch((0, _Actions.subscribeUnitMembers)());
      }
    });
  };
  var close = function close() {
    setUnitName("");
    closeDialog();
    setSelectedUnitMembers([]);
    setUnitMembers([]);
  };
  var checkError = function checkError(type) {
    switch (type) {
      case "unitName":
        setUnitNameError((0, _i18n.getTranslation)("global.units.components.dialog.newUnit.unitNameError"));
        break;
      default:
        setUnitNameError("");
    }
  };
  var handleChange = function handleChange(e) {
    if (e.target.name === "unitName") {
      setUnitName(e.target.value);
      setUnitNameError("");
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Template["default"], {
    open: open,
    closeDialog: close,
    onSubmit: createNewUnit,
    title: (0, _i18n.getTranslation)("global.units.components.dialog.newUnit.title"),
    checkError: checkError,
    name: unitName
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottm: "30px",
      height: "300px",
      minHeight: "300px",
      maxHeight: "500px",
      overflowY: "scroll"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: "25px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    variant: "standard",
    value: unitName,
    name: "unitName",
    onChange: function onChange(e) {
      handleChange(e);
    },
    error: unitNameError === "" ? false : true,
    helperText: unitNameError,
    label: (0, _i18n.getTranslation)("global.units.components.dialog.newUnit.unitName"),
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
        fontWeight: "300"
      }
    }
  })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "12px",
    style: {
      marginTop: "20px",
      color: "#747575",
      marginBottom: "15px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.dialog.newUnit.chooseMembers"
  })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_UnitMemberRows["default"], {
    unitMembers: unitMembers,
    newUnit: true,
    getSelectedUnitMembers: getSelectedUnitMembers,
    includeDividers: true
  }))))));
};
var _default = NewUnit;
exports["default"] = _default;