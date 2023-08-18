"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Icons = require("orion-components/CBComponents/Icons");
var _SharedComponents = require("orion-components/SharedComponents");
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _mdiMaterialUi = require("mdi-material-ui");
var _clientAppCore = require("client-app-core");
var _index = require("../Widgets/index");
var _reactMeasure = _interopRequireDefault(require("react-measure"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/ContextualData/Selectors");
var _Selectors2 = require("orion-components/GlobalData/Selectors");
var _Selectors3 = require("orion-components/AppState/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var actionCreators = _interopRequireWildcard(require("./actions"));
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _isArray = _interopRequireDefault(require("lodash/isArray"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  tabs: {
    justifyContent: "space-between",
    color: "#B5B9BE",
    padding: "0px 12px"
  },
  tab: {
    minWidth: 0,
    "&:hover": {
      color: "#FFF"
    }
  },
  selected: {
    color: "#FFF",
    opacity: 1
  },
  button: {
    textTransform: "none"
  }
};
var propTypes = {
  addCameraToDockMode: _propTypes["default"].func,
  classes: _propTypes["default"].object.isRequired,
  closeAlertProfile: _propTypes["default"].func,
  closeNotification: _propTypes["default"].func.isRequired,
  context: _propTypes["default"].object,
  dockedCameras: _propTypes["default"].array,
  expanded: _propTypes["default"].bool,
  getActivityDetails: _propTypes["default"].func,
  handleExpand: _propTypes["default"].func,
  loadProfile: _propTypes["default"].func,
  measure: _propTypes["default"].func,
  notification: _propTypes["default"].object.isRequired,
  openAlertProfile: _propTypes["default"].func,
  reopenNotification: _propTypes["default"].func.isRequired,
  unsubscribeFromFeed: _propTypes["default"].func,
  userFeeds: _propTypes["default"].array,
  timeFormat: _propTypes["default"].string,
  dir: _propTypes["default"].string,
  locale: _propTypes["default"].string,
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  addCameraToDockMode: function addCameraToDockMode() {},
  closeAlertProfile: function closeAlertProfile() {},
  context: null,
  dockedCameras: [],
  expanded: false,
  getActivityDetails: function getActivityDetails() {},
  handleExpand: function handleExpand() {},
  loadProfile: function loadProfile() {},
  measure: function measure() {},
  openAlertProfile: function openAlertProfile() {},
  unsubscribeFromFeed: function unsubscribeFromFeed() {},
  userFeeds: [],
  timeFormat: "12-hour",
  dir: "ltr",
  locale: "en",
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var AlertProfile = function AlertProfile(props) {
  var _context4;
  var dispatch = (0, _reactRedux.useDispatch)();
  var measure = props.measure,
    removeDockedCameraAndState = props.removeDockedCameraAndState,
    readOnly = props.readOnly,
    endDate = props.endDate,
    selectFloorPlanOn = props.selectFloorPlanOn,
    floorPlansWithFacilityFeed = props.floorPlansWithFacilityFeed,
    classes = props.classes;
  var unsubscribeFromFeed = actionCreators.unsubscribeFromFeed,
    openAlertProfile = actionCreators.openAlertProfile,
    forReplay = actionCreators.forReplay,
    closeAlertProfile = actionCreators.closeAlertProfile,
    closeNotification = actionCreators.closeNotification,
    reopenNotification = actionCreators.reopenNotification,
    addCameraToDockMode = actionCreators.addCameraToDockMode,
    loadProfile = actionCreators.loadProfile,
    openDialog = actionCreators.openDialog,
    closeDialog = actionCreators.closeDialog,
    setCameraPriority = actionCreators.setCameraPriority,
    addSpotlight = actionCreators.addSpotlight;
  var session = (0, _reactRedux.useSelector)(function (state) {
    return state.session;
  });
  var appState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState;
  });
  var spotlights = (0, _reactRedux.useSelector)(function (state) {
    return state.spotlights;
  });
  var id = props.id,
    activityId = props.activityId;
  var user = session.user.profile;
  var expandedAlert = appState.dock.dockData.expandedAlert;
  var userFeeds = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.userFeedsSelector)(state);
  });
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.contextById)(activityId)(state);
  });
  var notificationByID = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.notificationById)(id)(state) || {};
  });
  var dockedCameras = appState.dock.cameraDock.dockedCameras;
  var dialog = appState.dialog.openDialog;
  var _appState$global = appState.global,
    spotlightProximity = _appState$global.spotlightProximity,
    timeFormat = _appState$global.timeFormat;
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return state.appId;
  });
  var expanded = Boolean(id === expandedAlert);
  var notification = props.notification ? props.notification : notificationByID;
  var fullscreenCamera = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors3.fullscreenCameraOpen)(state);
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var _useState = (0, _react.useState)(0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    tab = _useState2[0],
    setTab = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    eventEnabled = _useState4[0],
    setEventEnabled = _useState4[1];
  var inlineStyles = {
    escalate: _objectSpread(_objectSpread({
      color: "#4eb5f3",
      cursor: "pointer",
      fontSize: "14px"
    }, dir === "ltr" && {
      paddingRight: "12px"
    }), dir === "rtl" && {
      paddingLeft: "12px"
    })
  };
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevExpanded = usePrevious(expanded);
  (0, _react.useEffect)(function () {
    if (prevExpanded && !expanded) {
      handleCollapse();
    }
    measure();
  }, [expanded]);
  (0, _react.useEffect)(function () {
    return function () {
      handleCollapse();
    };
  }, []);
  var handleUnsubscribe = function handleUnsubscribe() {
    if (context) {
      var _context;
      var subscriptions = context.subscriptions,
        entity = context.entity;
      var _id = entity.id;
      (0, _forEach["default"])(_context = (0, _keys["default"])(subscriptions)).call(_context, function (subscription) {
        return dispatch(unsubscribeFromFeed(_id, subscription, "dock"));
      });
    }
  };
  var handleChangeTab = function handleChangeTab(event, tab) {
    setTab(tab);
    if (!context || !context.entity || !context.camerasInRange || !context.attachments || !context.activities) {
      dispatch(openAlertProfile(notification, forReplay));
    }
  };
  var handleCreateEscalate = function handleCreateEscalate(callback) {
    var event = {
      name: notification.summary,
      startDate: notification.createdDate,
      id: notification.id
    };
    var body = (0, _stringify["default"])(event);
    _clientAppCore.eventService.escalateEvent(body, callback);
  };
  var handleEventEscalate = function handleEventEscalate() {
    handleCreateEscalate(function (err, res) {
      if (err) {
        console.log(err);
      } else {
        dispatch(loadProfile(res.id, res.name, res.entityType, "profile"));
      }
    });
  };
  var handleEnableEvent = function handleEnableEvent() {
    _clientAppCore.eventService.enableEvent(notification.object.id, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        setEventEnabled(true);
      }
    });
  };
  var handleCollapse = function handleCollapse() {
    var activityId = notification.activityId;
    setTab(0);
    handleUnsubscribe();
    if (context && expanded) {
      dispatch(closeAlertProfile(activityId));
    }
  };
  var handleClose = function handleClose() {
    var closed = notification.closed,
      id = notification.id;
    closed ? dispatch(reopenNotification(notification)) : dispatch(closeNotification(id));
    measure();
  };
  var renderTabs = function renderTabs() {
    var _context2, _context3;
    var entity = context.entity,
      camerasInRange = context.camerasInRange,
      attachments = context.attachments,
      activities = context.activities;
    var id = entity.id,
      contextEntities = entity.contextEntities,
      geometry = entity.geometry;
    var cameraList = (0, _uniq["default"])((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])((0, _isArray["default"])(camerasInRange) && camerasInRange || []), (0, _toConsumableArray2["default"])((0, _filter["default"])(_context3 = (0, _isArray["default"])(contextEntities) && contextEntities || []).call(_context3, function (ent) {
      return ent.entityType === "camera";
    }))));
    return /*#__PURE__*/_react["default"].createElement(_material.CardContent, {
      style: {
        padding: 0
      }
    }, tab === 0 && /*#__PURE__*/_react["default"].createElement(_index.FileWidget, {
      attachments: attachments,
      contextId: id,
      enabled: true,
      readOnly: readOnly,
      subscriberRef: "dock",
      isAlertProfile: true,
      dir: dir
    }), tab === 1 && /*#__PURE__*/_react["default"].createElement(_index.CameraWidget, {
      addCameraToDockMode: addCameraToDockMode,
      cameras: cameraList,
      contextId: id,
      dockedCameras: dockedCameras,
      entityType: "activity",
      geometry: geometry,
      enabled: true,
      loadProfile: loadProfile,
      readOnly: readOnly,
      subscriberRef: "dock",
      dialog: dialog,
      openDialog: openDialog,
      closeDialog: closeDialog,
      setCameraPriority: setCameraPriority,
      fullscreenCamera: fullscreenCamera,
      user: user,
      disableSlew: !geometry,
      disableLock: true,
      removeDockedCamera: removeDockedCameraAndState,
      isAlertProfile: true,
      dir: dir,
      selectFloorPlanOn: selectFloorPlanOn,
      floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
    }), tab === 2 && /*#__PURE__*/_react["default"].createElement(_index.PinnedItemsWidget, {
      contextId: id,
      event: entity,
      items: contextEntities,
      feeds: userFeeds,
      enabled: true,
      loadProfile: loadProfile,
      readOnly: readOnly,
      subscriberRef: "dock",
      isAlertProfile: true,
      dir: dir
    }), tab === 3 && /*#__PURE__*/_react["default"].createElement(_index.Activities, {
      contextId: entity.activityId ? entity.activityId : id,
      entity: {
        entityType: "activity"
      },
      activities: activities,
      enabled: true,
      subscriberRef: "dock",
      userId: user.id,
      readOnly: readOnly,
      isAlertProfile: true,
      forReplay: forReplay,
      endDate: endDate,
      timeFormatPreference: timeFormat ? timeFormat : "12-hour",
      dir: dir,
      locale: locale
    }));
  };
  var summary = notification.summary,
    activityDate = notification.activityDate,
    createdDate = notification.createdDate,
    isPriority = notification.isPriority,
    geometry = notification.geometry,
    closed = notification.closed,
    target = notification.target,
    object = notification.object;
  var button = classes.button,
    tabs = classes.tabs,
    selected = classes.selected;
  var spotlightsEnabled = !!spotlights && (0, _filter["default"])(_context4 = (0, _values["default"])(spotlights)).call(_context4, function (s) {
    return !!s;
  }).length < 3;

  // -- build out appropriate spotlight target
  var spotlightGeo = null;
  if (target && target.entity && target.entity.entityType === "camera") {
    spotlightGeo = target.entity.spotlightShape ? target.entity.spotlightShape : target.entity.entityData;
    spotlightGeo.spotlightProximity = spotlightProximity;
  } else if (object && object.entity && object.entity.entityType === "camera") {
    spotlightGeo = object.entity.spotlightShape ? object.entity.spotlightShape : object.entity.entityData;
    spotlightGeo.spotlightProximity = spotlightProximity;
  } else {
    spotlightGeo = geometry ? {
      geometry: geometry
    } : target && target.entity && target.entity.entityData ? target.entity.entityData : object && object.entity && object.entity.entityData ? object.entity.entityData : null;
  }
  var isEvent = object && object.entity && object.entity.entityType === "event";
  var canEnableEvent = isEvent && !eventEnabled && object.entity.disabled === true;
  return /*#__PURE__*/_react["default"].createElement(_reactMeasure["default"], {
    bounds: true,
    onResize: measure
  }, function (_ref) {
    var measureRef = _ref.measureRef;
    return /*#__PURE__*/_react["default"].createElement("div", {
      ref: measureRef
    }, /*#__PURE__*/_react["default"].createElement(_material.Card, {
      style: {
        marginBottom: 12,
        borderRadius: 5
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.CardHeader, {
      sx: {
        backgroundColor: "#494D53",
        color: "#fff"
      },
      avatar: /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          alignItems: "center"
        }
      }, geometry ? /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
        geometry: geometry
      }) : null, isPriority ? /*#__PURE__*/_react["default"].createElement(_Icons.Alert, {
        fontSize: "large",
        iconWidth: "37px",
        iconHeight: "37px"
      }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Info, {
        fontSize: "large",
        style: {
          opacity: 0.3
        }
      })),
      title: summary,
      titleTypographyProps: {
        style: {
          lineHeight: "1.25em",
          fontSize: "14px"
        }
      },
      subheader: /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        style: {
          fontSize: "12px"
        },
        color: "#82878C"
      }, _clientAppCore.timeConversion.convertToUserTime(activityDate || createdDate, "full_".concat(timeFormat))), !closed && spotlightGeo && !!spotlights && /*#__PURE__*/_react["default"].createElement(_material.Tooltip, {
        disableFocusListener: spotlightsEnabled,
        disableHoverListener: spotlightsEnabled,
        disableTouchListener: spotlightsEnabled,
        title: (0, _i18n.getTranslation)("global.profiles.alertProfile.activeSpotlightsTxt"),
        placement: "bottom-start"
      }, /*#__PURE__*/_react["default"].createElement(_material.Link, {
        onClick: function onClick() {
          return dispatch(addSpotlight(spotlightGeo));
        },
        underline: "none",
        component: spotlightsEnabled ? "a" : "p",
        color: "textSecondary",
        style: {
          color: spotlightsEnabled ? "#4eb5f3" : "",
          display: !spotlightsEnabled ? "inline-block" : "",
          paddingRight: "12px",
          fontSize: "14px"
        }
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.profiles.alertProfile.spotlight"
      }))), /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !closed && (appId === "map-app" || appId === "mpo-app") && !readOnly && !isEvent && /*#__PURE__*/_react["default"].createElement(_material.Link, {
        onClick: function onClick() {
          return handleEventEscalate();
        },
        underline: "none",
        color: "textSecondary",
        style: inlineStyles.escalate
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.profiles.alertProfile.escalate"
      }))), /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !closed && (appId === "map-app" || appId === "events-app") && !readOnly && canEnableEvent && /*#__PURE__*/_react["default"].createElement(_material.Link, {
        onClick: function onClick() {
          return handleEnableEvent();
        },
        variant: "body1",
        underline: "none",
        color: "textSecondary",
        style: inlineStyles.escalate
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.profiles.alertProfile.escalate"
      })))),
      subheaderTypographyProps: {
        component: "div",
        styles: {
          color: "#fff"
        }
      },
      action: !readOnly ? closed ? /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        style: {
          opacity: 1,
          color: "#B5B9BE"
        },
        onClick: handleClose
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Undo, {
        fontSize: "small"
      })) : /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        style: {
          opacity: 1,
          color: "#B5B9BE"
        },
        onClick: handleClose
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, {
        fontSize: "small"
      })) : null
    }), !closed && /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        backgroundColor: "#3D3F42"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.CardContent, {
      style: {
        padding: 0
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Tabs, {
      value: expanded ? tab : false,
      classes: {
        flexContainer: tabs
      },
      onChange: handleChangeTab,
      TabIndicatorProps: {
        style: {
          display: "none"
        }
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Tab, {
      classes: {
        root: classes.tab,
        selected: selected
      },
      icon: /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.TooltipImage, {
        className: "alertProfileTabIcons"
      })
    }), /*#__PURE__*/_react["default"].createElement(_material.Tab, {
      classes: {
        root: classes.tab,
        selected: selected
      },
      icon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Videocam, {
        className: "alertProfileTabIcons"
      })
    }), /*#__PURE__*/_react["default"].createElement(_material.Tab, {
      classes: {
        root: classes.tab,
        selected: selected
      },
      icon: /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.Pin, {
        className: "alertProfileTabIcons"
      })
    }), /*#__PURE__*/_react["default"].createElement(_material.Tab, {
      classes: {
        root: classes.tab,
        selected: selected
      },
      icon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ChatBubble, {
        className: "alertProfileTabIcons"
      })
    }))), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
      "in": tab !== false && expanded,
      unmountOnExit: true
    }, context && context.entity && renderTabs(), /*#__PURE__*/_react["default"].createElement(_material.CardActions, null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      fullWidth: true,
      color: "primary",
      classes: {
        root: button
      },
      onClick: handleCollapse
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.alertProfile.close"
    })))))));
  });
};
AlertProfile.propTypes = propTypes;
AlertProfile.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(AlertProfile);
exports["default"] = _default;