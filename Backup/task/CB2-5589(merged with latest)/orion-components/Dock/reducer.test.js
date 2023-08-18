"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _reducer = _interopRequireWildcard(require("./reducer.js"));
var actions = _interopRequireWildcard(require("./actions"));
var notificationsActions = _interopRequireWildcard(require("./Notifications/actions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
describe("Dock reducer", function () {
  it("should initialize with expected initial state", function () {
    expect((0, _reducer["default"])(undefined, {})).toEqual(_reducer.initialState);
  });
  describe("Should handle setTab", function () {
    it("Should assign tab correctly and empty newAlerts", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.setTab("notifications");
      initialState = _objectSpread({}, _reducer.initialState);
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        tab: "notifications",
        newAlerts: []
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });

  // describe("Should handle toggleClose", () => {
  //     it("Should empty newAlerts", () => {

  //         let action;
  //         let initialState;
  //         let expectedState;

  //         action = actions.toggleOpen('notifications');
  //         initialState = { ...seedState };
  //         expectedState = {
  //                 ...seedState,
  //                 newAlerts: []
  //         }
  //         expect(alertSidebar(initialState, action)).toEqual(expectedState)

  //     })
  // })

  describe("Should handle toggleOpen", function () {
    it("Should toggle isOpen correctly from false to true", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.toggleOpen();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        isOpen: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        isOpen: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should toggle isOpen correctly from true to false", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.toggleOpen();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        isOpen: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        isOpen: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle closeNotificationFailed", function () {
    it("Should set isError to true from false", function () {
      var notification = {
        id: "123",
        message: "This will fail."
      };
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATION_FAILED",
        notificationId: notification.id,
        notification: notification,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notification.id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already true", function () {
      var notification = {
        id: "123",
        message: "This will fail."
      };
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATION_FAILED",
        notificationId: notification.id,
        notification: notification,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notification.id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should prepend bad id of bad notification to front of rejectedNots", function () {
      var notification = {
        id: "123",
        message: "This will fail."
      };
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATION_FAILED",
        notificationId: notification.id,
        notification: notification,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["123", "456"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notification.id, "123", "456"],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle closeNotificationsFailed", function () {
    it("Should set isError to true from false", function () {
      var notifications = [{
        id: "123",
        message: "This will fail."
      }];
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATIONS_FAILED",
        notificationIds: [notifications[0].id],
        notifications: notifications,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notifications[0].id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already true", function () {
      var notifications = [{
        id: "123",
        message: "This will fail."
      }];
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATIONS_FAILED",
        notificationIds: [notifications[0].id],
        notifications: notifications,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notifications[0].id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should prepend bad ids of bad notifications to front of rejectedNots", function () {
      var _context;
      var notifications = [{
        id: "123",
        message: "This will fail."
      }, {
        id: "456",
        message: "This will fail too."
      }, {
        id: "789",
        message: "This will fail as well."
      }];
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATIONS_FAILED",
        notificationIds: (0, _map["default"])(notifications).call(notifications, function (n) {
          return n.id;
        }),
        notifications: notifications,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["1000", "1001"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: (0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(action.notificationIds), ["1000", "1001"]),
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle reopenNotificationFailed", function () {
    it("Should set isError to true from false", function () {
      var notification = {
        id: "123",
        message: "This will fail."
      };
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "REOPEN_NOTIFICATION_FAILED",
        notificationId: notification.id,
        notification: notification,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notification.id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already true", function () {
      var notification = {
        id: "123",
        message: "This will fail."
      };
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "REOPEN_NOTIFICATION_FAILED",
        notificationId: notification.id,
        notification: notification,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notification.id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should prepend bad id of bad notification to front of rejectedNots", function () {
      var notification = {
        id: "123",
        message: "This will fail."
      };
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "REOPEN_NOTIFICATION_FAILED",
        notificationId: notification.id,
        notification: notification,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["123", "456"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notification.id, "123", "456"],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle reopenNotificationsFailed", function () {
    it("Should set isError to true from false", function () {
      var notifications = [{
        id: "123",
        message: "This will fail."
      }];
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "REOPEN_NOTIFICATIONS_FAILED",
        notificationIds: [notifications[0].id],
        notifications: notifications,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notifications[0].id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already true", function () {
      var notifications = [{
        id: "123",
        message: "This will fail."
      }];
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "REOPEN_NOTIFICATIONS_FAILED",
        notificationIds: [notifications[0].id],
        notifications: notifications,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [notifications[0].id],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should prepend bad ids of bad notifications to front of rejectedNots", function () {
      var _context2;
      var notifications = [{
        id: "123",
        message: "This will fail."
      }, {
        id: "456",
        message: "This will fail too."
      }, {
        id: "789",
        message: "This will fail as well."
      }];
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "REOPEN_NOTIFICATIONS_FAILED",
        notificationIds: (0, _map["default"])(notifications).call(notifications, function (n) {
          return n.id;
        }),
        notifications: notifications,
        error: "There was an error"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["1000", "1001"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(action.notificationIds), ["1000", "1001"]),
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle getArchiveFailed", function () {
    it("Should set isError to true from false", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveFailed();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already true", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveFailed();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should set empty rejectedNots array", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveFailed();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["1000", "1001"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change rejectedNots array if already empty", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveFailed();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: true
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle getArchiveSuccess", function () {
    it("Should set isError to false from true", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveSuccess();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already false", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveSuccess();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should set empty rejectedNots array", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveSuccess();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["1000", "1001"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change rejectedNots array if already empty", function () {
      var action;
      var initialState;
      var expectedState;
      action = notificationsActions.getArchiveSuccess();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle closeNotificationComplete", function () {
    it("Should set isError to false from true", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATION_COMPLETE",
        notificationId: "123"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already false", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATION_COMPLETE",
        notificationId: "123"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should set empty rejectedNots array", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATION_COMPLETE",
        notificationId: "123"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["1000", "1001"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change rejectedNots array if already empty", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATION_COMPLETE",
        notificationId: "123"
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle closeNotificationsComplete", function () {
    it("Should set isError to false from true", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATIONS_COMPLETE",
        notificationIds: ["123", "456"]
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: true
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change isError if already false", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATIONS_COMPLETE",
        notificationIds: ["123", "456"]
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should set empty rejectedNots array", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATIONS_COMPLETE",
        notificationIds: ["123", "456"]
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: ["1000", "1001"],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not change rejectedNots array if already empty", function () {
      var action;
      var initialState;
      var expectedState;
      action = {
        type: "CLOSE_NOTIFICATIONS_COMPLETE",
        notificationIds: ["123", "456"]
      };
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        rejectedNots: [],
        hasError: false
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle newNotificationAlert", function () {
    it("Should add a new notification correctly to newAlerts when empty", function () {
      var sampleNotification = {
        summary: "Something happened.",
        id: "123"
      };
      var action;
      var initialState;
      var expectedState;
      action = actions.newNotificationAlert(sampleNotification);
      initialState = _objectSpread({}, _reducer.initialState);
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [sampleNotification]
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should append a new notification correctly to newAlerts when some items are already in the queue ", function () {
      var sampleNotification = {
        summary: "Something happened.",
        id: "123"
      };
      var action;
      var initialState;
      var expectedState;
      action = actions.newNotificationAlert(sampleNotification);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }, {
          id: "def",
          summary: "I'm second."
        }]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }, {
          id: "def",
          summary: "I'm second."
        }, sampleNotification]
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle clearNotification", function () {
    it("Should clear the correct notification from newAlerts when it is the only item present", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.clearNotification("abc");
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: []
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should clear the correct notification from newAlerts when multiple items are present, in various configurations", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.clearNotification("abc");
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }, {
          id: "def",
          summary: "I'm second."
        }, {
          id: "678",
          summary: "I'm third."
        }]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "def",
          summary: "I'm second."
        }, {
          id: "678",
          summary: "I'm third."
        }]
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
      action = actions.clearNotification("def");
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }, {
          id: "def",
          summary: "I'm second."
        }, {
          id: "678",
          summary: "I'm third."
        }]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }, {
          id: "678",
          summary: "I'm third."
        }]
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
      action = actions.clearNotification("678");
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }, {
          id: "def",
          summary: "I'm second."
        }, {
          id: "678",
          summary: "I'm third."
        }]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        newAlerts: [{
          id: "abc",
          summary: "I'm first."
        }, {
          id: "def",
          summary: "I'm second."
        }]
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
});