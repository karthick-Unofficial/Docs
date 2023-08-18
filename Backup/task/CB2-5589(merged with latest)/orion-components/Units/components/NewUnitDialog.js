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
var _material = require("@mui/material");
var _UnitMemberRows = _interopRequireDefault(require("./UnitMemberRows"));
var _clientAppCore = require("client-app-core");
var _DialogHoc = _interopRequireDefault(require("./DialogHoc"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var NewUnitDialog = function NewUnitDialog(_ref) {
  var open = _ref.open,
    closeDialog = _ref.closeDialog;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitMembers = _useState2[0],
    setUnitMembers = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    selectedUnitMembers = _useState4[0],
    setSelectedUnitMemebers = _useState4[1];
  var getAllUnitMembers = function getAllUnitMembers() {
    _clientAppCore.unitService.getAllUnitMembers(function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      } else {
        if (response && response.length > 0) {
          var unAssignedUnitsArray = [];
          (0, _map["default"])(response).call(response, function (member) {
            if (member.unitId === null) {
              member.selected = false;
              unAssignedUnitsArray.push(member);
            }
          });
          setUnitMembers(unAssignedUnitsArray);
        }
      }
    });
  };
  (0, _react.useEffect)(function () {
    getAllUnitMembers();
  }, []);
  (0, _react.useEffect)(function () {
    setIsOpen(open);
    getAllUnitMembers();
  }, [open]);
  var getSelectedUnitMembers = function getSelectedUnitMembers(selectedMembers) {
    var selectedArr = selectedUnitMembers;
    selectedArr.push(selectedMembers.id);
    setSelectedUnitMemebers(selectedArr);
  };
  var createNewUnit = function createNewUnit() {
    _clientAppCore.unitService.createUnit(unitName, selectedUnitMembers, function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      }
    });
  };
  var children = [/*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "12px",
    style: {
      marginTop: "20px",
      color: "#747575",
      marginBottom: "15px"
    }
  }, "Choose unit members"), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_UnitMemberRows["default"], {
    unitMembers: unitMembers,
    newUnit: true,
    getSelectedUnitMembers: getSelectedUnitMembers
  })))];
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_DialogHoc["default"], {
    open: open,
    closeDialog: closeDialog,
    DialogType: "New Unit",
    children: children,
    onSubmit: createNewUnit
  }));
};
var _default = NewUnitDialog;
exports["default"] = _default;