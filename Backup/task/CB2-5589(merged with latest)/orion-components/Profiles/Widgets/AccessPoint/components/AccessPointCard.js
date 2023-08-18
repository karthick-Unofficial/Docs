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
var _material = require("@mui/material");
var _reactRedux = require("react-redux");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var AccessPointCard = function AccessPointCard(props) {
  var dispatch = (0, _reactRedux.useDispatch)();
  var accessPoint = props.accessPoint,
    loadProfile = props.loadProfile,
    canTarget = props.canTarget,
    readOnly = props.readOnly,
    dir = props.dir;
  var handleHeaderClick = function handleHeaderClick(e, accessPoint) {
    e.stopPropagation();
    var id = accessPoint.id,
      entityData = accessPoint.entityData;
    dispatch(loadProfile(id, entityData.properties.name, "accessPoint", "profile"));
  };
  var id = accessPoint.id,
    feedId = accessPoint.feedId,
    entityData = accessPoint.entityData;
  var name = entityData.properties.name;
  var styles = {
    listItem: _objectSpread({
      backgroundColor: "#494D53",
      minHeight: 48,
      padding: "0px 6px"
    }, dir === "rtl" && {
      direction: "rtl"
    }),
    listItemText: _objectSpread(_objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    }), {}, {
      padding: 0
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: {
      borderRadius: 0,
      marginBottom: 12
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: loadProfile && !readOnly,
    onClick: function onClick(e) {
      return handleHeaderClick(e, accessPoint);
    },
    style: styles.listItem
  }, canTarget && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    geometry: entityData.geometry,
    id: id,
    feedId: feedId
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: styles.listItemText,
    primary: /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        padding: "0px 12px"
      }
    }, name),
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1"
    }
  })));
};
var _default = AccessPointCard;
exports["default"] = _default;