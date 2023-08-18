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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _js = require("@mdi/js");
var _clientAppCore = require("client-app-core");
var _Actions = require("orion-components/AppState/Actions");
var _reactRedux = require("react-redux");
var _Actions2 = require("orion-components/GlobalData/Actions");
var _Selectors = require("../../GlobalData/Selectors");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _size = _interopRequireDefault(require("lodash/size"));
var _SharedComponents = require("orion-components/SharedComponents");
var _CBComponents = require("orion-components/CBComponents");
var _UnitMemberRows = _interopRequireDefault(require("./UnitMemberRows"));
var _RenameUnit = _interopRequireDefault(require("./Dialog/RenameUnit"));
var _FocusEntitiesBound = _interopRequireDefault(require("./FocusEntitiesBound"));
var _i18n = require("orion-components/i18n");
var _UnitsPanel = require("orion-components/Dock/UnitsPanel/UnitsPanel");
var _Selectors2 = require("../../AppState/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var usePrevious = function usePrevious(value) {
  var ref = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
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
var AssignedUnitsCard = function AssignedUnitsCard(_ref) {
  var dir = _ref.dir,
    id = _ref.id,
    unitData = _ref.unitData,
    feedSettings = _ref.feedSettings,
    lastUnit = _ref.lastUnit;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    unit = _useState4[0],
    setUnit = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    isUnitsDialogOpen = _useState6[0],
    setUnitsDialogOpen = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    deleteDialog = _useState8[0],
    setDeleteDialog = _useState8[1];
  var _useState9 = (0, _react.useState)([]),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    unitGeometry = _useState10[0],
    setUnitGeometry = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    zoomEntities = _useState12[0],
    setZoomEntities = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    unitsActive = _useState14[0],
    setUnitsActive = _useState14[1];
  var _useState15 = (0, _react.useState)(null),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    selectUnitStatusType = _useState16[0],
    setSelectUnitStatusType = _useState16[1];
  var _useState17 = (0, _react.useState)([]),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    targetIds = _useState18[0],
    setTargetIds = _useState18[1];
  var unitMemberSelector = (0, _Selectors.unitMemberMemoized)();
  var unitMembers = (0, _reactRedux.useSelector)(function (state) {
    return unitMemberSelector(state, unitData.id, feedSettings);
  });
  var prevUnitMembers = usePrevious(unitMembers);
  var mapData = (0, _Selectors2.mapSelector)();
  var map = (0, _reactRedux.useSelector)(function (state) {
    return mapData(state);
  });
  var dispatch = (0, _reactRedux.useDispatch)();
  var unitsPanel = (0, _react.useContext)(_UnitsPanel.UnitsPanelContext);
  var unitStatusTypes = unitsPanel.unitStatusTypes;
  var getUnitGeoFromMembers = (0, _react.useCallback)(function () {
    var geoArr = [];
    var unitIdArr = [];
    var layers = map.getStyle().layers;
    var ac2feedLayers = (0, _filter["default"])(layers).call(layers, function (layer) {
      var _context;
      return layer.source && (0, _includes["default"])(_context = layer.source).call(_context, "ac2");
    });
    (0, _forEach["default"])(unitMembers).call(unitMembers, function (member) {
      var layerByFeedId = (0, _filter["default"])(ac2feedLayers).call(ac2feedLayers, function (layer) {
        var _context2;
        return layer.source && (0, _includes["default"])(_context2 = layer.source).call(_context2, member.feedId);
      });
      if ((0, _size["default"])(layerByFeedId) && member.geometry && member.geometry.coordinates) {
        var geometry = member.geometry;
        geometry["targetEntityId"] = member.targetEntityId;
        geoArr.push(geometry);
        unitIdArr.push(member.targetEntityId);
      }
    });
    setUnitGeometry(geoArr);
    setTargetIds(unitIdArr);
  });
  (0, _react.useEffect)(function () {
    if (!(0, _isEqual["default"])(unitMembers, prevUnitMembers)) {
      getUnitGeoFromMembers();
    }
  }, [unitMembers]);
  (0, _react.useEffect)(function () {
    if (unitData) {
      setUnit(unitData);
      if (unitData.isActive) {
        setUnitsActive(unitData.isActive);
        if ("status" in unitData) {
          setSelectUnitStatusType(unitData.status);
        }
      }
    }
  }, [unitData]);
  var handleExpandMenu = function handleExpandMenu(e) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  var handlePopoverClick = function handlePopoverClick(e) {
    // -- stop propagation outside the popover
    e.stopPropagation();
  };
  var handleCloseMenu = function handleCloseMenu() {
    setAnchorEl(null);
  };
  var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
  };
  var toggleNewUnitDialog = function toggleNewUnitDialog() {
    setUnitsDialogOpen(!isUnitsDialogOpen);
    handleCloseMenu();
  };
  var deleteUnit = function deleteUnit() {
    handleCloseMenu();
    _clientAppCore.unitService.deleteUnit(unit.id, function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      }
      if (response) {
        dispatch((0, _Actions2.subscribeUnitMembers)());
      }
    });
  };
  var activateUnit = function activateUnit(unitId) {
    _clientAppCore.unitService.activateUnit(unitId, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  var deactivateUnit = function deactivateUnit(unitId) {
    _clientAppCore.unitService.deactivateUnit(unitId, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };
  var handleIsActive = function handleIsActive(e) {
    setUnitsActive(e.target.checked);
    if (e.target.checked) {
      activateUnit(unit.id);
    } else {
      deactivateUnit(unit.id);
    }
  };
  var handleUnitStatusType = function handleUnitStatusType(e) {
    setSelectUnitStatusType(e.target.value);
    var status = e.target.value;
    _clientAppCore.unitService.setUnitStatus(unit.id, status, function (err, response) {
      if (err) {
        console.log("ERROR:", err, response);
      }
    });
  };

  //zoom entities

  var setFocus = function setFocus() {
    setZoomEntities(true);
    (0, _setTimeout2["default"])(function () {
      setZoomEntities(false);
    }, 3000);
  };
  //zoom entities

  var styles = {
    iconButton: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      "float": "left"
    }), dir === "ltr" && {
      "float": "right"
    }), {}, {
      color: "#fff",
      marginTop: "10px"
    }),
    textAlignRight: _objectSpread({
      margin: "0 20px"
    }, dir === "rtl" && {
      textAlign: "right"
    }),
    container: {
      backgroundColor: "#43494F",
      padding: "10px 14px",
      marginBottom: lastUnit ? 0 : 29,
      borderRadius: "5px"
    },
    header: {
      height: 72
    },
    active: {
      color: "#B6B9BD",
      fontFamily: "Roboto",
      fontSize: "11px",
      marginBottom: "-10px"
    },
    targetingICon: _objectSpread(_objectSpread({
      paddingTop: "10px"
    }, dir === "ltr" && {
      paddingLeft: "8px"
    }), dir === "rtl" && {
      paddingRight: "8px"
    }),
    statusTypeContainer: _objectSpread(_objectSpread({}, dir === "ltr" && {
      paddingRight: "20px"
    }), dir === "rtl" && {
      paddingLeft: "20px"
    }),
    statusType: {
      fontSize: "11px",
      fontWeight: 300
    },
    divider: {
      marginLeft: -10,
      marginRight: -10
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "unitsCardContainer",
    style: styles.container
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "unitsCardHeader",
    style: styles.header
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "11px",
    style: styles.active
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.assignedUnitsCard.Active"
  })), /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    style: {
      marginRight: "0px"
    },
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      style: {
        transform: "scale(1.1)"
      },
      checked: unitsActive,
      onChange: handleIsActive,
      name: "isActive",
      sx: checkboxStyle
    })
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
    style: styles.targetingICon
  }, unitGeometry.length > 0 && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    feedId: "",
    id: id,
    setFocus: setFocus,
    geometry: unitGeometry,
    multipleTargets: true,
    targetIds: targetIds
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 8,
    sm: 8,
    md: 8,
    lg: 8,
    style: {
      padding: "10px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "14px",
    style: {
      margin: "0px 3px",
      color: "#fff",
      fontWeight: 600 // Medium
    }
  }, unit.name), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.statusTypeContainer
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    select: true,
    value: selectUnitStatusType,
    variant: "standard",
    fullWidth: true,
    onChange: handleUnitStatusType,
    InputProps: {
      style: styles.statusType
    }
  }, unitStatusTypes.length > 0 && (0, _map["default"])(unitStatusTypes).call(unitStatusTypes, function (type) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      value: type.id,
      key: "".concat(type.id, "-menu-item")
    }, type.name);
  })))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.iconButton,
    onClick: handleExpandMenu,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, null, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiDotsHorizontal
  })))))), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: styles.divider
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "unitsMember",
    style: {
      color: "#fff",
      paddingRight: "16px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_UnitMemberRows["default"], {
    unitMembers: unitMembers
  })), /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    open: !!anchorEl,
    anchorEl: anchorEl,
    anchorOrigin: {
      vertical: "top",
      horizontal: dir === "rtl" ? "left" : "right"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: dir === "rtl" ? "left" : "right"
    },
    onClose: handleCloseMenu,
    onClick: handlePopoverClick,
    style: {
      borderRadius: "0"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: {
      background: "#4A4D52"
    }
  }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: toggleNewUnitDialog
  }, /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, null, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiPencil
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.units.components.assignedUnitsCard.edit"),
    style: styles.textAlignRight
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: function onClick() {
      return setDeleteDialog("deleteUnitDialog");
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, null, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiTrashCan
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.units.components.assignedUnitsCard.delete"),
    style: styles.textAlignRight
  }))))), zoomEntities && /*#__PURE__*/_react["default"].createElement(_FocusEntitiesBound["default"], {
    items: unitMembers,
    id: id
  }), /*#__PURE__*/_react["default"].createElement(_RenameUnit["default"], {
    open: isUnitsDialogOpen,
    closeDialog: toggleNewUnitDialog,
    unit: unit
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: deleteDialog === "deleteUnitDialog",
    title: (0, _i18n.getTranslation)("global.units.components.assignedUnitsCard.deleteUnit"),
    textContent: (0, _i18n.getTranslation)("global.units.components.assignedUnitsCard.deleteConfirmationText"),
    confirm: {
      action: function action() {
        dispatch((0, _Actions.closeDialog)("deleteUnitDialog"));
        deleteUnit();
        setDeleteDialog("");
      },
      label: /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.units.components.assignedUnitsCard.confirm"
      })
    },
    abort: {
      action: function action() {
        dispatch((0, _Actions.closeDialog)("deleteUnitDialog"));
        handleCloseMenu();
        setDeleteDialog("");
      },
      label: /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.units.components.assignedUnitsCard.cancel"
      })
    }
  }));
};
var _default = AssignedUnitsCard;
exports["default"] = _default;