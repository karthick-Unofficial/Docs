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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
var _material = require("@mui/material");
var _selector = require("orion-components/i18n/Config/selector");
var _UnitMemberRows = _interopRequireDefault(require("./components/UnitMemberRows"));
var _AssignedUnitsCard = _interopRequireDefault(require("./components/AssignedUnitsCard"));
var _NewUnit = _interopRequireDefault(require("./components/Dialog/NewUnit"));
var _theme = _interopRequireDefault(require("orion-components/theme"));
var _styles = require("@mui/material/styles");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _CollectionsCard = _interopRequireDefault(require("./components/CollectionsCard/CollectionsCard"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var Units = function Units(_ref) {
  var feedSettings = _ref.feedSettings,
    units = _ref.units;
  var getUnassignedMembersData = (0, _Selectors.getUnassignedMembers)();
  var unAssignedMembers = (0, _reactRedux.useSelector)(function (state) {
    return getUnassignedMembersData(state, feedSettings);
  });
  var collectionsData = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.collectionsSelector)(state);
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isUnitsDialogOpen = _useState2[0],
    setUnitsDialogOpen = _useState2[1];
  var collectionLocationTypes = [{
    key: "targetCollection",
    title: "TARGET LOCATIONS"
  }, {
    key: "interdictionPointCollection",
    title: "INTERDICTION LOCATIONS"
  }];
  var toggleNewUnitDialog = function toggleNewUnitDialog() {
    setUnitsDialogOpen(!isUnitsDialogOpen);
  };
  var styles = {
    container: {
      backgroundColor: "#3D3F42",
      margin: "0px 5px",
      padding: "6px 15px",
      borderRadius: "5px"
    },
    headerContainer: {
      padding: "0px 5px 12px 5px",
      textAlign: "center"
    },
    header1: _objectSpread(_objectSpread({
      color: "#fff",
      fontWeight: 600,
      fontSize: "16px"
    }, dir === "ltr" && {
      paddingLeft: "35px"
    }), dir === "rtl" && {
      paddingRight: "35px"
    }),
    unassignedHeader: {
      fontSize: 14
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_styles.StyledEngineProvider, {
    injectFirst: true
  }, /*#__PURE__*/_react["default"].createElement(_styles.ThemeProvider, {
    theme: (0, _styles.createTheme)(_theme["default"])
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "unitsContainer",
    dir: dir,
    style: styles.container
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "unitsHeader",
    style: styles.headerContainer
  }, /*#__PURE__*/_react["default"].createElement("span", {
    style: styles.header1
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.main.title"
  })), /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      "float": "right"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    style: {
      textTransform: "none"
    },
    onClick: toggleNewUnitDialog
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.main.newUnit"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "assignedUnits"
  }, units && units.length > 0 && (0, _map["default"])(units).call(units, function (unit, index) {
    return /*#__PURE__*/_react["default"].createElement(_AssignedUnitsCard["default"], {
      key: "assigned-units-card-".concat(index),
      dir: dir,
      id: "1",
      unitData: unit,
      feedSettings: feedSettings,
      lastUnit: index == units.length - 1
    });
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "unitsUnAssigned",
    style: {
      color: "white",
      paddingTop: 14
    }
  }, /*#__PURE__*/_react["default"].createElement("span", {
    style: styles.unassignedHeader
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.main.unassigned"
  })), /*#__PURE__*/_react["default"].createElement(_UnitMemberRows["default"], {
    unitMembers: unAssignedMembers,
    includeDividers: true
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "CollectionsCard"
  }, (0, _map["default"])(collectionLocationTypes).call(collectionLocationTypes, function (collection, index) {
    return /*#__PURE__*/_react["default"].createElement(_CollectionsCard["default"], {
      title: collection.title,
      id: collection.key,
      key: index,
      collectionsData: collectionsData
    });
  })), isUnitsDialogOpen && /*#__PURE__*/_react["default"].createElement(_NewUnit["default"], {
    open: isUnitsDialogOpen,
    closeDialog: toggleNewUnitDialog,
    members: unAssignedMembers
  }))));
};
var _default = Units;
exports["default"] = _default;