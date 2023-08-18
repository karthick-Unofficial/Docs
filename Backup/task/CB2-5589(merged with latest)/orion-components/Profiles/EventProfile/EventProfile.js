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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _moment = _interopRequireDefault(require("moment"));
var _ErrorBoundary = _interopRequireDefault(require("../../ErrorBoundary"));
var _LayoutControls = _interopRequireDefault(require("../Widgets/LayoutControls/LayoutControls"));
var _EventDialog = _interopRequireDefault(require("./components/EventDialog"));
var _index = require("../../CBComponents/index");
var _Widgets = require("../Widgets");
var _jquery = _interopRequireDefault(require("jquery"));
var _EventShareDialog = _interopRequireDefault(require("./components/EventShareDialog"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _Selectors2 = require("orion-components/ContextPanel/Selectors");
var _Selectors3 = require("orion-components/GlobalData/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _unionBy = _interopRequireDefault(require("lodash/unionBy"));
var _Actions = require("orion-components/ContextualData/Actions");
var _Actions2 = require("orion-components/AppState/Actions");
var _Actions3 = require("orion-components/GlobalData/Actions");
var _Actions4 = require("orion-components/ContextPanel/Actions");
var _index2 = require("orion-components/Dock/Actions/index.js");
var _eventProfileActions = require("../../SharedActions/eventProfileActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  forReplay: _propTypes["default"].bool,
  selectWidget: _propTypes["default"].func,
  updateListCheckbox: _propTypes["default"].func,
  widgetsLaunchable: _propTypes["default"].bool,
  deleteEvent: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  replayEndDate: _propTypes["default"].date,
  locale: _propTypes["default"].string,
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacFeed: _propTypes["default"].bool,
  widgetsExpandable: _propTypes["default"].bool
};
var defaultProps = {
  locale: "en",
  selectFloorPlanOn: function selectFloorPlanOn() {},
  widgetsExpandable: false
};
var DEFAULT_WIDGET_CONFIG = [];
var EventProfile = function EventProfile(_ref) {
  var forReplay = _ref.forReplay,
    _selectWidget = _ref.selectWidget,
    updateListCheckbox = _ref.updateListCheckbox,
    widgetsLaunchable = _ref.widgetsLaunchable,
    deleteEvent = _ref.deleteEvent,
    readOnly = _ref.readOnly,
    replayEndDate = _ref.replayEndDate,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    floorPlansWithFacFeed = _ref.floorPlansWithFacFeed,
    widgetsExpandable = _ref.widgetsExpandable;
  var dispatch = (0, _reactRedux.useDispatch)();
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile;
  });
  var externalSystems = (0, _reactRedux.useSelector)(function (state) {
    return state.session.organization.externalSystems;
  });
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.selectedContextSelector)(state);
  });
  var clientConfig = (0, _reactRedux.useSelector)(function (state) {
    return state.clientConfig;
  });
  var entity = context.entity;
  var isLoaded = (0, _isObject["default"])(context) && entity;
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return (0, _Selectors.persistedState)(state);
    }),
    activityFilters = _useSelector.activityFilters;
  var dialog = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dialog.openDialog;
  });
  var mapStatus = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapState)(state);
  });
  var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
      return state;
    }),
    userAppState = _useSelector2.userAppState;
  var view = isLoaded && userAppState ? userAppState.eventView : null;
  var contextId = entity.id;
  var lookupData = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData && state.globalData.listLookupData ? state.globalData.listLookupData : {};
  });
  var isPrimary = (0, _reactRedux.useSelector)(function (state) {
    return contextId === (0, _Selectors2.contextPanelState)(state).selectedContext.primary;
  });
  var types = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors3.eventTypesSelector)(state);
  });
  var widgetState = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.widgetStateSelector)(state);
  });
  var feeds = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors3.userFeedsSelector)(state);
  });
  var event = entity;
  var defaultListPagination = clientConfig.defaultListPagination;
  var listPaginationOptions = clientConfig.listPaginationOptions;
  var mapVisible = mapStatus.visible;
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return state.appId;
  });
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var floorPlansWithFacilityFeed = (0, _reactRedux.useSelector)(function (state) {
    return floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null;
  });
  var appState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState;
  });
  var sidebarOpen = appState.dock.dockData.isOpen;
  var dockedCameras = appState.dock.cameraDock.dockedCameras;
  var fullscreenCamera = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.fullscreenCameraOpen)(state);
  });
  var secondaryExpanded = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.contextPanelState)(state).secondaryExpanded;
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
    editing = _useState8[0],
    setEditing = _useState8[1];
  var _useState9 = (0, _react.useState)({}),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    notes = _useState10[0],
    setNotes = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    mounted = _useState12[0],
    setMounted = _useState12[1];
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevEvent = usePrevious(event);
  if (!mounted) {
    DEFAULT_WIDGET_CONFIG = [{
      enabled: true,
      id: "activities",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.activities")
    }, {
      enabled: true,
      id: "map",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.map")
    }, {
      enabled: true,
      id: "notes",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.notes")
    }, {
      enabled: true,
      id: "event_lists",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.eventLists")
    }, {
      enabled: true,
      id: "pinned_items",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.pinnedItems")
    }, {
      enabled: true,
      id: "files",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.files")
    }, {
      enabled: true,
      id: "secure_share",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.secureShare")
    }, {
      enabled: true,
      id: "cad_details",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.cadDetails")
    }, {
      enabled: true,
      id: "responding_units",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.respondingUnits")
    }, {
      enabled: true,
      id: "cameras",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.cameras")
    }, {
      enabled: true,
      id: "proximity",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.proximity")
    }, {
      enabled: true,
      id: "resources",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.resources")
    }, {
      enabled: true,
      id: "equipments",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.equipment")
    }, {
      enabled: true,
      id: "gate_runner_response",
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.gateRunnerResponse")
    }];
    setMounted(true);
  }
  (0, _react.useEffect)(function () {
    var id = event.id;
    if (!forReplay) {
      if (getWidgetStatus("event_lists")) {
        dispatch((0, _Actions.startListStream)(id, "profile"));
      }
      if (getWidgetStatus("activities")) {
        dispatch((0, _Actions.startEventActivityStream)(id, "profile"));
      }
      if (getWidgetStatus("files")) {
        dispatch((0, _Actions.startAttachmentStream)(id, "profile"));
      }
      if (getWidgetStatus("pinned_items")) {
        dispatch((0, _Actions.startEventPinnedItemsStream)(id, "profile"));
      }
      if (getWidgetStatus("cameras")) {
        dispatch((0, _Actions.startEventCameraStream)(id, "profile"));
      }
      if (event && event.notes) {
        retrieveHTML(event.notes);
      }
    } else {
      // do we need to do something else here, or leave it up to the widgets to pull in the static data
    }
    setMounted(true);
  }, []);
  (0, _react.useEffect)(function () {
    handleScroll();
  }, [scrolledUp]);
  (0, _react.useEffect)(function () {
    if (event && prevEvent) {
      if (prevEvent.notes !== event.notes) {
        retrieveHTML(event.notes);
      }
    }
  }, [event.notes]);
  var retrieveHTML = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(handle) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!handle) {
              _context.next = 5;
              break;
            }
            _context.next = 3;
            return _clientAppCore.eventService.downloadEventNotes(handle, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                setNotes(result);
              }
            });
          case 3:
            _context.next = 6;
            break;
          case 5:
            setNotes({});
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function retrieveHTML(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var deleteNotes = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(eventId) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _clientAppCore.eventService.deleteEventNotes(eventId, function (err, result) {
              if (err) {
                console.log(err, result);
              } else {
                setNotes({});
              }
            });
          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function deleteNotes(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
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
  var handleCloseDeleteDialog = function handleCloseDeleteDialog() {
    dispatch((0, _Actions2.closeDialog)("eventDeleteDialog"));
  };
  var handleConfirmDelete = function handleConfirmDelete() {
    dispatch(deleteEvent(event.id));
    handleCloseDeleteDialog();
  };
  var handleEditMode = function handleEditMode(editing) {
    setEditing(editing);
  };
  var getWidgetConfig = function getWidgetConfig() {
    var _context3, _context4;
    var type = event.type;
    var isTemplate = event.isTemplate;
    var eventType = types[type];
    var defaultTypes = ["notes", "pinned_items", "files", "cameras"];
    var viewLists = user.integrations && (0, _find["default"])(_context3 = user.integrations).call(_context3, function (feed) {
      return feed.entityType === "list";
    });
    if (viewLists) defaultTypes.push("event_lists");

    // Don't allow proximity widget in cameras app
    if (appId !== "cameras-app") defaultTypes.push("proximity");

    // Only allow activities widget if not a template
    if (!isTemplate) defaultTypes.push("activities");

    // Only allow map widget if the widgets are expandable
    if (widgetsExpandable) defaultTypes.push("map");

    // Add additional widgets based on event type
    if (eventType) defaultTypes = (0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(defaultTypes), (0, _toConsumableArray2["default"])(eventType.widgets));

    // Add resources & equipment widgets if user has HRMS external system
    if ((0, _indexOf["default"])(externalSystems).call(externalSystems, "hrms") > -1) {
      var _context5;
      defaultTypes = (0, _concat["default"])(_context5 = []).call(_context5, (0, _toConsumableArray2["default"])(defaultTypes), ["resources", "equipments"]);
    }
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
  var renderActions = function renderActions() {
    var _context6, _context7, _context8, _context9, _context10, _context11, _context12, _context13, _context14;
    var name = event.name;
    var canManage = user.applications && (0, _find["default"])(_context6 = user.applications).call(_context6, function (app) {
      return app.appId === "events-app";
    }) && (0, _find["default"])(_context7 = user.applications).call(_context7, function (app) {
      return app.appId === "events-app";
    }).permissions && (0, _includes["default"])(_context8 = (0, _find["default"])(_context9 = user.applications).call(_context9, function (app) {
      return app.appId === "events-app";
    }).permissions).call(_context8, "manage");
    var canShare = !event.isTemplate && user.applications && (0, _find["default"])(_context10 = user.applications).call(_context10, function (app) {
      return app.appId === "events-app";
    }) && (0, _find["default"])(_context11 = user.applications).call(_context11, function (app) {
      return app.appId === "events-app";
    }).permissions && (0, _includes["default"])(_context12 = (0, _find["default"])(_context13 = user.applications).call(_context13, function (app) {
      return app.appId === "events-app";
    }).permissions).call(_context12, "share") && user.orgId === event.ownerOrg;
    var canViewReports = user.applications && (0, _find["default"])(_context14 = user.applications).call(_context14, function (app) {
      return app.appId === "reports-app";
    });
    var actions = [];
    var reportAction = {
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.report"),
      nameText: "Report",
      action: function action() {
        var _context15;
        return window.location.replace((0, _concat["default"])(_context15 = "/reports-app/#/report-builder/sitrep?id=sitrep&event=".concat(name, "&eventId=")).call(_context15, event.id));
      }
    };
    var shareAction = {
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.share"),
      nameText: "Share",
      action: function action() {
        return dispatch((0, _Actions2.openDialog)("eventShareDialog"));
      }
    };
    var editAction = {
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.edit"),
      nameText: "Edit",
      action: function action() {
        handleEditMode(true);
        dispatch((0, _Actions2.openDialog)("eventEditDialog"));
      }
    };
    var deleteAction = {
      name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.delete"),
      nameText: "Delete",
      action: function action() {
        dispatch((0, _Actions2.openDialog)("eventDeleteDialog"));
      }
    };
    if (!event.isTemplate && canViewReports) {
      actions.push(reportAction);
    }
    if (canShare) {
      actions.push(shareAction);
    }
    if (canManage) {
      actions.push(editAction);
      if (event.ownerOrg === user.orgId) {
        actions.push(deleteAction);
      }
    }
    return actions;
  };
  if (context) {
    var _context16, _context17, _context18, _context19, _context20, _context21, _context22, _context23, _context24, _context25, _context26, _context27, _context28, _context29, _context30, _context31, _context32, _context33, _context34, _context35, _context36, _context37, _context38, _context39, _context40, _context41, _context42, _context43, _context44, _context45, _context46, _context47;
    var attachments = context.attachments,
      activities = context.activities,
      pinnedItems = context.pinnedItems,
      lists = context.lists,
      eventCameras = context.eventCameras;
    var userId = user.id;
    var entityData = event.entityData,
      name = event.name,
      desc = event.desc,
      isPublic = event.isPublic,
      type = event.type,
      endDate = event.endDate,
      entityType = event.entityType;
    var additionalProperties = event.additionalProperties || {};
    var eventType = types[type];
    var geometry = entityData.geometry;
    var canManageEvent = !readOnly && user.applications && (0, _find["default"])(_context16 = user.applications).call(_context16, function (app) {
      return app.appId === "events-app";
    }) && (0, _find["default"])(_context17 = user.applications).call(_context17, function (app) {
      return app.appId === "events-app";
    }).permissions && (0, _includes["default"])(_context18 = (0, _find["default"])(_context19 = user.applications).call(_context19, function (app) {
      return app.appId === "events-app";
    }).permissions).call(_context18, "manage");
    var respondingUnits = additionalProperties.respondingUnits,
      address = additionalProperties.address,
      status = additionalProperties.status;
    var scrollOffset = scrolledUp ? 167 : 0;
    var widgetsContainerStyle = {
      top: scrollOffset
    };
    var widgets = getWidgetConfig();
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "cb-profile-wrapper",
      style: {
        height: "100%",
        overflow: "scroll"
      }
    }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.SummaryWidget, {
      id: contextId,
      readOnly: readOnly,
      user: user,
      context: context,
      name: name,
      displayType: eventType ? eventType.name : "",
      type: endDate ? "Planned" : "Emergent",
      geometry: geometry,
      description: desc,
      scrolledUp: scrolledUp,
      handleExpand: handleExpand,
      mapVisible: mapVisible,
      appId: appId,
      actions: renderActions(),
      dir: dir
    })), !scrolledUp && /*#__PURE__*/_react["default"].createElement("div", {
      className: "layout-control-button"
    }, /*#__PURE__*/_react["default"].createElement("a", {
      className: "cb-font-link",
      onClick: handleEditLayout
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.eventProfile.main.editProfileLayout"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "widgets-container",
      style: widgetsContainerStyle
    }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LayoutControls["default"], {
      open: layoutControlsOpen,
      anchor: anchorEl,
      close: handleCloseEditLayout,
      widgetOrder: widgets,
      profile: "event",
      expandedWidget: view
    })), (0, _jquery["default"])(window).width() > 1023 && getWidgetStatus("map") && /*#__PURE__*/_react["default"].createElement(_Widgets.MapWidget, {
      order: getWidgetStatus("map").index,
      enabled: getWidgetStatus("map").enabled,
      expanded: mapVisible,
      selectWidget: _selectWidget,
      title: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.mapPlanner"),
      dir: dir
    }), getWidgetStatus("cad_details") &&
    /*#__PURE__*/
    // TODO: There's no need to pass down a hard-coded array to a widget if it can be handled in the widget
    _react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.CADDetailsWidget, {
      order: getWidgetStatus("cad_details").index,
      enabled: getWidgetStatus("cad_details").enabled,
      expanded: false,
      steps: ["Dispatched", "En Route", "On-Scene", "Closed"],
      address: address,
      activeStep: (0, _indexOf["default"])(_context20 = ["dispatched", "enroute",
      // cSpell:ignore enroute
      "onScene", "closed"]).call(_context20, status),
      dir: dir
    })), getWidgetStatus("cameras") && eventCameras && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.CameraWidget, {
      key: "".concat(contextId, "-cameras"),
      cameras: eventCameras,
      entityType: entityType,
      geometry: geometry,
      user: user,
      order: getWidgetStatus("cameras").index,
      enabled: getWidgetStatus("cameras").enabled,
      loadProfile: _Actions4.loadProfile,
      sidebarOpen: sidebarOpen,
      dockedCameras: dockedCameras,
      addCameraToDockMode: _index2.addCameraToDockMode,
      contextId: contextId,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      setCameraPriority: _index2.setCameraPriority,
      readOnly: readOnly,
      disableSlew: readOnly,
      fullscreenCamera: fullscreenCamera,
      widgetsLaunchable: widgetsLaunchable,
      entity: event,
      eventEnded: endDate && (0, _moment["default"])().diff(endDate) >= 0,
      removeDockedCamera: _index2.removeDockedCameraAndState,
      dir: dir,
      selectFloorPlanOn: selectFloorPlanOn,
      floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
    })), getWidgetStatus("gate_runner_response") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.GateRunnerResponseWidget, {
      order: getWidgetStatus("gate_runner_response").index,
      enabled: getWidgetStatus("gate_runner_response").enabled,
      dir: dir,
      widgetsExpandable: widgetsExpandable,
      event: event,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      selectWidget: _selectWidget,
      activities: activities
    })), getWidgetStatus("responding_units") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.RespondingUnitsWidget, {
      order: getWidgetStatus("responding_units").index,
      enabled: getWidgetStatus("responding_units").enabled,
      expanded: false,
      loadProfile: _Actions4.loadProfile,
      respondingUnits: respondingUnits,
      title: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.respondingUnits"),
      dir: dir
    })), getWidgetStatus("notes") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.NotesWidget, {
      order: getWidgetStatus("notes").index,
      enabled: getWidgetStatus("notes").enabled,
      selectWidget: function selectWidget(widget) {
        return dispatch(_selectWidget(widget));
      },
      selected: view === "Notes",
      expanded: false,
      widgetsExpandable: widgetsExpandable,
      secondaryExpanded: secondaryExpanded,
      canContribute: canManageEvent,
      updateNotes: function updateNotes(event, notes) {
        return dispatch((0, _eventProfileActions.updateEventNotes)(event, notes));
      },
      event: event,
      notes: notes && notes.html ? notes : {
        html: "<p><br></p>"
      },
      widgetsLaunchable: widgetsLaunchable && appId !== "events-app",
      contextId: contextId,
      entityType: entityType,
      deleteNotes: deleteNotes,
      activities: activities,
      dir: dir,
      openDialog: function openDialog(widget) {
        return dispatch((0, _Actions2.openDialog)(widget));
      },
      closeDialog: function closeDialog(widget) {
        return dispatch((0, _Actions2.closeDialog)(widget));
      }
    })), getWidgetStatus("pinned_items") && pinnedItems && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.PinnedItemsWidget, {
      order: getWidgetStatus("pinned_items").index,
      enabled: getWidgetStatus("pinned_items").enabled,
      selected: view === "Pinned Items",
      items: pinnedItems,
      selectWidget: _selectWidget,
      canManage: canManageEvent,
      event: event,
      view: view,
      loadProfile: _Actions4.loadProfile,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable && appId !== "events-app",
      contextId: contextId,
      entityType: entityType,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      isPrimary: isPrimary,
      readOnly: readOnly,
      eventEnded: endDate && (0, _moment["default"])().diff(endDate) >= 0,
      feeds: feeds,
      dir: dir,
      selectFloor: selectFloorPlanOn,
      floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
    })), getWidgetStatus("event_lists") && lists && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.ListWidget, {
      order: getWidgetStatus("event_lists").index,
      enabled: getWidgetStatus("event_lists").enabled,
      selected: view === "Event Lists",
      expanded: false // for styling differences between profile and expanded widget views
      ,
      canRemoveLists: !readOnly && user.applications && (0, _find["default"])(_context21 = user.applications).call(_context21, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context22 = user.applications).call(_context22, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context23 = (0, _find["default"])(_context24 = user.applications).call(_context24, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context23, "manage"),
      canAddEditLists: !readOnly && user.applications && (0, _find["default"])(_context25 = user.applications).call(_context25, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context26 = user.applications).call(_context26, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context27 = (0, _find["default"])(_context28 = user.applications).call(_context28, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context27, "manage"),
      listAccessAndEventsManage: user.integrations && (0, _find["default"])(_context29 = user.integrations).call(_context29, function (feed) {
        return feed.entityType === "list";
      }) && user.applications && (0, _find["default"])(_context30 = user.applications).call(_context30, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context31 = user.applications).call(_context31, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context32 = (0, _find["default"])(_context33 = user.applications).call(_context33, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context32, "manage"),
      selectWidget: _selectWidget,
      updateListCheckbox: updateListCheckbox,
      defaultListPagination: defaultListPagination,
      listPaginationOptions: listPaginationOptions,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable && appId !== "events-app",
      lists: lists,
      lookupData: lookupData,
      contextId: contextId,
      getLookupValues: _Actions3.getLookupValues,
      user: user,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      dialog: dialog,
      isPrimary: isPrimary,
      secondaryExpanded: secondaryExpanded,
      dir: dir,
      locale: locale
    })), getWidgetStatus("activities") && (activities || forReplay) && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.Activities, {
      key: "".concat(contextId, "-activities"),
      entity: event,
      order: getWidgetStatus("activities").index,
      enabled: getWidgetStatus("activities").enabled,
      selected: view === "Activity Timeline",
      pageSize: 5,
      selectWidget: _selectWidget,
      activities: activities,
      canManage: user.applications && (0, _find["default"])(_context34 = user.applications).call(_context34, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context35 = user.applications).call(_context35, function (app) {
        return app.appId === "events-app";
      }).config && (0, _find["default"])(_context36 = user.applications).call(_context36, function (app) {
        return app.appId === "events-app";
      }).config.canView,
      activityFilters: activityFilters,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable && appId !== "events-app",
      contextId: contextId,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      dialog: dialog,
      isPrimary: isPrimary,
      userId: userId,
      entityType: entityType,
      readOnly: readOnly,
      forReplay: forReplay,
      endDate: replayEndDate,
      timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
      dir: dir,
      locale: locale
    })), getWidgetStatus("files") && attachments && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.FileWidget, {
      id: "files",
      order: getWidgetStatus("files").index,
      enabled: getWidgetStatus("files").enabled,
      selected: view === "Files",
      selectWidget: _selectWidget,
      attachments: attachments,
      canDelete: !readOnly && user.applications && (0, _find["default"])(_context37 = user.applications).call(_context37, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context38 = user.applications).call(_context38, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context39 = (0, _find["default"])(_context40 = user.applications).call(_context40, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context39, "manage"),
      hasAccess: !readOnly && user.applications && (0, _find["default"])(_context41 = user.applications).call(_context41, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context42 = user.applications).call(_context42, function (app) {
        return app.appId === "events-app";
      }).config && (0, _find["default"])(_context43 = user.applications).call(_context43, function (app) {
        return app.appId === "events-app";
      }).config.canView,
      attachFiles: _eventProfileActions.attachFilesToEvent,
      widgetsExpandable: widgetsExpandable,
      widgetsLaunchable: widgetsLaunchable && appId !== "events-app",
      entityType: entityType,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      contextId: contextId,
      isPrimary: isPrimary,
      dir: dir
    })), getWidgetStatus("secure_share") && /*#__PURE__*/_react["default"].createElement(_Widgets.SGSettings, {
      key: contextId,
      selectWidget: _selectWidget,
      selected: view === "SecureShare Settings",
      expanded: false,
      order: getWidgetStatus("secure_share").index,
      enabled: getWidgetStatus("secure_share").enabled,
      contextId: contextId,
      settings: additionalProperties,
      expandable: widgetsExpandable,
      pinnedItems: pinnedItems,
      isPublic: isPublic,
      type: type,
      dir: dir
    }), getWidgetStatus("proximity") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.ProximityWidget, {
      order: getWidgetStatus("proximity").index,
      enabled: getWidgetStatus("proximity").enabled,
      selected: view === "Proximity",
      expanded: false // for styling differences between profile and expanded widget views
      ,
      selectWidget: _selectWidget,
      event: event,
      canManage: !readOnly && user.applications && (0, _find["default"])(_context44 = user.applications).call(_context44, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context45 = user.applications).call(_context45, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context46 = (0, _find["default"])(_context47 = user.applications).call(_context47, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context46, "manage"),
      view: view,
      loadProfile: _Actions4.loadProfile,
      widgetsExpandable: widgetsExpandable,
      contextId: contextId,
      context: context,
      unsubscribeFromFeed: _Actions.unsubscribeFromFeed,
      subscriberRef: "profile",
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      isPrimary: isPrimary,
      eventEnded: endDate && (0, _moment["default"])().diff(endDate) >= 0,
      feeds: feeds,
      startProximityEntitiesStream: _Actions.startProximityEntitiesStream,
      dir: dir,
      forReplay: forReplay
    })), getWidgetStatus("resources") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.ResourceWidget, {
      key: contextId,
      contextId: contextId,
      selectWidget: _selectWidget,
      selected: view === "Resources",
      expanded: false,
      order: getWidgetStatus("resources").index,
      enabled: getWidgetStatus("resources").enabled,
      expandable: widgetsExpandable,
      settings: additionalProperties,
      dir: dir,
      canManage: canManageEvent
    })), getWidgetStatus("equipments") && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.EquipmentWidget, {
      key: contextId,
      selectWidget: _selectWidget,
      selected: view === "Equipment",
      expanded: false,
      order: getWidgetStatus("equipments").index,
      enabled: getWidgetStatus("equipments").enabled,
      expandable: widgetsExpandable,
      settings: additionalProperties,
      contextId: contextId,
      dir: dir,
      canManage: canManageEvent
    })), /*#__PURE__*/_react["default"].createElement(_EventShareDialog["default"], {
      event: event,
      user: user,
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      publishEvent: _eventProfileActions.publishEvent,
      shareEvent: _eventProfileActions.shareEvent,
      dir: dir
    }), /*#__PURE__*/_react["default"].createElement(_index.Dialog, {
      open: dialog === "eventDeleteDialog",
      confirm: {
        label: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.confirm"),
        action: handleConfirmDelete
      },
      abort: {
        label: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.cancel"),
        action: handleCloseDeleteDialog
      },
      title: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.confirmationText"),
      dir: dir
    }), /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_EventDialog["default"], {
      editing: editing,
      handleEditMode: handleEditMode,
      open: dialog === "eventEditDialog",
      selectedEvent: event,
      closeDialog: _Actions2.closeDialog,
      types: types,
      timeFormatPreference: timeFormatPreference,
      dir: dir,
      locale: locale
    }))));
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", null);
  }
};
EventProfile.propTypes = propTypes;
EventProfile.defaultProps = defaultProps;
var _default = EventProfile;
exports["default"] = _default;