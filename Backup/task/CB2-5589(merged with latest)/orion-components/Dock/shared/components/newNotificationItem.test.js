"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _NewNotificationItem = _interopRequireDefault(require("./NewNotificationItem"));
var reactRedux = _interopRequireWildcard(require("react-redux"));
var _enzyme = require("enzyme");
var _i18n = require("orion-components/testData/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// import { initialState } from './reducers/user.js';

// Mock Date object
var DATE_TO_USE = new Date("2017");
var _Date = Date;
global.Date = jest.fn(function () {
  return DATE_TO_USE;
});
global.Date.UTC = _Date.UTC;
var notification = {
  activityId: "5b391797-4594-45c1-a6b5-f11058f0e860",
  actor: {
    id: "b617dedf-9e59-418d-9737-fb6cae298ef3",
    name: "Test User",
    type: "user",
    url: "http://localhost/ecosystem/api/users/b617dedf-9e59-418d-9737-fb6cae298ef3"
  },
  app: "ecosystem",
  closed: false,
  createdDate: "2017-10-16T18:47:09.150Z",
  id: "c71ed13e-0d2e-42f6-aeee-98f5a186bc41",
  isPriority: false,
  lastModifiedDate: "2017-10-16T18:47:09.150Z",
  message: "Test User posted Post Test E in Daily Brief",
  object: {
    id: "4aedc1eb-c9a4-4545-9ea5-02638beea57c",
    name: "Post Test E",
    type: "brief",
    url: "http://localhost/ecosystem/api/entities/4aedc1eb-c9a4-4545-9ea5-02638beea57c"
  },
  published: "2017-10-16T18:47:08.999Z",
  summary: "Test User posted Post Test E in Daily Brief",
  target: {
    id: "ares_security_corporation",
    name: "Ares Security Corporation",
    type: "organization",
    url: "http://localhost/ecosystem/api/organizations/ares_security_corporation"
  },
  to: [{
    email: false,
    sms: false,
    system: true,
    token: "organization:ares_security_corporation"
  }],
  type: "created",
  userId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
  viewed: false
};
jest.mock("react-redux", function () {
  return {
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});
describe("NewNotificationItem", function () {
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
    // Basic render with a couple dock items
    var wrapper = (0, _enzyme.shallow)( /*#__PURE__*/_react["default"].createElement(_NewNotificationItem["default"], {
      notification: notification
    }));
    expect(wrapper).toMatchSnapshot();
  });
});