"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _CBComponents = require("orion-components/CBComponents");
var _clientAppCore = require("client-app-core");
var _iconsMaterial = require("@mui/icons-material");
var _moment = _interopRequireDefault(require("moment"));
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _Actions = require("orion-components/ContextPanel/Actions");
var _selector = require("orion-components/i18n/Config/selector");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _Selectors2 = require("orion-components/GlobalData/Selectors");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  event: _propTypes["default"].object,
  locale: _propTypes["default"].string,
  selectFloorPlanOn: _propTypes["default"].func,
  getPinnedItems: _propTypes["default"].func,
  profileIconTemplate: _propTypes["default"].string,
  filterType: _propTypes["default"].string,
  floorPlansWithFacilityFeed: _propTypes["default"].object,
  targetingEnabled: _propTypes["default"].bool,
  eventIconStyles: _propTypes["default"].obj
};
var defaultProps = {
  locale: "en",
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var EventCard = function EventCard(props) {
  var _context3, _context4;
  var event = props.event,
    selectFloorPlanOn = props.selectFloorPlanOn,
    getPinnedItems = props.getPinnedItems,
    profileIconTemplate = props.profileIconTemplate,
    filterType = props.filterType,
    targetingEnabled = props.targetingEnabled,
    eventIconStyles = props.eventIconStyles;
  var dispatch = (0, _reactRedux.useDispatch)();
  var eventStats = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData.events.eventStatistics[event.id];
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var selectedEntity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.selectedEntityState)(state);
  });
  var commentCount = eventStats ? eventStats.commentCount : null;
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var floorPlansWithFacilityFeed = (0, _reactRedux.useSelector)(function (state) {
    return state.globalData && state.globalData.floorPlanWithFacilityFeedId ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null;
  });
  var userFeeds = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.userFeedsSelector)(state);
  });
  var pinnedItems;
  var profileIconTemplates;
  (0, _reactRedux.useSelector)(function (state) {
    if (getPinnedItems) {
      pinnedItems = getPinnedItems(state, props);
    }
  });
  if (profileIconTemplate) {
    var _context;
    profileIconTemplates = {};
    (0, _forEach["default"])(_context = (0, _values["default"])(userFeeds)).call(_context, function (feed) {
      profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
    });
  }
  var handleEventClick = function handleEventClick() {
    dispatch((0, _Actions.loadProfile)(event.id, event.name, "event", "profile"));
  };
  var loadEntityData = function loadEntityData(entity) {
    dispatch((0, _Actions.loadProfile)(entity.id, entity.entityData.properties.name, entity.entityType, "profile"));
  };
  var showFloorPlanOnTargetClick = function showFloorPlanOnTargetClick(entity) {
    var entityData = entity.entityData;
    if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
      var floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
      if (floorPlanData.id === entityData.displayTargetId) {
        selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId);
      }
    }
  };
  var name = event.name,
    id = event.id,
    description = event.description,
    isTemplate = event.isTemplate,
    entityData = event.entityData,
    feedId = event.feedId,
    sharedBy = event.sharedBy;
  var endDate = event.endDate ? (0, _moment["default"])(event.endDate) : null;
  var secondaryText = "";
  if (isTemplate) {
    secondaryText = description;
  } else {
    var _context2;
    var expired = event.endDate ? (0, _moment["default"])(event.endDate) < (0, _moment["default"])() : false;
    var dateTimeFormat = (0, _concat["default"])(_context2 = "MMM D, YYYY ".concat(timeFormatPreference === "24-hour" ? "H" : "h", ":mm ")).call(_context2, timeFormatPreference === "24-hour" ? "" : "A ", "z");
    var startDate = (0, _moment["default"])(event.startDate);
    var endDisplayDate = endDate ? (0, _i18n.getTranslation)("global.events.closed") + _clientAppCore.timeConversion.convertToUserTime(endDate, dateTimeFormat) : null;
    if (expired) {
      secondaryText = endDisplayDate;
    } else {
      secondaryText = startDate.format("MDY") === (0, _moment["default"])().format("MDY") && startDate < (0, _moment["default"])() ? (0, _i18n.getTranslation)("global.events.started") + _clientAppCore.timeConversion.convertToUserTime((0, _moment["default"])(startDate).locale(locale), "time_".concat(timeFormatPreference)) + (0, _i18n.getTranslation)("global.events.today") : startDate.format("MDY") !== (0, _moment["default"])().format("MDY") && startDate < (0, _moment["default"])() && (0, _moment["default"])().format("YYYY") !== startDate.format("YYYY") ? (0, _i18n.getTranslation)("global.events.started") + _clientAppCore.timeConversion.convertToUserTime((0, _moment["default"])(startDate).locale(locale), dateTimeFormat) : startDate < (0, _moment["default"])() ? (0, _i18n.getTranslation)("global.events.started") + _clientAppCore.timeConversion.convertToUserTime((0, _moment["default"])(startDate).locale(locale), dateTimeFormat) : (0, _i18n.getTranslation)("global.events.starts") + _clientAppCore.timeConversion.convertToUserTime((0, _moment["default"])(startDate).locale(locale), dateTimeFormat);
    }
  }
  var styles = {
    statusIcon: {
      borderRadius: "5px",
      fill: "#fff",
      fontSize: "1.5rem",
      padding: 5
    }
  };
  var childSelected = selectedEntity && pinnedItems && (0, _indexOf["default"])(_context3 = (0, _keys["default"])(pinnedItems)).call(_context3, selectedEntity.id) >= 0;
  var collectionIcon = function collectionIcon() {
    switch (filterType) {
      case "active":
        return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.PriorityHigh, {
          style: _objectSpread(_objectSpread({}, styles.statusIcon), {}, {
            background: "#65ac50"
          })
        });
      case "scheduled":
        return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CalendarMonth, {
          style: _objectSpread(_objectSpread({}, styles.statusIcon), {}, {
            background: "#4885ba"
          })
        });
      case "closed":
        return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Check, {
          style: _objectSpread(_objectSpread({}, styles.statusIcon), {}, {
            background: "#979798"
          })
        });
      default:
        return endDate ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Event, {
          fontSize: "large"
        }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.DashboardCustomize, {
          style: {
            fontSize: "1.5rem"
          }
        });
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Collection, {
    key: id,
    id: id,
    primaryText: name,
    secondaryText: secondaryText,
    icon: collectionIcon(),
    selected: selectedEntity && event.id === selectedEntity.id,
    childSelected: childSelected,
    handleSelect: handleEventClick,
    commentCount: commentCount,
    dir: dir,
    filterType: filterType,
    geometry: entityData && entityData.geometry,
    feedId: feedId,
    sharedBy: sharedBy,
    targetingEnabled: targetingEnabled,
    iconStyles: eventIconStyles
  }, pinnedItems && (0, _map["default"])(_context4 = (0, _values["default"])(pinnedItems)).call(_context4, function (item) {
    var entityData = item.entityData,
      id = item.id;
    var properties = entityData.properties;
    var name = properties.name,
      type = properties.type,
      subtype = properties.subtype;

    // -- set profileIconTemplate to pass to CollectionItem
    properties.profileIconTemplate = profileIconTemplates[item.feedId];
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionItem, {
      key: id,
      item: item,
      primaryText: name,
      secondaryText: subtype ? subtype : type,
      type: subtype ? subtype : type,
      geometry: true,
      handleSelect: loadEntityData,
      selected: selectedEntity && id === selectedEntity.id,
      dir: dir,
      selectFloor: function selectFloor() {
        return showFloorPlanOnTargetClick(item);
      }
    });
  }));
};
EventCard.propTypes = propTypes;
EventCard.defaultProps = defaultProps;
var _default = EventCard;
exports["default"] = _default;