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
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _Template = _interopRequireDefault(require("./Template"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var RenameUnit = function RenameUnit(_ref) {
  var open = _ref.open,
    closeDialog = _ref.closeDialog,
    unit = _ref.unit;
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitName = _useState2[0],
    setUnitName = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    unitNameError = _useState4[0],
    setUnitNameError = _useState4[1];
  (0, _react.useEffect)(function () {
    if (unit) {
      setUnitName(unit.name);
    }
  }, [unit]);
  (0, _react.useEffect)(function () {
    return function () {
      setUnitName("");
    };
  }, []);
  var renameUnit = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _clientAppCore.unitService.renameUnit(unit.id, unitName, function (err, response) {
              if (err) {
                console.log("ERROR:", err, response);
              }
            });
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function renameUnit() {
      return _ref2.apply(this, arguments);
    };
  }();
  var checkError = function checkError(type) {
    switch (type) {
      case "unitName":
        setUnitNameError((0, _i18n.getTranslation)("global.units.components.dialog.renameUnit.unitNameError"));
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
  var handleClose = function handleClose() {
    setUnitName(unit.name);
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Template["default"], {
    open: open,
    closeDialog: closeDialog,
    onSubmit: renameUnit,
    onCancel: handleClose,
    title: (0, _i18n.getTranslation)("global.units.components.dialog.renameUnit.title"),
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
    label: (0, _i18n.getTranslation)("global.units.components.dialog.renameUnit.unitName"),
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
  })))));
};
var _default = RenameUnit;
exports["default"] = _default;