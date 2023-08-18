"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactReduxI18n = require("react-redux-i18n");
var LocalizeComponent = function LocalizeComponent(_ref) {
  var value = _ref.value,
    dateFormat = _ref.dateFormat,
    options = _ref.options;
  return /*#__PURE__*/_react["default"].createElement(_reactReduxI18n.Localize, {
    value: value,
    dateFormat: dateFormat,
    options: options ? options : null
  });
};
var _default = LocalizeComponent;
exports["default"] = _default;