"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _DetailsWidget = _interopRequireDefault(require("./DetailsWidget"));
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
    var selectedEntity = {
      appId: "vessels-app",
      entityData: {
        geometry: {
          coordinates: [-91.19507833333333, 29.682976666666665],
          type: "Point"
        },
        properties: {
          course: 209.3,
          disposition: "unknown",
          name: "MISS LAURIE",
          sourceId: "367002040",
          speed: 7.2
        }
      },
      entityType: "track",
      feedId: "aishub",
      id: "aishub.367002040",
      isActive: true,
      ownerOrg: "ares_security_corporation",
      sourceId: "367002040"
    };
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_DetailsWidget["default"], {
      selectedEntity: selectedEntity,
      details: selectedEntity.entityData.properties,
      displayProps: []
    }));
    expect(wrapper).toMatchSnapshot();
  });
});