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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _LayoutControls = _interopRequireDefault(require("../Widgets/LayoutControls/LayoutControls"));
var _Widgets = require("../Widgets");
var _material = require("@mui/material");
var _clientAppCore = require("client-app-core");
var _PinToDialog = _interopRequireDefault(require("../../SharedComponents/PinToDialog"));
var _ErrorBoundary = _interopRequireDefault(require("../../ErrorBoundary"));
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _CamerasWidget = _interopRequireDefault(require("../Widgets/Cameras/CamerasWidget"));
var _index = require("../../CBComponents/index");
var _i18n = require("orion-components/i18n");
var _AccessPointWidget = _interopRequireDefault(require("../Widgets/AccessPoint/AccessPointWidget"));
var _Selectors = require("orion-components/Map/Selectors");
var _reactRedux = require("react-redux");
var _Selectors2 = require("orion-components/ContextPanel/Selectors");
var _Selectors3 = require("orion-components/AppState/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var _unionBy = _interopRequireDefault(require("lodash/unionBy"));
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _uniqBy = _interopRequireDefault(require("lodash/uniqBy"));
var _cameraProfileActions = require("orion-components/SharedActions/cameraProfileActions");
var _Actions = require("orion-components/ContextPanel/Actions");
var _Actions2 = require("orion-components/AppState/Actions");
var _Actions3 = require("orion-components/ContextualData/Actions");
var _commonActions = require("orion-components/SharedActions/commonActions");
var _Actions4 = require("orion-components/Map/Tools/Actions");
var _index2 = require("orion-components/Dock/Actions/index.js");
var _facilityProfileActions = require("orion-components/SharedActions/facilityProfileActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//actions

var DEFAULT_WIDGET_CONFIG = [];
var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var propTypes = {
  context: _propTypes["default"].object,
  selectFloorPlan: _propTypes["default"].func.isRequired,
  selectedFloorId: _propTypes["default"].string,
  setFloorPlans: _propTypes["default"].func.isRequired,
  actionOptions: _propTypes["default"].array,
  disableCameras: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  context: null,
  selectedFloorId: null,
  dir: "ltr"
};
var FacilityProfile = function FacilityProfile(_ref) {
  var _context;
  var actionOptions = _ref.actionOptions,
    appData = _ref.appData,
    ignoreFacility = _ref.ignoreFacility,
    disableCameras = _ref.disableCameras,
    selectFloorPlan = _ref.selectFloorPlan,
    setFloorPlans = _ref.setFloorPlans,
    clearFloorPlan = _ref.clearFloorPlan,
    selectWidget = _ref.selectWidget,
    widgetsLaunchable = _ref.widgetsLaunchable,
    readOnly = _ref.readOnly,
    forReplay = _ref.forReplay,
    endDate = _ref.endDate,
    startAttachmentStream = _ref.startAttachmentStream;
  var dispatch = (0, _reactRedux.useDispatch)();
  var fullContext = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.selectedFacilitySelector)(state);
  });
  var session = (0, _reactRedux.useSelector)(function (state) {
    return state.session;
  });
  var globalData = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData;
  });
  var user = session.user.profile;
  var entity = fullContext ? fullContext.entity : null;
  var dialog = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dialog.openDialog;
  });
  var isLoaded = (0, _isObject["default"])(fullContext) && entity;
  var view = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && state.userAppState && state.userAppState.facilityView;
  });
  var floorPlans = globalData.floorPlans;
  var orgId = isLoaded && user.orgId;
  var ownerOrg = isLoaded && entity;
  var activityFilters = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && (0, _Selectors3.persistedState)(state).activityFilters;
  });
  var contextId = entity.id;
  var isPrimary = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded && contextId === (0, _Selectors2.contextPanelState)(state).selectedContext.primary;
  });
  var fromOrg = isLoaded && ownerOrg === orgId;
  var fromEco = isLoaded && ownerOrg !== orgId;
  var widgetState = (0, _reactRedux.useSelector)(function (state) {
    return isLoaded ? (0, _Selectors3.widgetStateSelector)(state) : [];
  });
  var context = fullContext;
  var sidebarOpen = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.dockData.isOpen;
  });
  var dockedCameras = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.cameraDock.dockedCameras;
  });
  var facilityId = entity.id;
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return (0, _Selectors.floorPlanSelector)(state) || {};
    }),
    selectedFloor = _useSelector.selectedFloor;
  var camerasWidgetContext = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.selectedContextSelector)(state);
  });
  var cameras = (0, _uniqBy["default"])((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(camerasWidgetContext.floorPlanCameras || []), (0, _toConsumableArray2["default"])(camerasWidgetContext.camerasInRange || [])), "id");
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    hiding = _useState2[0],
    setHiding = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    floorPlanAccessPoints = _useState4[0],
    setFloorPlanAccessPoints = _useState4[1];
  var _useState5 = (0, _react.useState)({
      layoutControlsOpen: false,
      anchorEl: null,
      scrolledUp: false,
      editing: false,
      hiding: false
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    state = _useState6[0],
    setState = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    mounted = _useState8[0],
    setMounted = _useState8[1];
  var scrollOffset = state.scrolledUp ? 74 : 0;
  var widgetsContainerStyle = {
    top: scrollOffset
  };
  var _useState9 = (0, _react.useState)(""),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    facilityDeleteTitle = _useState10[0],
    setFacilityDeleteTitle = _useState10[1];
  var _useState11 = (0, _react.useState)([]),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    priorityOptions = _useState12[0],
    setpriorityOptions = _useState12[1];
  var _useState13 = (0, _react.useState)(""),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    defaultPriority = _useState14[0],
    setDefaultPriority = _useState14[1];
  var prevDefaultPriority = null;
  var prevPriorityOptions = null;
  var handleCloseDeleteDialog = function handleCloseDeleteDialog() {
    dispatch((0, _Actions2.closeDialog)("facilityDeleteDialog"));
  };
  var handleCloseCannotDeleteDialog = function handleCloseCannotDeleteDialog() {
    dispatch((0, _Actions2.closeDialog)("facilityCannotDeleteDialog"));
  };
  var handleConfirmDelete = function handleConfirmDelete() {
    dispatch((0, _facilityProfileActions.deleteFacility)(context.entity.id));
    handleCloseDeleteDialog();
  };
  var getCustomWidgetConfig = function getCustomWidgetConfig(widgetName) {
    var integrations = user.integrations;
    var widgetArr = [];
    var entity = context.entity;
    (0, _filter["default"])(integrations).call(integrations, function (customWidget) {
      if (entity.feedId === customWidget.feedId && hasOwn(customWidget, "widgets")) {
        var widgets = customWidget.widgets;
        for (var i = 0; i < widgets.length; i++) {
          if (widgets[i].id === widgetName) {
            widgetArr.push(widgets[i]);
            break;
          }
        }
      }
    });
    return widgetArr;
  };
  var updateFacilityCondition = function updateFacilityCondition(defaultPriorityVal, priorityOptionVal) {
    if (prevDefaultPriority === null && prevPriorityOptions === null) {
      prevDefaultPriority = defaultPriorityVal;
      prevPriorityOptions = priorityOptionVal;
    }
    if (prevDefaultPriority !== null && prevPriorityOptions !== null) {
      if (prevDefaultPriority !== defaultPriority) {
        setpriorityOptions(priorityOptionVal);
        setDefaultPriority(defaultPriorityVal);
      } else {
        prevDefaultPriority = defaultPriorityVal;
        prevPriorityOptions = priorityOptionVal;
      }
    }
  };
  var getWidgetConfig = function getWidgetConfig(widgetState) {
    var widgetId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var defaultTypes = ["activities", "files", "cameras", "floorPlans", "accessPoints", "facility-condition"];
    if (widgetId === "facility-condition") {
      var facilityConditionWidget = getCustomWidgetConfig(widgetId);

      //If the widget array for the facility feed doesn't contain facility-condition, remove it from the DEFAULT_WIDGET_CONFIG.
      if (facilityConditionWidget.length === 0) {
        DEFAULT_WIDGET_CONFIG = (0, _filter["default"])(DEFAULT_WIDGET_CONFIG).call(DEFAULT_WIDGET_CONFIG, function (widget) {
          return widget.id !== "facility-condition";
        });
      } else {
        updateFacilityCondition(facilityConditionWidget[0].defaultPriority, facilityConditionWidget[0].priorityOptions);
      }
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
  var getWidgetStatus = function getWidgetStatus(widgetId, widgetState) {
    var widgetConfig = getWidgetConfig(widgetState, widgetId);
    var widget = (0, _find["default"])(widgetConfig).call(widgetConfig, function (widget, index) {
      widget.index = index;
      return widget.id === widgetId;
    });
    return widget;
  };
  if (!mounted) {
    DEFAULT_WIDGET_CONFIG = [{
      enabled: true,
      id: "floorPlans",
      name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.floorPlans")
    }, {
      enabled: true,
      id: "activities",
      name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.activities")
    }, {
      enabled: true,
      id: "files",
      name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.files")
    }, {
      enabled: true,
      id: "accessPoints",
      name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.accessPoints")
    }, {
      enabled: true,
      id: "facility-condition",
      name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.facilityCondition")
    }];
    if (!disableCameras) {
      DEFAULT_WIDGET_CONFIG.push({
        enabled: true,
        id: "cameras",
        name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.cameras")
      });
    }
    setMounted(true);
  }
  (0, _react.useEffect)(function () {
    setMounted(true);
  }, []);
  (0, _react.useEffect)(function () {
    if (facilityId) {
      _clientAppCore.facilityService.getFacilityFloorplans(context.entity.id, function (err, response) {
        if (err) {
          console.log("ERROR:", err);
        } else {
          var success = response.success,
            result = response.result;
          if (success && result.length) {
            dispatch(setFloorPlans(result));
          } else if (success && !result.length) {
            dispatch(selectFloorPlan(null));
          }
        }
      });
      if (!forReplay) {
        if (getWidgetStatus("files")) {
          dispatch(startAttachmentStream(facilityId, "profile"));
        }
        if (getWidgetStatus("activities")) {
          dispatch((0, _Actions3.startActivityStream)(facilityId, "facility", "profile"));
        }
        if (getWidgetStatus("cameras")) {
          dispatch((0, _Actions3.startCamerasInRangeStream)(facilityId, "facility", "profile"));
        }
      } else {
        // do we need to do something else here, or leave it up to the widgets to pull in the static data
      }
    }
    return function () {
      dispatch((0, _Actions3.unsubscribeFromFeed)(facilityId, "camerasInRange", "profile"));
    };
  }, [facilityId, selectFloorPlan, setFloorPlans, startAttachmentStream]);

  // useEffect(() => {
  // 	handleScroll(state.scrolledUp, setState);
  // }, []);
  if (facilityId) {
    var _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11, _context12, _context13, _context14, _context15, _context16, _context17;
    var attachments = context.attachments,
      activities = context.activities,
      _entity = context.entity;
    var entityData = context.entity.entityData;
    var geometry = entityData.geometry;
    var id = context.entity.id;
    var _entityData$propertie = entityData.properties,
      name = _entityData$propertie.name,
      description = _entityData$propertie.description;
    var hasAccess = !readOnly && user.integrations && (0, _find["default"])(_context2 = user.integrations).call(_context2, function (_int) {
      return _int.intId === _entity.feedId;
    }) && (0, _find["default"])(_context3 = user.integrations).call(_context3, function (_int2) {
      return _int2.intId === _entity.feedId;
    }).config && (0, _find["default"])(_context4 = user.integrations).call(_context4, function (_int3) {
      return _int3.intId === _entity.feedId;
    }).config.canView;
    var canManageFacility = !readOnly && user.integrations && (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int4) {
      return _int4.intId === _entity.feedId;
    }) && (0, _find["default"])(_context6 = user.integrations).call(_context6, function (_int5) {
      return _int5.intId === _entity.feedId;
    }).permissions && (0, _includes["default"])(_context7 = (0, _find["default"])(_context8 = user.integrations).call(_context8, function (_int6) {
      return _int6.intId === _entity.feedId;
    }).permissions).call(_context7, "manage");
    var floorPlanIds = (0, _keys["default"])(floorPlans);
    var checkEntitiesOnFloorPlan = function checkEntitiesOnFloorPlan() {
      if (floorPlanIds.length > 0) {
        var promises = [];
        (0, _forEach["default"])(floorPlanIds).call(floorPlanIds, function (floorPlanId) {
          promises.push(new _promise["default"](function (resolve, reject) {
            _clientAppCore.cameraService.getByDisplayTargetId(floorPlanId, function (err, res) {
              if (err) {
                reject(err);
              } else {
                if (res.length > 0) {
                  resolve("camera");
                }
                resolve(false);
              }
            });
          }));
          promises.push(new _promise["default"](function (resolve, reject) {
            _clientAppCore.accessPointService.getByDisplayTargetId(floorPlanId, function (err, res) {
              if (err) {
                reject(err);
              } else {
                if (res.length > 0) {
                  resolve("accessPoint");
                }
                resolve(false);
              }
            });
          }));
        });
        return _promise["default"].all(promises).then(function (data) {
          if ((0, _includes["default"])(data).call(data, "camera")) {
            dispatch((0, _Actions2.openDialog)("facilityCannotDeleteDialog"));
            setFacilityDeleteTitle((0, _i18n.getTranslation)("global.profiles.facilityProfile.main.cantDelete"));
          } else if ((0, _includes["default"])(data).call(data, "accessPoint")) {
            dispatch((0, _Actions2.openDialog)("facilityCannotDeleteDialog"));
            setFacilityDeleteTitle((0, _i18n.getTranslation)("global.profiles.facilityProfile.main.cantDeleteAccessPoint"));
          } else {
            dispatch((0, _Actions2.openDialog)("facilityDeleteDialog"));
          }
        })["catch"](function (error) {
          console.log("Error", error);
        });
      } else {
        dispatch((0, _Actions2.openDialog)("facilityDeleteDialog"));
      }
    };
    var actions = [];
    if (actionOptions) {
      (0, _forEach["default"])(actionOptions).call(actionOptions, function (action) {
        switch (action) {
          case "edit":
            if (canManageFacility) {
              actions.push({
                name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.edit"),
                nameText: "Edit",
                action: function action() {
                  return dispatch((0, _Actions4.setMapTools)({
                    type: "facility",
                    mode: "simple_select",
                    feature: {
                      id: id,
                      geometry: geometry,
                      properties: entityData.properties
                    }
                  }));
                }
              });
            }
            break;
          case "hide":
            actions.push({
              name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.hide"),
              nameText: "Hide",
              action: function action() {
                setHiding(true);
                dispatch(ignoreFacility(context.entity, appData));
              },
              debounce: hiding
            });
            break;
          case "delete":
            if (canManageFacility) {
              actions.push({
                name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.delete"),
                nameText: "Delete",
                action: function action() {
                  checkEntitiesOnFloorPlan();
                }
              });
            }
            break;
          default:
            break;
        }
      });
    }
    var widgets = getWidgetConfig(widgetState);
    var getSelectedFloorPlan = function getSelectedFloorPlan(floorPlan) {
      if (floorPlan && floorPlan.id) {
        _clientAppCore.accessPointService.getByDisplayTargetId(floorPlan.id, function (err, result) {
          if (err) {
            console.log("ERROR:", err);
          } else {
            setFloorPlanAccessPoints(result);
          }
        });
      } else {
        setFloorPlanAccessPoints(null);
      }
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0, _react.useEffect)(function () {
      if (selectedFloor) {
        getSelectedFloorPlan(selectedFloor);
      }
    }, [selectedFloor]);
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "cb-profile-wrapper",
      style: {
        height: "100%",
        overflow: "scroll"
      }
    }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_Widgets.SummaryWidget, {
      id: id,
      user: user,
      context: context,
      name: name,
      geometry: geometry,
      description: description,
      readOnly: readOnly,
      mapVisible: true,
      type: "Facility",
      actions: (0, _concat["default"])(_context9 = [{
        name: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.pinTo"),
        nameText: "Pin To",
        action: function action() {
          return dispatch((0, _Actions2.openDialog)("pinToDialog"));
        }
      }]).call(_context9, actions),
      dir: dir
    }), !state.scrolledUp && /*#__PURE__*/_react["default"].createElement("div", {
      className: "layout-control-button"
    }, /*#__PURE__*/_react["default"].createElement("a", {
      className: "cb-font-link",
      onClick: function onClick(e) {
        e.preventDefault();
        setState({
          layoutControlsOpen: true,
          anchorEl: e.currentTarget
        });
      }
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.facilityProfile.main.editProfileLayout"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "widgets-container",
      style: widgetsContainerStyle
    }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_LayoutControls["default"], {
      open: state.layoutControlsOpen,
      anchor: state.anchorEl,
      close: function close() {
        return setState({
          layoutControlsOpen: false
        });
      },
      widgetOrder: widgets,
      profile: "facility"
    })), getWidgetStatus("floorPlans", widgetState) && /*#__PURE__*/_react["default"].createElement(_Widgets.FloorPlanWidget, {
      floorPlans: floorPlans,
      handleSelect: selectFloorPlan,
      setFloorPlans: setFloorPlans,
      facilityFeedId: context.entity.feedId,
      facilityId: context.entity.id,
      clearFloorPlan: clearFloorPlan,
      removeFloorPlanCameraSub: _facilityProfileActions.removeFloorPlanCameraSub,
      removeFloorPlanAccessPointsSub: _facilityProfileActions.removeFloorPlanAccessPointsSub,
      startFloorPlanCameraStream: _Actions3.startFloorPlanCameraStream,
      startFloorPlanAccessPointsStream: _Actions3.startFloorPlanAccessPointsStream,
      cameras: getWidgetStatus("cameras", widgetState) && getWidgetStatus("cameras", widgetState).enabled,
      order: getWidgetStatus("floorPlans", widgetState).index,
      enabled: getWidgetStatus("floorPlans", widgetState).enabled,
      widgetsLaunchable: widgetsLaunchable,
      contextId: context.entity.id,
      getSelectedFloorPlan: getSelectedFloorPlan
    }), getWidgetStatus("activities", widgetState) && (activities || forReplay) && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.Activities, {
      key: "".concat(context.entity.id, "-activities"),
      entity: context.entity,
      order: getWidgetStatus("activities", widgetState).index,
      enabled: getWidgetStatus("activities", widgetState).enabled,
      selected: view === "Activity Timeline",
      canManage: hasAccess,
      pageSize: 5,
      selectWidget: selectWidget,
      activities: activities,
      fromOrg: fromOrg,
      fromEco: fromEco,
      activityFilters: activityFilters,
      widgetsExpandable: false,
      contextId: context.entity.id,
      unsubscribeFromFeed: _Actions3.unsubscribeFromFeed,
      subscriberRef: "profile",
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      dialog: dialog,
      isPrimary: isPrimary,
      userId: user.id,
      widgetsLaunchable: widgetsLaunchable,
      entityType: context.entity.entityType,
      readOnly: readOnly,
      forReplay: forReplay,
      endDate: endDate,
      timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
      dir: dir,
      locale: locale
    })), getWidgetStatus("files", widgetState) && attachments && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.FileWidget, {
      id: "files",
      order: getWidgetStatus("files", widgetState).index,
      enabled: getWidgetStatus("files", widgetState).enabled,
      selected: view === "Files",
      selectWidget: selectWidget,
      attachments: attachments,
      hasAccess: hasAccess,
      canDelete: canManageFacility,
      attachFiles: _facilityProfileActions.attachFilesToFacility,
      widgetsExpandable: false,
      entityType: "facility",
      unsubscribeFromFeed: _Actions3.unsubscribeFromFeed,
      subscriberRef: "profile",
      contextId: context.entity.id,
      isPrimary: isPrimary,
      widgetsLaunchable: widgetsLaunchable,
      dir: dir
    })), getWidgetStatus("cameras", widgetState) && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_CamerasWidget["default"], {
      key: "".concat(context.entity.id, "-cameras"),
      entityType: "floorplan",
      order: getWidgetStatus("cameras", widgetState).index,
      enabled: getWidgetStatus("cameras", widgetState).enabled,
      loadProfile: function loadProfile(entityId, entityName, entityType, profileRef) {
        return (0, _Actions.loadProfile)(entityId, entityName, entityType, profileRef, "secondary");
      }
      // unsubscribeFromFeed={unsubscribeFromFeed}
      ,
      subscriberRef: "profile",
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      sidebarOpen: sidebarOpen,
      dockedCameras: dockedCameras,
      addCameraToDockMode: _index2.addCameraToDockMode,
      setCameraPriority: _index2.setCameraPriority,
      disableSlew: true,
      readOnly: readOnly,
      contextId: context.entity.id,
      widgetsLaunchable: widgetsLaunchable,
      entity: _entity,
      user: user,
      removeDockedCamera: _index2.removeDockedCameraAndState,
      useCameraGeometry: true,
      cameras: cameras,
      geometry: geometry,
      dir: dir
    })), getWidgetStatus("accessPoints", widgetState) && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_AccessPointWidget["default"], {
      order: getWidgetStatus("accessPoints", widgetState).index,
      accessPoints: floorPlanAccessPoints,
      loadProfile: _Actions.loadProfile,
      enabled: getWidgetStatus("accessPoints", widgetState).enabled
    })), getWidgetStatus("facility-condition", widgetState) && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_Widgets.FacilityConditionWidget, {
      dir: dir,
      order: getWidgetStatus("facility-condition", widgetState).index,
      enabled: getWidgetStatus("facility-condition", widgetState).enabled,
      facilityId: facilityId,
      context: context.entity,
      locale: locale,
      initialDefaultPriority: defaultPriority,
      priorityOptions: priorityOptions
    })), /*#__PURE__*/_react["default"].createElement(_PinToDialog["default"], {
      open: dialog === "pinToDialog",
      close: function close() {
        return dispatch((0, _Actions2.closeDialog)("pinToDialog"));
      },
      entity: context.entity,
      addRemoveFromCollections: _cameraProfileActions.addRemoveFromCollections,
      addRemoveFromEvents: _cameraProfileActions.addRemoveFromEvents,
      canManageEvents: user.applications && (0, _find["default"])(_context10 = user.applications).call(_context10, function (app) {
        return app.appId === "events-app";
      }) && (0, _find["default"])(_context11 = user.applications).call(_context11, function (app) {
        return app.appId === "events-app";
      }).permissions && (0, _includes["default"])(_context12 = (0, _find["default"])(_context13 = user.applications).call(_context13, function (app) {
        return app.appId === "events-app";
      }).permissions).call(_context12, "manage"),
      canPinToCollections: user.applications && (0, _find["default"])(_context14 = user.applications).call(_context14, function (app) {
        return app.appId === "map-app";
      }) && (0, _find["default"])(_context15 = user.applications).call(_context15, function (app) {
        return app.appId === "map-app";
      }).permissions && (0, _includes["default"])(_context16 = (0, _find["default"])(_context17 = user.applications).call(_context17, function (app) {
        return app.appId === "map-app";
      }).permissions).call(_context16, "manage"),
      createCollection: _commonActions.createCollection,
      dialog: dialog,
      openDialog: _Actions2.openDialog,
      closeDialog: _Actions2.closeDialog,
      userId: user.id,
      dir: dir
    }), /*#__PURE__*/_react["default"].createElement(_index.Dialog, {
      open: dialog === "facilityDeleteDialog",
      confirm: {
        label: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.confirm"),
        action: handleConfirmDelete
      },
      abort: {
        label: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.cancel"),
        action: handleCloseDeleteDialog
      },
      title: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.confirmationText"),
      dir: dir
    }), /*#__PURE__*/_react["default"].createElement(_index.Dialog, {
      open: dialog === "facilityCannotDeleteDialog",
      abort: {
        label: (0, _i18n.getTranslation)("global.profiles.facilityProfile.main.close"),
        action: handleCloseCannotDeleteDialog
      },
      title: facilityDeleteTitle,
      dir: dir
    }))));
  } else {
    return /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, null);
  }
};
FacilityProfile.propTypes = propTypes;
FacilityProfile.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(FacilityProfile, function (prevProps, nextProps) {
  if (!(0, _reactFastCompare["default"])(prevProps, nextProps)) {
    return false;
  }
});
exports["default"] = _default;