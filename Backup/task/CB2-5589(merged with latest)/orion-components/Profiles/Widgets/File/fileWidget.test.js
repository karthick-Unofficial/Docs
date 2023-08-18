"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _enzyme = require("enzyme");
var _FileWidget = _interopRequireDefault(require("./FileWidget"));
jest.mock("mapbox-gl", function () {});
describe("FileWidget", function () {
  it("renders", function () {
    var selectedEntity = {
      appId: "map-app",
      createdDate: 1506539788.248,
      entityData: {
        geometry: {
          coordinates: [-112.92383522014282, 40.23064685419149],
          type: "Point"
        },
        properties: {
          description: "",
          id: "e72cbf33-ea13-4685-b741-6b11894ed286",
          name: "Sharing"
        },
        type: "Point"
      },
      entityType: "shapes",
      feedId: "shapes",
      id: "e72cbf33-ea13-4685-b741-6b11894ed286",
      isDeleted: false,
      isOwner: false,
      isShareable: true,
      lastModifiedDate: 1506540564.809,
      owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
      ownerOrg: "ares_security_corporation",
      sharedWith: {
        ares_security_corporation: "VIEW/EDIT"
      }
    };
    var permissions = {
      items: {
        canContribute: true
      }
    };
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_FileWidget["default"], {
      selectedEntity: selectedEntity,
      permissions: permissions
    }));
    expect(wrapper).toMatchSnapshot();
  });
});