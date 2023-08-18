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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _SharedComponents = require("orion-components/SharedComponents");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context7, _context8; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context7 = ownKeys(Object(source), !0)).call(_context7, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context8 = ownKeys(Object(source))).call(_context8, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  selectFloor: _propTypes["default"].func,
  facilityFeedId: _propTypes["default"].string
};
var defaultProps = {
  selectFloor: function selectFloor() {},
  facilityFeedId: ""
};
var LinkedItemsWidget = function LinkedItemsWidget(_ref) {
  var _context2, _context3;
  var contextId = _ref.contextId,
    unsubscribeFromFeed = _ref.unsubscribeFromFeed,
    subscriberRef = _ref.subscriberRef,
    isPrimary = _ref.isPrimary,
    expanded = _ref.expanded,
    selectWidget = _ref.selectWidget,
    entityType = _ref.entityType,
    loadProfile = _ref.loadProfile,
    facilityFeedId = _ref.facilityFeedId,
    selectFloor = _ref.selectFloor,
    items = _ref.items,
    feeds = _ref.feeds,
    canLink = _ref.canLink,
    selected = _ref.selected,
    entity = _ref.entity,
    events = _ref.events,
    openDialog = _ref.openDialog,
    closeDialog = _ref.closeDialog,
    linkEntities = _ref.linkEntities,
    unlinkEntities = _ref.unlinkEntities,
    disabledTypes = _ref.disabledTypes,
    dialog = _ref.dialog,
    order = _ref.order,
    enabled = _ref.enabled,
    widgetsExpandable = _ref.widgetsExpandable,
    widgetsLaunchable = _ref.widgetsLaunchable,
    autoFocus = _ref.autoFocus,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var styles = {
    widgetExpandButton: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    })
  };
  (0, _react.useEffect)(function () {
    return function () {
      if (!isPrimary && !expanded) {
        dispatch(unsubscribeFromFeed(contextId, "fov", subscriberRef));
        dispatch(unsubscribeFromFeed(contextId, "fovItems", subscriberRef));
        dispatch(unsubscribeFromFeed(contextId, "linkedEntities", subscriberRef));
      }
    };
  }, []);
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Linked Items"));
  };
  var handleLaunch = function handleLaunch() {
    // -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
    if (entityType === "camera") {
      window.open("/cameras-app/#/entity/".concat(contextId, "/widget/linked-items"));
    }
  };
  var handleLoadDetails = function handleLoadDetails(item) {
    switch (item.feedId) {
      case "cameras":
        // Cameras in another camera's FOV are set as secondary context
        dispatch(loadProfile(item.id, item.entityData.properties.name, "camera", "profile", "secondary"));
        break;
      default:
        dispatch(loadProfile(item.id, item.entityData.properties.name, item.entityType, "profile", "secondary"));
        break;
    }
  };
  var showFloorPlanOnTargetClick = function showFloorPlanOnTargetClick(entityData) {
    var displayType = entityData.displayType,
      displayTargetId = entityData.displayTargetId;
    if (displayType === "facility") {
      _clientAppCore.facilityService.getFloorPlan(displayTargetId, function (err, response) {
        if (err) {
          console.log("ERROR Floor plan not found:", err);
        } else {
          dispatch(selectFloor(response.result, facilityFeedId));
        }
      });
    } else {
      return null;
    }
  };
  var getCategories = function getCategories() {
    var _context;
    var itemIds = (0, _map["default"])(items).call(items, function (item) {
      return item.feedId;
    });
    var categories = (0, _map["default"])(_context = (0, _filter["default"])(feeds).call(feeds, function (feed) {
      return (0, _includes["default"])(itemIds).call(itemIds, feed.feedId);
    })).call(_context, function (feed) {
      return {
        name: feed.name,
        id: feed.feedId
      };
    });
    return categories;
  };
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: (0, _concat["default"])(_context2 = "widget-wrapper ".concat(expanded ? "expanded" : "collapsed", " ")).call(_context2, "index-" + order)
  }, !expanded && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.linkedItems.title"
  })), canLink && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button",
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: function onClick() {
      return dispatch(openDialog("link-entity-dialog"));
    },
    style: {
      textTransform: "none"
    },
    color: "primary"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.linkedItems.linkItems"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, widgetsExpandable && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))), widgetsLaunchable && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleLaunch
  }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null))))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, !!items.length && (0, _map["default"])(_context3 = getCategories()).call(_context3, function (category) {
    var _context4;
    var id = category.id,
      name = category.name;
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionCard, {
      key: id,
      name: name,
      dir: dir
    }, (0, _map["default"])(_context4 = (0, _filter["default"])(items).call(items, function (item) {
      return item.feedId === category.id;
    })).call(_context4, function (item) {
      var _context5;
      var entityData = item.entityData,
        feedId = item.feedId,
        id = item.id,
        isDeleted = item.isDeleted,
        entityType = item.entityType;
      var _entityData$propertie = entityData.properties,
        name = _entityData$propertie.name,
        type = _entityData$propertie.type,
        subtype = _entityData$propertie.subtype;
      var disabled = (0, _indexOf["default"])(_context5 = disabledTypes || []).call(_context5, entityType) > -1;
      return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionCardItem, {
        disabled: isDeleted || disabled,
        feedId: feedId,
        handleClick: function handleClick() {
          return handleLoadDetails(item);
        },
        handleRemove: function handleRemove() {
          return dispatch(unlinkEntities([{
            id: id,
            type: item.entityType
          }, {
            id: entity.id,
            type: "camera"
          }]));
        },
        canRemove: item.linkedWith ? true : false,
        id: id,
        key: id,
        name: name,
        type: expanded ? subtype ? subtype : type : "",
        dir: dir,
        selectFloor: function selectFloor() {
          return showFloorPlanOnTargetClick(entityData);
        }
      });
    }));
  }), !!events.length && /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionCard, {
    key: "events",
    name: "Events",
    dir: dir
  }, (0, _map["default"])(events).call(events, function (item) {
    var _context6;
    var entityData = item.entityData,
      id = item.id,
      isDeleted = item.isDeleted;
    var _entityData$propertie2 = entityData.properties,
      name = _entityData$propertie2.name,
      type = _entityData$propertie2.type,
      subtype = _entityData$propertie2.subtype;
    var disabled = (0, _indexOf["default"])(_context6 = disabledTypes || []).call(_context6, "event") > -1;
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionCardItem, {
      disabled: isDeleted || disabled,
      geometry: entityData.geometry,
      handleClick: function handleClick() {
        return handleLoadDetails(item);
      },
      id: id,
      key: id,
      name: name,
      type: expanded ? subtype ? subtype : type : "",
      dir: dir
    });
  }))), /*#__PURE__*/_react["default"].createElement(_SharedComponents.LinkDialog, {
    dialog: dialog || "",
    title: (0, _i18n.getTranslation)("global.profiles.widgets.linkedItems.linkItem"),
    closeDialog: closeDialog,
    entity: entity,
    linkEntities: linkEntities,
    autoFocus: autoFocus,
    dir: dir
  }));
};
LinkedItemsWidget.propTypes = propTypes;
LinkedItemsWidget.defaultProps = defaultProps;
var _default = LinkedItemsWidget;
exports["default"] = _default;