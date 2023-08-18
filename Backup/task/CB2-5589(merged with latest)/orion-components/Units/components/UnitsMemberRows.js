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
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  newUnit: _propTypes["default"].bool,
  getSelectedUnitMembers: _propTypes["default"].func
};
var defaultProps = {
  newUnit: false,
  getSelectedUnitMembers: function getSelectedUnitMembers() {}
};
var geometry = {
  "coordinates": [-96.51724428580445, 51.43671891342285],
  "type": "Point"
};
var UnitMemberRows = function UnitMemberRows(_ref) {
  var unitMembers = _ref.unitMembers,
    newUnit = _ref.newUnit,
    getSelectedUnitMembers = _ref.getSelectedUnitMembers;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitMembersState = _useState2[0],
    setUnitMembersState = _useState2[1];
  (0, _react.useEffect)(function () {
    setUnitMembersState(unitMembers);
  }, [unitMembers]);
  var handleIsActive = function handleIsActive(e, i) {
    unitMembersState[i]["".concat(e.target.name)] = e.target.checked;
    setUnitMembersState((0, _toConsumableArray2["default"])(unitMembersState));
    if (newUnit) {
      getSelectedUnitMembers(unitMembers[i]);
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "UnitMemberRows"
  }, unitMembersState && (0, _map["default"])(unitMembersState).call(unitMembersState, function (unit, index) {
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      container: true
    }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 1,
      sm: 1,
      md: 1,
      lg: 1
    }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
      control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        style: {
          transform: "scale(1.1)"
        },
        checked: newUnit ? unit.selected : unit.isActive,
        name: newUnit ? "selected" : "isActive",
        onChange: function onChange(e) {
          handleIsActive(e, index);
        }
      })
    })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, geometry && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
      feedId: "",
      id: index,
      geometry: geometry
    })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, /*#__PURE__*/_react["default"].createElement("div", null, unit.memberType === "person" ? /*#__PURE__*/_react["default"].createElement("img", {
      alt: "person",
      style: {
        width: 35,
        margin: "5px 10px"
      },
      src: require("../../SharedComponents/ShapeEdit/icons/Person_blue.png")
    }) : /*#__PURE__*/_react["default"].createElement("img", {
      alt: "police_car",
      style: {
        width: 35,
        margin: "5px 10px"
      },
      src: require("../../SharedComponents/ShapeEdit/icons/Police_Car_blue.png")
    }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 5,
      sm: 5,
      md: 5,
      lg: 5
    }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: {
        fontSize: "14px",
        paddingTop: "12px",
        margin: "0px 5px"
      }
    }, unit.name)), !newUnit ? /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "text",
      style: {
        textTransform: "none",
        color: "#66686C"
      }
    }, "Settings")) : null), index === unitMembersState.length - 1 ? null : /*#__PURE__*/_react["default"].createElement(_material.Divider, {
      style: {
        background: "#626466",
        marginBottom: "3px",
        marginTop: "3px",
        padding: "0px 4px"
      }
    }));
  }));
};
UnitMemberRows.propTypes = propTypes;
UnitMemberRows.defaultProps = defaultProps;
var _default = UnitMemberRows;
exports["default"] = _default;