"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var styles = {
  paper: {
    marginTop: 48,
    width: 420
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  open: _propTypes["default"].bool.isRequired,
  handleClose: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var Dock = function Dock(_ref) {
  var classes = _ref.classes,
    open = _ref.open,
    handleClose = _ref.handleClose,
    dir = _ref.dir;
  return /*#__PURE__*/_react["default"].createElement(_material.ClickAwayListener, {
    onClickAway: handleClose
  }, /*#__PURE__*/_react["default"].createElement(_material.Drawer, {
    classes: {
      paper: classes.paper
    },
    open: open,
    anchor: dir == "rtl" ? "left" : "right",
    variant: "persistent"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBDock.drawer"
  })));
};
Dock.propTypes = propTypes;
var _default = (0, _styles.withStyles)(styles)(Dock);
exports["default"] = _default;