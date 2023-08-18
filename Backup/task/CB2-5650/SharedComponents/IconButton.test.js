"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _IconButton = _interopRequireDefault(require("./IconButton"));
var _enzyme = require("enzyme");
describe("IconButton", function () {
  it("renders", function () {
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_IconButton["default"], null));
    expect(wrapper).toMatchSnapshot();
  });
});