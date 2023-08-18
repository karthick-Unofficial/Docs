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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _reducer = _interopRequireWildcard(require("./reducer.js"));
var actions = _interopRequireWildcard(require("./actions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
describe("notifications reducer", function () {
  it("should initialize with expected initial state", function () {
    expect((0, _reducer["default"])(undefined, {})).toEqual(_reducer.initialState);
  });
  describe("Should handle initialNotificationsReceived", function () {
    it("Should add notifications correctly to activeItems", function () {
      var sampleNotifications = [{
        summary: "Something happened.",
        id: "123"
      }, {
        summary: "Something happened again.",
        id: "789"
      }];
      var action;
      var initialState;
      var expectedState;
      action = actions.initialNotificationsReceived(sampleNotifications);
      initialState = _objectSpread({}, _reducer.initialState);
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "789"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
    });
    it("Should add notifications correctly to activeItemsById", function () {
      var sampleNotifications = [{
        summary: "Something happened.",
        id: "123"
      }, {
        summary: "Something happened again.",
        id: "789"
      }];
      var action;
      var initialState;
      var expectedState;
      action = actions.initialNotificationsReceived(sampleNotifications);
      initialState = _objectSpread({}, _reducer.initialState);
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: sampleNotifications[0],
          789: sampleNotifications[1]
        }
      });
      expect((0, _reducer["default"])(initialState, action).activeItemsById).toEqual(expectedState.activeItemsById);
    });
  });
  describe("Should handle closeNotification", function () {
    it("Should remove notification correctly from activeItems when a single item is present", function () {
      var notificationId = "123";
      var action;
      var initialState;
      var expectedState;
      action = actions.closeNotification(notificationId);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: []
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
    });
    it("Should remove notification correctly from activeItems when multiple items are present, in various configurations", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.closeNotification("123");
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["456", "789"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
      action = actions.closeNotification("456");
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "789"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
      action = actions.closeNotification("789");
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
    });
    it("Should not alter state if passed id is not present", function () {
      var notificationId = "789";
      var action;
      var initialState;
      var expectedState;
      action = actions.closeNotification(notificationId);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456"]
      });
      expectedState = initialState;
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
    });
    it("Should remove notification correctly from activeItemsById", function () {
      var notificationId = "123";
      var action;
      var initialState;
      var expectedState;
      action = actions.closeNotification(notificationId);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: {
            id: "123"
          },
          789: {
            id: "789"
          }
        }
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          789: {
            id: "789"
          }
        }
      });
      expect((0, _reducer["default"])(initialState, action).activeItemsById).toEqual(expectedState.activeItemsById);
    });
    it("Should not alter activeItemsById if passed notification is not present ", function () {
      var notificationId = "456";
      var action;
      var initialState;
      var expectedState;
      action = actions.closeNotification(notificationId);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: {
            id: "123"
          },
          789: {
            id: "789"
          }
        }
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: {
            id: "123"
          },
          789: {
            id: "789"
          }
        }
      });
      expect((0, _reducer["default"])(initialState, action).activeItemsById).toEqual(expectedState.activeItemsById);
    });
  });
  describe("Should handle closeBulkNotifications", function () {
    it("Should remove notifications correctly from activeItems, in various configurations", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.closeBulkNotifications(["123", "456"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["789"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
      action = actions.closeBulkNotifications(["123", "789"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["456"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
      action = actions.closeBulkNotifications(["789", "456"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
    });
    it("Should only remove a notification if the id is present", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.closeBulkNotifications(["123", "1000"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["456", "789"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
    });
    it("Should not alter state if no passed ids are present", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.closeBulkNotifications(["1123123", "1000"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItems: ["123", "456", "789"]
      });
      expect((0, _reducer["default"])(initialState, action).activeItems).toEqual(expectedState.activeItems);
    });
    it("Should remove notifications correctly from activeItemsById", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.closeBulkNotifications(["123", "456"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          456: {
            id: "456"
          },
          123: {
            id: "123"
          },
          789: {
            id: "789"
          }
        }
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          789: {
            id: "789"
          }
        }
      });
      expect((0, _reducer["default"])(initialState, action).activeItemsById).toEqual(expectedState.activeItemsById);
    });
    it("Should only remove a notification from activeItemsById if the id is present ", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.closeBulkNotifications(["1000", "456"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: {
            id: "123"
          },
          456: {
            id: "456"
          },
          789: {
            id: "789"
          }
        }
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: {
            id: "123"
          },
          789: {
            id: "789"
          }
        }
      });
      expect((0, _reducer["default"])(initialState, action).activeItemsById).toEqual(expectedState.activeItemsById);
    });
    it("Should not alter activeItemsById if passed notification is not present ", function () {
      var action;
      var initialState;
      var expectedState;
      action = actions.closeBulkNotifications(["as;lkjasdfaw", "098765"]);
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: {
            id: "123"
          },
          789: {
            id: "789"
          }
        }
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        activeItemsById: {
          123: {
            id: "123"
          },
          789: {
            id: "789"
          }
        }
      });
      expect((0, _reducer["default"])(initialState, action).activeItemsById).toEqual(expectedState.activeItemsById);
    });
  });
  describe("Should handle dumpArchive", function () {
    it("reset archiveItems and archiveItemsById to empty when some items are present in each", function () {
      var sampleNotification = {
        summary: "Something happened.",
        id: "123"
      };
      var action;
      var initialState;
      var expectedState;
      action = actions.dumpArchive();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        archiveItems: ["123", "456", "1000"],
        archiveItemsById: {
          123: {
            id: 123
          },
          456: {
            id: 456
          },
          789: {
            id: 789
          }
        }
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        archiveItems: [],
        archiveItemsById: {}
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
    it("Should not alter archiveItems and archiveItemsById if they are already empty", function () {
      var sampleNotification = {
        summary: "Something happened.",
        id: "123"
      };
      var action;
      var initialState;
      var expectedState;
      action = actions.dumpArchive();
      initialState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        archiveItems: [],
        archiveItemsById: {}
      });
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        archiveItems: [],
        archiveItemsById: {}
      });
      expect((0, _reducer["default"])(initialState, action)).toEqual(expectedState);
    });
  });
  describe("Should handle getArchiveSuccess", function () {
    // Returns all thus-queried pages with each request (no appends)

    it("Should add notifications correctly to archiveItems if empty", function () {
      var sampleNotifications = [{
        summary: "Something happened.",
        id: "123"
      }, {
        summary: "Something happened again.",
        id: "789"
      }];
      var action;
      var initialState;
      var expectedState;
      action = actions.getArchiveSuccess(sampleNotifications);
      initialState = _objectSpread({}, _reducer.initialState);
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        archiveItems: ["123", "789"]
      });
      expect((0, _reducer["default"])(initialState, action).archiveItems).toEqual(expectedState.archiveItems);
    });
    it("Should add notifications correctly to archiveItemsById if empty", function () {
      var sampleNotifications = [{
        summary: "Something happened.",
        id: "123"
      }, {
        summary: "Something happened again.",
        id: "789"
      }];
      var action;
      var initialState;
      var expectedState;
      action = actions.getArchiveSuccess(sampleNotifications);
      initialState = _objectSpread({}, _reducer.initialState);
      expectedState = _objectSpread(_objectSpread({}, _reducer.initialState), {}, {
        archiveItemsById: {
          123: sampleNotifications[0],
          789: sampleNotifications[1]
        }
      });
      expect((0, _reducer["default"])(initialState, action).archiveItemsById).toEqual(expectedState.archiveItemsById);
    });
  });
});