"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactReduxI18n = require("react-redux-i18n");
var Translator = function Translator(_ref) {
  var value = _ref.value,
    count = _ref.count,
    primaryValue = _ref.primaryValue,
    secondaryValue = _ref.secondaryValue,
    style = _ref.style;
  return /*#__PURE__*/_react["default"].createElement(_reactReduxI18n.Translate, {
    value: value,
    count: count != undefined ? count : "",
    primaryValue: primaryValue != undefined ? primaryValue : "",
    secondaryValue: secondaryValue != undefined ? secondaryValue : "",
    style: style
  });
};
var _default = Translator;
exports["default"] = _default;