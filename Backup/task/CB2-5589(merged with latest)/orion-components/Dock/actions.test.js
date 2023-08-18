"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));
var _reduxThunk = _interopRequireDefault(require("redux-thunk"));
require("isomorphic-fetch");
var t = _interopRequireWildcard(require("./actionTypes"));
var actions = _interopRequireWildcard(require("./actions"));
var _reducer = require("./reducer");
var _testUtils = require("../lib/test-utils.js");
var _fetchMock = _interopRequireDefault(require("fetch-mock"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// orion test utilities

var middlewares = [_reduxThunk["default"]];
var mockStore = (0, _reduxMockStore["default"])(middlewares);
describe("Dock Sync Actions", function () {
  it("Should create an action to set tab", function () {
    var expectedAction = {
      type: t.SET_ALERTS_TAB,
      tab: "notifications"
    };
    expect(actions.setTab("notifications")).toEqual(expectedAction);
  });
  it("Should create an action to toggle sidebar open and closed", function () {
    var expectedAction = {
      type: t.TOGGLE_OPEN
    };
    expect(actions.toggleOpen()).toEqual(expectedAction);
  });
  it("Should create an action to display a new alert popin", function () {
    var notification = {
      id: 123,
      message: "A sample notification"
    };
    var expectedAction = {
      type: t.SHOW_ALERT,
      notification: notification
    };
    expect(actions.newNotificationAlert(notification)).toEqual(expectedAction);
  });
  it("Should create an action to remove a new alert popin", function () {
    var notification = {
      id: 123,
      message: "A sample notification"
    };
    var expectedAction = {
      type: t.HIDE_ALERT,
      notificationId: notification.id
    };
    expect(actions.clearNotification(notification.id)).toEqual(expectedAction);
  });
  it("Should create an action to generate a user feedback notification.", function () {
    var store = mockStore({
      appState: _reducer.initialState
    });
    var date = new Date();
    var notification = {
      id: "User feedback confirmed.",
      feedback: true,
      createdDate: date,
      summary: "User feedback confirmed.",
      undoFunc: expect.any(Function)
    };
    var expectedActions = [{
      type: t.SHOW_ALERT,
      notification: notification
    }];
    store.dispatch(actions.createUserFeedback("User feedback confirmed.", jest.fn()));
    return (0, _testUtils.flushAllPromises)().then(function () {
      // temporary, we need to find a way to expect any function, the above expect.any(Function) does not work
      expect(store.getActions()[0].notification.id).toEqual("User feedback confirmed.");
      expect(store.getActions()[0].notification.feedback).toEqual(true);
      // expect(store.getActions()[0].notification.createdDate).toEqual(date);
      expect(store.getActions()[0].notification.summary).toEqual("User feedback confirmed.");
    });
  });
});