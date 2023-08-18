"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _RulesWidget = _interopRequireDefault(require("./RulesWidget"));
var _enzyme = require("enzyme");
var _testData = require("orion-components/testData");
describe("RulesWidget", function () {
  it("renders", function () {
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_RulesWidget["default"], {
      rules: [],
      user: _testData.userData
    }));
    expect(wrapper).toMatchSnapshot();
  });
});