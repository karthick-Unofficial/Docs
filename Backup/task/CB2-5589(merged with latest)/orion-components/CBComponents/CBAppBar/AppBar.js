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
var _AppMenu = _interopRequireDefault(require("../CBAppMenu/AppMenu"));
var _index = require("../index");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./appBarActions"));
var _size = _interopRequireDefault(require("lodash/size"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var styles = {
  root: {
    flexGrow: 1,
    position: "relative",
    zIndex: 9999
  },
  toolbar: {
    backgroundColor: "#41454a",
    color: "#fff",
    height: 48,
    minHeight: 48
  },
  flex: {
    flexGrow: 1
  },
  paper: {
    borderRadius: 0
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  location: _propTypes["default"].string.isRequired,
  dir: _propTypes["default"].string
};
var CBAppBar = function CBAppBar(_ref) {
  var classes = _ref.classes,
    location = _ref.location,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var startNotificationStream = actionCreators.startNotificationStream;
  var globalData = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData;
  });
  var alertCount = (0, _size["default"])((0, _pickBy["default"])(globalData.notifications.activeItemsById, function (item) {
    return item.isPriority;
  }));
  // const user = useSelector(state => state.user); #comment-Not used anymore

  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    dockOpen = _useState4[0],
    setDockOpen = _useState4[1];
  (0, _react.useEffect)(function () {
    dispatch(startNotificationStream());
  }, []);
  var handleMenuOpen = function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  };
  var handleMenuClose = function handleMenuClose() {
    setAnchorEl(null);
  };
  var handleOpenDock = function handleOpenDock() {
    setDockOpen(true);
  };
  var handleCloseDock = function handleCloseDock() {
    setDockOpen(false);
  };
  var open = Boolean(anchorEl);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: classes.root
  }, /*#__PURE__*/_react["default"].createElement(_material.AppBar, {
    position: "static"
  }, /*#__PURE__*/_react["default"].createElement(_material.Toolbar, {
    className: classes.toolbar,
    style: alertCount > 0 ? {
      backgroundColor: "#E85858"
    } : {}
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "title",
    color: "inherit",
    className: classes.flex
  }, location), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleOpenDock,
    color: "inherit"
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Info, null)), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    color: "inherit"
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Videocam, null)), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    color: "inherit"
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.RssFeed, null)), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: open ? handleMenuClose : handleMenuOpen,
    color: "inherit"
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Apps, null)), /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    id: "cb-app-menu",
    className: classes.paper,
    open: open,
    anchorEl: anchorEl,
    onClose: handleMenuClose,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "right"
    }
  }, /*#__PURE__*/_react["default"].createElement(_AppMenu["default"], null)))), /*#__PURE__*/_react["default"].createElement(_index.Dock, {
    open: dockOpen,
    handleClose: handleCloseDock,
    dir: dir
  }));
};
CBAppBar.propTypes = propTypes;
var _default = (0, _styles.withStyles)(styles)(CBAppBar);
exports["default"] = _default;