"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));
var _reduxThunk = _interopRequireDefault(require("redux-thunk"));
require("isomorphic-fetch");
var actions = _interopRequireWildcard(require("./actions"));
var t = _interopRequireWildcard(require("./actionTypes"));
var _user = require("./reducers/user");
var _testUtils = require("../lib/test-utils.js");
var _fetchMock = _interopRequireDefault(require("fetch-mock"));
var _dom = require("@testing-library/dom");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// orion test utilities

var middlewares = [_reduxThunk["default"]];
var mockStore = (0, _reduxMockStore["default"])(middlewares);
describe("ListPanel Sync Actions", function () {
  it("Should create an action to invalidate identity", function () {
    var expectedAction = {
      type: t.IDENTITY_INVALIDATED
    };
    expect(actions.identityInvalidated()).toEqual(expectedAction);
  });
  it("Should create an action for hydrate user success", function () {
    var user = {
      name: "Test User",
      email: "test@test.com"
    };
    var expectedAction = {
      type: t.HYDRATE_USER_SUCCESS,
      user: user
    };
    expect(actions.hydrateUserSuccess(user)).toEqual(expectedAction);
  });

  // it("Should create an action for login request", () => {
  //     const expectedAction = {
  //         type: t.LOGIN_REQUEST
  //     }
  //     expect(actions.requestLogin()).toEqual(expectedAction);
  // })

  // it("Should create an action for login success", () => {
  //     const expectedAction = {
  //         type: t.LOGIN_SUCCESS
  //     }
  //     expect(actions.loginSuccess()).toEqual(expectedAction);
  // })

  // it("Should create an action for login failure", () => {
  //     const expectedAction = {
  //         type: t.LOGIN_FAILURE,
  //         errorMessage: 'error'
  //     }
  //     expect(actions.loginFailure('error')).toEqual(expectedAction);
  // })
});

describe("ListPanel Async Actions", function () {
  describe("hydrateUser", function () {
    var response = {
      user: {
        name: "Test User",
        id: "123",
        email: "test@test.com"
      },
      org: {
        name: "Ares Security Corporation",
        orgId: "ares_security_corp"
      }
    };
    afterEach(function () {
      _fetchMock["default"].reset();
      _fetchMock["default"].restore();
    });
    beforeEach(function () {
      (0, _testUtils.safelyMock)("get", "/user", {
        body: response,
        headers: {
          "content-type": "application/json"
        }
      });
    });
    it("Should dispatch HYDRATE_USER_SUCCESS on success", function () {
      var store = mockStore({
        appState: _user.initialState
      });
      var expectedActions = [{
        type: t.HYDRATE_USER_SUCCESS,
        user: response.user
      }];
      store.dispatch(actions.hydrateUser(response.user.id));
      return (0, _dom.waitFor)(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
    it("Should call getProfile a single time", function () {
      var store = mockStore({
        appState: _user.initialState
      });
      store.dispatch(actions.hydrateUser(response.user.id));
      return (0, _testUtils.flushAllPromises)().then(function () {
        expect((0, _testUtils.checkMockedUrl)("/profile")).toBe(true);
        expect((0, _testUtils.getMockedMethod)()).toEqual("GET");
      });
    });
    it("Should call getProfile with the correct data", function () {
      var store = mockStore({
        appState: _user.initialState
      });
      store.dispatch(actions.hydrateUser(response.user.id));
      return (0, _testUtils.flushAllPromises)().then(function () {
        expect((0, _testUtils.checkMockedUrl)("/users/".concat(response.user.id, "/profile"))).toBe(true);
      });
    });
  });
  describe("logOut", function () {
    it("Should dispatch IDENTITY_INVALIDATED on success", function () {
      var store = mockStore({
        appState: _user.initialState
      });
      var expectedActions = [{
        type: "IDENTITY_INVALIDATED"
      }, {
        type: "IDENTITY_INVALIDATED"
      }];
      store.dispatch(actions.logOut());
      return (0, _testUtils.flushAllPromises)().then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    // Should also test that cookie has been cleared. Maybe needs to be in client-app-core?
  });

  // describe("login", () => {
  //     const creds = {
  //         "username": "testuser@test.com",
  //         "password": "1111111"
  //     }
  //     const response = {"success": true, "access_token": 'aabcd1234'}
  //     afterEach(() => {
  //         fetchMock.reset();
  //         fetchMock.restore();
  //     })
  //     beforeEach(() => {
  //         safelyMock('get', '/api/auth/token', { body: response, headers: { 'content-type': 'application/json' }})
  //     })

  //     it("Should dispatch LOGIN_REQUEST and LOGIN_SUCCESS correctly", () => {
  //         const store = mockStore({appState : userInitialState});

  //         const expectedActions = [
  //             { type: t.LOGIN_REQUEST },
  //             { type: t.LOGIN_SUCCESS }
  //         ]

  //         store.dispatch(actions.loginUser(creds));
  //         return flushAllPromises().then(() => {
  //             expect(store.getActions()).toEqual(expectedActions);
  //         });

  //     })

  //     it("Should have called login a single time", () => {
  //         const creds = {
  //             "username": "testuser@test.com",
  //             "password": "1111111"
  //         }
  //         const store = mockStore({appState : userInitialState});

  //         store.dispatch(actions.loginUser(creds));
  //         return flushAllPromises().then(() => {
  //             expect(checkMockedUrl('auth/token')).toBe(true);
  //             expect(getMockedMethod()).toEqual("POST");
  //         });

  //     })

  //     it("Should have called login with the correct data", () => {
  //         const creds = {
  //             "username": "testuser@test.com",
  //             "password": "1111111"
  //         }
  //         const store = mockStore({appState : userInitialState});

  //         store.dispatch(actions.loginUser(creds));
  //         return flushAllPromises().then(() => {
  //             expect(getSentData()).toEqual(creds);
  //         });

  //     })

  //     // Should also test that cookie has been set

  // })
});