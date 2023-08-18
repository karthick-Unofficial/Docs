"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _GenericDetailsWidget = _interopRequireDefault(require("./GenericDetailsWidget"));
var _enzyme = require("enzyme");
jest.mock("mapbox-gl/dist/mapbox-gl", function () {
  return {
    Map: function Map() {
      return {};
    }
  };
});
describe("DetailsWidget", function () {
  it("renders", function () {
    var kvPairs = [{
      key: "test key",
      value: "test value"
    }];
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_GenericDetailsWidget["default"], {
      kvPairs: kvPairs
    }));
    expect(wrapper).toMatchSnapshot();
  });
  it("renders with display props", function () {
    var kvPairs = [{
      key: "test key",
      value: "test value"
    }];
    var displayProps = {
      "test key": "change key"
    };
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_GenericDetailsWidget["default"], {
      kvPairs: kvPairs,
      displayProps: displayProps
    }));
    expect(wrapper).toMatchSnapshot();
  });
});