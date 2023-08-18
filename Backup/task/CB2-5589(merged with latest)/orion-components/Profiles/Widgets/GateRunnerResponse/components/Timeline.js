"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _size = _interopRequireDefault(require("lodash/size"));
var _unionBy = _interopRequireDefault(require("lodash/unionBy"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _Actions = require("orion-components/ContextualData/Actions");
var _reactRedux = require("react-redux");
var _clientAppCore = require("client-app-core");
var _Selectors = require("orion-components/AppState/Selectors");
var _Selectors2 = require("orion-components/ContextualData/Selectors");
var _selectors = require("orion-components/GlobalData/Units/selectors");
var _Actions2 = require("orion-components/GlobalData/Actions");
var _TimelineCard = _interopRequireDefault(require("./TimelineCard"));
var _Icons = require("../Icons");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  dir: _propTypes["default"].string
};
var defaultProps = {
  dir: "ltr"
};
var Timeline = function Timeline(props) {
  var _context2, _context3;
  var event = props.event,
    dir = props.dir,
    activities = props.activities,
    unsubscribeFromFeed = props.unsubscribeFromFeed,
    subscriberRef = props.subscriberRef,
    initialActivityDate = props.initialActivityDate,
    recentActivityId = props.recentActivityId,
    feedSettings = props.feedSettings,
    unitsApp = props.unitsApp;
  var id = event.id;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    recommendedUnit = _useState4[0],
    setRecommendedUnit = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    mapSelectionMode = _useState6[0],
    setMapSelectionMode = _useState6[1];
  var _useState7 = (0, _react.useState)([]),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    recommendations = _useState8[0],
    setRecommendations = _useState8[1];
  var mapSelectionRef = (0, _react.useRef)(mapSelectionMode);
  var activityId = open;
  var attachments = [];
  var map = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapObject)(state);
  });
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.contextById)(activityId)(state);
  });
  var units = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selectors.getAllUnits)(state);
  });
  if (context) {
    attachments = context.attachments;
  }
  var handleCardExpand = function handleCardExpand(id) {
    if (open === id) {
      setOpen(null);
    } else {
      setOpen(id);
      setRecommendedUnit([]);
      setRecommendations([]);
      dispatch((0, _Actions.startAttachmentStream)(id, "profile"));
      if ((0, _size["default"])(unitsApp)) streamRecommendations(id);
    }
  };
  var handleCardCollapse = function handleCardCollapse() {
    setOpen(null);
    setRecommendedUnit([]);
    setRecommendations([]);
  };
  var toggleMapSelection = function toggleMapSelection() {
    setMapSelectionMode(!mapSelectionMode);
    mapSelectionRef.current = !mapSelectionMode;
  };
  var streamRecommendations = function streamRecommendations(activityId) {
    _clientAppCore.brcService.streamRecommendations(activityId, function (err, response) {
      if (err) console.log(err);
      if (response) {
        switch (response.type) {
          case "initial":
          case "add":
            setRecommendations([response.new_val]);
            break;
          default:
            break;
        }
      }
    });
  };
  var handleUnsubscribe = function handleUnsubscribe() {
    if (context && activityId) {
      var _context;
      var subscriptions = context.subscriptions;
      (0, _forEach["default"])(_context = (0, _keys["default"])(subscriptions)).call(_context, function (subscription) {
        return dispatch(unsubscribeFromFeed(activityId, subscription, "dock"));
      });
    }
  };
  var handleNotify = function handleNotify(recommendationIds) {
    _clientAppCore.brcService.notifyRecommendations(recommendationIds, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        streamRecommendations(open);
      }
    });
  };
  (0, _react.useEffect)(function () {
    dispatch((0, _Actions2.subscribeUnitMembers)());
    return function () {
      handleUnsubscribe();
      if (unsubscribeFromFeed) dispatch(unsubscribeFromFeed(id, "activities", subscriberRef));
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (map && mapSelectionMode) {
      map.once("click", function (e) {
        if (mapSelectionRef.current) {
          var coords = [e.lngLat.lng, e.lngLat.lat];
          _clientAppCore.eventService.generateLocationActivity(id, coords, null, function (err, res) {
            if (err) {
              console.log(err);
            }
          });
          setMapSelectionMode(false);
          mapSelectionRef.current = false;
        }
      });
    }
  }, [mapSelectionMode]);
  (0, _react.useEffect)(function () {
    if (recentActivityId) {
      handleCardExpand(recentActivityId);
    }
  }, [recentActivityId]);
  (0, _react.useEffect)(function () {
    if ((0, _size["default"])(units) && (0, _size["default"])(recommendations)) {
      (0, _map["default"])(recommendations).call(recommendations, function (recommendation) {
        var unitId = recommendation.unitId;
        var unit = (0, _find["default"])(units).call(units, function (unit) {
          return unit.id === unitId;
        });
        if (unit) {
          unit["recommendationId"] = recommendation.id;
          unit["notified"] = recommendation.notified;
          unit["locationName"] = recommendation.locationName;
          setRecommendedUnit((0, _unionBy["default"])([unit], recommendedUnit, "id"));
        }
      });
    }
  }, [recommendations]);
  var styles = {
    timeline: _objectSpread({
      color: "#B4B8BC",
      fontSize: 12,
      margin: "15px 0 10px 0",
      width: "50%"
    }, dir === "rtl" && {
      textAlign: "right"
    }),
    targetWrapper: {
      display: "flex",
      direction: dir
    },
    targetObserved: _objectSpread({
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      width: "50%"
    }, !mapSelectionMode && {
      color: "rgb(255, 255, 255, 0.7)"
    }),
    typography: _objectSpread(_objectSpread({
      color: "inherit",
      fontSize: 12
    }, dir === "rtl" && {
      marginRight: 10
    }), dir === "ltr" && {
      marginLeft: 10
    })
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.timelineWrapper
  }, (0, _size["default"])(activities) ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.targetWrapper
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.timeline
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.timeline.title"
  })), /*#__PURE__*/_react["default"].createElement("a", {
    className: "cb-font-link",
    style: styles.targetObserved,
    onClick: function onClick() {
      return toggleMapSelection();
    }
  }, /*#__PURE__*/_react["default"].createElement(_Icons.TargetObserved, null), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.typography
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.timeline.targetObserved"
  })))), (0, _map["default"])(_context2 = (0, _sort["default"])(_context3 = (0, _values["default"])(activities)).call(_context3, function (a, b) {
    return _moment["default"].utc(b.activityDate) - _moment["default"].utc(a.activityDate);
  })).call(_context2, function (activity, index) {
    return /*#__PURE__*/_react["default"].createElement(_TimelineCard["default"], {
      key: index,
      captured: activities.length - index,
      geometry: activity.geometry,
      dir: dir,
      timeline: activity,
      open: open === activity.id,
      attachments: attachments,
      units: recommendedUnit,
      feedSettings: feedSettings,
      initialActivityDate: initialActivityDate,
      handleNotify: handleNotify,
      handleCardExpand: handleCardExpand,
      handleCardCollapse: handleCardCollapse
    });
  })) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null));
};
Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;
var _default = Timeline;
exports["default"] = _default;