"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));
var _iconsMaterial = require("@mui/icons-material");
var _LookupTable = _interopRequireDefault(require("./LookupTable"));
var _i18n = require("orion-components/i18n");
var _merge = _interopRequireDefault(require("lodash/merge"));
var _keyBy = _interopRequireDefault(require("lodash/keyBy"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ManageModal = function ManageModal(_ref) {
  var open = _ref.open,
    close = _ref.close,
    lookupType = _ref.lookupType,
    contextId = _ref.contextId,
    settings = _ref.settings,
    assignedData = _ref.assignedData,
    dir = _ref.dir;
  var _useState = (0, _react.useState)(true),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    showLoader = _useState2[0],
    setShowLoader = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    lookupData = _useState4[0],
    setLookupData = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    title = _useState6[0],
    setTitle = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    showAvailable = _useState8[0],
    setShowAvailable = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    showAssigned = _useState10[0],
    setShowAssigned = _useState10[1];
  var _useState11 = (0, _react.useState)(""),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    searchTerm = _useState12[0],
    setSearchTerm = _useState12[1];
  var _useState13 = (0, _react.useState)([]),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    searchColumns = _useState14[0],
    setSearchColumns = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    openPopup = _useState16[0],
    setOpenPopup = _useState16[1];
  var _useState17 = (0, _react.useState)(false),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    checkError = _useState18[0],
    setCheckError = _useState18[1];
  var style = {
    dialogCloseIcon: _objectSpread({
      cursor: "pointer",
      "float": "right",
      color: "#ECECED"
    }, dir === "rtl" && {
      marginRight: "50px"
    }),
    outlinedInput: {
      border: "1px solid #727983",
      width: "55%",
      height: "40px",
      marginTop: "2%",
      marginBottom: "2%",
      color: "white",
      borderRadius: "5px"
    },
    progressContainer: {
      width: "900px",
      height: "50vh",
      display: "table",
      overflow: "hidden"
    },
    progress: {
      display: "table-cell",
      verticalAlign: "middle",
      textAlign: "center"
    },
    errorText: {
      fontSize: "1.3rem",
      color: "#ECECED"
    }
  };
  (0, _react.useEffect)(function () {
    setOpenPopup(open);
    if (lookupType === "resources") {
      setTitle((0, _i18n.getTranslation)("global.profiles.eventProfile.main.resources"));
      setSearchColumns(["Name", "LocationName", "UnitName", "RankName", "ShiftEndTime"]);
    } else {
      setTitle((0, _i18n.getTranslation)("global.profiles.eventProfile.main.equipment"));
      setSearchColumns(["Name", "Category", "UnitName", "ItemCount"]);
    }
    _clientAppCore.integrationService.getExternalSystemLookup("hrms", lookupType, function (err, response) {
      if (err) {
        console.log("The HRMS ".concat(lookupType, " lookup returned an error."), err);
        setShowLoader(false);
        setCheckError(true);
      } else if (!response || !response.data || response.data.length === 0) {
        console.log("The HRMS ".concat(lookupType, " lookup didn't return any data."), response);
        setShowLoader(false);
        setCheckError(true);
      } else {
        var data = response.data;
        (0, _forEach["default"])(data).call(data, function (element) {
          element.Selected = false;
        });
        if (lookupType === "resources") {
          (0, _merge["default"])((0, _keyBy["default"])(data, "MilitaryNumber"), (0, _keyBy["default"])(assignedData, "MilitaryNumber"));
        } else {
          (0, _merge["default"])((0, _keyBy["default"])(data, "Name"), (0, _keyBy["default"])(assignedData, "Name"));
        }
        (0, _sort["default"])(data).call(data, function (a, b) {
          return a.Name.localeCompare(b.Name);
        });
        setCheckError(false);
        setShowLoader(false);
        setLookupData(data);
      }
    });
  }, [lookupType, open]);
  (0, _react.useEffect)(function () {
    if (searchTerm.length > 0) {
      style.outlinedInput.background = "#727983";
    } else {
      style.outlinedInput.background = "none";
    }
  }, [searchTerm]);
  var handleClose = function handleClose() {
    close();
  };
  var search = function search(rows) {
    if (lookupData) if (lookupData.length !== 0) {
      if (lookupType === "resources") {
        return (0, _filter["default"])(rows).call(rows, function (row) {
          return (0, _some["default"])(searchColumns).call(searchColumns, function (column) {
            var _context;
            return row[column] ? (0, _indexOf["default"])(_context = row[column].toString().toLowerCase()).call(_context, searchTerm.toLowerCase()) > -1 : null;
          });
        });
      } else {
        return (0, _filter["default"])(rows).call(rows, function (row) {
          return (0, _some["default"])(searchColumns).call(searchColumns, function (column) {
            var _context2;
            return row[column] ? (0, _indexOf["default"])(_context2 = row[column].toString().toLowerCase()).call(_context2, searchTerm.toLowerCase()) > -1 : null;
          });
        });
      }
    }
  };
  var lookupSearchAndFilter = function lookupSearchAndFilter() {
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.OutlinedInput, {
      id: "input-with-icon-adornment",
      style: style.outlinedInput,
      placeholder: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.manageModal.search"),
      onChange: function onChange(e) {
        return setSearchTerm(e.target.value);
      },
      value: searchTerm,
      startAdornment: /*#__PURE__*/_react["default"].createElement(_material.InputAdornment, {
        position: dir == "rtl" ? "end" : "start"
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.SearchOutlined, {
        style: {
          color: "white"
        }
      })),
      endAdornment: searchTerm !== "" ? /*#__PURE__*/_react["default"].createElement(_material.InputAdornment, {
        position: dir == "rtl" ? "start" : "end"
      }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        onClick: function onClick() {
          return setSearchTerm("");
        }
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, {
        style: {
          color: "white",
          cursor: "pointer"
        }
      }))) : null
    }), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      container: true
    }, lookupType === "resources" ? /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
      control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        name: "showAvailable",
        checked: showAvailable,
        style: {
          color: showAvailable ? "#4DB6F5" : "#55575A"
        },
        onChange: function onChange(e) {
          return setShowAvailable(e.target.checked);
        }
      }),
      label: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.manageModal.showAvail")
    })) : /*#__PURE__*/_react["default"].createElement("div", null), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, /*#__PURE__*/_react["default"].createElement(_FormControlLabel["default"], {
      control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        label: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.manageModal.showAssigned"),
        name: "showAssigned",
        checked: showAssigned,
        style: {
          color: showAssigned ? "#4DB6F5" : "#55575A"
        },
        onChange: function onChange(e) {
          setShowAssigned(e.target.checked);
        }
      }),
      label: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.manageModal.showAssigned")
    }))));
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    open: openPopup,
    fullWidth: true,
    PaperProps: {
      sx: {
        width: "1010px",
        maxWidth: "none",
        marginTop: "2%",
        minHeight: "420px",
        maxHeight: "848px"
      }
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogContent, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "8px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 11,
    sm: 11,
    md: 11,
    lg: 11
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      color: "#fff"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.hrms.manageModal.select",
    count: title
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: style.dialogCloseIcon
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CloseOutlined, {
    onClick: handleClose
  })))), showLoader ? /*#__PURE__*/_react["default"].createElement("div", {
    style: style.progressContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: style.progress
  }, /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, {
    size: 60,
    thickness: 5,
    style: {
      color: "#4DB5F4"
    }
  }))) : checkError ? /*#__PURE__*/_react["default"].createElement("div", {
    style: style.progressContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: style.progress
  }, /*#__PURE__*/_react["default"].createElement("span", {
    style: style.errorText
  }, lookupType === "resources" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.hrms.manageModal.noDataErrorResources"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.hrms.manageModal.noDataErrorEquipment"
  })))) : /*#__PURE__*/_react["default"].createElement("div", null, lookupSearchAndFilter(), /*#__PURE__*/_react["default"].createElement(_LookupTable["default"], {
    lookupData: search(lookupData),
    lookupType: lookupType,
    contextId: contextId,
    settings: settings,
    assigned: showAssigned,
    available: showAvailable,
    closePopup: handleClose,
    dir: dir
  })))));
};
var _default = ManageModal;
exports["default"] = _default;