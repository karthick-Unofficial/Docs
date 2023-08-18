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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var LookupTable = function LookupTable(_ref) {
  var contextId = _ref.contextId,
    lookupData = _ref.lookupData,
    lookupType = _ref.lookupType,
    assigned = _ref.assigned,
    available = _ref.available,
    closePopup = _ref.closePopup,
    dir = _ref.dir;
  var style = {
    tableHead: {
      color: "#969AA0",
      position: "sticky",
      background: "#2C2D2F",
      top: 0,
      zIndex: 1,
      borderBottom: "1px solid #969AA0"
    },
    cell: {
      color: "#D5D7D7",
      borderBottom: "1px solid #969AA0"
    },
    lookupTableDone: _objectSpread(_objectSpread({
      width: "130px",
      padding: "5px 20px",
      color: "white",
      background: "#4DB5F4",
      borderRadius: "5px"
    }, dir === "rtl" && {
      marginRight: "20px"
    }), dir === "rtl" && {
      marginLeft: "20px"
    })
  };
  var resourceRef = (0, _react.useRef)();
  var equipmentRef = (0, _react.useRef)();
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    tableHeader = _useState2[0],
    setTableHeader = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    widgetData = _useState4[0],
    setWidgetData = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    checkLookupData = _useState6[0],
    setCheckLookupData = _useState6[1];
  (0, _react.useEffect)(function () {
    if (lookupType === "resources") {
      setTableHeader([{
        header: ""
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.shiftEnding")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.location")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.unit")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.rank")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.name")
      }]);
    } else {
      setTableHeader([{
        header: ""
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.name")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.category")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.count")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.lookupTable.unit")
      }]);
    }
    if (assigned && !available) {
      var data = (0, _filter["default"])(widgetData).call(widgetData, function (element) {
        return element.Selected == true;
      });
      setWidgetData(data);
    } else if (available && !assigned) {
      var _data = (0, _filter["default"])(widgetData).call(widgetData, function (element) {
        return element.AvailableNow == true;
      });
      setWidgetData(_data);
    } else {
      if (lookupData) {
        if (lookupData !== undefined) {
          setWidgetData(lookupData);
          setCheckLookupData(true);
        }
      }
    }
  }, [lookupType, lookupData, assigned, available]);
  var actions = function actions() {
    var handleSave = function handleSave() {
      if (lookupType === "resources") {
        var resources = [];
        (0, _find["default"])(widgetData).call(widgetData, function (data) {
          if (data.Selected === true) {
            resources.push(data);
          }
        });
        var update = {
          additionalProperties: {
            resources: resources
          }
        };
        _clientAppCore.eventService.updateEvent(contextId, update, function (err, response) {
          if (err) console.log(err);
          if (response) closePopup();
        });
      } else {
        var equipments = [];
        (0, _find["default"])(widgetData).call(widgetData, function (data) {
          if (data.Selected === true) {
            equipments.push(data);
          }
        });
        var _update = {
          additionalProperties: {
            equipments: equipments
          }
        };
        _clientAppCore.eventService.updateEvent(contextId, _update, function (err, response) {
          if (err) console.log(err);
          if (response) closePopup();
        });
      }
    };
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        marginTop: "5%",
        "float": "right",
        marginBottom: "5%"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: closePopup
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.hrms.lookupTable.cancel"
    })), /*#__PURE__*/_react["default"].createElement(_material.Button, {
      style: style.lookupTableDone,
      onClick: handleSave
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.hrms.lookupTable.done"
    })));
  };
  var handleCheck = function handleCheck(e, i) {
    widgetData[i]["".concat(e.target.name)] = e.target.checked;
    setWidgetData((0, _toConsumableArray2["default"])(widgetData));
  };
  var onResourceRefChange = (0, _react.useCallback)(function (node) {
    if (node !== null) {
      resourceRef.current = node;
      if (resourceRef !== null) {
        if (document.getElementById("trowsScrollResource")) document.getElementById("trowsScrollResource").focus();
      }
    }
  }, []);
  var onEquipmentRefChange = (0, _react.useCallback)(function (node) {
    if (node !== null) {
      equipmentRef.current = node;
      if (equipmentRef !== null) {
        document.getElementById("trowsScrollEquipment").focus();
      }
    }
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", null, checkLookupData ? widgetData.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.TableContainer, {
    style: {
      maxHeight: "40vh"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Table, null, /*#__PURE__*/_react["default"].createElement("colgroup", null, (0, _map["default"])(tableHeader).call(tableHeader, function (row, index) {
    if (index === 0) {
      return /*#__PURE__*/_react["default"].createElement("col", {
        width: "5%",
        key: index
      });
    } else {
      /*#__PURE__*/_react["default"].createElement("col", {
        width: "25%",
        key: index
      });
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.TableHead, null, /*#__PURE__*/_react["default"].createElement(_material.TableRow, {
    style: {
      background: "#2C2D2F"
    }
  }, (0, _map["default"])(tableHeader).call(tableHeader, function (value, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.tableHead,
      key: index
    }, value.header);
  }))), /*#__PURE__*/_react["default"].createElement(_material.TableBody, null, lookupType === "resources" ? (0, _map["default"])(widgetData).call(widgetData, function (element, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableRow, {
      key: index,
      tabIndex: "0",
      ref: onResourceRefChange,
      id: "trowsScrollResource"
    }, /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      name: "Selected",
      checked: element.Selected,
      color: "primary",
      style: {
        color: element.Selected ? "#4DB6F5" : "#55575A"
      },
      onChange: function onChange(e) {
        return handleCheck(e, index);
      }
    })), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.ShiftEndTime), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.LocationName), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.UnitName), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.RankName), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.Name));
  }) : (0, _map["default"])(widgetData).call(widgetData, function (element, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableRow, {
      key: index,
      ref: onEquipmentRefChange,
      tabIndex: "0",
      id: "trowsScrollEquipment"
    }, /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      name: "Selected",
      checked: element.Selected,
      color: "primary",
      style: {
        color: element.Selected ? "#4DB6F5" : "#55575A"
      },
      onChange: function onChange(e) {
        return handleCheck(e, index);
      }
    })), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.Name), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.Category), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.ItemCount), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.UnitName));
  }))))) : /*#__PURE__*/_react["default"].createElement("div", null) : null, actions());
};
var _default = LookupTable;
exports["default"] = _default;