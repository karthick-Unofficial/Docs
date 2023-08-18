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
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var WidgetTable = function WidgetTable(_ref) {
  var tableData = _ref.tableData,
    WidgetType = _ref.WidgetType,
    expanded = _ref.expanded,
    dir = _ref.dir;
  var style = {
    cell: _objectSpread({
      color: "#D5D7D7",
      borderBottom: "1px solid #969AA0"
    }, dir === "rlt" && {
      textAlign: "right"
    })
  };
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    tableHeader = _useState2[0],
    setTableHeader = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    widgetData = _useState4[0],
    setWidgetData = _useState4[1];
  (0, _react.useEffect)(function () {
    if (WidgetType === "resources") {
      setTableHeader([{
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.widgetTable.name")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.widgetTable.rank")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.widgetTable.location")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.widgetTable.unit")
      }]);
    } else {
      setTableHeader([{
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.widgetTable.name")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.widgetTable.category")
      }, {
        header: (0, _i18n.getTranslation)("global.profiles.widgets.hrms.widgetTable.unit")
      }]);
    }
    (0, _sort["default"])(tableData).call(tableData, function (a, b) {
      return a.Name.localeCompare(b.Name);
    });
    setWidgetData(tableData);
  }, [WidgetType, tableData]);
  return /*#__PURE__*/_react["default"].createElement("div", null, widgetData.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.TableContainer, {
    style: {
      maxHeight: "auto",
      overflow: !expanded ? "hidden" : "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Table, null, /*#__PURE__*/_react["default"].createElement("colgroup", null, (0, _map["default"])(tableHeader).call(tableHeader, function (row, index) {
    return /*#__PURE__*/_react["default"].createElement("col", {
      width: "34%",
      key: index
    });
  })), /*#__PURE__*/_react["default"].createElement(_material.TableHead, null, /*#__PURE__*/_react["default"].createElement(_material.TableRow, null, (0, _map["default"])(tableHeader).call(tableHeader, function (value, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: {
        position: "sticky",
        color: "#969AA0",
        backgroundColor: expanded ? "#35383C" : "#2C2D2F"
      },
      key: index
    }, value.header);
  }))), /*#__PURE__*/_react["default"].createElement(_material.TableBody, null, WidgetType === "resources" ? (0, _map["default"])(widgetData).call(widgetData, function (element, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableRow, {
      key: index,
      tabIndex: "0",
      id: "widgetScrollResource"
    }, /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.Name), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.RankName), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.LocationName), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.UnitName));
  }) : (0, _map["default"])(widgetData).call(widgetData, function (element, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableRow, {
      key: index,
      tabIndex: "0",
      id: "widgetScrollEquipment"
    }, /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.Name), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.Category), /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      style: style.cell
    }, element.UnitName));
  }))))) : /*#__PURE__*/_react["default"].createElement("div", null));
};
var _default = WidgetTable;
exports["default"] = _default;