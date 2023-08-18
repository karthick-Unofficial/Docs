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
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Apm = require("../../../Apm");
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _CBComponents = require("orion-components/CBComponents");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _Settings = _interopRequireDefault(require("@mui/icons-material/Settings"));
var _Activity = _interopRequireDefault(require("./components/Activity"));
var _moment = _interopRequireDefault(require("moment"));
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _styles = require("@mui/styles");
var _uniqBy = _interopRequireDefault(require("lodash/uniqBy"));
var _intersection = _interopRequireDefault(require("lodash/intersection"));
var _difference = _interopRequireDefault(require("lodash/difference"));
var _commonActions = require("orion-components/SharedActions/commonActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context6, _context7; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context6 = ownKeys(Object(source), !0)).call(_context6, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context7 = ownKeys(Object(source))).call(_context7, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  locale: _propTypes["default"].string
};
var defaultProps = {
  locale: "en"
};
var useStyles = (0, _styles.makeStyles)({
  input: {
    color: "#fff",
    fontSize: "0.75rem",
    "&::placeholder": {
      opacity: "0.7"
    }
  }
});
var Activities = function Activities(props) {
  var _context5;
  var activityFilters = props.activityFilters,
    activities = props.activities,
    contextId = props.contextId,
    unsubscribeFromFeed = props.unsubscribeFromFeed,
    subscriberRef = props.subscriberRef,
    isPrimary = props.isPrimary,
    selectWidget = props.selectWidget,
    entityType = props.entityType,
    entity = props.entity,
    forReplay = props.forReplay,
    endDate = props.endDate,
    locale = props.locale,
    canManage = props.canManage,
    selected = props.selected,
    order = props.order,
    enabled = props.enabled,
    widgetsExpandable = props.widgetsExpandable,
    widgetsLaunchable = props.widgetsLaunchable,
    dialog = props.dialog,
    readOnly = props.readOnly,
    isAlertProfile = props.isAlertProfile,
    timeFormatPreference = props.timeFormatPreference,
    dir = props.dir,
    openDialog = props.openDialog,
    closeDialog = props.closeDialog,
    displayType = props.displayType;
  var dispatch = (0, _reactRedux.useDispatch)();
  var classes = useStyles();
  var app = (0, _reactRedux.useSelector)(function (state) {
    return state.appId || state.clientConfig.app;
  });
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    comment = _useState2[0],
    setComment = _useState2[1];
  var _useState3 = (0, _react.useState)(activityFilters),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    filters = _useState4[0],
    setFilters = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var _useState7 = (0, _react.useState)(1),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    page = _useState8[0],
    setPage = _useState8[1];
  var _useState9 = (0, _react.useState)(activities || []),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    activitiesState = _useState10[0],
    setActivitiesState = _useState10[1];
  var _useState11 = (0, _react.useState)(true),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    loadMore = _useState12[0],
    setLoadMore = _useState12[1];
  var inlineStyles = {
    widgetExpandButton: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "ltr" && {
      paddingRight: 0
    }), dir === "rtl" && {
      paddingLeft: 0
    })
  };
  (0, _react.useEffect)(function () {
    getActivities();
  }, []);
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    if (prevProps) {
      if (!(0, _reactFastCompare["default"])(activities, prevProps.activities)) {
        var _context;
        setActivitiesState((0, _uniqBy["default"])((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(activitiesState), (0, _toConsumableArray2["default"])(activities)), "id"));
      }
    }
  }, [activities]);
  (0, _react.useEffect)(function () {
    return function () {
      if (!isPrimary && unsubscribeFromFeed) dispatch(unsubscribeFromFeed(contextId, "activities", subscriberRef));
    };
  }, []);

  // selectWidget
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Activity Timeline"));
  };
  var handleLaunch = function handleLaunch() {
    // -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
    if (entityType === "event") {
      window.open("/events-app/#/entity/".concat(contextId, "/widget/activity-timeline"));
    } else if (entityType === "camera") {
      window.open("/cameras-app/#/entity/".concat(contextId, "/widget/activity-timeline"));
    } else if (entityType === "facility") {
      window.open("/facilities-app/#/entity/".concat(contextId));
    }
  };
  var handleChange = function handleChange(event) {
    if (event.target.value.length > 280) {
      setError((0, _i18n.getTranslation)("global.profiles.widgets.activities.main.errorText.commentsTxt"));
      return;
    }
    setComment(event.target.value);
    setError("");
  };
  var handleAddComment = function handleAddComment() {
    //const { entityType } = entity;
    var EntityType = entity.entityType;
    // If not an event, use generic add comment,
    if (EntityType !== "event") _clientAppCore.activityService.comment(contextId, EntityType, comment);
    // Otherwise, use event-specific add comment (events work differently than entities)
    else {
      _clientAppCore.eventService.addComment(contextId, comment, function (err, res) {
        if (err) {
          console.log(err, res);
        } else {
          // Update event's 'lastModified' property
          _clientAppCore.eventService.mockUpdateEvent(contextId, function (err, response) {
            if (err) {
              console.log(err, response);
            }
          });
        }
      });
    }
    setComment("");
    setError("");
  };
  var handleUpdateFilter = function handleUpdateFilter(values) {
    var newFilters = filters ? (0, _toConsumableArray2["default"])(filters) : [];
    if ((0, _intersection["default"])(newFilters, values).length > 0) {
      newFilters = (0, _difference["default"])(newFilters, values);
    } else {
      var _context2;
      newFilters = (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(newFilters), (0, _toConsumableArray2["default"])(values));
    }
    // if (expanded) {
    // 	updateActivityFilters({ activityFilters: newFilters });
    // }
    setFilters(newFilters);
  };
  var handleCancelFilter = function handleCancelFilter() {
    setFilters(activityFilters || []);
    closeFilterDialog();
  };
  var handleSaveFilter = function handleSaveFilter() {
    dispatch((0, _commonActions.updateActivityFilters)(app, {
      activityFilters: filters
    }));
    closeFilterDialog();
  };
  var getActivities = function getActivities() {
    var EntityType = entity.entityType;
    var streamedActivities = !forReplay && activities ? activities : [];
    var sorted = (0, _sort["default"])(activitiesState).call(activitiesState, function (a, b) {
      return _moment["default"].utc(a.published).diff(_moment["default"].utc(b.published));
    });
    var initial = forReplay ? endDate : new Date().toISOString();
    var date = sorted.length > 0 ? sorted[0].published : initial;
    EntityType === "event" ? _clientAppCore.activityService.getActivitiesByEvent(contextId,
    //eventId
    5,
    //pageSize
    date,
    //fromDate
    null, function (err, res) {
      if (err) console.log(err);
      if (res) {
        // If there are new activities after attempting to load more
        if (res.length > 0) {
          var _context3;
          setActivitiesState((0, _uniqBy["default"])((0, _concat["default"])(_context3 = []).call(_context3, (0, _toConsumableArray2["default"])(activitiesState), (0, _toConsumableArray2["default"])(streamedActivities), (0, _toConsumableArray2["default"])(res)), "id"));
        }
        // If it's the end of activities
        if (res.length < 5) {
          setLoadMore(false);
        }
      }
    }) : _clientAppCore.activityService.getActivitiesByEntity(EntityType,
    //entityType
    contextId,
    //Id
    5,
    //pageSize
    date,
    //fromDate
    null, function (err, res) {
      if (err) console.log(err);
      if (res) {
        // If there are new activities after attempting to load more
        if (res.length > 0) {
          var _context4;
          setActivitiesState((0, _uniqBy["default"])((0, _concat["default"])(_context4 = []).call(_context4, (0, _toConsumableArray2["default"])(activitiesState), (0, _toConsumableArray2["default"])(streamedActivities), (0, _toConsumableArray2["default"])(res)), "id"));
        }
        // If it's the end of activities
        if (res.length < 5) {
          setLoadMore(false);
        }
      }
    });
  };

  // This will load the first 5 activities older than the oldest visible activity
  var handleNextPage = function handleNextPage() {
    getActivities();
    setPage(page + 1);
  };
  var closeFilterDialog = function closeFilterDialog() {
    dispatch(closeDialog("activityFilterDialog"));
  };
  var openFilterDialog = function openFilterDialog() {
    dispatch(openDialog("activityFilterDialog"));
  };
  var capitalizeFirstLetter = function capitalizeFirstLetter(string) {
    if (locale === "en") {
      return string.charAt(0).toUpperCase() + (0, _slice["default"])(string).call(string, 1);
    } else if (locale === "ar") {
      switch (string) {
        case "camera":
          {
            return (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.camera");
          }
        case "event":
          {
            return (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.event");
          }
        case "shapes":
          {
            return (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.shapes");
          }
        case "accessPoint":
          {
            return (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.accessPoints");
          }
        default:
          return string;
      }
    }
  };
  var owner = entity.owner;
  var EntityType = entity.entityType;
  var disabledStyle = {
    button: {
      width: "100%",
      minWidth: 0,
      height: 50,
      margin: ".75rem 0",
      borderRadius: 5,
      backgroundColor: "#6C6C6E",
      padding: "0 9px",
      color: "#fff"
    },
    buttonBorder: {
      borderRadius: 5,
      backgroundColor: "#6C6C6E"
    },
    buttonLabel: {
      width: "100%",
      paddingLeft: 9,
      paddingRight: 9,
      textTransform: "none",
      color: "#ffffff"
    }
  };
  var inputStyle = {
    field: {
      fontSize: ".75rem",
      border: "1px solid #828283",
      padding: "10px 10px 0",
      margin: ".75rem 0",
      width: "100%",
      backgroundColor: "#1F1F21",
      color: "#fff",
      minHeight: "72px"
    },
    button: {
      width: "100%",
      minWidth: 0,
      height: 50,
      margin: ".75rem 0",
      borderRadius: 5,
      color: "#fff",
      padding: "0 9px"
    },
    buttonBorder: {
      borderRadius: 5
    },
    buttonLabel: {
      width: "100%",
      paddingLeft: 9,
      paddingRight: 9,
      textTransform: "none"
    }
  };
  var filterActions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "cancel-action-button",
    variant: "text",
    style: {
      color: "#fff"
    },
    color: "primary",
    onClick: handleCancelFilter
  }, (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "confirm-action-button",
    variant: "text",
    style: {
      color: "#fff"
    },
    color: "primary",
    onClick: handleSaveFilter
  }, (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.confirm"))];
  var activityDialogActions = function activityDialogActions() {
    return /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, filterActions);
  };
  // activities don't have the usual properties that allow for ownership checking, but if a user has access to an activity, it's safe to assume they have the proper access to comment
  var canComment = !readOnly && (!owner && EntityType === "activity" ? true : canManage);
  /**
   * This is a quick fix til activity filtering becomes more robust.
   * If there are no filters, or the length of this filters is greater than 1,
   * i.e. the filter does not just include "comment", show all activities
   */
  var filteredActivities = activitiesState;
  if (activityFilters) {
    var showUpdates = activityFilters.length > 1;
    var showComments = (0, _includes["default"])(activityFilters).call(activityFilters, "comment");
    filteredActivities = !activityFilters.length || showUpdates && showComments ? activitiesState : showComments ? (0, _filter["default"])(activitiesState).call(activitiesState, function (activity) {
      return activity.type === "comment";
    }) : (0, _filter["default"])(activitiesState).call(activitiesState, function (activity) {
      return activity.type !== "comment";
    });
  }
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "collapsed ".concat("index-" + order)
  }, !isAlertProfile || canComment ? /*#__PURE__*/_react["default"].createElement("div", {
    id: "activity-wrapper",
    className: "widget-wrapper"
  }, !isAlertProfile && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.activities.main.activityTimeline"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    id: "activity-filter-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: openFilterDialog
  }, /*#__PURE__*/_react["default"].createElement(_Settings["default"], {
    color: "#828283"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, widgetsExpandable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: inlineStyles.widgetExpandButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))) : null, widgetsLaunchable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: inlineStyles.widgetExpandButton,
    onClick: handleLaunch
  }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null))) : null)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, canComment && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    id: "comment-field-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "comment-input-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "comment-field",
    placeholder: (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.postToTimeline"),
    style: _objectSpread(_objectSpread({}, inputStyle.field), {}, {
      direction: dir
    }),
    multiline: true,
    fullWidth: true,
    value: comment,
    onChange: handleChange,
    error: !!error,
    helperText: error,
    variant: "standard",
    InputProps: {
      style: {
        padding: 0,
        letterSpacing: "unset"
      },
      classes: {
        input: classes.input
      },
      disableUnderline: true
    },
    FormHelperTextProps: {
      style: {
        fontSize: 12,
        letterSpacing: "unset",
        lineHeight: "unset"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    id: "comment-post-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    disabled: (0, _trim["default"])(comment).call(comment) ? false : true,
    variant: "contained",
    style: (0, _trim["default"])(comment).call(comment) ? inputStyle.button : disabledStyle.button,
    onClick: handleAddComment
  }, (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.post")))))), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: dialog === "activityFilterDialog" ? true : false,
    actions: true,
    DialogActionsFunction: activityDialogActions,
    dialogContentStyles: {
      maxWidth: 500,
      padding: "20px",
      width: "500px"
    }
  }, /*#__PURE__*/_react["default"].createElement("p", {
    className: "dialog-text",
    style: {
      color: "#ABABAC"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.activities.main.activityTimelineFilters"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    id: "activity-filter-dialog",
    style: {
      display: "inline-grid"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      checked: filters && (0, _includes["default"])(filters).call(filters, "comment"),
      onChange: function onChange() {
        return handleUpdateFilter(["comment"]);
      }
    }),
    style: {
      color: "#7E7F7F"
    },
    label: (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.postedMessages")
  }), /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    style: {
      color: "#7E7F7F"
    },
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      checked: filters && (0, _includes["default"])(filters).call(filters, "updated"),
      onChange: function onChange() {
        return handleUpdateFilter(["updated", "created", "pinned", "exit", "enter"]);
      }
    }),
    label: (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.updates", displayType ? displayType : capitalizeFirstLetter(EntityType))
  }))))) : /*#__PURE__*/_react["default"].createElement(_material.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    className: "activity-list-wrapper"
  }, filteredActivities.length > 0 ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, (0, _map["default"])(_context5 = (0, _sort["default"])(filteredActivities).call(filteredActivities, function (a, b) {
    return _moment["default"].utc(b.published) - _moment["default"].utc(a.published);
  })).call(_context5, function (activity) {
    return /*#__PURE__*/_react["default"].createElement(_Activity["default"], {
      key: activity.id,
      activity: activity,
      forReplay: forReplay,
      timeFormatPreference: timeFormatPreference,
      dir: dir,
      locale: locale
    });
  }), loadMore && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    style: {
      color: "#fff"
    },
    color: "primary",
    onClick: handleNextPage,
    key: "load-more-activities-button"
  }, (0, _i18n.getTranslation)("global.profiles.widgets.activities.main.loadMore"))) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: 12,
      color: "#fff"
    },
    component: "p",
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.activities.main.noActivities"
  }))));
};
Activities.propTypes = propTypes;
Activities.defaultProps = defaultProps;
var _default = (0, _Apm.withSpan)("activities-widget", "profile-widget")(Activities);
exports["default"] = _default;