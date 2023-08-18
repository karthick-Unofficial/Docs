"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _DockItemTarget = _interopRequireDefault(require("./DockItemTarget"));
var _enzyme = require("enzyme");
describe("DockItemTarget", function () {
  it("renders", function () {
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_DockItemTarget["default"], null));
    expect(wrapper).toMatchSnapshot();
  });
});