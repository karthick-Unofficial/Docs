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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _PinnedItemsDialog = _interopRequireDefault(require("./components/PinnedItemsDialog"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  selectFloor: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloor: function selectFloor() {},
  floorPlansWithFacilityFeed: null
};
var PinnedItemsWidget = function PinnedItemsWidget(_ref) {
  var contextId = _ref.contextId,
    subscriberRef = _ref.subscriberRef,
    isPrimary = _ref.isPrimary,
    unsubscribeFromFeed = _ref.unsubscribeFromFeed,
    openDialog = _ref.openDialog,
    selectWidget = _ref.selectWidget,
    entityType = _ref.entityType,
    loadProfile = _ref.loadProfile,
    items = _ref.items,
    feeds = _ref.feeds,
    floorPlansWithFacilityFeed = _ref.floorPlansWithFacilityFeed,
    canManage = _ref.canManage,
    selected = _ref.selected,
    order = _ref.order,
    enabled = _ref.enabled,
    widgetsExpandable = _ref.widgetsExpandable,
    widgetsLaunchable = _ref.widgetsLaunchable,
    dialog = _ref.dialog,
    closeDialog = _ref.closeDialog,
    eventEnded = _ref.eventEnded,
    readOnly = _ref.readOnly,
    isAlertProfile = _ref.isAlertProfile,
    dir = _ref.dir,
    selectFloor = _ref.selectFloor;
  var dispatch = (0, _reactRedux.useDispatch)();
  (0, _react.useEffect)(function () {
    return function () {
      if (!isPrimary && unsubscribeFromFeed) dispatch(unsubscribeFromFeed(contextId, "pinnedItems", subscriberRef));
    };
  }, []);
  var handleOpenDialog = function handleOpenDialog() {
    dispatch(openDialog("pinnedItemDialog"));
  };
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Pinned Items"));
  };
  var handleLaunch = function handleLaunch() {
    // -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
    if (entityType === "event") {
      window.open("/events-app/#/entity/".concat(contextId, "/widget/pinned-items"));
    }
  };
  var handleUnpin = function handleUnpin(itemType, itemId) {
    _clientAppCore.eventService.unpinEntity(contextId, itemType, itemId);

    // Give the unpin a little time to finish
    (0, _setTimeout2["default"])(function () {
      // Fake an update to cause the pinned item array to update on the changefeed
      _clientAppCore.eventService.mockUpdateEvent(contextId, function (err, response) {
        if (err) {
          console.log(err, response);
        }
      });
    }, 200);
  };
  var handleLoadEntityDetails = function handleLoadEntityDetails(item) {
    dispatch(loadProfile(item.id, item.entityData.properties.name, item.entityType, "profile", "secondary"));
  };
  var getCategories = function getCategories() {
    var _context;
    var itemIds = items ? (0, _map["default"])(items).call(items, function (item) {
      return item.feedId;
    }) : [];
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
  var showFloorPlanOnTargetClick = function showFloorPlanOnTargetClick(entity) {
    var entityData = entity.entityData,
      entityType = entity.entityType;
    if (entityType === "camera" || "accessPoint" && entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
      var floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
      if (floorPlanData.id === entityData.displayTargetId) {
        selectFloor(floorPlanData, floorPlanData.facilityFeedId);
      }
    }
  };
  var categories = getCategories();
  var canPinItems = false;
  var canRemoveItems = false;
  if (canManage) {
    canPinItems = true;
    canRemoveItems = true;
  }
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-wrapper collapsed ".concat("index-" + order)
  }, !isAlertProfile && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.pinnedItems.main.title"
  })), canPinItems && !eventEnded && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    onClick: handleOpenDialog
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.pinnedItems.main.pinItem"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, widgetsExpandable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    }),
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))) : null, widgetsLaunchable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    }),
    onClick: handleLaunch
  }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null))) : null)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, categories.length > 0 ? (0, _map["default"])(categories).call(categories, function (category) {
    var _context2, _context3;
    var id = category.id,
      name = category.name;
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionCard, {
      key: id,
      name: name,
      dir: dir
    }, (0, _map["default"])(_context2 = (0, _sort["default"])(_context3 = (0, _filter["default"])(items).call(items, function (item) {
      return item.feedId === id;
    })).call(_context3, function (a, b) {
      return a.entityData.properties.name > b.entityData.properties.name ? 1 : -1;
    })).call(_context2, function (item) {
      var entityData = item.entityData,
        entityType = item.entityType,
        feedId = item.feedId,
        id = item.id,
        isDeleted = item.isDeleted;
      var name = entityData.properties.name;
      return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionCardItem, {
        canRemove: canRemoveItems,
        disabled: isDeleted || eventEnded,
        selectFloor: function selectFloor() {
          return showFloorPlanOnTargetClick(item);
        },
        feedId: feedId,
        handleClick: loadProfile ? function () {
          return handleLoadEntityDetails(item);
        } : null,
        handleRemove: function handleRemove() {
          return handleUnpin(entityType, id);
        },
        id: id,
        key: id,
        name: name,
        readOnly: readOnly,
        type: "",
        dir: dir
      });
    }));
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: 12,
      color: "#fff"
    },
    align: "center",
    variant: "caption",
    component: "p"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.pinnedItems.main.noAssocEntities"
  }))), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_PinnedItemsDialog["default"], {
    closeDialog: closeDialog,
    dialog: dialog,
    contextId: contextId,
    feeds: feeds,
    dir: dir
  })));
};
PinnedItemsWidget.propTypes = propTypes;
PinnedItemsWidget.defaultProps = defaultProps;
var _default = PinnedItemsWidget;
exports["default"] = _default;