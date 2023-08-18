"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _i18n = require("orion-components/i18n");
var EntityEdit = function EntityEdit(_ref) {
  var onClick = _ref.onClick;
  return /*#__PURE__*/_react["default"].createElement("a", {
    onClick: onClick
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons"
  }, "edit"), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.entityProfile.entityEdit.edit"
  })));
};
var _default = EntityEdit;
exports["default"] = _default;