"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _clientAppCore = require("client-app-core");
var _propTypes = _interopRequireDefault(require("prop-types"));
var propTypes = {
  locale: _propTypes["default"].string
};
var defaultProps = {
  locale: "en"
};
var UserTime = function UserTime(_ref) {
  var time = _ref.time,
    format = _ref.format,
    locale = _ref.locale;
  var userTime = _clientAppCore.timeConversion.convertToUserTime(time, format, locale);
  return /*#__PURE__*/_react["default"].createElement("div", null, userTime);
};
UserTime.propTypes = propTypes;
UserTime.defaultProps = defaultProps;
var _default = UserTime;
exports["default"] = _default;