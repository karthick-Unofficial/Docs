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
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _ErrorBoundary = _interopRequireDefault(require("../../ErrorBoundary"));
var _SummaryWidget = _interopRequireDefault(require("../Widgets/Summary/SummaryWidget"));
var _LayoutControls = _interopRequireDefault(require("../Widgets/LayoutControls/LayoutControls"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _i18n = require("orion-components/i18n");
var _clientAppCore = require("client-app-core");
var _jquery = _interopRequireDefault(require("jquery"));
var _PinToDialog = _interopRequireDefault(require("../../SharedComponents/PinToDialog"));
var _AccessPointEditDialog = _interopRequireDefault(require("./components/AccessPointEditDialog"));
var _FileWidget = _interopRequireDefault(require("../Widgets/File/FileWidget"));
var _Activities = _interopRequireDefault(require("../Widgets/Activities/Activities"));
var _LinkedItemsWidget = _interopRequireDefault(require("../Widgets/LinkedItems/LinkedItemsWidget"));
var _CamerasWidget = _interopRequireDefault(require("../Widgets/Cameras/CamerasWidget"));
var _AccessControlWidget = _interopRequireDefault(require("../Widgets/AccessControl/AccessControlWidget"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _Selectors2 = require("orion-components/ContextPanel/Selectors");
var _Selectors3 = require("orion-components/GlobalData/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _unionBy = _interopRequireDefault(require("lodash/unionBy"));
var _Actions = require("orion-components/AppState/Actions");
var _Actions2 = require("orion-components/ContextualData/Actions");
var _Actions3 = require("orion-components/ContextPanel/Actions");
var _index = require("orion-components/Dock/Actions/index.js");
var _Actions4 = require("orion-components/GlobalData/Actions");
var _accessPointProfileActions = require("../../SharedActions/accessPointProfileActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//actions

var propTypes = {
  locale: _propTypes["default"].string,
  selectFloorPlanOn: _propTypes["default"].func
};
var defaultProps = {
  locale: "en",
  selectFloorPlanOn: function selectFloorPlanOn() {}
};
var DEFAULT_WIDGET_CONFIG = [];
var AccessPointProfile = function AccessPointProfile(_ref) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8;
  var readOnly = _ref.readOnly,
    facilityOption = _ref.facilityOption,
    appData = _ref.appData,
    view = _ref.view,
    selectWidget = _ref.selectWidget,
    widgetsLaunchable = _ref.widgetsLaunchable,
    widgetsExpandable = _ref.widgetsExpandable,
    forReplay = _ref.forReplay,
    endDate = _ref.endDate,
    disableLinkedItems = _ref.disableLinkedItems,
    disabledLinkedItemTypes = _ref.disabledLinkedItemTypes,
    floorPlansWithFacFeed = _ref.floorPlansWithFacFeed,
    selectFloorPlanOn = _ref.selectFloorPlanOn;
  var dispatch = (0, _reactRedux.useDispatch)();
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile;
  });
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.selectedContextSelector)(state);
  });
  var entity = context.entity;
  var isLoaded = (0, _isObject["default"])(context) && entity;
  var activityFilters = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.persistedState)(state).activityFilters;
  });
  var dialog = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.dialog.openDialog;
  });
  var mapStatus = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapState)(state);
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.i18n.locale;
  });
  var entityType = isLoaded && entity.entityType;
  var contextId = isLoaded && entity.id;
  var widgetState = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.widgetStateSelector)(state);
  });
  // Check if camera is the primary context
  var isPrimary = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && contextId === (0, _Selectors2.contextPanelState)(state).selectedContext.primary;
  });
  var feeds = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors3.userFeedsSelector)(state);
  });
  var sidebarOpen = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.dock.dockData.isOpen;
  });
  var dockedCameras = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.dock.cameraDock.dockedCameras;
  });
  var fullscreenCamera = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.fullscreenCameraOpen)(state);
  });
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appId;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _selector.getDir)(state);
  });
  var accessPoint = isLoaded && entity;
  var mapVisible = isLoaded && mapStatus.visible;
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.global.timeFormat;
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    scrolledUp = _useState2[0],
    setScrolledUp = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    hiding = _useState4[0],
    setHiding = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    layoutControlsOpen = _useState6[0],
    setLayoutControlsOpen = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    anchorEl = _useState8[0],
    setAnchorEl = _useState8[1];
  var _useState9 = (0, _react.useState)(true),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    facilityHidden = _useState10[0],
    setFacilityHidden = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    mounted = _useState12[0],
    setMounted = _useState12[1];
  var floorPlansWithFacilityFeed = (0, _reactRedux.useSelector)(function (state) {
    return floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null;
  });
  var canManageAccessPoint = user.integrations && (0, _find["default"])(_context = user.integrations).call(_context, function (_int) {
    return _int.intId === accessPoint.feedId;
  }) && (0, _find["default"])(_context2 = user.integrations).call(_context2, function (_int2) {
    return _int2.intId === accessPoint.feedId;
  }).permissions && (0, _includes["default"])(_context3 = (0, _find["default"])(_context4 = user.integrations).call(_context4, function (_int3) {
    return _int3.intId === accessPoint.feedId;
  }).permissions).call(_context3, "manage");
  var canControlAccessPoint = !readOnly && user.integrations && (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int4) {
    return _int4.intId === accessPoint.feedId;
  }) && (0, _find["default"])(_context6 = user.integrations).call(_context6, function (_int5) {
    return _int5.intId === accessPoint.feedId;
  }).permissions && (0, _includes["default"])(_context7 = (0, _find["default"])(_context8 = user.integrations).call(_context8, function (_int6) {
    return _int6.intId === accessPoint.feedId;
  }).permissions).call(_context7, "control");
  (0, _react.useEffect)(function () {
    if (!forReplay) {
      dispatch((0, _Actions2.startCamerasInRangeStream)(contextId, entityType, "profile"));
      if (getWidgetStatus("activities")) dispatch((0, _Actions2.startActivityStream)(contextId, "accessPoint", "profile"));
      if (getWidgetStatus("files")) dispatch((0, _Actions2.startAttachmentStream)(contextId, "profile"));
      if (accessPoint && accessPoint.entityData.displayTargetId && accessPoint.entityData.displayType && accessPoint.entityData.displayType.toLowerCase() === "facility") {
        _clientAppCore.facilityService.getFloorPlan(accessPoint.entityData.displayTargetId, function (err, res) {
          if (err) {
            setFacilityHidden(true);
          } else if (res.success) {
            setFacilityHidden(false);
          }
        });
      }
    } else {
      // do we need to do something else here, or leave it up to the widgets to pull in the static data
    }
    setMounted(true);
  }, []);
  if (!mounted) {
    DEFAULT_WIDGET_CONFIG = [{
      enabled: true,
      id: "access_control",
      name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.accessControlWidget.title")
    }, {
      enabled: true,
      id: "files",
      name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.files")
    }, {
      enabled: true,
      id: "activities",
      name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.activities")
    }, {
      enabled: true,
      id: "cameras",
      name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.cameras")
    }];
    setMounted(true);
  }
  (0, _react.useEffect)(function () {
    handleScroll();
  }, [scrolledUp]);
  var getWidgetStatus = function getWidgetStatus(widgetId) {
    var widgetConfig = getWidgetConfig();
    var widget = (0, _find["default"])(widgetConfig).call(widgetConfig, function (widget, index) {
      widget.index = index;
      return widget.id === widgetId;
    });
    return widget;
  };
  var handleScroll = function handleScroll() {
    (0, _jquery["default"])(".cb-profile-wrapper").on("resize scroll", function () {
      var elementTop = (0, _jquery["default"])(".summary-wrapper").offset().top;
      var elementBottom = elementTop + (0, _jquery["default"])(".summary-wrapper").outerHeight() + 120; // offset for app/navigation bar
      var viewportTop = (0, _jquery["default"])(".cb-profile-wrapper").scrollTop();
      var profileHeight = (0, _jquery["default"])(".cb-profile-wrapper").height();
      var viewportBottom = viewportTop + (0, _jquery["default"])(".cb-profile-wrapper").height();
      var widgetsHeight = (0, _jquery["default"])(".widgets-container").height();
      var scrollLength = viewportBottom - elementBottom;
      var pctScrolled = Math.floor(viewportTop / scrollLength * 100); // gets percentage scrolled

      if (!scrolledUp && pctScrolled > 1 && widgetsHeight > profileHeight - 66) {
        setScrolledUp(true);
      } else if (scrolledUp && pctScrolled < 2) {
        setScrolledUp(false);
      }
    });
  };
  var handleExpand = function handleExpand() {
    setScrolledUp(false);
    (0, _jquery["default"])(".cb-profile-wrapper").scrollTop(0);
  };
  var getWidgetConfig = function getWidgetConfig() {
    var defaultTypes = ["files", "activities", "linked_items", "cameras"];
    if (canControlAccessPoint) {
      defaultTypes.unshift("access_control");
    }
    if (widgetsExpandable) defaultTypes.push("map");
    var filteredDefault = (0, _filter["default"])(DEFAULT_WIDGET_CONFIG).call(DEFAULT_WIDGET_CONFIG, function (widget) {
      return (0, _includes["default"])(defaultTypes).call(defaultTypes, widget.id);
    });
    var filteredState = widgetState ? (0, _filter["default"])(widgetState).call(widgetState, function (widget) {
      return (0, _includes["default"])(defaultTypes).call(defaultTypes, widget.id);
    }) : [];
    var widgetConfig = widgetState ? (0, _unionBy["default"])(filteredState, filteredDefault, "id") : filteredDefault;
    return widgetConfig;
  };
  var handleEditLayout = function handleEditLayout(event) {
    event.preventDefault();
    setLayoutControlsOpen(true);
    setAnchorEl(event.currentTarget);
  };
  var handleCloseEditLayout = function handleCloseEditLayout() {
    setLayoutControlsOpen(false);
  };
  var showFloorPlanOnTargetClick = function showFloorPlanOnTargetClick() {
    var entityData = accessPoint.entityData;
    if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
      var floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
      if (floorPlanData.id === entityData.displayTargetId) {
        selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId);
      }
    }
  };
  if (context) {
    var _context9, _context11, _context12, _context13, _context14, _context15, _context16, _context17, _context18, _context19, _context20, _context21, _context22, _context23, _context24, _context25, _context26, _context27, _context28, _context29, _context30, _context31, _context32, _context33;
    var _entityType = accessPoint.entityType,
      entityData = accessPoint.entityData,
      feedId = accessPoint.feedId;
    var properties = entityData.properties,
      geometry = entityData.geometry;
    var name = properties.name,
      description = properties.description,
      type = properties.type;
    var attachments = context.attachments,
      activities = context.activities,
      camerasInRange = context.camerasInRange;
    var userId = user.id;
    // Height of summary-info (consistent between scrolled and not scrolled state) + padding
    var scrollOffset = scrolledUp ? 167 : 0;
    // Dynamic offset for widget container when SummaryWidget is collapsed
    var widgetsContainerStyle = {
      top: scrollOffset
    };
    var widgets = getWidgetConfig();
    var actions = [];
    if (entityData.displayType && entityData.displayType.toLowerCase() === "facility" && entityData.displayTargetId && facilityOption && !facilityHidden) {
      actions.push({
        name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.facility"),
        nameText: "Facility",
        action: function action() {
          return window.location.replace("/facilities-app/#/?".concat(entityData.displayTargetId));
        }
      });
    }
    actions = (0, _concat["default"])(_context9 = []).call(_context9, (0, _toConsumableArray2["default"])(actions), [{
      name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.pinTo"),
      nameText: "Pin To",
      action: function action() {
        return dispatch((0, _Actions.openDialog)("pinToDialog"));
      }
    }]);

    // can we edit a access point?
    if (canManageAccessPoint) {
      var _context10;
      actions = (0, _concat["default"])(_context10 = []).call(_context10, (0, _toConsumableArray2["default"])(actions), [{
        name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.edit"),
        nameText: "Edit",
        action: function action() {
          return dispatch((0, _Actions.openDialog)("accessPointEditDialog"));
        }
      }]);
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "cb-profile-wrapper",
      style: {
        height: "100%",
        overflow: "scroll"
      }
    }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_SummaryWidget["default"], {
      id: contextId,
      readOnly: readOnly,
      user: user,
      context: context,
      name: name,
      type: "accessPoint",
      geometry: entityData.displayTargetId ? true : geometry,
      description: description,
      scrolledUp: scrolledUp,
      handleExpand: handleExpand,
      mapVisible: mapVisible,
      appId: appId,
      selectFloor: showFloorPlanOnTargetClick,
      actions: (0, _concat["default"])(_context11 = []).call(_context11, (0, _toConsumableArray2["default"])(actions), [{
        name: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.hide"),
        nameText: "Hide",
        action: function action() {
          setHiding(true);
          dispatch((0, _Actions4.ignoreEntity)(contextId, _entityType, feedId, appData));
        },
        debounce: hiding
      }]),
      dir: dir,
      displayType: type === "Radar" ? type : "Access Point"
    })), !scrolledUp && /*#__PURE__*/_react["default"].createElement("div", {
      className: "layout-control-button"
    }, /*#__PURE__*/_react["default"].createElement("a", {
      className: "cb-font-link",
      onClick: handleEditLayout
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.accessPointProfile.editProfileLayout"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "widgets-container",
      style: widgetsContainerStyle
    }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LayoutControls["default"], {
      open: layoutControlsOpen,
      anchor: anchorEl,
      close: handleCloseEditLayout,
      widgetOrder: widgets,
      profile: "accessPoint"
    })), getWidgetStatus("access_control") && canControlAccessPoint && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_AccessControlWidget["default"], {
      readOnly: readOnly,
      key: "".concat(contextId, "-access_control"),
      order: getWidgetStatus("access_control").index,
      enabled: getWidgetStatus("access_control").enabled,
      accessPoint: accessPoint
    })), getWidgetStatus("files") && context.attachments && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_FileWidget["default"], {
      key: "".concat(contextId, "-files"),
      order: getWidgetStatus("files").index,
      enabled: getWidgetStatus("files").enabled,
      canDelete: !readOnly && user && user.integrations && (0, _find["default"])(_context12 = user.integrations).call(_context12, function (_int7) {
        return _int7.intId === accessPoint.feedId;
      }) && (0, _find["default"])(_context13 = user.integrations).call(_context13, function (_int8) {
        return _int8.intId === accessPoint.feedId;
      }).permissions && (0, _includes["default"])(_context14 = (0, _find["default"])(_context15 = user.integrations).call(_context15, function (_int9) {
        return _int9.intId === accessPoint.feedId;
      }).permissions).call(_context14, "manage"),
      hasAccess: !readOnly && user && user.integrations && (0, _find["default"])(_context16 = user.integrations).call(_context16, function (_int10) {
        return _int10.intId === accessPoint.feedId;
      }) && (0, _find["default"])(_context17 = user.integrations).call(_context17, function (_int11) {
        return _int11.intId === accessPoint.feedId;
      }).config && (0, _find["default"])(_context18 = user.integrations).call(_context18, function (_int12) {
        return _int12.intId === accessPoint.feedId;
      }).config.canView,
      attachments: attachments,
      selected: view === "Files",
      selectWidget: selectWidget,
      attachFiles: _accessPointProfileActions.attachFilesToAccessPoint,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable,
      entityType: _entityType,
      contextId: contextId,
      dialog: dialog,
      unsubscribeFromFeed: _Actions2.unsubscribeFromFeed,
      openDialog: _Actions.openDialog,
      closeDialog: _Actions.closeDialog,
      subscriberRef: "profile",
      dir: dir
    })), getWidgetStatus("activities") && (activities || forReplay) && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Activities["default"], {
      locale: locale,
      key: "".concat(contextId, "-activities"),
      entity: accessPoint,
      canManage: user.integrations && (0, _find["default"])(_context19 = user.integrations).call(_context19, function (_int13) {
        return _int13.intId === accessPoint.feedId;
      }) && (0, _find["default"])(_context20 = user.integrations).call(_context20, function (_int14) {
        return _int14.intId === accessPoint.feedId;
      }).config && (0, _find["default"])(_context21 = user.integrations).call(_context21, function (_int15) {
        return _int15.intId === accessPoint.feedId;
      }).config.canView,
      order: getWidgetStatus("activities").index,
      enabled: getWidgetStatus("activities").enabled,
      selected: view === "Activity Timeline",
      pageSize: 5,
      selectWidget: selectWidget,
      activities: activities,
      activityFilters: activityFilters,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable,
      unsubscribeFromFeed: _Actions2.unsubscribeFromFeed,
      contextId: contextId,
      entityType: _entityType,
      subscriberRef: "profile",
      openDialog: _Actions.openDialog,
      closeDialog: _Actions.closeDialog,
      dialog: dialog,
      isPrimary: isPrimary,
      userId: userId,
      readOnly: readOnly,
      forReplay: forReplay,
      endDate: endDate,
      timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
      dir: dir,
      displayType: type === "Radar" ? type : "AccessPoint"
    })), !disableLinkedItems && getWidgetStatus("linked_items") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LinkedItemsWidget["default"], {
      order: getWidgetStatus("linked_items").index,
      enabled: getWidgetStatus("linked_items").enabled,
      dialog: dialog,
      openDialog: _Actions.openDialog,
      linkEntities: _accessPointProfileActions.linkEntities,
      unlinkEntities: _accessPointProfileActions.unlinkEntities,
      entity: accessPoint,
      closeDialog: _Actions.closeDialog,
      selected: view === "Linked Items",
      expanded: false // for styling differences between profile and expanded widget views
      ,
      items: (0, _toConsumableArray2["default"])(context.linkedEntities || []),
      canLink: canManageAccessPoint,
      events: context.fovEvents || [],
      disabledTypes: disabledLinkedItemTypes,
      selectWidget: selectWidget,
      feeds: feeds,
      view: view,
      loadProfile: _Actions3.loadProfile,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable,
      contextId: contextId,
      entityType: _entityType,
      subscriberRef: "profile",
      unsubscribeFromFeed: _Actions2.unsubscribeFromFeed,
      isPrimary: isPrimary,
      autoFocus: true,
      dir: dir
    })), getWidgetStatus("cameras") && camerasInRange && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_CamerasWidget["default"], {
      key: "".concat(contextId, "-cameras"),
      cameras: camerasInRange,
      canLink: !readOnly && user.integrations && (0, _find["default"])(_context22 = user.integrations).call(_context22, function (_int16) {
        return _int16.intId === accessPoint.feedId;
      }) && (0, _find["default"])(_context23 = user.integrations).call(_context23, function (_int17) {
        return _int17.intId === accessPoint.feedId;
      }).permissions && (0, _includes["default"])(_context24 = (0, _find["default"])(_context25 = user.integrations).call(_context25, function (_int18) {
        return _int18.intId === accessPoint.feedId;
      }).permissions).call(_context24, "manage"),
      entityType: _entityType,
      geometry: geometry,
      order: getWidgetStatus("cameras").index,
      enabled: getWidgetStatus("cameras").enabled,
      loadProfile: _Actions3.loadProfile,
      sidebarOpen: sidebarOpen,
      entity: accessPoint,
      linkEntities: _accessPointProfileActions.linkEntities,
      unlinkCameras: _accessPointProfileActions.unlinkEntities,
      dockedCameras: dockedCameras,
      addCameraToDockMode: _index.addCameraToDockMode,
      contextId: contextId,
      unsubscribeFromFeed: _Actions2.unsubscribeFromFeed,
      subscriberRef: "profile",
      dialog: dialog,
      openDialog: _Actions.openDialog,
      closeDialog: _Actions.closeDialog,
      setCameraPriority: _index.setCameraPriority,
      fullscreenCamera: fullscreenCamera,
      readOnly: readOnly,
      disableSlew: readOnly,
      selectFloorPlanOn: selectFloorPlanOn,
      floorPlansWithFacilityFeed: floorPlansWithFacilityFeed,
      widgetsLaunchable: !readOnly && widgetsLaunchable,
      user: user,
      removeDockedCamera: _index.removeDockedCameraAndState,
      dir: dir
    })), /*#__PURE__*/_react["default"].createElement(_AccessPointEditDialog["default"], {
      open: dialog === "accessPointEditDialog",
      accessPoint: accessPoint,
      close: function close() {
        return dispatch((0, _Actions.closeDialog)("accessPointEditDialog"));
      },
      update: function update(accessPointId, entityData) {
        return dispatch((0, _accessPointProfileActions.updateAccesspoint)(accessPointId, entityData));
      },
      dir: dir
    }), /*#__PURE__*/_react["default"].createElement(_PinToDialog["default"], {
      open: dialog === "pinToDialog",
      close: function close() {
        return dispatch((0, _Actions.closeDialog)("pinToDialog"));
      },
      entity: accessPoint,
      addRemoveFromCollections: _accessPointProfileActions.addRemoveFromCollections,
      addRemoveFromEvents: _accessPointProfileActions.addRemoveFromEvents,
      createCollection: _accessPointProfileActions.createCollection,
      dialog: dialog,
      openDialog: _Actions.openDialog,
      closeDialog: _Actions.closeDialog,
      canManageEvents: user.applications && (0, _find["default"])(_context26 = user.applications).call(_context26, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context27 = user.applications).call(_context27, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context28 = (0, _find["default"])(_context29 = user.applications).call(_context29, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context28, "manage"),
      canPinToCollections: user.applications && (0, _find["default"])(_context30 = user.applications).call(_context30, function (app) {
        return app.appId === "map-app";
      }) && (0, _find["default"])(_context31 = user.applications).call(_context31, function (app) {
        return app.appId === "map-app";
      }).permissions && (0, _includes["default"])(_context32 = (0, _find["default"])(_context33 = user.applications).call(_context33, function (app) {
        return app.appId === "map-app";
      }).permissions).call(_context32, "manage"),
      userId: userId,
      dir: dir
    })));
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", null);
  }
};
AccessPointProfile.propTypes = propTypes;
AccessPointProfile.defaultProps = defaultProps;
var _default = AccessPointProfile;
exports["default"] = _default;