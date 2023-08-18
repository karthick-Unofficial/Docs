"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _every = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/every"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("../../CBComponents");
var _FileWidget = _interopRequireDefault(require("../Widgets/File/FileWidget"));
var _EntityDelete = _interopRequireDefault(require("../EntityProfile/components/EntityDelete"));
var _EntityShare = _interopRequireDefault(require("../EntityProfile/components/EntityShare"));
var _ShapeAssociation = _interopRequireDefault(require("../EntityProfile/components/ShapeAssociation"));
var _CamerasWidget = _interopRequireDefault(require("../Widgets/Cameras/CamerasWidget"));
var _RobotCamerasWidget = _interopRequireDefault(require("../Widgets/RobotCameras/RobotCamerasWidget"));
var _MissionControlWidget = _interopRequireDefault(require("../Widgets/MissionControl/MissionControlWidget"));
var _LayoutControls = _interopRequireDefault(require("../Widgets/LayoutControls/LayoutControls"));
var _AlertWidget = _interopRequireDefault(require("../Widgets/Alert/AlertWidget"));
var _PinToDialog = _interopRequireDefault(require("../../SharedComponents/PinToDialog"));
var _SummaryWidget = _interopRequireDefault(require("../Widgets/Summary/SummaryWidget"));
var _ImageViewer = _interopRequireDefault(require("../../SharedComponents/ImageViewer"));
var _Activities = _interopRequireDefault(require("../Widgets/Activities/Activities"));
var _ErrorBoundary = _interopRequireDefault(require("../../ErrorBoundary"));
var _jquery = _interopRequireDefault(require("jquery"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _Selectors2 = require("orion-components/AppState/Selectors");
var _Selectors3 = require("orion-components/ContextPanel/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var _unionBy = _interopRequireDefault(require("lodash/unionBy"));
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _cameraProfileActions = require("orion-components/SharedActions/cameraProfileActions");
var _commonActions = require("orion-components/SharedActions/commonActions");
var _index = require("orion-components/Dock/Actions/index.js");
var _Actions = require("orion-components/Map/Tools/Actions");
var _Actions2 = require("orion-components/ContextPanel/Actions");
var _Actions3 = require("orion-components/AppState/Actions");
var _Actions4 = require("orion-components/ContextualData/Actions");
var _Actions5 = require("orion-components/GlobalData/Actions");
var _entityProfileActions = require("../../SharedActions/entityProfileActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context34, _context35; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context34 = ownKeys(Object(source), !0)).call(_context34, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context35 = ownKeys(Object(source))).call(_context35, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var DEFAULT_WIDGET_CONFIG = [];
var propTypes = {
  context: _propTypes["default"].object,
  contextId: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
  entityType: _propTypes["default"].string,
  forReplay: _propTypes["default"].bool,
  trackHistDuration: _propTypes["default"].number,
  widgetState: _propTypes["default"].array,
  feedDisplayProps: _propTypes["default"].array,
  notifications: _propTypes["default"].object,
  entityCollections: _propTypes["default"].array,
  sidebarOpen: _propTypes["default"].bool,
  dockedCameras: _propTypes["default"].array,
  dialog: _propTypes["default"].object,
  dialogData: _propTypes["default"].object,
  user: _propTypes["default"].object,
  activityFilters: _propTypes["default"].array,
  mapVisible: _propTypes["default"].bool,
  fullscreenCamera: _propTypes["default"].bool,
  appId: _propTypes["default"].string,
  widgetsLaunchable: _propTypes["default"].bool,
  profileIconTemplate: _propTypes["default"].string,
  timeFormatPreference: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool,
  endDate: _propTypes["default"].object,
  appData: _propTypes["default"].func,
  dir: _propTypes["default"].string
};
var RobotProfile = function RobotProfile(_ref) {
  var _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11, _context12, _context13, _context14, _context15, _context16, _context17, _context18, _context19, _context20, _context21, _context22, _context23, _context24, _context25, _context26, _context27, _context28, _context29, _context30, _context31, _context32, _context33;
  var forReplay = _ref.forReplay,
    appData = _ref.appData,
    widgetsLaunchable = _ref.widgetsLaunchable,
    readOnly = _ref.readOnly,
    endDate = _ref.endDate;
  var dispatch = (0, _reactRedux.useDispatch)();
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile;
  });
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors3.selectedContextSelector)(state);
  });
  var isLoaded = (0, _isObject["default"])(context) && context.entity;
  var dialog = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.dialog.openDialog;
  });
  var dialogData = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.dialog.dialogData;
  });
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return (0, _Selectors2.persistedState)(state);
    }),
    activityFilters = _useSelector.activityFilters;
  var mapStatus = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.mapState)(state);
  });
  var trackHistDuration = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.trackHistoryDuration)(state);
  });
  var entityType = isLoaded && context.entity.entityType;
  var feedID = isLoaded && context.entity.feedId;
  var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
      return isLoaded && (0, _Selectors.feedInfoSelector)(feedID)(state);
    }),
    displayProperties = _useSelector2.displayProperties,
    profileIconTemplate = _useSelector2.profileIconTemplate;
  var widgetState = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors2.widgetStateSelector)(state);
  });
  var feedDisplayProps = isLoaded ? displayProperties : null;
  var notifications = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded ? state.globalData.notifications : null;
  });
  var sidebarOpen = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded ? state.appState.dock.dockData.isOpen : null;
  });
  var dockedCameras = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded ? state.appState.dock.cameraDock.dockedCameras : null;
  });
  var contextId = isLoaded && context.entity.id;
  var mapVisible = isLoaded && mapStatus.visible;
  var fullscreenCamera = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors2.fullscreenCameraOpen)(state);
  });
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return state.appId;
  });
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    layoutControlsOpen = _useState4[0],
    setLayoutControlsOpen = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    scrolledUp = _useState6[0],
    setScrolledUp = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    hiding = _useState8[0],
    setHiding = _useState8[1];
  var _useState9 = (0, _react.useState)({}),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    cameraStates = _useState10[0],
    setCameraStates = _useState10[1];
  (0, _react.useEffect)(function () {
    if (contextId) {
      if (!forReplay) {
        dispatch((0, _Actions4.startActivityStream)(contextId, entityType, "profile"));
        dispatch((0, _Actions4.startAttachmentStream)(contextId, "profile"));
        dispatch((0, _Actions4.startCamerasInRangeStream)(contextId, entityType, "profile"));

        // ***** TODO: Do we want to include the Rules widget in this profile?
        // startRulesStream(contextId, "profile");
      }

      // -- initialize camera states
      var newCameraStates = _objectSpread({}, cameraStates);
      var _entity = context.entity;
      var robotCameras = _entity.entityData.properties.cameras || [];
      (0, _forEach["default"])(robotCameras).call(robotCameras, function (robotCamera) {
        newCameraStates[robotCamera.id] = "off";
      });
      setCameraStates(newCameraStates);
    }
    DEFAULT_WIDGET_CONFIG = [{
      enabled: true,
      id: "alerts",
      name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.alerts")
    }, {
      enabled: true,
      id: "activities",
      name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.activities")
    }, {
      enabled: true,
      id: "files",
      name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.files")
    }, {
      enabled: true,
      id: "cameras",
      name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.cameras")
    }, {
      enabled: true,
      id: "robotCameras",
      name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.robotCams")
    }, {
      enabled: true,
      id: "missionControl",
      name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.missionControl")
    }];
  }, []);
  var handleScroll = (0, _react.useCallback)(function () {
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
  }, [scrolledUp]);
  (0, _react.useEffect)(function () {
    handleScroll();
    return function () {
      (0, _jquery["default"])(".cb-profile-wrapper").off("resize scroll");
    };
  }, [handleScroll]);
  function toggleTrackHistory() {
    if (context.trackHistory) {
      dispatch((0, _Actions4.removeSubscriber)(contextId, "trackHistory", "map"));
      dispatch((0, _Actions4.unsubscribeFromFeed)(contextId, "trackHistory", "profile"));
    } else {
      dispatch((0, _Actions4.startTrackHistoryStream)(context.entity, "profile", trackHistDuration, forReplay));
    }
  }
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
  var handleShareClick = function handleShareClick(entity) {
    entity.isPublic ? dispatch((0, _entityProfileActions.unshareEntityToOrg)(entity.id)) : dispatch((0, _entityProfileActions.shareEntityToOrg)(entity.id));
    dispatch((0, _Actions3.closeDialog)("shareEntityDialog"));
  };
  var getWidgetConfig = function getWidgetConfig() {
    var widgetConfig = widgetState ? (0, _unionBy["default"])(widgetState, DEFAULT_WIDGET_CONFIG, "id") : DEFAULT_WIDGET_CONFIG;
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

  /**
   * Check association before opening a dialog, throwing an error or failed association dialog if entity is associated
   * @param {string} dialogId -- Id of dialog you'd like to open if association checks are passed
   * @param {string} associationAction -- "delete" or "unshare"
   */
  var openDialogWithAssociation = function openDialogWithAssociation(dialogId, associationAction) {
    _clientAppCore.associationService.checkAssociations(contextId, function (err, response) {
      if (err || response.error) {
        dispatch((0, _Actions3.openDialog)("entity-profile-error", (0, _i18n.getTranslation)("global.profiles.robotDogProfile.errorText")));
      } else if (response) {
        if (response.hasAssociations) {
          // Passing an action along so dialog knows what text to render
          dispatch((0, _Actions3.openDialog)("shape-association", _objectSpread(_objectSpread({}, response), {}, {
            action: associationAction
          })));
        } else {
          dispatch((0, _Actions3.openDialog)(dialogId));
        }
      }
    });
  };

  // ***** TODO: now that we updated how camera state is stored, we might be able to move this whole interaction (and camerasStates) to the RobotCamerasWidget component
  var toggleCameraState = function toggleCameraState(id, currentState) {
    var _context;
    var entity = context.entity;
    var camera = (0, _find["default"])(_context = entity.entityData.properties.cameras).call(_context, function (robotCamera) {
      return robotCamera.id === id;
    });
    if (camera) {
      var _context2;
      // -- grab next state in series
      var newStateIndex = (0, _indexOf["default"])(_context2 = camera.states).call(_context2, currentState) + 1;
      var newState = camera.states[newStateIndex < camera.states.length ? newStateIndex : 0];

      // -- update local camera state
      var newCameraStates = _objectSpread({}, cameraStates);
      if (newCameraStates[id]) {
        newCameraStates[id] = newState;
        setCameraStates(newCameraStates);
      }
    }
  };
  if (!context) {
    return /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var orgId = user.orgId;
  var userId = user.id;
  var attachments = context.attachments,
    rules = context.rules,
    camerasInRange = context.camerasInRange,
    activities = context.activities;
  var entity = context.entity;
  var entityData = entity.entityData,
    feedId = entity.feedId;
  var properties = entityData.properties,
    geometry = entityData.geometry;
  var name = properties.name,
    description = properties.description,
    type = properties.type,
    subtype = properties.subtype;
  var cameras = properties.cameras || [];
  // const rulesAppPermission = user.applications.filter(application => {
  // 	return application.appId === "rules-app" && application.config.canView;
  // })[0];
  var imageAttachments = attachments ? (0, _filter["default"])(attachments).call(attachments, function (attachment) {
    return /(jpg)|(png)|(jpeg)|(gif)|(svg)/.exec(attachment.mimeType);
  }) : [];

  // Height of summary-info (consistent between scrolled and not scrolled state) + padding
  var scrollOffset = scrolledUp ? 167 : 0;
  // Dynamic offset for widget container when SummaryWidget is collapsed
  var widgetsContainerStyle = {
    top: scrollOffset
  };
  var widgets = getWidgetConfig();
  var actions = [];
  actions = (0, _concat["default"])(_context3 = []).call(_context3, (0, _toConsumableArray2["default"])(actions), [{
    name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.trackHistory"),
    nameText: "Track History",
    // action: () => this.toggleTrackHistory(contextId)
    action: function action() {
      return toggleTrackHistory(contextId);
    }
  }, {
    name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.pinTo"),
    nameText: "Pin To",
    action: function action() {
      return dispatch((0, _Actions3.openDialog)("pinToDialog"));
    }
  }, {
    name: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.hide"),
    nameText: "Hide",
    action: function action() {
      if (context.trackHistory && (!rules || rules.length === 0)) {
        // If track history is on, toggle it off before removing
        // this.toggleTrackHistory(contextId);
        toggleTrackHistory(contextId);
      }
      if (!rules || rules.length === 0) {
        setHiding(true);
        dispatch((0, _Actions5.ignoreEntity)(contextId, entityType, feedId, appData));
      } else {
        openDialogWithAssociation("shapeHideDialog", "hide");
      }
    },
    debounce: hiding
  }]);
  var hasAccessToFeed = user.integrations && (0, _find["default"])(_context4 = user.integrations).call(_context4, function (_int) {
    return _int.intId === entity.feedId;
  }) && (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int2) {
    return _int2.intId === entity.feedId;
  }).config && (0, _find["default"])(_context6 = user.integrations).call(_context6, function (_int3) {
    return _int3.intId === entity.feedId;
  }).config.canView;
  var robotCamerasWidgetCameras = camerasInRange ? (0, _filter["default"])(camerasInRange).call(camerasInRange, function (camera) {
    return (0, _some["default"])(cameras).call(cameras, function (robotCamera) {
      return robotCamera.id === camera.id;
    });
  }) : [];
  var otherCameras = camerasInRange ? (0, _filter["default"])(camerasInRange).call(camerasInRange, function (camera) {
    return (0, _every["default"])(robotCamerasWidgetCameras).call(robotCamerasWidgetCameras, function (robotCamera) {
      return robotCamera.id !== camera.id;
    });
  }) : [];
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-profile-wrapper",
    style: {
      height: "100%",
      overflow: "scroll"
    }
  }, !scrolledUp && /*#__PURE__*/_react["default"].createElement(_ImageViewer["default"], {
    images: imageAttachments,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_SummaryWidget["default"], {
    id: contextId,
    user: user,
    context: context,
    name: name,
    type: subtype ? subtype : type,
    geometry: geometry,
    description: description,
    scrolledUp: scrolledUp,
    handleExpand: handleExpand,
    mapVisible: mapVisible,
    appId: appId,
    profileIconTemplate: profileIconTemplate,
    actions: actions,
    readOnly: readOnly,
    dir: dir
  })), !scrolledUp && /*#__PURE__*/_react["default"].createElement("div", {
    className: "layout-control-button"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "cb-font-link",
    onClick: handleEditLayout
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.robotDogProfile.editProfileLayout"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widgets-container",
    style: widgetsContainerStyle
  }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LayoutControls["default"], {
    key: "".concat(contextId, "-layout-controls"),
    open: layoutControlsOpen,
    anchor: anchorEl,
    close: handleCloseEditLayout,
    widgetOrder: widgets,
    profile: "entity"
  })), getWidgetStatus("cameras") && otherCameras && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_CamerasWidget["default"], {
    key: "".concat(contextId, "-cameras"),
    cameras: otherCameras,
    canLink: !readOnly && user.integrations && (0, _find["default"])(_context7 = user.integrations).call(_context7, function (_int4) {
      return _int4.intId === entity.feedId;
    }) && (0, _find["default"])(_context8 = user.integrations).call(_context8, function (_int5) {
      return _int5.intId === entity.feedId;
    }).permissions && (0, _includes["default"])(_context9 = (0, _find["default"])(_context10 = user.integrations).call(_context10, function (_int6) {
      return _int6.intId === entity.feedId;
    }).permissions).call(_context9, "manage"),
    entityType: entityType,
    geometry: geometry,
    order: getWidgetStatus("cameras").index,
    enabled: getWidgetStatus("cameras").enabled,
    loadProfile: _Actions2.loadProfile,
    sidebarOpen: sidebarOpen,
    entity: entity,
    linkEntities: _entityProfileActions.linkEntities,
    unlinkCameras: _entityProfileActions.unlinkEntities,
    dockedCameras: dockedCameras,
    addCameraToDockMode: _index.addCameraToDockMode,
    contextId: contextId,
    unsubscribeFromFeed: _Actions4.unsubscribeFromFeed,
    subscriberRef: "profile",
    dialog: dialog,
    openDialog: _Actions3.openDialog,
    closeDialog: _Actions3.closeDialog,
    setCameraPriority: _index.setCameraPriority,
    fullscreenCamera: fullscreenCamera,
    readOnly: readOnly,
    disableSlew: readOnly,
    widgetsLaunchable: !readOnly && widgetsLaunchable,
    user: user,
    removeDockedCamera: _index.removeDockedCameraAndState,
    dir: dir
  })), getWidgetStatus("missionControl") && feedDisplayProps && /*#__PURE__*/_react["default"].createElement(_MissionControlWidget["default"], {
    key: "".concat(contextId, "-mission-control"),
    order: getWidgetStatus("missionControl").index,
    enabled: getWidgetStatus("missionControl").enabled,
    details: properties,
    dir: dir
  }), getWidgetStatus("robotCameras") && robotCamerasWidgetCameras && robotCamerasWidgetCameras.length > 0 && /*#__PURE__*/_react["default"].createElement(_RobotCamerasWidget["default"], {
    key: "".concat(contextId, "-robot-cameras"),
    order: getWidgetStatus("robotCameras").index,
    enabled: getWidgetStatus("robotCameras").enabled,
    timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
    cameras: robotCamerasWidgetCameras
    // robotCameras={robotCameras}
    ,
    robotCameras: cameras,
    robotCameraStates: cameraStates,
    canLink: !readOnly && user.integrations && (0, _find["default"])(_context11 = user.integrations).call(_context11, function (_int7) {
      return _int7.intId === entity.feedId;
    }) && (0, _find["default"])(_context12 = user.integrations).call(_context12, function (_int8) {
      return _int8.intId === entity.feedId;
    }).permissions && (0, _includes["default"])(_context13 = (0, _find["default"])(_context14 = user.integrations).call(_context14, function (_int9) {
      return _int9.intId === entity.feedId;
    }).permissions).call(_context13, "manage"),
    entityType: entityType
    // geometry={geometry}
    ,
    loadProfile: _Actions2.loadProfile,
    sidebarOpen: sidebarOpen,
    entity: entity,
    linkEntities: _entityProfileActions.linkEntities,
    unlinkCameras: _entityProfileActions.unlinkEntities,
    dockedCameras: dockedCameras,
    addCameraToDockMode: _index.addCameraToDockMode,
    contextId: contextId,
    unsubscribeFromFeed: _Actions4.unsubscribeFromFeed,
    subscriberRef: "profile",
    dialog: dialog,
    openDialog: _Actions3.openDialog,
    closeDialog: _Actions3.closeDialog,
    setCameraPriority: _index.setCameraPriority,
    fullscreenCamera: fullscreenCamera,
    readOnly: readOnly,
    widgetsLaunchable: !readOnly && widgetsLaunchable,
    user: user,
    removeDockedCamera: _index.removeDockedCameraAndState,
    toggleCameraState: toggleCameraState,
    dir: dir
  }), getWidgetStatus("alerts") && notifications && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_AlertWidget["default"], {
    key: "".concat(contextId, "-alerts"),
    order: getWidgetStatus("alerts").index,
    enabled: getWidgetStatus("alerts").enabled,
    contextId: contextId,
    loadProfile: _Actions2.loadProfile,
    notifications: notifications,
    closeNotification: _index.closeNotification,
    dir: dir
  })), getWidgetStatus("activities") && (activities || forReplay) && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Activities["default"], {
    key: "".concat(contextId, "-activities"),
    entity: entity,
    order: getWidgetStatus("activities").index,
    enabled: getWidgetStatus("activities").enabled,
    pageSize: 5,
    activities: activities,
    canManage: user.integrations && (0, _find["default"])(_context15 = user.integrations).call(_context15, function (_int10) {
      return _int10.intId === entity.feedId;
    }) && (0, _find["default"])(_context16 = user.integrations).call(_context16, function (_int11) {
      return _int11.intId === entity.feedId;
    }).config && (0, _find["default"])(_context17 = user.integrations).call(_context17, function (_int12) {
      return _int12.intId === entity.feedId;
    }).config.canView,
    activityFilters: activityFilters,
    unsubscribeFromFeed: _Actions4.unsubscribeFromFeed,
    contextId: contextId,
    userId: userId,
    subscriberRef: "profile",
    openDialog: _Actions3.openDialog,
    closeDialog: _Actions3.closeDialog,
    dialog: dialog,
    readOnly: readOnly,
    forReplay: forReplay,
    endDate: endDate,
    timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
    dir: dir
  })), getWidgetStatus("files") && attachments && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_FileWidget["default"], {
    key: "".concat(contextId, "-files"),
    order: getWidgetStatus("files").index,
    enabled: getWidgetStatus("files").enabled,
    attachments: attachments,
    canDelete: !readOnly && (entityType !== "track" ? user && user.integrations && (0, _find["default"])(_context18 = user.integrations).call(_context18, function (_int13) {
      return _int13.intId === entity.feedId;
    }) && (0, _find["default"])(_context19 = user.integrations).call(_context19, function (_int14) {
      return _int14.intId === entity.feedId;
    }).permissions && (0, _includes["default"])(_context20 = (0, _find["default"])(_context21 = user.integrations).call(_context21, function (_int15) {
      return _int15.intId === entity.feedId;
    }).permissions).call(_context20, "manage") : user && user.applications && (0, _find["default"])(_context22 = user.applications).call(_context22, function (app) {
      return app.appId === "map-app";
    }) && (0, _find["default"])(_context23 = user.applications).call(_context23, function (app) {
      return app.appId === "map-app";
    }).permissions && (0, _includes["default"])(_context24 = (0, _find["default"])(_context25 = user.applications).call(_context25, function (app) {
      return app.appId === "map-app";
    }).permissions).call(_context24, "manage")),
    hasAccess: !readOnly && hasAccessToFeed,
    attachFiles: _entityProfileActions.attachFilesToEntity,
    entityType: entityType,
    contextId: contextId,
    dialog: dialog,
    unsubscribeFromFeed: _Actions4.unsubscribeFromFeed,
    openDialog: _Actions3.openDialog,
    closeDialog: _Actions3.closeDialog,
    subscriberRef: "profile",
    dir: dir
  })), /*#__PURE__*/_react["default"].createElement(_PinToDialog["default"], {
    open: dialog === "pinToDialog",
    close: function close() {
      return dispatch((0, _Actions3.closeDialog)("pinToDialog"));
    },
    entity: entity,
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
    addRemoveFromCollections: _cameraProfileActions.addRemoveFromCollections,
    addRemoveFromEvents: _cameraProfileActions.addRemoveFromEvents,
    createCollection: _commonActions.createCollection,
    dialog: dialog,
    openDialog: _Actions3.openDialog,
    closeDialog: _Actions3.closeDialog,
    userId: userId,
    dir: dir
  })), /*#__PURE__*/_react["default"].createElement(_EntityDelete["default"], {
    open: dialog === "shapeDeleteDialog",
    closeDialog: _Actions3.closeDialog,
    userId: userId,
    deleteShape: _Actions.deleteShape,
    id: contextId,
    name: name
  }), /*#__PURE__*/_react["default"].createElement(_EntityShare["default"], {
    handleClick: function handleClick() {
      return handleShareClick(entity, orgId);
    },
    open: dialog === "shareEntityDialog",
    handleClose: function handleClose() {
      return dispatch((0, _Actions3.closeDialog)("shareEntityDialog"));
    },
    shared: entity.isPublic
  }), /*#__PURE__*/_react["default"].createElement(_ShapeAssociation["default"], {
    open: dialog === "shape-association",
    closeDialog: _Actions3.closeDialog,
    dialogData: dialogData,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    key: "entity-profile-error",
    open: dialog === "entity-profile-error",
    confirm: {
      label: (0, _i18n.getTranslation)("global.profiles.robotDogProfile.ok"),
      action: function action() {
        dispatch((0, _Actions3.closeDialog)("entity-profile-error"));
      }
    },
    textContent: dialogData,
    dir: dir
  }));
};
RobotProfile.propTypes = propTypes;
var _default = RobotProfile;
exports["default"] = _default;