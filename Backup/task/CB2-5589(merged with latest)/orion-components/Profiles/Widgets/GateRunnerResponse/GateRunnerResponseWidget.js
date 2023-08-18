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
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _reactRedux = require("react-redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _i18n = require("orion-components/i18n");
var _moment = _interopRequireDefault(require("moment"));
var _uniqBy = _interopRequireDefault(require("lodash/uniqBy"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _orderBy = _interopRequireDefault(require("lodash/orderBy"));
var _size = _interopRequireDefault(require("lodash/size"));
var _last = _interopRequireDefault(require("lodash/last"));
var _first = _interopRequireDefault(require("lodash/first"));
var _find = _interopRequireDefault(require("lodash/find"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _Actions = require("orion-components/GlobalData/Actions");
var _Actions2 = require("orion-components/ContextualData/Actions");
var _ActivityCard = _interopRequireDefault(require("./components/ActivityCard"));
var _ActivityHotList = _interopRequireDefault(require("./components/ActivityHotList"));
var _Timeline = _interopRequireDefault(require("./components/Timeline"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  dir: _propTypes["default"].string
};
var defaultProps = {
  dir: "ltr"
};
var filterOptions = {
  types: ["camera-detection", "manual-location", "unit-status-change"],
  "private": true
};
var collectionLocationType = {
  key: "interdictionPointCollection"
};
var GateRunnerResponseWidget = function GateRunnerResponseWidget(props) {
  var event = props.event,
    selectWidget = props.selectWidget,
    selected = props.selected,
    order = props.order,
    enabled = props.enabled,
    widgetsExpandable = props.widgetsExpandable,
    dir = props.dir,
    unsubscribeFromFeed = props.unsubscribeFromFeed,
    subscriberRef = props.subscriberRef,
    activities = props.activities;
  var dispatch = (0, _reactRedux.useDispatch)();
  var collections = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData.collections;
  });
  var applications = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile.applications;
  });
  var unitsApp = (0, _find["default"])(applications, {
    appId: "units-app"
  });
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    selectedDetection = _useState2[0],
    setSelectedDetection = _useState2[1];
  var _useState3 = (0, _react.useState)(activities || []),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    activitiesState = _useState4[0],
    setActivitiesState = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    filteredActivities = _useState6[0],
    setFilteredActivities = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    initialActivityDate = _useState8[0],
    setInitialActivityDate = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    recentActivityId = _useState10[0],
    setRecentActivityId = _useState10[1];
  var _useState11 = (0, _react.useState)([]),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    UnassignedFeeds = _useState12[0],
    setUnassignedFeeds = _useState12[1];
  var _useState13 = (0, _react.useState)([]),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    unitSettings = _useState14[0],
    setUnitSettings = _useState14[1];
  var _useState15 = (0, _react.useState)([]),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    cardCollection = _useState16[0],
    setCardCollection = _useState16[1];
  var _useState17 = (0, _react.useState)([]),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    collectionDetails = _useState18[0],
    setCollectionDetails = _useState18[1];
  var _useState19 = (0, _react.useState)(null),
    _useState20 = (0, _slicedToArray2["default"])(_useState19, 2),
    detections = _useState20[0],
    setDetections = _useState20[1];
  var state = {
    activitiesState: activitiesState,
    unitSettings: unitSettings,
    cardCollection: cardCollection,
    collectionDetails: collectionDetails
  };
  var selectedPlate = event.additionalProperties && event.additionalProperties.licensePlate;
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Gate Runner Response"));
  };
  var handleSelectDetection = function handleSelectDetection(detection) {
    var update = {
      additionalProperties: {
        licensePlate: detection.CarNumber,
        startTime: new Date(detection.CaptureDateTime).toISOString()
      }
    };
    _clientAppCore.eventService.updateEvent(event.id, update, function (err, response) {
      if (err) console.log(err, response);
    });
  };
  var getActivities = function getActivities() {
    var streamedActivities = activities ? activities : [];
    var sorted = (0, _sort["default"])(activitiesState).call(activitiesState, function (a, b) {
      return _moment["default"].utc(a.activityDate).diff(_moment["default"].utc(b.activityDate));
    });
    var date = sorted.length > 0 ? sorted[0].activityDate : new Date().toISOString();
    _clientAppCore.activityService.getActivitiesByEvent(event.id, 1000, date, filterOptions, function (err, res) {
      if (err) console.log(err);
      if (res) {
        if (res.length > 0) {
          var _context;
          setActivitiesState((0, _uniqBy["default"])((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(activitiesState), (0, _toConsumableArray2["default"])(streamedActivities), (0, _toConsumableArray2["default"])(res)), "id"));
        }
      }
    });
  };
  var getCollections = function getCollections() {
    _clientAppCore.unitService.getAppSettingsByKey("units-app", collectionLocationType.key, function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      } else {
        if (response.value) {
          var obj = {
            members: response.value
          };
          setCardCollection(obj);
        }
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
  var prevProps = usePrevious(props);
  var prevState = usePrevious(state);
  (0, _react.useEffect)(function () {
    if (prevProps) {
      if (!(0, _isEqual["default"])(activities, prevProps.activities)) {
        var _context2;
        setActivitiesState((0, _uniqBy["default"])((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(activitiesState), (0, _toConsumableArray2["default"])(activities)), "id"));
      }
    }
  }, [activities]);
  (0, _react.useEffect)(function () {
    if (selectedPlate) {
      getActivities();
    } else {
      _clientAppCore.brcService.getDetections(event.startDate, 60, function (err, response) {
        if (err) console.log("ERROR", err);
        if (!response) return;
        // if error returned will be undefined
        setDetections(response);
      });
    }
    getCollections();
    if ((0, _size["default"])(unitsApp)) {
      dispatch((0, _Actions.subscribeUnits)());
      dispatch((0, _Actions.subscribeUnitMembers)());
      _clientAppCore.unitService.getAppSettingsByKey("units-app", "unitMemberFeeds", function (err, response) {
        if (err) {
          console.log("ERROR:", err);
        } else {
          setUnitSettings(response);
        }
      });
    }
  }, []);
  (0, _react.useEffect)(function () {
    if (prevState) {
      if (!(0, _isEqual["default"])(activitiesState, prevState.activitiesState)) {
        var filtered = (0, _filter["default"])(activitiesState).call(activitiesState, function (activity) {
          var _context3;
          return (0, _includes["default"])(_context3 = filterOptions.types).call(_context3, activity.type);
        });
        var sortedActivities = (0, _size["default"])(filtered) && (0, _orderBy["default"])(filtered, ["activityDate"], ["desc"]);
        setFilteredActivities(sortedActivities);
        var firstActivity = (0, _last["default"])(sortedActivities);
        var recentActivity = (0, _first["default"])(sortedActivities);
        setInitialActivityDate(firstActivity && firstActivity.activityDate);
        setRecentActivityId(recentActivity && recentActivity.id);
        if (selectedPlate && firstActivity) {
          setSelectedDetection(firstActivity);
          dispatch((0, _Actions2.startAttachmentStream)(firstActivity.id, "profile"));
        }
      }
      if ((0, _size["default"])(unitSettings) && !(0, _isEqual["default"])(unitSettings, prevState.unitSettings)) {
        var value = unitSettings.value;
        if (value.length > 0) {
          setUnassignedFeeds(value);
        }
      }
      if (!(0, _isEmpty["default"])(cardCollection) && !(0, _isEqual["default"])(cardCollection, prevState.cardCollection)) {
        var entityDetails = [];
        var memberId = cardCollection.members;
        entityDetails.push(collections[memberId]);
        setCollectionDetails(entityDetails);
      }
    }
  }, [activitiesState, unitSettings, cardCollection, collectionDetails]);
  (0, _react.useEffect)(function () {
    if (selectedPlate) {
      dispatch((0, _Actions2.startGateRunnerActivityStream)(event.id, "event", filterOptions, subscriberRef));
    }
  }, [selectedPlate]);
  var styles = {
    label: {
      textTransform: "none"
    },
    cameraButton: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "lighten($darkGray, 2 %)"
    },
    widgetOptionButton: _objectSpread(_objectSpread({}, dir === "rtl" && {
      marginRight: "auto"
    }), dir === "ltr" && {
      marginLeft: "auto"
    }),
    widgetExpandButton: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    })
  };
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-wrapper collapsed ".concat("index-" + order, " "),
    style: {
      padding: 15
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2",
    style: {
      fontSize: 14
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.main.title"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, widgetsExpandable && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))))), selectedPlate ? /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      maxHeight: 540,
      overflowY: "scroll"
    }
  }, /*#__PURE__*/_react["default"].createElement(_ActivityCard["default"], {
    selectedDetection: selectedDetection,
    initialActivityDate: initialActivityDate,
    eventEndDate: event.endDate,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_Timeline["default"], {
    event: event,
    dir: dir,
    activities: filteredActivities,
    unsubscribeFromFeed: unsubscribeFromFeed,
    subscriberRef: subscriberRef,
    initialActivityDate: initialActivityDate,
    recentActivityId: recentActivityId,
    feedSettings: UnassignedFeeds,
    unitsApp: unitsApp
  })) : /*#__PURE__*/_react["default"].createElement(_ActivityHotList["default"], {
    detections: detections,
    handleSelectDetection: handleSelectDetection,
    dir: dir
  }));
};
GateRunnerResponseWidget.propTypes = propTypes;
GateRunnerResponseWidget.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(GateRunnerResponseWidget);
exports["default"] = _default;