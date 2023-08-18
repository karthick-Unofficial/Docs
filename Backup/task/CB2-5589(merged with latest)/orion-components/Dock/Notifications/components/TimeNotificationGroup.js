"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactVirtualized = require("react-virtualized");
var _Profiles = require("orion-components/Profiles");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloorPlanOn: null,
  floorPlansWithFacilityFeed: null
};
var cache = new _reactVirtualized.CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 140
});
var TimeNotificationGroup = function TimeNotificationGroup(props) {
  var dispatch = (0, _reactRedux.useDispatch)();
  var notifications = props.notifications,
    animating = props.animating,
    archive = props.archive,
    expandedAlert = props.expandedAlert,
    fetchNextPage = props.fetchNextPage,
    fetching = props.fetching,
    shouldFetch = props.shouldFetch,
    componentState = props.componentState,
    readOnly = props.readOnly,
    forReplay = props.forReplay,
    removeDockedCameraAndState = props.removeDockedCameraAndState,
    endDate = props.endDate,
    selectFloorPlanOn = props.selectFloorPlanOn,
    floorPlansWithFacilityFeed = props.floorPlansWithFacilityFeed,
    bulkAction = props.bulkAction;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    animatingState = _useState2[0],
    setAnimatingState = _useState2[1];
  var _useState3 = (0, _react.useState)(notifications),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    nextNotifications = _useState4[0],
    setNextNotifications = _useState4[1];
  var _useState5 = (0, _react.useState)(animating),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    nextAnimating = _useState6[0],
    setNextAnimating = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    wrapper = _useState8[0],
    setWrapper = _useState8[1];
  var virtualList = null;
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  (0, _react.useEffect)(function () {
    if (notifications.length !== nextNotifications.length) {
      setNextNotifications(notifications);
    }
    if (nextAnimating !== animating) {
      setNextAnimating(animating);
    }
  }, [notifications, animating]);
  (0, _react.useEffect)(function () {
    if (nextNotifications.length > notifications.length) {
      setAnimatingState(false);
    } else if (nextAnimating !== animating) {
      setAnimatingState(archive ? "left" : "right");
    }
  }, [props]);
  (0, _react.useEffect)(function () {
    if (archive) {
      handleScroll();
    }
  }, []);
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    var sortedNotifications = (0, _sort["default"])(notifications).call(notifications, function (a, b) {
      if (new Date(b.createdDate) < new Date(a.createdDate)) {
        return -1;
      } else {
        return 1;
      }
    });
    var index = (0, _findIndex["default"])(sortedNotifications).call(sortedNotifications, function (notification) {
      return notification.id === expandedAlert;
    });
    if (prevProps && virtualList && expandedAlert !== prevProps.expandedAlert && index > -1) {
      var offset = virtualList.getOffsetForRow({
        alignment: "center",
        index: index
      });
      virtualList.scrollToPosition(offset);
    }
  }, [props]);
  var handleScroll = function handleScroll() {
    var element = document.getElementById("virtualized-notification-list");
    if (element) {
      element.addEventListener("scroll", function (event) {
        var element = event.target;
        var scrollTop = element.scrollTop,
          clientHeight = element.clientHeight,
          scrollHeight = element.scrollHeight;
        if (Math.floor(scrollHeight - scrollTop) <= clientHeight &&
        // --> If we scroll to bottom
        !fetching &&
        // --> AND not already fetching
        shouldFetch) {
          // --> AND we haven't fetched the same data in the past X seconds
          fetchNextPage();
        }
      });
    }
  };
  var handleBulkClose = function handleBulkClose(notifications) {
    setAnimatingState(archive ? "left" : "right");
    // If archived, we need to pass whole notifications
    if (archive) {
      (0, _setTimeout2["default"])(function () {
        return dispatch(bulkAction(notifications));
      }, 500);
    } else {
      (0, _setTimeout2["default"])(function () {
        return dispatch(bulkAction((0, _map["default"])(notifications).call(notifications, function (n) {
          return n.id;
        })));
      }, 500);
    }
  };
  var triggerAnimationGroup = function triggerAnimationGroup() {
    setAnimatingState(archive ? "left" : "right");
  };
  (0, _react.useLayoutEffect)(function () {
    setWrapper(document.getElementById("notification-tab-wrapper"));
  }, [document.getElementById("notification-tab-wrapper")]);
  var rowRenderer = function rowRenderer(_ref) {
    var index = _ref.index,
      key = _ref.key,
      parent = _ref.parent,
      style = _ref.style;
    var sortedNotifications = (0, _sort["default"])(notifications).call(notifications, function (a, b) {
      var aDate = a.activityDate || a.createdDate;
      var bDate = b.activityDate || b.createdDate;
      if (new Date(bDate) < new Date(aDate)) {
        return -1;
      } else {
        return 1;
      }
    });
    var notification = sortedNotifications[index];
    var id = notification.id,
      activityId = notification.activityId;
    return /*#__PURE__*/_react["default"].createElement(_reactVirtualized.CellMeasurer, {
      key: key,
      cache: cache,
      parent: parent,
      columnIndex: 0,
      rowIndex: index
    }, function (_ref2) {
      var measure = _ref2.measure;
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: id,
        style: style
      }, /*#__PURE__*/_react["default"].createElement(_Profiles.AlertProfile, {
        id: id,
        readOnly: readOnly,
        notification: forReplay ? notification : null,
        activityId: activityId,
        measure: measure,
        index: index,
        removeDockedCameraAndState: removeDockedCameraAndState,
        forReplay: forReplay,
        endDate: endDate,
        selectFloorPlanOn: selectFloorPlanOn,
        floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
      }));
    });
  };
  var hasError = false;
  if (notifications[0]) {
    var _context;
    hasError = (0, _includes["default"])(_context = componentState.rejectedNots).call(_context, notifications[0].id);
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: animatingState && !hasError ? "notification-group animating animating-" + animatingState : "notification-group"
  }, wrapper && /*#__PURE__*/_react["default"].createElement(_reactVirtualized.List, {
    id: "virtualized-notification-list",
    deferredMeasurementCache: cache,
    height: wrapper.offsetHeight - 36,
    rowCount: notifications.length,
    rowHeight: cache.rowHeight,
    rowRenderer: rowRenderer,
    width: wrapper.offsetWidth,
    ref: function ref(_ref3) {
      virtualList = _ref3;
    }
  }));
};
TimeNotificationGroup.propTypes = propTypes;
TimeNotificationGroup.defaultProps = defaultProps;
var _default = TimeNotificationGroup;
exports["default"] = _default;