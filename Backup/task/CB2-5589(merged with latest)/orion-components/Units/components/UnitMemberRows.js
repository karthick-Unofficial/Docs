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
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Settings = _interopRequireDefault(require("./Dialog/Settings"));
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  newUnit: _propTypes["default"].bool,
  getSelectedUnitMembers: _propTypes["default"].func
};
var defaultProps = {
  newUnit: false,
  getSelectedUnitMembers: function getSelectedUnitMembers() {}
};
var checkboxStyle = {
  "&.Mui-checked": {
    position: "relative",
    "&:after": {
      content: '""',
      left: 13,
      top: 13,
      height: 15,
      width: 15,
      position: "absolute",
      backgroundColor: "#fff",
      zIndex: -1
    }
  }
};
var UnitMemberRows = function UnitMemberRows(_ref) {
  var _context;
  var unitMembers = _ref.unitMembers,
    newUnit = _ref.newUnit,
    getSelectedUnitMembers = _ref.getSelectedUnitMembers,
    _ref$includeDividers = _ref.includeDividers,
    includeDividers = _ref$includeDividers === void 0 ? false : _ref$includeDividers;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitMembersState = _useState2[0],
    setUnitMembersState = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    isUnitsDialogOpen = _useState4[0],
    setUnitsDialogOpen = _useState4[1];
  var _useState5 = (0, _react.useState)({}),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    unitSelected = _useState6[0],
    setUnitSelected = _useState6[1];
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  (0, _react.useEffect)(function () {
    setUnitMembersState(unitMembers);
  }, [unitMembers]);
  var toggleSettingsDialog = function toggleSettingsDialog(id) {
    if (id) {
      var selected = (0, _find["default"])(unitMembers).call(unitMembers, function (unit) {
        return unit.id === id;
      });
      setUnitSelected(selected);
    }
    setUnitsDialogOpen(!isUnitsDialogOpen);
  };
  var activateUnitMember = function activateUnitMember(unitMemberId) {
    _clientAppCore.unitService.activateUnitMember(unitMemberId, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  var deactivateUnitMember = function deactivateUnitMember(unitMemberId) {
    _clientAppCore.unitService.deactivateUnitMember(unitMemberId, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  var handleIsActive = function handleIsActive(e, i) {
    unitMembersState[i]["".concat(e.target.name)] = e.target.checked;
    setUnitMembersState((0, _toConsumableArray2["default"])(unitMembersState));

    // selected unit  members that are to be assigned to a unit
    if (newUnit) {
      getSelectedUnitMembers(unitMembers[i]);
    } else {
      if (e.target.checked) {
        activateUnitMember(unitMembersState[i].id);
      } else {
        deactivateUnitMember(unitMembersState[i].id);
      }
    }
  };
  var styles = {
    gridContainer: {
      height: 60,
      alignItems: "center"
    },
    unitMemberIconContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    unitMemberIcon: {
      width: 30,
      marginLeft: 10
    },
    unitMemberName: {
      fontSize: "12px",
      fontWeight: "300",
      margin: "0px 12px"
    },
    settingsButton: {
      textTransform: "none",
      color: "#82858A",
      fontSize: "12px",
      fontWeight: "300"
    },
    divider: {
      background: "#626466",
      marginBottom: "3px",
      marginTop: "3px",
      padding: "0px 4px"
    },
    checkboxLabel: {
      marginRight: "0px"
    },
    checkbox: {
      transform: "scale(1.1)"
    },
    targetingIconContainer: _objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: "12px"
    }), dir === "rtl" && {
      marginRight: "12px"
    })
  };
  var renderRows = function renderRows(unit, index) {
    var disableIsActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      container: true,
      style: styles.gridContainer
    }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 1,
      sm: 1,
      md: 1,
      lg: 1
    }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
      style: styles.checkboxLabel,
      control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        style: styles.checkbox,
        sx: checkboxStyle,
        checked: newUnit ? unit.selected : unit.isActive,
        name: newUnit ? "selected" : "isActive",
        onChange: function onChange(e) {
          handleIsActive(e, index);
        },
        disabled: disableIsActive
      })
    })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: styles.targetingIconContainer
    }, unit.geometry && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
      feedId: unit.feedId,
      id: unit.targetEntityId,
      geometry: unit.geometry,
      feedLayerCheck: true
    }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2,
      style: styles.unitMemberIconContainer
    }, unit.memberType === "person" ? /*#__PURE__*/_react["default"].createElement("img", {
      alt: "person",
      style: styles.unitMemberIcon,
      src: require("../../SharedComponents/ShapeEdit/icons/Person_blue.png")
    }) : /*#__PURE__*/_react["default"].createElement("img", {
      alt: "police_car",
      style: styles.unitMemberIcon,
      src: require("../../SharedComponents/ShapeEdit/icons/Police_Car_blue.png")
    })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 5,
      sm: 5,
      md: 5,
      lg: 5
    }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: styles.unitMemberName
    }, unit.name)), !newUnit ? /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "text",
      style: styles.settingsButton,
      onClick: function onClick() {
        return toggleSettingsDialog(unit.id);
      }
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.units.components.unitMemberRows.settings"
    }))) : null), includeDividers && index !== unitMembersState.length - 1 && /*#__PURE__*/_react["default"].createElement(_material.Divider, {
      style: styles.divider
    }));
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "UnitMemberRows"
  }, newUnit && unitMembersState && (0, _map["default"])(_context = (0, _filter["default"])(unitMembersState).call(unitMembersState, function (unitMemberData) {
    if (unitMemberData.isFeed === false) {
      return unitMemberData;
    }
  })).call(_context, function (unit, index) {
    return renderRows(unit, index);
  }), !newUnit && unitMembersState && (0, _map["default"])(unitMembersState).call(unitMembersState, function (unit, index) {
    var disableIsActive = false;
    if ("isFeed" in unit) {
      if (unit.isFeed === true) {
        disableIsActive = true;
      }
    }
    return renderRows(unit, index, disableIsActive);
  }), isUnitsDialogOpen && /*#__PURE__*/_react["default"].createElement(_Settings["default"], {
    open: isUnitsDialogOpen,
    closeDialog: toggleSettingsDialog,
    unitMember: unitSelected
  }));
};
UnitMemberRows.propTypes = propTypes;
UnitMemberRows.defaultProps = defaultProps;
var compareProps = function compareProps(props, nextProps) {
  if ((0, _isEqual["default"])(props.unitMembers, nextProps.unitMembers)) {
    return true;
  } else {
    return false;
  }
};
var _default = /*#__PURE__*/(0, _react.memo)(UnitMemberRows, compareProps);
exports["default"] = _default;