"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Apm = require("../../../Apm");
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _CameraCard = _interopRequireDefault(require("./components/CameraCard"));
var _SharedComponents = require("orion-components/SharedComponents");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context12, _context13; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context12 = ownKeys(Object(source), !0)).call(_context12, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context13 = ownKeys(Object(source))).call(_context13, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var CamerasWidget = function CamerasWidget(_ref) {
  var _context6, _context11;
  var cameras = _ref.cameras,
    contextId = _ref.contextId,
    unsubscribeFromFeed = _ref.unsubscribeFromFeed,
    subscriberRef = _ref.subscriberRef,
    entity = _ref.entity,
    entityType = _ref.entityType,
    selectWidget = _ref.selectWidget,
    geometry = _ref.geometry,
    selected = _ref.selected,
    order = _ref.order,
    canLink = _ref.canLink,
    enabled = _ref.enabled,
    widgetsExpandable = _ref.widgetsExpandable,
    widgetsLaunchable = _ref.widgetsLaunchable,
    loadProfile = _ref.loadProfile,
    sidebarOpen = _ref.sidebarOpen,
    dockedCameras = _ref.dockedCameras,
    addCameraToDockMode = _ref.addCameraToDockMode,
    removeDockedCamera = _ref.removeDockedCamera,
    useCameraGeometry = _ref.useCameraGeometry,
    readOnly = _ref.readOnly,
    dialog = _ref.dialog,
    openDialog = _ref.openDialog,
    closeDialog = _ref.closeDialog,
    setCameraPriority = _ref.setCameraPriority,
    fullscreenCamera = _ref.fullscreenCamera,
    disableSlew = _ref.disableSlew,
    disableLock = _ref.disableLock,
    linkEntities = _ref.linkEntities,
    unlinkCameras = _ref.unlinkCameras,
    user = _ref.user,
    eventEnded = _ref.eventEnded,
    isAlertProfile = _ref.isAlertProfile,
    dir = _ref.dir,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    floorPlansWithFacilityFeed = _ref.floorPlansWithFacilityFeed;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    camerasLoaded = _useState4[0],
    setCamerasLoaded = _useState4[1];
  var dispatch = (0, _reactRedux.useDispatch)();
  (0, _react.useEffect)(function () {
    if (!camerasLoaded && cameras) {
      if (cameras.length === 1) {
        handleCardExpand(cameras[0].id);
      }
      setCamerasLoaded(true);
    }
  }, [cameras]);
  (0, _react.useEffect)(function () {
    return function () {
      if (unsubscribeFromFeed) {
        // Event profile uses a different stream that includes both cameras in range and pinned cameras
        dispatch(unsubscribeFromFeed(contextId, entityType === "event" ? "eventCameras" : "camerasInRange", subscriberRef));
      }
    };
  }, [unsubscribeFromFeed, entityType, contextId, subscriberRef]);
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Cameras"));
  };
  var handleLaunch = function handleLaunch() {
    // -- camera-wall expects entityType of "shape", but entityType on all shape properties is set to "shapes"
    var et = entityType === "shapes" ? "shape" : entityType;

    // -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
    if (et === "floorplan") {
      window.open("/facilities-app/#/entity/".concat(contextId));
    } else {
      var _context, _context2, _context3;
      // -- build out properties based on how the Camera-Wall App does it
      var edProps = entity.entityData.properties;
      var name = entity.name || (edProps ? edProps.name : "Unknown");
      var backupType = et.charAt(0).toUpperCase() + (0, _slice["default"])(et).call(et, 1);
      var type = edProps ? edProps.subtype || edProps.type || backupType : backupType;
      var displayName = (name ? name.replace("/", "%2F") : contextId).toUpperCase();
      window.open((0, _concat["default"])(_context = (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "/camera-wall-app/#/entityId/".concat(contextId, "/entityName/")).call(_context3, displayName, "/entityType/")).call(_context2, et, "/type/")).call(_context, type));
    }
  };
  var handleCardExpand = function handleCardExpand(id) {
    setOpen(open === id ? null : id);
  };
  var handleSlewAll = function handleSlewAll() {
    var coordinates = geometry.coordinates;
    (0, _forEach["default"])(cameras).call(cameras, function (camera) {
      var _context4;
      // Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
      // -- don't slew virtual ptz cams (i.e. wavcam) as they are already locked to target
      if (!(camera.entityData.properties.features && (0, _includes["default"])(_context4 = camera.entityData.properties.features).call(_context4, "ribbon"))) {
        _clientAppCore.cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
      }
    });
  };
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
  var showFloorPlanOnTargetClick = function showFloorPlanOnTargetClick(entity) {
    var entityData = entity.entityData;
    if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
      var floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
      if (floorPlanData.id === entityData.displayTargetId) {
        dispatch(selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId));
      }
    }
  };
  var canSlewAll = cameras && (0, _findIndex["default"])(cameras).call(cameras, function (camera) {
    var _context5;
    return camera.entityData.properties.features && (0, _includes["default"])(_context5 = camera.entityData.properties.features).call(_context5, "auto-slew");
  }) > -1;
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-wrapper collapsed ".concat("index-" + order, " ")
  }, !isAlertProfile && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.cameras.main.title"
  })), (0, _includes["default"])(_context6 = ["camera", "shapes", "track", "accessPoint"]).call(_context6, entityType) && canLink && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button",
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: function onClick() {
      return dispatch(openDialog("link-entity-dialog"));
    },
    style: styles.label,
    color: "primary"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.cameras.main.linkCamera"
  }))), canSlewAll && !readOnly && !disableSlew && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button",
    style: styles.widgetOptionButton
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    style: styles.label,
    color: "primary",
    onClick: handleSlewAll,
    disabled: !(geometry && geometry.coordinates)
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.cameras.main.slewAll"
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
    className: "widget-content",
    style: {
      display: "flex"
    }
  }, cameras && cameras.length > 0 ? (0, _map["default"])(cameras).call(cameras, function (camera, index) {
    var _context7, _context8, _context9, _context10;
    var cameraDisabled = camera.isDeleted || eventEnded;
    return /*#__PURE__*/_react["default"].createElement(_CameraCard["default"], {
      contextId: contextId,
      cameraIndex: index,
      canUnlink: canLink,
      canControl: !readOnly && user.integrations && (0, _find["default"])(_context7 = user.integrations).call(_context7, function (_int) {
        return _int.intId === camera.feedId;
      }) && (0, _find["default"])(_context8 = user.integrations).call(_context8, function (_int2) {
        return _int2.intId === camera.feedId;
      }).permissions && (0, _includes["default"])(_context9 = (0, _find["default"])(_context10 = user.integrations).call(_context10, function (_int3) {
        return _int3.intId === camera.feedId;
      }).permissions).call(_context9, "control"),
      entityType: entityType,
      useCameraGeometry: useCameraGeometry,
      geometry: geometry,
      key: camera.id,
      loadProfile: loadProfile,
      unlinkCameras: unlinkCameras,
      camera: camera,
      canExpand: !cameraDisabled,
      handleCardExpand: handleCardExpand,
      canTarget: !cameraDisabled,
      hasMenu: open === camera.id && !cameraDisabled,
      expanded: open === camera.id,
      disableSlew: disableSlew,
      disableLock: disableLock,
      sidebarOpen: sidebarOpen,
      dockedCameras: dockedCameras,
      addCameraToDockMode: addCameraToDockMode,
      removeDockedCamera: removeDockedCamera,
      dialog: dialog,
      openDialog: openDialog,
      closeDialog: closeDialog,
      readOnly: readOnly,
      subscriberRef: subscriberRef,
      setCameraPriority: setCameraPriority,
      fullscreenCamera: fullscreenCamera,
      dir: dir,
      selectFloorPlanOn: showFloorPlanOnTargetClick
    });
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      margin: "12px auto",
      color: "#fff"
    },
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.cameras.main.noCamsAvailable"
  }))), (0, _includes["default"])(_context11 = ["camera", "shapes", "track", "accessPoint"]).call(_context11, entityType) && /*#__PURE__*/_react["default"].createElement(_SharedComponents.LinkDialog, {
    dialog: dialog || "",
    title: (0, _i18n.getTranslation)("global.profiles.widgets.cameras.main.linkCams"),
    closeDialog: closeDialog,
    entity: entity,
    linkEntities: linkEntities,
    dir: dir
  }));
};
CamerasWidget.propTypes = propTypes;
CamerasWidget.defaultProps = defaultProps;
var _default = (0, _Apm.withSpan)("cameras-widget", "profile-widget")(CamerasWidget);
exports["default"] = _default;