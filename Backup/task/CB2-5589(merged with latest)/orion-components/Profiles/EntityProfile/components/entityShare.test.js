"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _EntityShare = _interopRequireDefault(require("./EntityShare"));
var _enzyme = require("enzyme");
describe("EntityShare", function () {
  it("renders", function () {
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_EntityShare["default"], null));
    expect(wrapper).toMatchSnapshot();
  });
});