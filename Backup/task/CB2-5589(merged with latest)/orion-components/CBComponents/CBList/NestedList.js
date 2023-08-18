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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _iconsMaterial = require("@mui/icons-material");
var _map = _interopRequireDefault(require("lodash/map"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var styles = {
  dense: {
    padding: 0
  },
  root: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  items: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  header: _propTypes["default"].string.isRequired,
  headerStyle: _propTypes["default"].object,
  nestedStyle: _propTypes["default"].object,
  inset: _propTypes["default"].bool,
  dense: _propTypes["default"].bool
};
var defaultProps = {
  headerStyle: {
    variant: "body1",
    color: "#FFF"
  },
  nestedStyle: {
    variant: "body1",
    color: "#FFF"
  },
  inset: true,
  dense: false
};
var NestedList = function NestedList(_ref) {
  var classes = _ref.classes,
    items = _ref.items,
    header = _ref.header,
    headerStyle = _ref.headerStyle,
    nestedStyle = _ref.nestedStyle,
    inset = _ref.inset,
    dense = _ref.dense;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var handleExpand = function handleExpand() {
    setExpanded(!expanded);
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    className: classes.root,
    style: {
      color: headerStyle.color,
      height: dense ? 16 : "auto"
    },
    button: true,
    dense: dense,
    onClick: handleExpand,
    disableGutters: true,
    disableTouchRipple: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: header,
    primaryTypographyProps: {
      noWrap: true,
      variant: headerStyle.variant
    }
  }), expanded ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded
  }, /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: {
      padding: 0
    }
  }, (0, _map["default"])(items, function (item) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: item.name,
      style: {
        color: nestedStyle.color
      },
      className: dense ? classes.dense : "",
      disableGutters: !inset,
      dense: dense,
      id: item.name
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: item.name,
      primaryTypographyProps: {
        noWrap: true,
        variant: nestedStyle.variant
      }
    }));
  }))));
};
NestedList.propTypes = propTypes;
NestedList.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(NestedList);
exports["default"] = _default;