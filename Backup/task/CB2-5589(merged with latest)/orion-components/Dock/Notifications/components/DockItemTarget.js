"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var DockItemTarget = function DockItemTarget(_ref) {
  var onMouseEnter = _ref.onMouseEnter,
    onMouseExit = _ref.onMouseExit,
    onClick = _ref.onClick;
  var mouseEnter = function mouseEnter(e) {
    // console.log(e.target.getBoundingClientRect());
    var pos = e.target.getBoundingClientRect();
    // console.log(pos.height);
    onMouseEnter(pos.right - pos.width / 2 - 6, pos.top - 36);
  };
  var mouseLeave = function mouseLeave() {
    onMouseExit();
  };
  return /*#__PURE__*/_react["default"].createElement("a", {
    className: "target-icon-wrapper",
    onClick: onClick,
    onMouseLeave: mouseLeave
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "targeting-icon",
    onMouseEnter: mouseEnter
  }));
};
var _default = DockItemTarget;
exports["default"] = _default;