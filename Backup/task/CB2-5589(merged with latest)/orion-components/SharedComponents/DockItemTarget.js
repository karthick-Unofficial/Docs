"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _GpsNotFixed = _interopRequireDefault(require("@mui/icons-material/GpsNotFixed"));
// Material UI

var DockItemTarget = function DockItemTarget(_ref) {
  var onMouseExit = _ref.onMouseExit,
    onClick = _ref.onClick,
    onMouseEnter = _ref.onMouseEnter;
  var mouseEnter = function mouseEnter(e) {
    var pos = e.target.getBoundingClientRect();
    onMouseEnter(pos.right - pos.width / 2 - 6, pos.top - 36);
  };
  var mouseLeave = function mouseLeave() {
    onMouseExit();
  };
  return /*#__PURE__*/_react["default"].createElement("a", {
    className: "target",
    onClick: onClick,
    onMouseLeave: mouseLeave
  }, /*#__PURE__*/_react["default"].createElement(_GpsNotFixed["default"], {
    onMouseEnter: mouseEnter
  }));
};
var _default = DockItemTarget;
exports["default"] = _default;