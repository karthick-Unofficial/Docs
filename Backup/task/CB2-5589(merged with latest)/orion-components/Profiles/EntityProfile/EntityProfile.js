"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Apm = require("../../Apm");
var _clientAppCore = require("client-app-core");
var _CBComponents = require("../../CBComponents");
var _FileWidget = _interopRequireDefault(require("../Widgets/File/FileWidget"));
var _RulesWidget = _interopRequireDefault(require("../Widgets/Rules/RulesWidget"));
var _EntityDelete = _interopRequireDefault(require("./components/EntityDelete"));
var _EntityShare = _interopRequireDefault(require("./components/EntityShare"));
var _ShapeAssociation = _interopRequireDefault(require("./components/ShapeAssociation"));
var _CamerasWidget = _interopRequireDefault(require("../Widgets/Cameras/CamerasWidget"));
var _DetailsWidget = _interopRequireDefault(require("../Widgets/Details/DetailsWidget"));
var _LayoutControls = _interopRequireDefault(require("../Widgets/LayoutControls/LayoutControls"));
var _AlertWidget = _interopRequireDefault(require("../Widgets/Alert/AlertWidget"));
var _PinToDialog = _interopRequireDefault(require("../../SharedComponents/PinToDialog"));
var _SummaryWidget = _interopRequireDefault(require("../Widgets/Summary/SummaryWidget"));
var _ImageViewer = _interopRequireDefault(require("../../SharedComponents/ImageViewer"));
var _MarineTrafficParticularsWidget = _interopRequireDefault(require("../Widgets/MarineTrafficParticulars/MarineTrafficParticularsWidget"));
var _Activities = _interopRequireDefault(require("../Widgets/Activities/Activities"));
var _DroneAssociation = _interopRequireDefault(require("../Widgets/DroneAssociation/DroneAssociation"));
var _ErrorBoundary = _interopRequireDefault(require("../../ErrorBoundary"));
var _jquery = _interopRequireDefault(require("jquery"));
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _Selectors2 = require("orion-components/AppState/Selectors");
var _Selectors3 = require("orion-components/ContextPanel/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _unionBy = _interopRequireDefault(require("lodash/unionBy"));
var _Actions = require("orion-components/ContextualData/Actions");
var _index = require("orion-components/Dock/Actions/index.js");
var _Actions2 = require("orion-components/AppState/Actions");
var _Actions3 = require("orion-components/GlobalData/Actions");
var _Actions4 = require("orion-components/Map/Tools/Actions");
var _Actions5 = require("orion-components/ContextPanel/Actions");
var _entityProfileActions = require("../../SharedActions/entityProfileActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context45, _context46; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context45 = ownKeys(Object(source), !0)).call(_context45, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context46 = ownKeys(Object(source))).call(_context46, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
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
var EntityProfile = function EntityProfile(_ref) {
  var forReplay = _ref.forReplay,
    appData = _ref.appData,
    widgetsLaunchable = _ref.widgetsLaunchable,
    readOnly = _ref.readOnly,
    endDate = _ref.endDate,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    floorPlansWithFacFeed = _ref.floorPlansWithFacFeed,
    mapstatus = _ref.mapstatus;
  var dispatch = (0, _reactRedux.useDispatch)();
  var session = (0, _reactRedux.useSelector)(function (state) {
    return state.session;
  });
  var appState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState;
  });
  var globalData = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData || {};
  });
  var mapstate = (0, _reactRedux.useSelector)(function (state) {
    return state.mapState;
  });
  var mapStatus = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.mapState)(state);
  });
  var user = session.user.profile;
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors3.selectedContextSelector)(state);
  });
  var entity = context.entity;
  var isLoaded = (0, _isObject["default"])(context) && entity;
  var dialog = isLoaded && appState.dialog.openDialog;
  var dialogData = isLoaded && appState.dialog.dialogData;
  var activityFilters = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors2.persistedState)(state).activityFilters;
  });
  var trackHistDuration = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors2.trackHistoryDuration)(state);
  });
  var entityType = isLoaded && entity.entityType;
  var feedId = isLoaded && entity.feedId;
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return isLoaded && (0, _Selectors.feedInfoSelector)(feedId)(state);
    }),
    displayProperties = _useSelector.displayProperties;
  var profileIconTemplate = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.feedInfoSelector)(feedId)(state).profileIconTemplate;
  });
  var marineTrafficVisible = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.feedInfoSelector)(feedId)(state).marineTrafficVisible;
  });
  var widgetState = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors2.widgetStateSelector)(state);
  });
  var entityCollections = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors.collectionsSelector)(state);
  });
  var feedDisplayProps = isLoaded && displayProperties;
  var notifications = isLoaded && globalData.notifications;
  var sidebarOpen = isLoaded && appState.dock.dockData.isOpen;
  var dockedCameras = isLoaded && appState.dock.cameraDock.dockedCameras;
  var contextId = isLoaded && entity.id;
  var mapVisible = mapstatus ? mapStatus.visible : isLoaded && mapstate.baseMap.visible;
  var fullscreenCamera = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors2.fullscreenCameraOpen)(state);
  });
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appId;
  });
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.appState.global.timeFormat;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _selector.getDir)(state);
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var floorPlansWithFacilityFeed = (0, _reactRedux.useSelector)(function (state) {
    return floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null;
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    layoutControlsOpen = _useState2[0],
    setLayoutControlsOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    scrolledUp = _useState4[0],
    setScrolledUp = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    hiding = _useState6[0],
    setHiding = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    zetronPhoneVisible = _useState8[0],
    setZetronPhoneVisible = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    anchorEl = _useState10[0],
    setAnchorEL = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    mounted = _useState12[0],
    setMounted = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    marineTrafficVesselData = _useState14[0],
    setMarineTrafficVesselData = _useState14[1];
  var _useState15 = (0, _react.useState)([]),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    widgets = _useState16[0],
    setWidgets = _useState16[1];
  if (!mounted) {
    DEFAULT_WIDGET_CONFIG = [{
      enabled: true,
      id: "alerts",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.alerts")
    }, {
      enabled: true,
      id: "activities",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.activities")
    }, {
      enabled: true,
      id: "files",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.files")
    }, {
      enabled: true,
      id: "details",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.details")
    }, {
      enabled: true,
      id: "rules",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.rules")
    }, {
      enabled: true,
      id: "cameras",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.cameras")
    }, {
      enabled: false,
      id: "marineTrafficParticulars",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.marineTraffic")
    }, {
      enabled: true,
      id: "drone-association",
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.droneAssociation")
    }];
    setMounted(true);
  }
  (0, _react.useEffect)(function () {
    if (marineTrafficVisible) {
      var _context, _context2;
      _clientAppCore.integrationService.getExternalSystemLookup("marine-traffic", entity.entityType, function (err, response) {
        if (err) console.log("ERROR", err);
        if (!response) return;
        var data = response.data;
        // if error returned will be undefined
        setMarineTrafficVesselData(data);
      }, (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "sourceId=".concat(entity.sourceId, "&targetId=")).call(_context2, entity.id, "&targetType=")).call(_context, entity.entityType));
    } else {
      setWidgets(getWidgetConfig());
    }
    var serviceCallBackExternalSystem = function serviceCallBackExternalSystem(err, response) {
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
    if (contextId) {
      if (!forReplay) {
        dispatch((0, _Actions.startActivityStream)(contextId, entityType, "profile"));
        dispatch((0, _Actions.startAttachmentStream)(contextId, "profile"));
        dispatch((0, _Actions.startCamerasInRangeStream)(contextId, entityType, "profile"));
        dispatch((0, _Actions.startRulesStream)(contextId, "profile"));
        var _context$entity = context.entity,
          entityData = _context$entity.entityData,
          _feedId = _context$entity.feedId;
        if (entityType === "track" && _feedId === "zetron" && entityData && entityData.properties && entityData.properties.subtype && entityData.properties.subtype.toLowerCase() === "zetron") {
          /* Note:
          	Suppose to get externalSystems [] from redux state (e.g. state.session.organization.externalSystems)
          	but different apps profileContainer needs to be modified in order to pass it as props.
          	therefore here fetching directly to avoid modifying multiple apps profile container.
          */

          _clientAppCore.integrationService.getExternalSystem("zetron", function (errExt, responseExt) {
            if (errExt) {
              console.log("An error has occurred to check external system is available to user.");
            } else {
              if (responseExt && responseExt.externalSystemId) {
                _clientAppCore.integrationService.getExternalSystemLookup("zetron", "serviceAvailableToUser", serviceCallBackExternalSystem);
              }
            }
          });
        }
      } else {
        // do we need to do something else here, or leave it up to the widgets to pull in the static data
      }
    }
    setMounted(true);
  }, []);
  (0, _react.useEffect)(function () {
    setWidgets(getWidgetConfig());
  }, [marineTrafficVesselData]);
  (0, _react.useEffect)(function () {
    handleScroll();
  }, [scrolledUp]);
  var handleInitiateRadioCall = function handleInitiateRadioCall(radioUnitId) {
    var dataToPost = {
      radioUnitId: radioUnitId
    };
    if (radioUnitId) {
      //post example: https://192.168.66.134/integration-app/api/externalSystem/zetron/resource/callRadio
      _clientAppCore.restClient.exec_post("/integration-app/api/externalSystem/zetron/resource/callRadio", dataToPost, function (err, response) {
        //Note : At present we just fire and forget and incase of error display standard error message in console.
        if (err) {
          console.log("An error has occurred sending command to zetron interface.", err, response);
        }
      });
    }
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
  var toggleTrackHistory = function toggleTrackHistory() {
    if (context.trackHistory) {
      (0, _Apm.captureUserInteraction)("EntityProfile Track History On");
      dispatch((0, _Actions.removeSubscriber)(contextId, "trackHistory", "map"));
      dispatch((0, _Actions.unsubscribeFromFeed)(contextId, "trackHistory", "profile", forReplay));
    } else {
      dispatch((0, _Actions.startTrackHistoryStream)(context.entity, "profile", trackHistDuration, forReplay));
    }
  };

  //this function is not called anywhere
  //const handleCloseEntityProfile = () => {
  //	hideInfo();
  //	updateViewingHistory([]);
  //};

  var handleEditLayout = function handleEditLayout(event) {
    event.preventDefault();
    setLayoutControlsOpen(true);
    setAnchorEL(event.currentTarget);
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
    dispatch((0, _Actions2.closeDialog)("shareEntityDialog"));
  };
  var getCustomWidgetConfig = function getCustomWidgetConfig(widgetName) {
    var hasOwn = function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };
    var integrations = user.integrations;
    var customWidgetsArr = [];
    (0, _filter["default"])(integrations).call(integrations, function (customWidget) {
      if (feedId === customWidget.feedId && hasOwn(customWidget, "widgets")) {
        var _widgets = customWidget.widgets;
        (0, _map["default"])(_widgets).call(_widgets, function (widget) {
          if (widget.id === widgetName) {
            customWidgetsArr.push(widget.id);
          }
        });
      }
    });
    return customWidgetsArr;
  };
  var getWidgetConfig = function getWidgetConfig() {
    var entityType = context.entity.entityType;
    var checkDroneWidget = getCustomWidgetConfig("drone-association");
    var widgetConfig = widgetState ? (0, _unionBy["default"])(widgetState, DEFAULT_WIDGET_CONFIG, "id") : DEFAULT_WIDGET_CONFIG;

    // -- remove details from shapes
    widgetConfig = entityType === "shapes" ? (0, _filter["default"])(widgetConfig).call(widgetConfig, function (widget) {
      return widget.id !== "details";
    }) : widgetConfig;

    // -- remove marine traffic from irrelevant feeds
    widgetConfig = !marineTrafficVesselData || !marineTrafficVisible ? (0, _filter["default"])(widgetConfig).call(widgetConfig, function (widget) {
      return widget.id !== "marineTrafficParticulars";
    }) : widgetConfig;

    // remove drone-association widget from irrelevant feeds
    widgetConfig = checkDroneWidget.length === 0 ? (0, _filter["default"])(widgetConfig).call(widgetConfig, function (widget) {
      return widget.id !== "drone-association";
    }) : widgetConfig;
    return widgetConfig;
  };
  var getWidgetStatus = function getWidgetStatus(widgetId) {
    var widgetConfig = getWidgetConfig(widgetId);
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
        dispatch((0, _Actions2.openDialog)("entity-profile-error", (0, _i18n.getTranslation)("global.profiles.entityProfile.main.problemOccurred")));
      } else if (response) {
        if (response.hasAssociations) {
          // Passing an action along so dialog knows what text to render
          dispatch((0, _Actions2.openDialog)("shape-association", _objectSpread(_objectSpread({}, response), {}, {
            action: associationAction
          })));
        } else {
          dispatch((0, _Actions2.openDialog)(dialogId));
        }
      }
    });
  };
  if (context) {
    var _context3, _context5, _context6, _context7, _context8, _context9, _context11, _context12, _context13, _context14, _context15, _context16, _context17, _context18, _context19, _context20, _context21, _context22, _context23, _context24, _context25, _context26, _context27, _context28, _context29, _context30, _context31, _context32, _context33, _context34, _context35, _context36, _context37, _context38, _context39, _context40, _context41, _context42, _context43, _context44;
    var orgId = user.orgId;
    var userId = user.id;
    var attachments = context.attachments,
      rules = context.rules,
      camerasInRange = context.camerasInRange,
      activities = context.activities;
    var _entity = context.entity;
    var _entityType = _entity.entityType,
      entityData = _entity.entityData,
      _feedId2 = _entity.feedId;
    var properties = entityData.properties,
      geometry = entityData.geometry;
    var name = properties.name,
      description = properties.description,
      type = properties.type,
      subtype = properties.subtype;
    var rulesAppPermission = (0, _filter["default"])(_context3 = user.applications).call(_context3, function (application) {
      return application.appId === "rules-app" && application.config.canView;
    })[0];
    var imageAttachments = attachments ? (0, _filter["default"])(attachments).call(attachments, function (attachment) {
      return /(jpg)|(png)|(jpeg)|(gif)|(svg)/.exec(attachment.mimeType);
    }) : [];

    // Height of summary-info (consistent between scrolled and not scrolled state) + padding
    var scrollOffset = scrolledUp ? 167 : 0;
    // Dynamic offset for widget container when SummaryWidget is collapsed
    var widgetsContainerStyle = {
      top: scrollOffset
    };
    var isMarker = context && _entityType === "shapes" && type === "Point";
    var actions = [];
    if (zetronPhoneVisible) {
      var _context4;
      actions = (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(actions), [{
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.tetraRadioCall"),
        nameText: "Zetron Call",
        action: function action() {
          return handleInitiateRadioCall(properties.radioUnitId);
        }
      }]);
    }
    actions = (0, _concat["default"])(_context5 = []).call(_context5, (0, _toConsumableArray2["default"])(actions), [{
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.trackHistory"),
      nameText: "Track History",
      action: function action() {
        return toggleTrackHistory(contextId);
      }
    }, {
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.pinTo"),
      nameText: "Pin To",
      action: function action() {
        return dispatch((0, _Actions2.openDialog)("pinToDialog"));
      }
    }]);
    if (user.integrations && (0, _find["default"])(_context6 = user.integrations).call(_context6, function (_int) {
      return _int.intId === _entity.feedId;
    }) && (0, _find["default"])(_context7 = user.integrations).call(_context7, function (_int2) {
      return _int2.intId === _entity.feedId;
    }).permissions && (0, _includes["default"])(_context8 = (0, _find["default"])(_context9 = user.integrations).call(_context9, function (_int3) {
      return _int3.intId === _entity.feedId;
    }).permissions).call(_context8, "manage")) {
      var _context10;
      actions = (0, _concat["default"])(_context10 = []).call(_context10, (0, _toConsumableArray2["default"])(actions), [{
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.edit"),
        nameText: "Edit",
        action: function action() {
          return dispatch((0, _Actions4.setMapTools)({
            type: "drawing",
            mode: geometry.type === "Point" ? "simple_select" : "direct_select",
            feature: _objectSpread({
              id: contextId
            }, _entity.entityData)
          }));
        }
      }, {
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.delete"),
        nameText: "Delete",
        action: function action() {
          return openDialogWithAssociation("shapeDeleteDialog", "delete");
        }
      }]);
    }
    actions = (0, _concat["default"])(_context11 = []).call(_context11, (0, _toConsumableArray2["default"])(actions), [{
      name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.hide"),
      nameText: "Hide",
      action: function action() {
        if (context.trackHistory && rules.length === 0) {
          // If track history is on, toggle it off before removing
          toggleTrackHistory(contextId);
        }
        if (rules.length === 0) {
          setHiding(true);
          dispatch((0, _Actions3.ignoreEntity)(contextId, _entityType, _feedId2, appData));
        } else {
          openDialogWithAssociation("shapeHideDialog", "hide");
        }
      },
      debounce: hiding
    }]);
    var hasAccessToFeed = user.integrations && (0, _find["default"])(_context12 = user.integrations).call(_context12, function (_int4) {
      return _int4.intId === _entity.feedId;
    }) && (0, _find["default"])(_context13 = user.integrations).call(_context13, function (_int5) {
      return _int5.intId === _entity.feedId;
    }).config && (0, _find["default"])(_context14 = user.integrations).call(_context14, function (_int6) {
      return _int6.intId === _entity.feedId;
    }).config.canView;
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
      user: zetronPhoneVisible ? _objectSpread(_objectSpread({}, user), {}, {
        zetronSystemAvailable: true
      }) : user,
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
      value: "global.profiles.entityProfile.main.editLayout"
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
    })), getWidgetStatus("details") && feedDisplayProps && /*#__PURE__*/_react["default"].createElement(_DetailsWidget["default"], {
      key: "".concat(contextId, "-details"),
      order: getWidgetStatus("details").index,
      enabled: getWidgetStatus("details").enabled,
      details: properties,
      displayProps: feedDisplayProps,
      timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
      dir: dir
    }), marineTrafficVesselData && getWidgetStatus("marineTrafficParticulars") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_MarineTrafficParticularsWidget["default"], {
      entity: _entity,
      data: marineTrafficVesselData,
      order: getWidgetStatus("marineTrafficParticulars").index,
      enabled: getWidgetStatus("marineTrafficParticulars").enabled,
      dir: dir
    })), getWidgetStatus("cameras") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_CamerasWidget["default"], {
      key: "".concat(contextId, "-cameras"),
      cameras: camerasInRange,
      canLink: !readOnly && user.integrations && (0, _find["default"])(_context15 = user.integrations).call(_context15, function (_int7) {
        return _int7.intId === _entity.feedId;
      }) && (0, _find["default"])(_context16 = user.integrations).call(_context16, function (_int8) {
        return _int8.intId === _entity.feedId;
      }).permissions && (0, _includes["default"])(_context17 = (0, _find["default"])(_context18 = user.integrations).call(_context18, function (_int9) {
        return _int9.intId === _entity.feedId;
      }).permissions).call(_context17, "manage"),
      entityType: _entityType,
      geometry: geometry,
      selectFloorPlanOn: selectFloorPlanOn,
      floorPlansWithFacilityFeed: floorPlansWithFacilityFeed,
      order: getWidgetStatus("cameras").index,
      enabled: getWidgetStatus("cameras").enabled,
      loadProfile: _Actions5.loadProfile,
      sidebarOpen: sidebarOpen,
      entity: _entity,
      linkEntities: _entityProfileActions.linkEntities,
      unlinkCameras: _entityProfileActions.unlinkEntities,
      dockedCameras: dockedCameras,
      addCameraToDockMode: _index.addCameraToDockMode,
      contextId: contextId,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      setCameraPriority: _index.setCameraPriority,
      fullscreenCamera: fullscreenCamera,
      readOnly: readOnly,
      disableSlew: readOnly,
      widgetsLaunchable: !readOnly && widgetsLaunchable,
      user: user,
      removeDockedCamera: _index.removeDockedCameraAndState,
      dir: dir
    })), getWidgetStatus("alerts") && notifications && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_AlertWidget["default"], {
      key: "".concat(contextId, "-alerts"),
      order: getWidgetStatus("alerts").index,
      enabled: getWidgetStatus("alerts").enabled,
      contextId: contextId,
      loadProfile: _Actions5.loadProfile,
      notifications: notifications,
      closeNotification: _index.closeNotification,
      dir: dir
    })), getWidgetStatus("activities") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Activities["default"], {
      locale: locale,
      key: "".concat(contextId, "-activities"),
      entity: _entity,
      order: getWidgetStatus("activities").index,
      enabled: getWidgetStatus("activities").enabled,
      pageSize: 5,
      activities: activities,
      canManage: user.integrations && (0, _find["default"])(_context19 = user.integrations).call(_context19, function (_int10) {
        return _int10.intId === _entity.feedId;
      }) && (0, _find["default"])(_context20 = user.integrations).call(_context20, function (_int11) {
        return _int11.intId === _entity.feedId;
      }).config && (0, _find["default"])(_context21 = user.integrations).call(_context21, function (_int12) {
        return _int12.intId === _entity.feedId;
      }).config.canView,
      activityFilters: activityFilters,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      contextId: contextId,
      userId: userId,
      subscriberRef: "profile",
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      dialog: dialog,
      readOnly: readOnly,
      forReplay: forReplay,
      endDate: endDate,
      timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
      dir: dir
    })), getWidgetStatus("files") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_FileWidget["default"], {
      key: "".concat(contextId, "-files"),
      order: getWidgetStatus("files").index,
      enabled: getWidgetStatus("files").enabled,
      attachments: attachments,
      canDelete: !readOnly && (_entityType !== "track" ? user && user.integrations && (0, _find["default"])(_context22 = user.integrations).call(_context22, function (_int13) {
        return _int13.intId === _entity.feedId;
      }) && (0, _find["default"])(_context23 = user.integrations).call(_context23, function (_int14) {
        return _int14.intId === _entity.feedId;
      }).permissions && (0, _includes["default"])(_context24 = (0, _find["default"])(_context25 = user.integrations).call(_context25, function (_int15) {
        return _int15.intId === _entity.feedId;
      }).permissions).call(_context24, "manage") : user && user.applications && (0, _find["default"])(_context26 = user.applications).call(_context26, function (app) {
        return app.appId === "map-app";
      }) && (0, _find["default"])(_context27 = user.applications).call(_context27, function (app) {
        return app.appId === "map-app";
      }).permissions && (0, _includes["default"])(_context28 = (0, _find["default"])(_context29 = user.applications).call(_context29, function (app) {
        return app.appId === "map-app";
      }).permissions).call(_context28, "manage")),
      hasAccess: !readOnly && hasAccessToFeed,
      attachFiles: _entityProfileActions.attachFilesToEntity,
      entityType: _entityType,
      contextId: contextId,
      dialog: dialog,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      subscriberRef: "profile",
      dir: dir
    })), getWidgetStatus("rules") && rulesAppPermission && !isMarker && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_RulesWidget["default"], {
      key: "".concat(contextId, "-rules"),
      order: getWidgetStatus("rules").index,
      enabled: getWidgetStatus("rules").enabled,
      canManage: !readOnly && user.applications && (0, _find["default"])(_context30 = user.applications).call(_context30, function (app) {
        return app.appId === "rules-app";
      }) && (0, _find["default"])(_context31 = user.applications).call(_context31, function (app) {
        return app.appId === "rules-app";
      }).permissions && (0, _includes["default"])(_context32 = (0, _find["default"])(_context33 = user.applications).call(_context33, function (app) {
        return app.appId === "rules-app";
      }).permissions).call(_context32, "manage"),
      canViewRules: !readOnly && user.applications && (0, _find["default"])(_context34 = user.applications).call(_context34, function (app) {
        return app.appId === "rules-app";
      }) && (0, _find["default"])(_context35 = user.applications).call(_context35, function (app) {
        return app.appId === "rules-app";
      }).config && (0, _find["default"])(_context36 = user.applications).call(_context36, function (app) {
        return app.appId === "rules-app";
      }).config.canView,
      contextId: contextId,
      context: context,
      entityType: _entityType,
      rules: rules,
      collections: entityCollections,
      userId: userId,
      hasLinks: true,
      orgId: orgId,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      loadProfile: _Actions5.loadProfile,
      dir: dir
    })), getWidgetStatus("drone-association") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_DroneAssociation["default"], {
      key: "".concat(contextId, "-drone-association"),
      order: getWidgetStatus("drone-association").index,
      enabled: getWidgetStatus("drone-association").enabled,
      loadProfile: _Actions5.loadProfile,
      context: context
    })), /*#__PURE__*/_react["default"].createElement(_PinToDialog["default"], {
      open: dialog === "pinToDialog",
      close: function close() {
        return dispatch((0, _Actions2.closeDialog)("pinToDialog"));
      },
      entity: _entity,
      canManageEvents: user.applications && (0, _find["default"])(_context37 = user.applications).call(_context37, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context38 = user.applications).call(_context38, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context39 = (0, _find["default"])(_context40 = user.applications).call(_context40, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context39, "manage"),
      canPinToCollections: user.applications && (0, _find["default"])(_context41 = user.applications).call(_context41, function (app) {
        return app.appId === "map-app";
      }) && (0, _find["default"])(_context42 = user.applications).call(_context42, function (app) {
        return app.appId === "map-app";
      }).permissions && (0, _includes["default"])(_context43 = (0, _find["default"])(_context44 = user.applications).call(_context44, function (app) {
        return app.appId === "map-app";
      }).permissions).call(_context43, "manage"),
      addRemoveFromCollections: _entityProfileActions.addRemoveFromCollections,
      addRemoveFromEvents: _entityProfileActions.addRemoveFromEvents,
      createCollection: _entityProfileActions.createCollection,
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      userId: userId,
      dir: dir
    })), /*#__PURE__*/_react["default"].createElement(_EntityDelete["default"], {
      open: dialog === "shapeDeleteDialog",
      closeDialog: _Actions2.closeDialog,
      userId: userId,
      deleteShape: _entityProfileActions.deleteShape,
      id: contextId,
      name: name
    }), /*#__PURE__*/_react["default"].createElement(_EntityShare["default"], {
      handleClick: function handleClick() {
        return handleShareClick(_entity, orgId);
      },
      open: dialog === "shareEntityDialog",
      handleClose: function handleClose() {
        return dispatch((0, _Actions2.closeDialog)("shareEntityDialog"));
      },
      shared: _entity.isPublic
    }), /*#__PURE__*/_react["default"].createElement(_ShapeAssociation["default"], {
      open: dialog === "shape-association",
      closeDialog: _Actions2.closeDialog,
      dialogData: dialogData,
      dir: dir
    }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
      key: "entity-profile-error",
      open: dialog === "entity-profile-error",
      confirm: {
        label: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.ok"),
        action: function action() {
          dispatch((0, _Actions2.closeDialog)("entity-profile-error"));
        }
      },
      textContent: dialogData,
      dir: dir
    }));
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", null);
  }
};

// span instead of transaction
EntityProfile.propTypes = propTypes;
EntityProfile.defaultProps = defaultProps;
var _default = (0, _Apm.withSpan)("entity-profile", "profile")(EntityProfile);
exports["default"] = _default;