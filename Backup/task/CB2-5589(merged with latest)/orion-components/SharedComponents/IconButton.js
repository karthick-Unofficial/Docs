"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var IconButton = function IconButton(_ref) {
  var onClick = _ref.onClick,
    iconName = _ref.iconName;
  return /*#__PURE__*/_react["default"].createElement("button", {
    onClick: onClick,
    style: {
      backgroundColor: "transparent",
      color: "white",
      border: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons"
  }, iconName));
};
var _default = IconButton;
exports["default"] = _default;