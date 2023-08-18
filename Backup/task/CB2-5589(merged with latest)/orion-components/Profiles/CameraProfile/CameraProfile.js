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
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _ErrorBoundary = _interopRequireDefault(require("../../ErrorBoundary"));
var _SummaryWidget = _interopRequireDefault(require("../Widgets/Summary/SummaryWidget"));
var _LayoutControls = _interopRequireDefault(require("../Widgets/LayoutControls/LayoutControls"));
var _FileWidget = _interopRequireDefault(require("../Widgets/File/FileWidget"));
var _Activities = _interopRequireDefault(require("../Widgets/Activities/Activities"));
var _MapWidget = _interopRequireDefault(require("../Widgets/Map/MapWidget"));
var _LinkedItemsWidget = _interopRequireDefault(require("../Widgets/LinkedItems/LinkedItemsWidget"));
var _LiveCameraWidget = _interopRequireDefault(require("../Widgets/LiveCamera/LiveCameraWidget"));
var _CameraDialog = _interopRequireDefault(require("./components/CameraDialog"));
var _PinToDialog = _interopRequireDefault(require("../../SharedComponents/PinToDialog"));
var _clientAppCore = require("client-app-core");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _jquery = _interopRequireDefault(require("jquery"));
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _Selectors2 = require("orion-components/ContextPanel/Selectors");
var _Selectors3 = require("orion-components/GlobalData/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _includes2 = _interopRequireDefault(require("lodash/includes"));
var _keys = _interopRequireDefault(require("lodash/keys"));
var _unionBy = _interopRequireDefault(require("lodash/unionBy"));
var _Actions = require("orion-components/AppState/Actions");
var _Actions2 = require("orion-components/ContextualData/Actions");
var _Actions3 = require("orion-components/ContextPanel/Actions");
var _index = require("orion-components/Dock/Actions/index.js");
var _Actions4 = require("orion-components/GlobalData/Actions");
var _cameraProfileActions = require("../../SharedActions/cameraProfileActions");
var _commonActions = require("../../SharedActions/commonActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  locale: _propTypes["default"].string,
  selectFloorPlanOn: _propTypes["default"].func
};
var defaultProps = {
  locale: "en",
  selectFloorPlanOn: function selectFloorPlanOn() {}
};
var DEFAULT_WIDGET_CONFIG = [];

// cSpell:ignore mapstate mapstatus
var CameraProfile = function CameraProfile(_ref) {
  var disableLinkedItems = _ref.disableLinkedItems,
    forReplay = _ref.forReplay,
    floorPlansWithFacFeed = _ref.floorPlansWithFacFeed,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    updateCamera = _ref.updateCamera,
    selectWidget = _ref.selectWidget,
    facilityOption = _ref.facilityOption,
    disabledLinkedItemTypes = _ref.disabledLinkedItemTypes,
    widgetsExpandable = _ref.widgetsExpandable,
    widgetsLaunchable = _ref.widgetsLaunchable,
    appData = _ref.appData,
    readOnly = _ref.readOnly,
    endDate = _ref.endDate,
    facilityFeedId = _ref.facilityFeedId,
    mapstatus = _ref.mapstatus;
  var dispatch = (0, _reactRedux.useDispatch)();
  var session = (0, _reactRedux.useSelector)(function (state) {
    return state.session;
  });
  var appState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState;
  });
  var userAppState = (0, _reactRedux.useSelector)(function (state) {
    return state.userAppState;
  });
  var mapstate = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState;
  });
  var mapStatus = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapState)(state);
  });
  var user = session.user.profile;
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.selectedContextSelector)(state);
  });
  var entity = context.entity;
  var isLoaded = (0, _isObject["default"])(context) && !!entity;
  var activityFilters = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.persistedState)(state).activityFilters;
  });
  var dialog = isLoaded && appState.dialog.openDialog;
  var view = isLoaded && userAppState ? userAppState.cameraView : null;
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.i18n.locale;
  });
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
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _selector.getDir)(state);
  });
  var camera = isLoaded && entity;
  var sidebarOpen = isLoaded && appState.dock.dockData.isOpen;
  var dockedCameras = isLoaded && appState.dock.cameraDock.dockedCameras;
  var mapVisible = mapstatus ? mapStatus.visible : isLoaded && mapstate.baseMap.visible;
  var fullscreenCamera = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.fullscreenCameraOpen)(state);
  });
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appId;
  });
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.global.timeFormat;
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  var activeFOV = isLoaded && (appId === "map-app" || appId === "events-app") ? (0, _includes2["default"])((0, _keys["default"])((0, _reactRedux.useSelector)(function (state) {
    return state.globalData.fovs.data;
  })), contextId) : undefined;
  var floorPlansWithFacilityFeed = (0, _reactRedux.useSelector)(function (state) {
    return floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null;
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    layoutControlsOpen = _useState2[0],
    setLayoutControlsOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    anchorEl = _useState4[0],
    setAnchorEl = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    scrolledUp = _useState6[0],
    setScrolledUp = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    hiding = _useState8[0],
    setHiding = _useState8[1];
  var _useState9 = (0, _react.useState)(true),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    facilityHidden = _useState10[0],
    setFacilityHidden = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    mounted = _useState12[0],
    setMounted = _useState12[1];
  if (!mounted) {
    DEFAULT_WIDGET_CONFIG = [{
      enabled: true,
      id: "linked_items",
      name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.linkedItems")
    }, {
      enabled: true,
      id: "activities",
      name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.activities")
    }, {
      enabled: true,
      id: "live_camera",
      name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.liveCam")
    }, {
      enabled: true,
      id: "files",
      name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.files")
    }, {
      enabled: true,
      id: "map",
      name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.map")
    }];
    setMounted(true);
  }
  (0, _react.useEffect)(function () {
    handleScroll();
  }, [scrolledUp]);
  (0, _react.useEffect)(function () {
    if (!forReplay) {
      if (!disableLinkedItems && getWidgetStatus("linked_items")) {
        dispatch((0, _Actions2.startCamerasLinkedItemsStream)(contextId, "profile"));
        if (context.entity.fov) {
          dispatch((0, _Actions2.startFOVItemStream)(contextId, "profile"));
        }
      }
      if (getWidgetStatus("activities")) dispatch((0, _Actions2.startActivityStream)(contextId, "camera", "profile"));
      if (getWidgetStatus("files")) dispatch((0, _Actions2.startAttachmentStream)(contextId, "profile"));
      if (getWidgetStatus("live_camera")) dispatch((0, _Actions2.startLiveCameraStream)(contextId, "camera", "profile"));
      if (camera && camera.entityData.displayTargetId && camera.entityData.displayType && camera.entityData.displayType.toLowerCase() === "facility") {
        _clientAppCore.facilityService.getFloorPlan(camera.entityData.displayTargetId, function (err, res) {
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
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevContext = usePrevious(context);
  (0, _react.useEffect)(function () {
    if (!forReplay && context && !disableLinkedItems && prevContext && !prevContext.entity.fov && context.entity.fov && getWidgetStatus("linked_items")) {
      dispatch((0, _Actions2.startFOVItemStream)(contextId, "profile"));
    }
  }, [context]);
  var handleEditLayout = function handleEditLayout(event) {
    event.preventDefault();
    setLayoutControlsOpen(true);
    setAnchorEl(event.currentTarget);
  };
  var handleCloseEditLayout = function handleCloseEditLayout() {
    setLayoutControlsOpen(false);
  };
  var handleExpand = function handleExpand() {
    setScrolledUp(false);
    (0, _jquery["default"])(".cb-profile-wrapper").scrollTop(0);
  };
  var getWidgetConfig = function getWidgetConfig() {
    var defaultTypes = ["linked_items", "activities", "live_camera", "files"];
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
  var getWidgetStatus = function getWidgetStatus(widgetId) {
    var widgetConfig = getWidgetConfig();
    var widget = (0, _find["default"])(widgetConfig).call(widgetConfig, function (widget, index) {
      widget.index = index;
      return widget.id === widgetId;
    });
    return widget;
  };
  var showFloorPlanOnTargetClick = function showFloorPlanOnTargetClick() {
    var entityData = camera.entityData;
    if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
      var floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
      if (floorPlanData.id === entityData.displayTargetId) {
        dispatch(selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId));
      }
    }
  };
  if (context) {
    var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context11, _context12, _context13, _context14, _context15, _context16, _context17, _context18, _context19, _context20, _context21, _context22, _context23, _context24, _context25, _context26, _context27, _context28, _context29, _context30;
    var attachments = context.attachments,
      activities = context.activities;
    var userId = user.id;
    var entityType = camera.entityType,
      entityData = camera.entityData,
      feedId = camera.feedId;
    camera.activeFOV = activeFOV;
    var properties = entityData.properties,
      geometry = entityData.geometry;
    var name = properties.name,
      description = properties.description,
      type = properties.type,
      subtype = properties.subtype;
    var canManageCamera = !readOnly && user.integrations && (0, _find["default"])(_context = user.integrations).call(_context, function (_int) {
      return _int.intId === camera.feedId;
    }) && (0, _find["default"])(_context2 = user.integrations).call(_context2, function (_int2) {
      return _int2.intId === camera.feedId;
    }).permissions && (0, _includes["default"])(_context3 = (0, _find["default"])(_context4 = user.integrations).call(_context4, function (_int3) {
      return _int3.intId === camera.feedId;
    }).permissions).call(_context3, "manage");
    var canControlCamera = !readOnly && user.integrations && (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int4) {
      return _int4.intId === camera.feedId;
    }) && (0, _find["default"])(_context6 = user.integrations).call(_context6, function (_int5) {
      return _int5.intId === camera.feedId;
    }).permissions && (0, _includes["default"])(_context7 = (0, _find["default"])(_context8 = user.integrations).call(_context8, function (_int6) {
      return _int6.intId === camera.feedId;
    }).permissions).call(_context7, "control");
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
        name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.facility"),
        nameText: "Facility",
        action: function action() {
          return window.location.replace("/facilities-app/#/?".concat(entityData.displayTargetId));
        }
      });
    }
    actions = (0, _concat["default"])(_context9 = []).call(_context9, (0, _toConsumableArray2["default"])(actions), [{
      name: activeFOV ? (0, _i18n.getTranslation)("global.profiles.cameraProfile.hideFOV") : (0, _i18n.getTranslation)("global.profiles.cameraProfile.showFOV"),
      nameText: activeFOV ? "Hide FOV" : "Show FOV",
      action: activeFOV ? function () {
        return dispatch((0, _cameraProfileActions.hideFOV)(camera.id));
      } : function () {
        return dispatch((0, _cameraProfileActions.showFOV)(camera.id));
      }
    }, {
      name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.pinTo"),
      nameText: "Pin To",
      action: function action() {
        return dispatch((0, _Actions.openDialog)("pinToDialog"));
      }
    }]);
    // can we edit a camera?
    if (canManageCamera) {
      var _context10;
      actions = (0, _concat["default"])(_context10 = []).call(_context10, (0, _toConsumableArray2["default"])(actions), [{
        name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.edit"),
        nameText: "Edit",
        action: function action() {
          return dispatch((0, _Actions.openDialog)("cameraEditDialog"));
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
      type: subtype ? subtype : type,
      geometry: entityData.displayTargetId ? true : geometry,
      description: description,
      scrolledUp: scrolledUp,
      handleExpand: handleExpand,
      mapVisible: mapVisible,
      appId: appId,
      selectFloor: showFloorPlanOnTargetClick,
      actions: (0, _concat["default"])(_context11 = []).call(_context11, (0, _toConsumableArray2["default"])(actions), [{
        name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.hide"),
        nameText: "Hide",
        action: function action() {
          setHiding(true);
          dispatch((0, _Actions4.ignoreEntity)(contextId, entityType, feedId, appData));
        },
        debounce: hiding
      }]),
      dir: dir
    })), !scrolledUp && /*#__PURE__*/_react["default"].createElement("div", {
      className: "layout-control-button"
    }, /*#__PURE__*/_react["default"].createElement("a", {
      className: "cb-font-link",
      onClick: handleEditLayout
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.cameraProfile.editProfileLayout"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "widgets-container",
      style: widgetsContainerStyle
    }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LayoutControls["default"], {
      open: layoutControlsOpen,
      anchor: anchorEl,
      close: handleCloseEditLayout,
      widgetOrder: widgets,
      profile: "camera"
    })), (0, _jquery["default"])(window).width() > 1023 && getWidgetStatus("map") && /*#__PURE__*/_react["default"].createElement(_MapWidget["default"], {
      order: getWidgetStatus("map").index,
      enabled: getWidgetStatus("map").enabled,
      selectWidget: selectWidget,
      title: (0, _i18n.getTranslation)("global.profiles.cameraProfile.mapLocationFOV"),
      expanded: mapVisible,
      dir: dir
    }), getWidgetStatus("files") && context.attachments && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_FileWidget["default"], {
      key: "".concat(contextId, "-files"),
      order: getWidgetStatus("files").index,
      enabled: getWidgetStatus("files").enabled,
      canDelete: !readOnly && user && user.integrations && (0, _find["default"])(_context12 = user.integrations).call(_context12, function (_int7) {
        return _int7.intId === camera.feedId;
      }) && (0, _find["default"])(_context13 = user.integrations).call(_context13, function (_int8) {
        return _int8.intId === camera.feedId;
      }).permissions && (0, _includes["default"])(_context14 = (0, _find["default"])(_context15 = user.integrations).call(_context15, function (_int9) {
        return _int9.intId === camera.feedId;
      }).permissions).call(_context14, "manage"),
      hasAccess: !readOnly && user && user.integrations && (0, _find["default"])(_context16 = user.integrations).call(_context16, function (_int10) {
        return _int10.intId === camera.feedId;
      }) && (0, _find["default"])(_context17 = user.integrations).call(_context17, function (_int11) {
        return _int11.intId === camera.feedId;
      }).config && (0, _find["default"])(_context18 = user.integrations).call(_context18, function (_int12) {
        return _int12.intId === camera.feedId;
      }).config.canView,
      attachments: attachments,
      selected: view === "Files",
      selectWidget: selectWidget,
      attachFiles: _cameraProfileActions.attachFilesToCamera,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable,
      entityType: entityType,
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
      entity: camera,
      canManage: user.integrations && (0, _find["default"])(_context19 = user.integrations).call(_context19, function (_int13) {
        return _int13.intId === camera.feedId;
      }) && (0, _find["default"])(_context20 = user.integrations).call(_context20, function (_int14) {
        return _int14.intId === camera.feedId;
      }).config && (0, _find["default"])(_context21 = user.integrations).call(_context21, function (_int15) {
        return _int15.intId === camera.feedId;
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
      entityType: entityType,
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
      dir: dir
    })), !disableLinkedItems && getWidgetStatus("linked_items") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LinkedItemsWidget["default"], {
      order: getWidgetStatus("linked_items").index,
      enabled: getWidgetStatus("linked_items").enabled,
      dialog: dialog,
      openDialog: _Actions.openDialog,
      linkEntities: _cameraProfileActions.linkEntities,
      unlinkEntities: _cameraProfileActions.unlinkEntities,
      entity: camera,
      closeDialog: _Actions.closeDialog,
      selected: view === "Linked Items",
      expanded: false // for styling differences between profile and expanded widget views
      ,
      items: (0, _concat["default"])(_context22 = []).call(_context22, (0, _toConsumableArray2["default"])(context.fovItems || []), (0, _toConsumableArray2["default"])(context.linkedEntities || [])),
      canLink: canManageCamera,
      events: context.fovEvents || [],
      disabledTypes: disabledLinkedItemTypes,
      selectWidget: selectWidget,
      feeds: feeds,
      view: view,
      loadProfile: _Actions3.loadProfile,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable,
      contextId: contextId,
      entityType: entityType,
      subscriberRef: "profile",
      unsubscribeFromFeed: _Actions2.unsubscribeFromFeed,
      isPrimary: isPrimary,
      autoFocus: true,
      dir: dir,
      selectFloor: selectFloorPlanOn,
      facilityFeedId: facilityFeedId
    })), getWidgetStatus("live_camera") && context.liveCamera && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LiveCameraWidget["default"], {
      key: "camera-profile-view",
      order: getWidgetStatus("live_camera").index,
      enabled: getWidgetStatus("live_camera").enabled,
      selected: view === "Live Camera",
      expanded: false // for styling differences between profile and expanded widget views
      ,
      canControl: canControlCamera,
      selectWidget: selectWidget,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable,
      contextId: contextId,
      entityType: entityType,
      camera: camera,
      sidebarOpen: sidebarOpen,
      dockedCameras: dockedCameras,
      subscriberRef: "profile",
      unsubscribeFromFeed: _Actions2.unsubscribeFromFeed,
      addCameraToDockMode: _index.addCameraToDockMode,
      dialog: dialog,
      fullscreenCamera: fullscreenCamera,
      readOnly: readOnly,
      user: user,
      removeDockedCamera: _index.removeDockedCameraAndState,
      dir: dir
    })), /*#__PURE__*/_react["default"].createElement(_CameraDialog["default"], {
      open: dialog === "cameraEditDialog",
      camera: camera,
      close: function close() {
        return dispatch((0, _Actions.closeDialog)("cameraEditDialog"));
      },
      update: updateCamera,
      dir: dir
    }), /*#__PURE__*/_react["default"].createElement(_PinToDialog["default"], {
      open: dialog === "pinToDialog",
      close: function close() {
        return dispatch((0, _Actions.closeDialog)("pinToDialog"));
      },
      entity: camera,
      addRemoveFromCollections: _cameraProfileActions.addRemoveFromCollections,
      addRemoveFromEvents: _cameraProfileActions.addRemoveFromEvents,
      createCollection: _commonActions.createCollection,
      dialog: dialog,
      openDialog: _Actions.openDialog,
      closeDialog: _Actions.closeDialog,
      canManageEvents: user.applications && (0, _find["default"])(_context23 = user.applications).call(_context23, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context24 = user.applications).call(_context24, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context25 = (0, _find["default"])(_context26 = user.applications).call(_context26, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context25, "manage"),
      canPinToCollections: user.applications && (0, _find["default"])(_context27 = user.applications).call(_context27, function (app) {
        return app.appId === "map-app";
      }) && (0, _find["default"])(_context28 = user.applications).call(_context28, function (app) {
        return app.appId === "map-app";
      }).permissions && (0, _includes["default"])(_context29 = (0, _find["default"])(_context30 = user.applications).call(_context30, function (app) {
        return app.appId === "map-app";
      }).permissions).call(_context29, "manage"),
      userId: userId,
      dir: dir
    })));
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", null);
  }
};
CameraProfile.propTypes = propTypes;
CameraProfile.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(CameraProfile, function (prevProps, nextProps) {
  if (!(0, _reactFastCompare["default"])(prevProps, nextProps)) {
    return false;
  }
});
exports["default"] = _default;