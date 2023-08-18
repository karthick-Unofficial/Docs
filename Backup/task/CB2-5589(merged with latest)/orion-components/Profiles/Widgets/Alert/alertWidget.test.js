"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _AlertWidget = _interopRequireDefault(require("./AlertWidget"));
var _enzyme = require("enzyme");
var _i18n = require("orion-components/testData/i18n");
var reactRedux = _interopRequireWildcard(require("react-redux"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
jest.mock("react-redux", function () {
  return {
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});
describe("AlertWidget", function () {
  beforeEach(function () {
    useDispatchMock.mockImplementation(function () {
      return function () {};
    });
    useSelectorMock.mockImplementation(function (selector) {
      return selector(mockStore);
    });
  });
  afterEach(function () {
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
  });
  var useSelectorMock = reactRedux.useSelector;
  var useDispatchMock = reactRedux.useDispatch;
  var mockStore = {
    i18n: _i18n.i18n
  };
  it("renders", function () {
    var notifications = {
      activeItems: [],
      activeItemsById: {},
      archiveItems: [],
      archiveItemsById: {}
    };
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_AlertWidget["default"], {
      notifications: notifications
    }));
    expect(wrapper).toMatchSnapshot();
  });
});