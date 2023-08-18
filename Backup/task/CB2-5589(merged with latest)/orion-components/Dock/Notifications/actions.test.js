"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));
var _reduxThunk = _interopRequireDefault(require("redux-thunk"));
require("isomorphic-fetch");
var t = _interopRequireWildcard(require("./actionTypes"));
var actions = _interopRequireWildcard(require("./actions"));
var _reducer = require("../reducer");
var _testUtils = require("../../lib/test-utils.js");
var _fetchMock = _interopRequireDefault(require("fetch-mock"));
var _dom = require("@testing-library/dom");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// orion test utilities

var middlewares = [_reduxThunk["default"]];
var mockStore = (0, _reduxMockStore["default"])(middlewares);
describe("Notifications Sync Actions", function () {
  var notifications = [{
    id: "123",
    message: "Something has happened"
  }, {
    id: "123",
    message: "Something else has happened"
  }];
  it("Should create an action for initial received notifications", function () {
    var expectedAction = {
      type: t.INITIAL_NOTIFICATIONS_RECEIVED,
      notifications: notifications
    };
    expect(actions.initialNotificationsReceived(notifications)).toEqual(expectedAction);
  });
  it("Should create an action for archive fetch success", function () {
    var expectedAction = {
      type: t.GET_ARCHIVE_FAILED
    };
    expect(actions.getArchiveFailed()).toEqual(expectedAction);
  });
  it("Should create an action for archive fetch failure", function () {
    var expectedAction = {
      type: t.GET_ARCHIVE_SUCCESS,
      notifications: notifications
    };
    expect(actions.getArchiveSuccess(notifications)).toEqual(expectedAction);
  });
  it("Should create an action for archive dump", function () {
    var expectedAction = {
      type: t.DUMP_ARCHIVE
    };
    expect(actions.dumpArchive()).toEqual(expectedAction);
  });

  // The following for have async elements in optimstMiddleware, tests for async should be written there?

  it("Should create an action to close a notification", function () {
    var notification = {
      id: "1111",
      message: "yo"
    };
    var expectedAction = {
      type: t.CLOSE_NOTIFICATION,
      notificationId: notification.id
    };
    expect(actions.closeNotification(notification.id)).toEqual(expectedAction);
  });
  it("Should create an action to close bulk notifications", function () {
    var expectedAction = {
      type: t.CLOSE_NOTIFICATIONS,
      notificationIds: (0, _map["default"])(notifications).call(notifications, function (n) {
        return n.id;
      })
    };
    expect(actions.closeBulkNotifications((0, _map["default"])(notifications).call(notifications, function (n) {
      return n.id;
    }))).toEqual(expectedAction);
  });
  it("Should create an action to reopen a notification", function () {
    var notification = {
      id: "1111",
      message: "yo"
    };
    var expectedAction = {
      type: t.REOPEN_NOTIFICATION,
      notification: notification,
      notificationId: notification.id
    };
    expect(actions.reopenNotification(notification)).toEqual(expectedAction);
  });
  it("Should create an action to reopen bulk notifications", function () {
    var expectedAction = {
      type: t.REOPEN_NOTIFICATIONS,
      notifications: notifications,
      notificationIds: (0, _map["default"])(notifications).call(notifications, function (n) {
        return n.id;
      })
    };
    expect(actions.reopenBulkNotifications(notifications)).toEqual(expectedAction);
  });
  describe("Notifications Async Actions", function () {
    var notifications = [{
      id: "123",
      message: "Something has happened"
    }, {
      id: "123",
      message: "Something else has happened"
    }];
    describe("queryArchive", function () {
      afterEach(function () {
        _fetchMock["default"].reset();
        _fetchMock["default"].restore();
      });
      beforeEach(function () {
        (0, _testUtils.safelyMock)("get", "/archive", {
          body: notifications,
          headers: {
            "content-type": "application/json"
          }
        });
      });
      it("Should dispatch GET_ARCHIVE_SUCCESS correctly", function () {
        var store = mockStore({
          appState: _reducer.initialState
        });
        var expectedActions = [{
          type: t.GET_ARCHIVE_SUCCESS,
          notifications: notifications
        }];
        store.dispatch(actions.queryArchive(1));
        return (0, _dom.waitFor)(function () {
          console.log(store.getActions(), "store.getActions()");
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
      it("Should call setAppState a single time", function () {
        var store = mockStore({
          appState: _reducer.initialState
        });
        store.dispatch(actions.queryArchive(1));
        return (0, _testUtils.flushAllPromises)().then(function () {
          expect((0, _testUtils.checkMockedUrl)("/archive")).toBe(true);
        });
      });
      it("Should call setAppState with the correct data", function () {
        var store = mockStore({
          appState: _reducer.initialState
        });
        store.dispatch(actions.queryArchive(1));
        return (0, _testUtils.flushAllPromises)().then(function () {
          expect((0, _testUtils.checkMockedUrl)("/archive/1")).toBe(true);
          expect((0, _testUtils.getMockedMethod)()).toEqual("GET");
        });
      });
    });
  });
});