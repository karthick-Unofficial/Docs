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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _jquery = _interopRequireDefault(require("jquery"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var VideoIntegratedControls = function VideoIntegratedControls(_ref) {
  var instanceId = _ref.instanceId,
    camera = _ref.camera;
  var _useState = (0, _react.useState)(instanceId),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    instanceIdState = _useState2[0],
    setInstanceIdState = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    ctrlEngaged = _useState4[0],
    setCtrlEngaged = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    panSpd = _useState6[0],
    setPanSpd = _useState6[1];
  var _useState7 = (0, _react.useState)(0),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    tiltSpd = _useState8[0],
    setTiltSpd = _useState8[1];
  var _useState9 = (0, _react.useState)(0),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    zoom = _useState10[0],
    setZoom = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    x = _useState12[0],
    setX = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    y = _useState14[0],
    setY = _useState14[1];
  var controlSurface = /*#__PURE__*/(0, _react.createRef)();
  var _onPointerDown = function _onPointerDown(e) {
    controlSurface.current.setPointerCapture(e.nativeEvent.pointerId);
    controlSurface.current.startX = e.nativeEvent.offsetX;
    controlSurface.current.startY = e.nativeEvent.offsetY;
    controlSurface.current.lastX = 0;
    controlSurface.current.lastY = 0;
    setCtrlEngaged(true);
  };
  var _onPointerUp = function _onPointerUp(e) {
    setCtrlEngaged(false);
    controlSurface.current.releasePointerCapture(e.nativeEvent.pointerId);
    stopContinuousPanTilt();
  };
  var _onPointerMove = function _onPointerMove(e) {
    if (ctrlEngaged) {
      setX(e.nativeEvent.offsetX);
      setY(e.nativeEvent.offsetY);
      moveContinuousPanTilt(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };
  var _onMouseWheel = function _onMouseWheel(e) {
    var zoomFactor = camera.entityData.properties.vicZoomFactor || 20;
    var zoomDirFactor = zoomFactor < 0 ? 1 : -1;
    zoomFactor = Math.abs(zoomFactor);
    var distance = Math.abs(Math.round(e.nativeEvent.deltaY / 100) / zoomFactor);
    if (distance !== 0) {
      var direction = (e.nativeEvent.deltaY < 0 ? -1 : 1) * zoomDirFactor;
      setZoom(distance);
      relativeZoom(direction, distance, 1);
    }
  };
  var _onPointerEnter = function _onPointerEnter() {
    var profileWrapper = (0, _jquery["default"])(".cb-profile-wrapper")[0];
    var cameraDock = (0, _jquery["default"])(".camera-dock")[0];
    if (profileWrapper) profileWrapper.style.overflow = "hidden";
    if (cameraDock) cameraDock.parentElement.style.overflow = "hidden";
  };
  var _onPointerLeave = function _onPointerLeave() {
    var profileWrapper = (0, _jquery["default"])(".cb-profile-wrapper")[0];
    var cameraDock = (0, _jquery["default"])(".camera-dock")[0];
    if (profileWrapper) profileWrapper.style.overflow = "scroll";
    if (cameraDock) cameraDock.parentElement.style.overflow = "scroll";
  };

  // will only need the one command for XY and another for zoom relative
  var moveContinuousPanTilt = function moveContinuousPanTilt(x, y) {
    var panFactor = camera.entityData.properties.vicPanFactor || 10;
    var tiltFactor = camera.entityData.properties.vicTiltFactor || 10;
    var deltaX = x - controlSurface.current.startX;
    var deltaY = controlSurface.current.startY - y;

    // -- negative values for factors flip the direction
    var panDir = deltaX < 0 ? -1 : 1 * (panFactor < 0 ? -1 : 1);
    var tiltDir = deltaY < 0 ? 1 : -1 * (tiltFactor < 0 ? -1 : 1);
    panFactor = Math.abs(panFactor);
    tiltFactor = Math.abs(tiltFactor);

    // pan/tilt speed is 0-1
    // 10 is the default distance unit for speed change. Debating whether should be calculated or fixed. Leaning toward fixed for consistent behavior
    var panSpd = Math.round(Math.abs(deltaX) / 10) / panFactor;
    panSpd = panSpd > 1 ? 1 : panSpd;
    var tiltSpd = Math.round(Math.abs(deltaY) / 10) / tiltFactor;
    tiltSpd = tiltSpd > 1 ? 1 : tiltSpd;
    if (controlSurface.current.lastX !== panSpd * panDir) {
      _clientAppCore.cameraService.moveContinuous(camera.id, instanceIdState, "pan", panDir, panSpd);
      controlSurface.current.lastX = panSpd * panDir;
      setPanSpd(panSpd * panDir);
    }
    if (controlSurface.current.lastY !== tiltSpd * tiltDir) {
      _clientAppCore.cameraService.moveContinuous(camera.id, instanceIdState, "tilt", tiltDir, tiltSpd);
      controlSurface.current.lastY = tiltSpd * tiltDir;
      setTiltSpd(tiltSpd * tiltDir);
    }
  };
  var stopContinuousPanTilt = function stopContinuousPanTilt() {
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceIdState, "pan", 0, 0);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceIdState, "tilt", 0, 0);
  };
  var relativeZoom = function relativeZoom(direction, distance) {
    var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    _clientAppCore.cameraService.zoomRelative(camera.id, instanceIdState, direction, distance, speed);
  };
  var styles = {
    control_surface: {
      position: "absolute",
      zIndex: "1900",
      width: "100%",
      height: "100%"
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: controlSurface,
    style: styles.control_surface,
    onPointerDown: _onPointerDown,
    onPointerMove: _onPointerMove,
    onPointerUp: _onPointerUp,
    onWheel: _onMouseWheel,
    onPointerEnter: _onPointerEnter,
    onPointerLeave: _onPointerLeave
  });
};
var _default = VideoIntegratedControls;
exports["default"] = _default;