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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _SharedComponents = require("orion-components/SharedComponents");
var _Icons = require("orion-components/CBComponents/Icons");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  root: {
    color: "#fff",
    backgroundColor: "#494D53",
    "&:hover": {
      backgroundColor: "#494D53"
    },
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 8
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  item: _propTypes["default"].object.isRequired,
  primaryText: _propTypes["default"].string.isRequired,
  secondaryText: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  handleSelect: _propTypes["default"].func.isRequired,
  selected: _propTypes["default"].bool,
  geometry: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].object]),
  type: _propTypes["default"].string,
  alert: _propTypes["default"].bool,
  dir: _propTypes["default"].string,
  selectFloor: _propTypes["default"].func
};
var defaultProps = {
  secondaryText: "",
  selected: false,
  geometry: false,
  type: null,
  alert: false,
  selectFloor: function selectFloor() {}
};
var CollectionItem = function CollectionItem(_ref) {
  var classes = _ref.classes,
    item = _ref.item,
    primaryText = _ref.primaryText,
    secondaryText = _ref.secondaryText,
    handleSelect = _ref.handleSelect,
    selected = _ref.selected,
    geometry = _ref.geometry,
    type = _ref.type,
    alert = _ref.alert,
    dir = _ref.dir,
    selectFloor = _ref.selectFloor;
  var inlineStyles = {
    textAlign: _objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    })
  };
  var id = item.id,
    feedId = item.feedId,
    entityData = item.entityData;
  var profileIconTemplate = entityData && entityData.properties ? entityData.properties.profileIconTemplate : null;
  return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    onClick: function onClick() {
      return handleSelect(item);
    },
    key: id,
    className: classes.root,
    style: selected ? {
      backgroundColor: "#383D48"
    } : {}
  }, geometry && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    id: id,
    feedId: feedId,
    geometry: geometry,
    selectFloor: selectFloor
  }), type && (0, _SharedComponents.getIconByTemplate)(type, item, "2rem", profileIconTemplate) && /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, null, (0, _SharedComponents.getIconByTemplate)(type, item, "2rem", profileIconTemplate)), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: primaryText,
    secondary: secondaryText,
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1",
      component: "p"
    },
    secondaryTypographyProps: {
      style: {
        color: "#B5B9BE"
      },
      noWrap: true,
      variant: "body2"
    },
    inset: !geometry,
    style: inlineStyles.textAlign
  }), alert && /*#__PURE__*/_react["default"].createElement(_Icons.Alert, {
    fontSize: "large"
  }));
};
CollectionItem.propTypes = propTypes;
CollectionItem.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(CollectionItem);
exports["default"] = _default;