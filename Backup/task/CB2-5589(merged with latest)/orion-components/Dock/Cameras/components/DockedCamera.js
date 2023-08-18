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
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _PTZControls = _interopRequireDefault(require("../../../Profiles/Widgets/PTZControls/PTZ-controls"));
var _SharedComponents = require("../../../SharedComponents");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _material2 = require("@mui/material/");
var _CBComponents = require("orion-components/CBComponents");
var _uuid = require("uuid");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Material UI

var instanceId = (0, _uuid.v4)();
var DockedCamera = function DockedCamera(_ref) {
  var _context2;
  var setCameraPriority = _ref.setCameraPriority,
    removeDockedCamera = _ref.removeDockedCamera,
    dockedCameras = _ref.dockedCameras,
    hasProfile = _ref.hasProfile,
    loadProfile = _ref.loadProfile,
    camera = _ref.camera,
    cameraPosition = _ref.cameraPosition,
    overlay = _ref.overlay,
    cameraView = _ref.cameraView,
    canControl = _ref.canControl,
    dialog = _ref.dialog,
    openDialog = _ref.openDialog,
    closeDialog = _ref.closeDialog,
    fullscreenCameraOpen = _ref.fullscreenCameraOpen,
    addToDock = _ref.addToDock,
    overlayText = _ref.overlayText;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    showControls = _useState2[0],
    setShowControls = _useState2[1];
  (0, _react.useEffect)(function () {
    dispatch(setCameraPriority(true, false));
    return function () {
      dispatch(setCameraPriority(false, false));
    };
  }, []);
  var removeCamera = function removeCamera(position) {
    dispatch(removeDockedCamera(position, dockedCameras));
  };
  var handleControls = function handleControls() {
    setShowControls(!showControls);
  };
  var loadCameraProfile = function loadCameraProfile() {
    var id = camera.id,
      entityData = camera.entityData;
    if (!hasProfile) {
      return;
    }
    dispatch(loadProfile(id, entityData.properties.name, "camera", "profile"));
  };
  var hasCapability = function hasCapability(capability) {
    var _context;
    return camera.entityData.properties.features && (0, _includes["default"])(_context = camera.entityData.properties.features).call(_context, capability);
  };
  var buttonStyles = {
    controls: {
      color: "#35b7f3"
    }
  };
  var targetIcon = /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    id: camera.id,
    feedId: camera.feedId
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: "relative"
    }
  }, overlay && /*#__PURE__*/_react["default"].createElement("p", {
    className: "overlay-text",
    onClick: overlay ? addToDock : function () {} // handle replacing docked camera
  }, " ", overlayText, " "), /*#__PURE__*/_react["default"].createElement("div", {
    className: overlay ? "camera-overlay" : "video-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "camera-header"
  }, cameraView && targetIcon, /*#__PURE__*/_react["default"].createElement("p", {
    className: "camera-title",
    onClick: loadCameraProfile
  }, camera.entityData.properties.name), /*#__PURE__*/_react["default"].createElement(_material2.IconButton, {
    onClick: function onClick() {
      return removeCamera(cameraPosition);
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.VideoPlayerWrapper, {
    instanceId: instanceId,
    camera: camera,
    docked: false,
    modal: fullscreenCameraOpen,
    dialogKey: (0, _concat["default"])(_context2 = "dock-".concat(camera.id, "-")).call(_context2, cameraPosition),
    dialog: dialog,
    openDialog: openDialog,
    closeDialog: closeDialog,
    canControl: canControl,
    setCameraPriority: setCameraPriority,
    expanded: false
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "camera-footer"
  }, hasCapability("control") && showControls && /*#__PURE__*/_react["default"].createElement("div", {
    className: "camera-dock-ptz-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_PTZControls["default"], {
    dock: true,
    camera: camera,
    instanceId: instanceId
  })), hasCapability("control") && canControl ? !showControls ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: handleControls,
    variant: "text",
    color: "primary",
    style: buttonStyles.controls
  }, (0, _i18n.getTranslation)("global.dock.cameras.dockedCam.showControls")) : /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: handleControls,
    variant: "text",
    color: "primary",
    style: buttonStyles.controls
  }, (0, _i18n.getTranslation)("global.dock.cameras.dockedCam.hideControls")) : null)));
};
var _default = DockedCamera;
exports["default"] = _default;