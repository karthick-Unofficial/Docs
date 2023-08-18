"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var propTypes = {
  size: _propTypes["default"].number,
  image: _propTypes["default"].string,
  name: _propTypes["default"].string.isRequired
};
var defaultProps = {
  size: 40,
  image: null
};
var CBAvatar = function CBAvatar(_ref) {
  var size = _ref.size,
    image = _ref.image,
    name = _ref.name;
  return /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
    style: {
      width: size,
      height: size,
      color: "#FFF",
      backgroundColor: "#".concat((Math.random() * 0xffffff << 0).toString(16))
    },
    alt: name,
    src: image
  }, !image && name.match(/\b(\w)/g));
};
CBAvatar.propTypes = propTypes;
CBAvatar.defaultProps = defaultProps;
var _default = CBAvatar;
exports["default"] = _default;