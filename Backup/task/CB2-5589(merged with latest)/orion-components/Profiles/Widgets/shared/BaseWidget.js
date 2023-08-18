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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _size = _interopRequireDefault(require("lodash/size"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
// TODO: Restore once Portals are implemented
// import { Portal } from "orion-components/CBComponents";

var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  order: _propTypes["default"].number,
  title: _propTypes["default"].string.isRequired,
  children: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  handleExpand: _propTypes["default"].func,
  expanded: _propTypes["default"].bool,
  expandable: _propTypes["default"].bool,
  icon: _propTypes["default"].element,
  enabled: _propTypes["default"].bool,
  handleLaunch: _propTypes["default"].func,
  launchable: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  handleExpand: null,
  children: [],
  expanded: false,
  order: 0,
  expandable: false,
  icon: null,
  enabled: true,
  handleLaunch: null,
  launchable: false,
  dir: "ltr"
};
var styles = {
  root: {
    paddingRight: 0,
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  rootRTL: {
    paddingLeft: 0,
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
};
var BaseWidget = function BaseWidget(_ref) {
  var classes = _ref.classes,
    order = _ref.order,
    enabled = _ref.enabled,
    title = _ref.title,
    children = _ref.children,
    icon = _ref.icon,
    handleExpand = _ref.handleExpand,
    expanded = _ref.expanded,
    expandable = _ref.expandable,
    handleLaunch = _ref.handleLaunch,
    launchable = _ref.launchable,
    dir = _ref.dir;
  // TODO: Restore once Portals are implemented
  // componentDidMount() {
  // 	const node = document.getElementById("profile-widgets");
  // 	this.setState({ node });
  // }

  // handleExpand = () => {
  // 	const { expanded } = this.state;
  // 	const node = document.getElementById("node");
  // 	this.setState({ expanded: !expanded, node });
  // };
  // TODO: Restore once Portals are implemented
  // const { expanded, node } = this.state;
  var styles = {
    wrapper: {
      backgroundColor: expanded ? "transparent" : "#2C2D2F",
      marginTop: 4,
      borderRadius: 5,
      padding: 10,
      order: order,
      display: "flex",
      flexDirection: "column"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#FFF"
    },
    headerButtons: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      marginRight: "auto"
    }), dir === "ltr" && {
      marginLeft: "auto"
    }), {}, {
      display: "flex"
    }),
    iconButton: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    }), {}, {
      width: "auto"
    }),
    launchableButton: _objectSpread(_objectSpread({
      width: "auto",
      color: "white"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    })
  };

  // TODO: Restore once Portals are implemented
  // return node ? (
  // 	<Portal node={node}>

  return enabled ?
  /*#__PURE__*/
  /**
   * Remove styling if theres nothing to render
   * Prevents padding on empty widgets (Map Widget) from from affecting
   * profile layout
   */
  _react["default"].createElement("div", {
    style: expanded && !(0, _size["default"])(children) ? {} : styles.wrapper
  }, !expanded && /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.header
  }, Boolean(icon) && icon, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: dir == "rtl" ? {
      marginLeft: "auto",
      marginRight: icon ? "1rem" : 0
    } : {
      marginRight: "auto",
      marginLeft: icon ? "1rem" : 0
    },
    variant: "subtitle1"
  }, title), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.headerButtons
  }, expandable && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    disableTouchRipple: true,
    className: dir == "rtl" ? classes.rootRTL : classes.root,
    style: styles.iconButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], {
    style: {
      color: "#FFF"
    }
  })), launchable && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    disableTouchRipple: true,
    style: styles.launchableButton,
    onClick: handleLaunch
  }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null)))), children) : /*#__PURE__*/_react["default"].createElement(_react.Fragment, null);

  // 	</Portal>
  // ) : (
  // 	<div />
  // );
};

BaseWidget.propTypes = propTypes;
BaseWidget.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(BaseWidget);
exports["default"] = _default;