"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/entries"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _styles = require("@mui/styles");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  canRemove: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  feedId: _propTypes["default"].string,
  handleClick: _propTypes["default"].func,
  handleRemove: _propTypes["default"].func,
  id: _propTypes["default"].string.isRequired,
  name: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool,
  type: _propTypes["default"].string,
  dir: _propTypes["default"].string,
  selectFloor: _propTypes["default"].func,
  classes: _propTypes["default"].object,
  geometry: _propTypes["default"].object
};
var styles = {
  label: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  disabledButton: {
    color: "#6E777C !important",
    fontWeight: "bolder"
  }
};
var defaultProps = {
  canRemove: false,
  disabled: false,
  feedId: null,
  handleClick: null,
  handleRemove: null,
  name: "",
  readOnly: false,
  type: "",
  dir: "ltr",
  selectFloor: function selectFloor() {}
};
var CollectionCardItem = function CollectionCardItem(_ref) {
  var canRemove = _ref.canRemove,
    disabled = _ref.disabled,
    feedId = _ref.feedId,
    handleClick = _ref.handleClick,
    handleRemove = _ref.handleRemove,
    classes = _ref.classes,
    id = _ref.id,
    name = _ref.name,
    readOnly = _ref.readOnly,
    type = _ref.type,
    geometry = _ref.geometry,
    dir = _ref.dir,
    selectFloor = _ref.selectFloor;
  var inlineStyles = {
    listItemText: _objectSpread({
      padding: 0,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    }, dir === "rtl" && {
      textAlign: "right",
      marginRight: "5px"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    key: id,
    disabled: disabled,
    style: {
      height: 48,
      padding: 8,
      direction: dir
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: type ? 6 : 10,
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, !disabled && (id && feedId || geometry) && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    feedId: feedId,
    id: id,
    geometry: geometry,
    selectFloor: selectFloor
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: inlineStyles.listItemText,
    primary: handleClick ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
      color: "primary",
      classes: {
        label: classes.label,
        disabled: classes.disabledButton
      },
      style: {
        textTransform: "none",
        fontSize: 16
      },
      disabled: disabled,
      onClick: handleClick
    }, name ? name : id ? id.toUpperCase() : "") : name ? name : id ? id.toUpperCase() : "",
    primaryTypographyProps: {
      noWrap: true
    }
  })), type && /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 5
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: type,
    primaryTypographyProps: {
      style: {
        color: "#FFF",
        flex: "0 0 auto",
        marginLeft: 20,
        direction: dir
      },
      noWrap: true,
      variant: "body1"
    }
  })), canRemove && !readOnly && /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: type ? 1 : 2
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleRemove
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null)))));
};
var areEqual = function areEqual(prevProps, nextProps) {
  var _context;
  /*
   * Performance enhancement: Compare all props except handleClick & handleRemove.
   * Comparing functions always returns false and these functions would only change if the underlying item changed,
   * which would cause a rerender of the component anyways. - CD
   */
  var canRemove = nextProps.canRemove,
    disabled = nextProps.disabled,
    feedId = nextProps.feedId,
    id = nextProps.id,
    name = nextProps.name,
    readOnly = nextProps.readOnly,
    type = nextProps.type,
    geometry = nextProps.geometry;
  var changedProps = (0, _reduce["default"])(_context = (0, _entries["default"])({
    canRemove: canRemove,
    disabled: disabled,
    feedId: feedId,
    id: id,
    name: name,
    readOnly: readOnly,
    type: type,
    geometry: geometry
  })).call(_context, function (changedProp, _ref2) {
    var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
      key = _ref3[0],
      val = _ref3[1];
    if (prevProps[key] !== val) {
      changedProp[key] = [prevProps[key], val];
    }
    return changedProp;
  }, {});
  if ((0, _keys["default"])(changedProps).length > 0) {
    return false;
  } else {
    return true;
  }
};
CollectionCardItem.propTypes = propTypes;
CollectionCardItem.defaultProps = defaultProps;
var _default = /*#__PURE__*/_react["default"].memo((0, _styles.withStyles)(styles)(CollectionCardItem), areEqual);
exports["default"] = _default;