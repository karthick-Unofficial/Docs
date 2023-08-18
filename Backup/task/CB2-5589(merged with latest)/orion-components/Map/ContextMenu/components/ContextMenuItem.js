"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var ContextMenuItem = (0, _styles.withStyles)({
  root: {
    minWidth: 220,
    maxWidth: 300,
    minHeight: 54,
    whiteSpace: "normal",
    backgroundColor: "#494d53",
    color: "#ffffff",
    fontSize: 14,
    "&:hover, &:focus": {
      backgroundColor: "#2c2d2f"
    }
  }
})(_material.MenuItem);
var _default = ContextMenuItem;
exports["default"] = _default;