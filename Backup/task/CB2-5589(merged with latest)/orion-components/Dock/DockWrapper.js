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
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _react = _interopRequireWildcard(require("react"));
var _Dock = _interopRequireDefault(require("./Dock"));
var _NewNotificationItem = _interopRequireDefault(require("./shared/components/NewNotificationItem"));
var _Drawer = _interopRequireDefault(require("@mui/material/Drawer"));
var _Badge = _interopRequireDefault(require("@mui/material/Badge"));
var _SvgIcon = _interopRequireDefault(require("@mui/material/SvgIcon"));
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _iconsMaterial = require("@mui/icons-material");
var _mdiMaterialUi = require("mdi-material-ui");
var _Icons = require("orion-components/CBComponents/Icons");
var _styles = require("@mui/material/styles");
var _customTheme = _interopRequireDefault(require("./customTheme"));
var _CBComponents = require("orion-components/CBComponents");
var _i18n = require("orion-components/i18n");
var _clientAppCore = require("client-app-core");
var _reactRedux = require("react-redux");
var _actions = require("./Notifications/actions");
var _actions2 = require("./Cameras/actions");
var _selectors = require("./Cameras/selectors");
var _actions3 = require("../Services/SystemNotificationService/actions");
var _Selectors = require("orion-components/Session/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var actionCreators = _interopRequireWildcard(require("./actions"));
var _js = require("@mdi/js");
var _find = _interopRequireDefault(require("lodash/find"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Sidebar

// Notification Item

// material icons

// custom theme

var DockWrapper = function DockWrapper(props) {
  var _context4, _context5;
  var dispatch = (0, _reactRedux.useDispatch)();
  var shouldStreamCameras = props.shouldStreamCameras,
    shouldStreamNotifications = props.shouldStreamNotifications;
  var setTab = actionCreators.setTab,
    toggleOpen = actionCreators.toggleOpen,
    getAppState = actionCreators.getAppState,
    confirmFirstUse = actionCreators.confirmFirstUse,
    clearNotification = actionCreators.clearNotification,
    logOut = actionCreators.logOut,
    toggleWavCam = actionCreators.toggleWavCam;
  var dockData = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.dockData;
  }); //TODO: dockData.newAlerts
  var Notifications = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData.notifications;
  });
  var allNotifications = [];
  if (Notifications) {
    var _context, _context2;
    var activeNotifications = (0, _map["default"])(_context = Notifications.activeItems).call(_context, function (id) {
      return Notifications.activeItemsById[id];
    });
    var archiveNotifications = (0, _map["default"])(_context2 = Notifications.archiveItems).call(_context2, function (id) {
      return Notifications.archiveItemsById[id];
    });
    allNotifications = (0, _concat["default"])(activeNotifications).call(activeNotifications, archiveNotifications);
  }
  var cameraIntegrations = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.userIntegrationsOfEntityTypeSelector)("camera")(state);
  }, _reactRedux.shallowEqual);
  var userCameras = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selectors.userCamerasSelector)(state);
  });
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return state.appId;
  });
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user;
  });
  var profile = user.profile,
    firstUseText = user.firstUseText,
    sessionEnded = user.sessionEnded;
  var firstUseAck = profile.firstUseAck,
    id = profile.id;
  var hasSysHealthError = (0, _reactRedux.useSelector)(function (state) {
    return state.systemHealth.hasHealthError;
  });
  var externalSystems = (0, _reactRedux.useSelector)(function (state) {
    return state.session && state.session.organization && state.session.organization.externalSystems || [];
  });
  var notifications = allNotifications;
  var componentState = dockData;
  var userHasCameras = cameraIntegrations && cameraIntegrations.length > 0;
  var userId = id;
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var systemNotifications = (0, _reactRedux.useSelector)(function (state) {
    return state.systemNotifications;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var applications = profile.applications;
  var unitsApp = (0, _find["default"])(applications, {
    appId: "units-app"
  });
  var statusBoardApp = (0, _find["default"])(applications, {
    appId: "status-board-app"
  });
  var mql = window.matchMedia("(max-width: 750px)");
  var _useState = (0, _react.useState)(mql.matches ? "100%" : "420px"),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    panelWidth = _useState2[0],
    setPanelWidth = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    zetronPhoneVisible = _useState4[0],
    setZetronPhoneVisible = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    unitSettings = _useState6[0],
    setUnitSettings = _useState6[1];
  var handleTouchTap = function handleTouchTap(tab) {
    dispatch(setTab(tab));
    dispatch(toggleOpen());
  };
  var handleAlertTouchTap = function handleAlertTouchTap(tab) {
    // document.getElementById("notification-tab-wrapper").scrollTop = 0;
    dispatch(setTab(tab));
    dispatch(toggleOpen());
    (0, _setTimeout2["default"])(function () {
      var container = document.getElementById("notification-tab-wrapper");
      var target = document.getElementById("first-priority");
      scrollTo(container, target, 300);
    }, 1000);
  };
  var scrollTo = function scrollTo(element, destinationElement, duration) {
    // This only works if scrolling from scrollTop 0 atm
    if (element && destinationElement && duration) {
      var destination = destinationElement.offsetTop - 80;
      var distance = destination - element.scrollTop;
      var easeOutQuad = function easeOutQuad(t) {
        return t * (2 - t);
      };
      var time = 0;
      while (time < duration) {
        (function (time) {
          (0, _setTimeout2["default"])(function () {
            var tValue = time / duration;
            var transformedT = easeOutQuad(tValue);
            element.scrollTop = distance * transformedT;
          }, time);
        })(time += 10);
      }
    }
  };
  (0, _react.useEffect)(function () {
    dispatch(getAppState());
    if (shouldStreamNotifications) {
      dispatch((0, _actions.startNotificationStream)());
    }
    if (shouldStreamCameras) {
      dispatch((0, _actions2.getAllCameras)());
    }
    var serviceCallBack = function serviceCallBack(err, response) {
      if (err) {
        if (!zetronPhoneVisible) {
          setZetronPhoneVisible(false);
        }
      } else {
        if (response.clientInstalled) {
          setZetronPhoneVisible(true);
        }
      }
    };
    if (externalSystems) {
      if (externalSystems && externalSystems.length > 0) {
        var flagTmp = (0, _includes["default"])(externalSystems).call(externalSystems, "zetron");
        if (flagTmp) {
          _clientAppCore.integrationService.getExternalSystemLookup("zetron", "serviceAvailableToUser", serviceCallBack);
        }
      }
    }
    // Listen for changes in screen size and adjust width accordingly
    var mql = window.matchMedia("(max-width: 750px)");
    mql.addListener(function (e) {
      if (e.matches) {
        setPanelWidth("100%");
      } else {
        setPanelWidth(420);
      }
    });
    if (getUnitPanel(appId)) {
      _clientAppCore.unitService.getAppSettingsByKey("units-app", "unitMemberFeeds", function (err, response) {
        if (err) {
          console.log("ERROR:", err);
        } else {
          setUnitSettings(response.value);
        }
      });
    }
  }, []);
  var getUnitPanel = function getUnitPanel(appName) {
    switch (appName) {
      case "map-app":
        return true;
      default:
        return false;
    }
  };
  var handleConfirmFirstUse = function handleConfirmFirstUse() {
    dispatch(confirmFirstUse(userId));
  };
  var openNotifications = (0, _react.useMemo)(function () {
    return (0, _filter["default"])(notifications).call(notifications, function (item) {
      return !item.closed;
    });
  }, [notifications]);
  var alerts = (0, _react.useMemo)(function () {
    return (0, _filter["default"])(openNotifications).call(openNotifications, function (item) {
      return item.isPriority;
    });
  }, [openNotifications]);
  var nonPriority = (0, _react.useMemo)(function () {
    return (0, _filter["default"])(openNotifications).call(openNotifications, function (item) {
      return !item.isPriority;
    });
  }, [openNotifications]);
  var userHasWavCameras = (0, _react.useMemo)(function () {
    return (0, _some["default"])(userCameras).call(userCameras, function (cam) {
      var _context3;
      return cam.entityData.properties.features && (0, _includes["default"])(_context3 = cam.entityData.properties.features).call(_context3, "ribbon");
    });
  }, [userCameras]);
  var iconStyle = {
    height: "30px",
    width: "30px",
    color: "#FFF"
  };
  var badgeIconStyle = {
    height: "24px",
    width: "24px",
    color: "#FFF"
  };
  var dialogNotifications = (0, _map["default"])(_context4 = (0, _sort["default"])(systemNotifications).call(systemNotifications, function (a, b) {
    return new Date(a.timestamp) - new Date(b.timestamp);
  })).call(_context4, function (notification) {
    var id = notification.id,
      title = notification.title,
      content = notification.content;
    return {
      title: title,
      textContent: content,
      confirm: {
        label: (0, _i18n.getTranslation)("global.dock.dockWrapper.acknowledge"),
        action: function action() {
          dispatch((0, _actions3.acknowledgeSystemNotification)(id));
        }
      }
    };
  });

  // Docked prop on drawer allows it to be closed via click-away
  return /*#__PURE__*/_react["default"].createElement(_styles.StyledEngineProvider, {
    injectFirst: true
  }, /*#__PURE__*/_react["default"].createElement(_styles.ThemeProvider, {
    theme: (0, _styles.createTheme)(_customTheme["default"])
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: dir && dir === "rtl" ? "alert-sidebar-trayRTL" : "alert-sidebar-tray"
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: sessionEnded,
    title: (0, _i18n.getTranslation)("global.dock.dockWrapper.sessionExpired"),
    textContent: (0, _i18n.getTranslation)("global.dock.dockWrapper.redirectLogin"),
    confirm: {
      label: (0, _i18n.getTranslation)("global.dock.dockWrapper.ok"),
      action: function action() {
        return dispatch(logOut());
      }
    },
    dir: dir,
    dialogContentStyles: {
      color: "#fff"
    }
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: !firstUseAck,
    textContent: firstUseText,
    title: (0, _i18n.getTranslation)("global.dock.dockWrapper.userAgreement"),
    confirm: {
      label: (0, _i18n.getTranslation)("global.dock.dockWrapper.accept"),
      action: handleConfirmFirstUse
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.dock.dockWrapper.decline"),
      action: function action() {
        return dispatch(logOut());
      }
    },
    dir: dir
  }), !sessionEnded && firstUseAck &&
  /*#__PURE__*/
  // -- don't show notifications if firstUseAck dialog or sessionEnded dialog open
  _react["default"].createElement(_CBComponents.NotificationsDialog, {
    notifications: dialogNotifications,
    clearSystemNotifications: _actions3.clearSystemNotifications,
    dir: dir
  }), getUnitPanel(appId) && unitsApp && (0, _includes["default"])(_context5 = unitsApp.permissions).call(_context5, "manage") && /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper",
    onClick: componentState.isOpen ? function () {
      return dispatch(setTab("Units_panel"));
    } : function () {
      return handleTouchTap("Units_panel");
    }
  }, /*#__PURE__*/_react["default"].createElement(_SvgIcon["default"], {
    style: {
      width: "24px",
      height: "24px",
      color: "#FFFFFF"
    }
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiShieldCheck
  }))), statusBoardApp && /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper",
    onClick: componentState.isOpen ? function () {
      return dispatch(setTab("Status_board"));
    } : function () {
      return handleTouchTap("Status_board");
    }
  }, /*#__PURE__*/_react["default"].createElement(_SvgIcon["default"], {
    style: {
      width: "24px",
      height: "24px",
      color: "#FFFFFF"
    }
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiCheckboxMultipleMarked
  }))), zetronPhoneVisible && /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper",
    onClick: componentState.isOpen ? function () {
      return dispatch(setTab("Calling_Panel"));
    } : function () {
      return handleTouchTap("Calling_Panel");
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Phone, {
    style: {
      width: "24px",
      height: "24px",
      color: "#FFFFFF"
    }
  })), (alerts.length > 0 || hasSysHealthError) && /*#__PURE__*/_react["default"].createElement("div", {
    className: "alert-bar-overlay"
  }), alerts.length > 0 && /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper alert-wrapper",
    onClick: componentState.isOpen ? function () {
      return dispatch(setTab("Notifications"));
    } : function () {
      return handleAlertTouchTap("Notifications");
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "tray-icon alert-icon pulse bounce" + (alerts.length > 99 ? " high-count" : "")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "item-info"
  }, alerts.length)), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.dockWrapper.alerts"
  }))), /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper",
    onClick: componentState.isOpen ? function () {
      return dispatch(setTab("System_health"));
    } : function () {
      return handleTouchTap("System_health");
    }
  }, hasSysHealthError ? /*#__PURE__*/_react["default"].createElement(_Badge["default"], {
    badgeContent: /*#__PURE__*/_react["default"].createElement(_Icons.Alert, {
      iconStyles: {
        marginTop: "30px",
        fontSize: "20px"
      },
      iconColor: "#C64849"
    })
  }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.ClipboardPulse, {
    style: {
      width: "24px",
      height: "48px",
      color: "#FFF"
    }
  })) : /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.ClipboardPulse, {
    style: {
      width: "24px",
      height: "24px",
      color: "#FFF"
    }
  })), /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper",
    onClick: componentState.isOpen ? function () {
      return dispatch(setTab("Notifications"));
    } : function () {
      return handleTouchTap("Notifications");
    }
  }, nonPriority.length > 0 ? /*#__PURE__*/_react["default"].createElement(_Badge["default"], {
    badgeContent: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Error, {
      color: "#c64849"
    }),
    badgeStyle: {
      width: 16,
      height: 16,
      top: 24,
      right: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_Info["default"], {
    className: "info-icon",
    style: badgeIconStyle
  })) : /*#__PURE__*/_react["default"].createElement(_Info["default"], {
    className: "info-icon",
    style: iconStyle
  })), userHasWavCameras && /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper",
    onClick: function onClick() {
      return dispatch(toggleWavCam());
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Image, {
    style: {
      color: "white",
      width: "24px",
      height: "24px"
    }
  })), userHasCameras && /*#__PURE__*/_react["default"].createElement("a", {
    className: "link-wrapper",
    onClick: componentState.isOpen ? function () {
      return dispatch(setTab("Cameras"));
    } : function () {
      return handleTouchTap("Cameras");
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Videocam, {
    style: {
      width: "24px",
      height: "24px",
      color: "#FFF"
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "new-alerts"
  }, componentState.newAlerts.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
    key: componentState.newAlerts[0].id
  }, /*#__PURE__*/_react["default"].createElement(_NewNotificationItem["default"], {
    notification: componentState.newAlerts[0],
    key: componentState.newAlerts[0].id,
    isLonely: componentState.newAlerts.length === 1,
    clearNotification: clearNotification,
    timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour"
  }))), /*#__PURE__*/_react["default"].createElement(_Drawer["default"], {
    open: componentState.isOpen,
    anchor: dir === "rtl" ? "left" : "right",
    sx: (0, _defineProperty2["default"])({}, "& .MuiDrawer-paper", {
      width: componentState.isOpen ? panelWidth : " 420px",
      backgroundColor: "#2C2B2D",
      position: "fixed!important",
      height: "calc(100vh - 48px) !important",
      top: "48px !important",
      overflow: " visible !important"
    }),
    variant: "persistent"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    onClick: function onClick() {
      return dispatch(toggleOpen());
    },
    className: "ad-toggle-mobile"
  }), componentState.isOpen && /*#__PURE__*/_react["default"].createElement(_Dock["default"], (0, _extends2["default"])({}, props, {
    dir: dir,
    setTab: setTab,
    componentState: componentState,
    toggleOpen: toggleOpen,
    notifications: notifications,
    unitSettings: unitSettings,
    statusBoardApp: statusBoardApp
  }))))));
};
DockWrapper.defaultProps = {
  shouldStreamNotifications: true
};

//const shouldComponentUpdate = (prevProps, nextProps) => {
//	return (
//		isEqual(nextProps, prevProps)
//	);
//}
var _default = /*#__PURE__*/(0, _react.memo)(DockWrapper);
exports["default"] = _default;