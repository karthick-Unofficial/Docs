"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _PhoenixDropzone = _interopRequireDefault(require("./PhoenixDropzone"));
var _enzyme = require("enzyme");
describe("PhoenixDropzone", function () {
  it("renders", function () {
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_PhoenixDropzone["default"], null));
    expect(wrapper).toMatchSnapshot();
  });
});