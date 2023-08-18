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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _TimeNotificationGroup = _interopRequireDefault(require("./components/TimeNotificationGroup"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var actions = _interopRequireWildcard(require("./actions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var NotificationsTab = function NotificationsTab(props) {
  var dispatch = (0, _reactRedux.useDispatch)();
  var notifications = props.notifications,
    componentState = props.componentState,
    readOnly = props.readOnly,
    forReplay = props.forReplay,
    endDate = props.endDate,
    selectFloorPlanOn = props.selectFloorPlanOn,
    floorPlansWithFacilityFeed = props.floorPlansWithFacilityFeed;
  var closeBulkNotifications = actions.closeBulkNotifications,
    reopenBulkNotifications = actions.reopenBulkNotifications,
    getArchiveFailed = actions.getArchiveFailed,
    getArchiveSuccess = actions.getArchiveSuccess,
    dumpArchive = actions.dumpArchive,
    removeDockedCameraAndState = actions.removeDockedCameraAndState;
  var expandedAlert = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.dockData.expandedAlert;
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    animating = _useState2[0],
    setAnimating = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    archive = _useState4[0],
    setArchive = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    loadedPages = _useState6[0],
    setLoadedPages = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    swapped = _useState8[0],
    setSwapped = _useState8[1];
  var _useState9 = (0, _react.useState)(""),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    flip = _useState10[0],
    setFlip = _useState10[1];
  var _useState11 = (0, _react.useState)(true),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    shouldAllowFetch = _useState12[0],
    setShouldAllowFetch = _useState12[1];
  var _useState13 = (0, _react.useState)(true),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    shouldFetchNextPage = _useState14[0],
    setShouldFetchNextPage = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    shouldDisplayLoading = _useState16[0],
    setShouldDisplayLoading = _useState16[1];
  var _useState17 = (0, _react.useState)(null),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    loadingTimeout = _useState18[0],
    setLoadingTimeout = _useState18[1];
  var _useState19 = (0, _react.useState)(false),
    _useState20 = (0, _slicedToArray2["default"])(_useState19, 2),
    isFetchingNextPage = _useState20[0],
    setIsFetchingNextPage = _useState20[1];
  var _useState21 = (0, _react.useState)(),
    _useState22 = (0, _slicedToArray2["default"])(_useState21, 2),
    isSwapping = _useState22[0],
    setIsSwapping = _useState22[1];
  (0, _react.useEffect)(function () {
    var archivedNotifications = (0, _filter["default"])(notifications).call(notifications, function (item) {
      return item.closed;
    });
    if (swapped &&
    // --> in archive mode
    archivedNotifications.length < 10 &&
    // --> less than 10 archived notifications
    !isFetchingNextPage &&
    // --> not already fetching
    shouldAllowFetch // --> allowed to fetch
    ) {
      fetchNextPageConditionally();
    }
    if (componentState.hasError) {
      setAnimating(false);
    }
  }, [props]);
  var handleDismissClick = function handleDismissClick() {
    var activeNotifications = (0, _filter["default"])(notifications).call(notifications, function (n) {
      return !n.closed;
    });
    (0, _setTimeout2["default"])(function () {
      return dispatch(closeBulkNotifications((0, _map["default"])(activeNotifications).call(activeNotifications, function (n) {
        return n.id;
      })));
    }, 400);
    setAnimating(true);
  };
  var handleRestoreClick = function handleRestoreClick() {
    var inactiveNotifications = (0, _filter["default"])(notifications).call(notifications, function (n) {
      return n.closed;
    });
    setAnimating(true);
    (0, _setTimeout2["default"])(function () {
      dispatch(reopenBulkNotifications(inactiveNotifications));
      fetchNextPageConditionally();
      setAnimating(false);
      setShouldFetchNextPage(false);
    }, 400);
  };
  var fetchNextPageConditionally = function fetchNextPageConditionally() {
    var nextPage;
    if (shouldFetchNextPage) {
      nextPage = loadedPages + 1;
    } else {
      // If we've reopened any already-loaded notifications, we need to refresh the loaded pages before getting new ones so we don't lose items
      nextPage = loadedPages;
      setShouldFetchNextPage(true);
    }
    setIsFetchingNextPage(true);
    _clientAppCore.notificationService.getArchivedByPage(nextPage, function (err, response) {
      if (err) {
        console.log(err);
        dispatch(getArchiveFailed());
      } else {
        //  --> Show notifications
        var _archivedNotifications = (0, _filter["default"])(notifications).call(notifications, function (item) {
          return item.closed;
        });
        if (response.length === _archivedNotifications.length) {
          // --> If the response has the same items, we want to disable the scroll call for X seconds to avoid excess requests
          setShouldAllowFetch(false);
          (0, _setTimeout2["default"])(function () {
            return setShouldAllowFetch(true);
          }, 10000);
        }
        dispatch(getArchiveSuccess(response));
        clearTimeout(loadingTimeout);
        setLoadedPages(nextPage);
        setShouldDisplayLoading(false);
        setIsFetchingNextPage(false);
        setLoadingTimeout(null);
        setFlip("full");
      }
    });
  };
  var handleArchiveClick = function handleArchiveClick() {
    // Click should do nothing if we're mid-animation
    if (isSwapping) {
      return;
    }
    setArchive(!archive);
    setIsSwapping(true);

    // --> Swap views and scroll to top
    // --> Timeouts are relative to animation length

    scrollToTop(); //--> Immediate scroll-to-top is annoying, but fixes weird bug where low scrolling causes bleeding together of all the notifications on flip

    // setTimeout(this.scrollToTop, 150);
    (0, _setTimeout2["default"])(function () {
      return setSwapped(!swapped);
    }, 150);
    // Prevent swap back until animation is complete
    (0, _setTimeout2["default"])(function () {
      return setIsSwapping(false);
    }, 300);
    if (!swapped) {
      // ---> If we are switching to "Archive"
      setFlip("half");
      var loadTimeout = (0, _setTimeout2["default"])(function () {
        return setShouldDisplayLoading(true);
      }, 300);
      setLoadingTimeout(loadTimeout);
      fetchNextPageConditionally();
    } else {
      // ---> If we are switching to "Active"
      (0, _setTimeout2["default"])(dumpArchive, 300);
      //  --> Remove all loaded archive notifications; switch back to archive means we're starting fresh at page 1
      setLoadedPages(0);
      setShouldFetchNextPage(true);
      setShouldAllowFetch(true);
      setShouldDisplayLoading(false);
    }
  };
  var reopenBulkNotificationsEvent = function reopenBulkNotificationsEvent(notifications) {
    setShouldFetchNextPage(false);
    dispatch(reopenBulkNotifications(notifications));
  };
  var scrollToTop = function scrollToTop() {
    document.getElementById("notification-tab-wrapper").scrollTop = 0;
  };
  var activeNotifications = (0, _filter["default"])(notifications).call(notifications, function (item) {
    return !item.closed;
  });
  var archivedNotifications = (0, _filter["default"])(notifications).call(notifications, function (item) {
    return item.closed;
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "notification-tab-wrapper",
    className: "cf" + (componentState.hasError ? " adjusted" : "")
  }, /*#__PURE__*/_react["default"].createElement("div", null, componentState.hasError && /*#__PURE__*/_react["default"].createElement("div", {
    className: "error-message-banner"
  }, /*#__PURE__*/_react["default"].createElement("p", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.errorOcc"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, archive ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    style: {
      textTransform: "none"
    },
    onClick: handleArchiveClick
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.viewActive"
  })) : /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    style: {
      textTransform: "none"
    },
    onClick: handleArchiveClick
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.viewArchive"
  })), activeNotifications.length > 0 && !readOnly && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    style: {
      textTransform: "none"
    },
    onClick: handleDismissClick
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.dismissAll"
  }))))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "flip-container",
    style: {
      position: "absolute"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "flipper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "front"
  }, shouldDisplayLoading && componentState.hasError && /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: "24px 0px",
      color: "#B5B9BE"
    },
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.checkNetConn"
  })), shouldDisplayLoading && !componentState.hasError && /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: "24px 0px",
      color: "#B5B9BE"
    },
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.loading"
  }))))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "flip-container" + (archive && flip === "half" ? " half-flip" : archive && flip === "full" ? " flip" : "")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "flipper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "front"
  }, !swapped && (activeNotifications.length === 0 ? /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: "24px 0px",
      color: "#B5B9BE"
    },
    align: "center",
    variant: "caption",
    sx: {
      color: "#98999D"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.noNotifications"
  })) : /*#__PURE__*/_react["default"].createElement(_TimeNotificationGroup["default"], {
    archive: false,
    readOnly: readOnly,
    forReplay: forReplay,
    expandedAlert: expandedAlert,
    notifications: activeNotifications,
    animating: animating,
    bulkAction: closeBulkNotifications,
    componentState: componentState,
    removeDockedCameraAndState: removeDockedCameraAndState,
    endDate: endDate,
    selectFloorPlanOn: selectFloorPlanOn,
    floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "back"
  }, swapped && (archivedNotifications.length === 0 ? /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: "24px 0px",
      color: "#B5B9BE"
    },
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.notifications.main.archiveEmpty"
  })) : /*#__PURE__*/_react["default"].createElement(_TimeNotificationGroup["default"], {
    archive: true,
    notifications: archivedNotifications,
    readOnly: readOnly,
    forReplay: forReplay,
    animating: animating,
    bulkAction: reopenBulkNotificationsEvent,
    componentState: componentState,
    fetchNextPage: fetchNextPageConditionally,
    fetching: isFetchingNextPage,
    shouldFetch: shouldAllowFetch,
    removeDockedCameraAndState: removeDockedCameraAndState,
    endDate: endDate,
    selectFloorPlanOn: selectFloorPlanOn,
    floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
  })), isFetchingNextPage && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      textAlign: "center"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, {
    size: 200
  }))))));
};
NotificationsTab.propTypes = propTypes;
NotificationsTab.defaultProps = defaultProps;
var _default = NotificationsTab;
exports["default"] = _default;