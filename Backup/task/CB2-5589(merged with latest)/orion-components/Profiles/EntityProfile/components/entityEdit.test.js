"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _EntityEdit = _interopRequireDefault(require("./EntityEdit"));
var _enzyme = require("enzyme");
describe("EntityEdit", function () {
  it("renders", function () {
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_EntityEdit["default"], null));
    expect(wrapper).toMatchSnapshot();
  });
});