"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _SharedComponents = require("orion-components/SharedComponents");
var _styles = require("@mui/styles");
var _reactRedux = require("react-redux");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    avatarRTL: {
      marginRight: "5px!important",
      marginLeft: "-6px!important"
    },
    deleteIcon: {
      color: "rgba(255, 255, 255, 0.26)!important",
      "&.MuiChip-deleteIcon:hover": {
        color: "rgba(255, 255, 255, 0.4)!important"
      }
    },
    deleteIconRTL: {
      margin: "0 -6px 0 5px!important",
      color: "rgba(255, 255, 255, 0.26)!important",
      "&.MuiChip-deleteIcon:hover": {
        color: "rgba(255, 255, 255, 0.4)!important"
      }
    }
  };
});
var DistanceChip = function DistanceChip(_ref) {
  var _context, _context2;
  var path = _ref.path,
    activePath = _ref.activePath,
    deletePath = _ref.deletePath,
    setActivePath = _ref.setActivePath,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var id = path.id,
    name = path.name,
    distance = path.distance,
    eta = path.eta,
    coordinates = path.coordinates,
    unit = path.unit;
  var active = activePath && id === activePath.id;
  var d = distance ? distance.toFixed(2) + " ".concat(unit.display) : 0 + " ".concat(unit.display);
  var e = eta && eta > 0 ? " | ".concat(eta.toFixed(2), " min") : "";
  var geometry = {
    coordinates: coordinates[coordinates.length - 1],
    type: "Point"
  };
  var _useStyles = useStyles(),
    avatarRTL = _useStyles.avatarRTL,
    deleteIcon = _useStyles.deleteIcon,
    deleteIconRTL = _useStyles.deleteIconRTL;
  var chipOverrides = {
    chip: _objectSpread(_objectSpread({}, dir === "rtl" ? {
      marginRight: "8px"
    } : {
      marginLeft: "8px"
    }), {}, {
      color: "#fff",
      background: "#616161",
      "&.MuiChip-clickable:hover": {
        background: "rgb(109, 109, 109)"
      },
      "&.MuiChip-clickableColorPrimary:focus": {
        background: "rgb(40, 145, 194)"
      }
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Chip, {
    onDelete: active ? null : function () {
      return dispatch(deletePath(id));
    },
    onClick: function onClick() {
      return dispatch(setActivePath(path));
    },
    color: active ? "primary" : "default",
    sx: chipOverrides.chip,
    label: (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "".concat(name, "  |  ")).call(_context2, d)).call(_context, e),
    avatar: /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
      sx: {
        background: "#757575"
      }
    }, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
      geometry: geometry
    })),
    classes: {
      avatar: dir == "rtl" ? avatarRTL : {},
      deleteIcon: dir === "rtl" ? deleteIconRTL : deleteIcon
    }
  });
};
var _default = DistanceChip;
exports["default"] = _default;