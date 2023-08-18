"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _Home = _interopRequireDefault(require("@mui/icons-material/Home"));
var _iconsMaterial = require("@mui/icons-material");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
//import { default as NavigationArrowTopRight } from "material-ui/svg-icons/communication/call-made"; // There are no diagonal arrows
//import { default as NavigationArrowBottomLeft } from "material-ui/svg-icons/communication/call-received"; // There are no diagonal arrows

var PTZControls = function PTZControls(_ref) {
  var instanceId = _ref.instanceId,
    camera = _ref.camera,
    dock = _ref.dock;
  var handleContinuousStop = function handleContinuousStop() {
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "tilt", 0, 0);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "pan", 0, 0);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "zoom", 0, 0);
  };
  var handleCameraNorthWest = function handleCameraNorthWest() {
    // cameraService.moveRelative(this.props.camera.id, -1, -1, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "tilt", -1, 0.5);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "pan", -1, 0.5);
  };
  var handleCameraNorth = function handleCameraNorth() {
    // cameraService.moveRelative(this.props.camera.id, 0, -1, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "tilt", -1, 0.5);
  };
  var handleCameraNorthEast = function handleCameraNorthEast() {
    // cameraService.moveRelative(this.props.camera.id, 1, -1, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "pan", 1, 0.5);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "tilt", -1, 0.5);
  };
  var handleCameraWest = function handleCameraWest() {
    // cameraService.moveRelative(this.props.camera.id, -1, 0, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "pan", -1, 0.5);
  };
  var handleCameraHome = function handleCameraHome() {
    _clientAppCore.cameraService.moveHome(camera.id);
  };
  var handleCameraEast = function handleCameraEast() {
    // cameraService.moveRelative(this.props.camera.id, 1, 0, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "pan", 1, 0.5);
  };
  var handleCameraSouthWest = function handleCameraSouthWest() {
    // cameraService.moveRelative(this.props.camera.id, -1, 1, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "pan", -1, 0.5);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "tilt", 1, 0.5);
  };
  var handleCameraSouth = function handleCameraSouth() {
    // cameraService.moveRelative(this.props.camera.id, 0, 1, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "tilt", 1, 0.5);
  };
  var handleCameraSouthEast = function handleCameraSouthEast() {
    // cameraService.moveRelative(this.props.camera.id, 1, 1, 1, 1);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "pan", 1, 0.5);
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "tilt", 1, 0.5);
  };
  var handleCameraZoomIn = function handleCameraZoomIn() {
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "zoom", 1, 0.5);
  };
  var handleCameraZoomOut = function handleCameraZoomOut() {
    _clientAppCore.cameraService.moveContinuous(camera.id, instanceId, "zoom", -1, 0.5);
  };
  var buttonStyles = {
    zoom: {
      margin: ".5rem 1rem",
      color: "#fff",
      borderRadius: "50px",
      backgroundColor: "#828283",
      width: "35px",
      height: "30px",
      fontSize: "25px"
    },
    move: {
      width: "100%",
      height: "100%",
      minWidth: 0,
      color: "#fff",
      borderRadius: "2px"
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-control-main-container"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-button-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-circle"
  }, /*#__PURE__*/_react["default"].createElement(_material.Fab, {
    onMouseDown: handleCameraZoomIn,
    onMouseUp: handleContinuousStop,
    style: buttonStyles.zoom,
    mini: dock
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Add, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-circle"
  }, /*#__PURE__*/_react["default"].createElement(_material.Fab, {
    onMouseDown: handleCameraZoomOut,
    onMouseUp: handleContinuousStop,
    style: buttonStyles.zoom,
    mini: dock
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Remove, null)))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid ".concat(dock ? "docked-grid" : "")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    }),
    onMouseDown: handleCameraNorthWest,
    onMouseUp: handleContinuousStop
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.NorthWest, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    }),
    onMouseDown: handleCameraNorth,
    onMouseUp: handleContinuousStop
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.North, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    }),
    onMouseDown: handleCameraNorthEast,
    onMouseUp: handleContinuousStop
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.NorthEast, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    }),
    onMouseDown: handleCameraWest,
    onMouseUp: handleContinuousStop
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.West, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item ptz-home"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    style: _objectSpread({}, buttonStyles.move),
    onClick: handleCameraHome
  }, /*#__PURE__*/_react["default"].createElement(_Home["default"], null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onMouseDown: handleCameraEast,
    onMouseUp: handleContinuousStop,
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    })
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.East, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onMouseDown: handleCameraSouthWest,
    onMouseUp: handleContinuousStop,
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    })
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.SouthWest, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onMouseDown: handleCameraSouth,
    onMouseUp: handleContinuousStop,
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    })
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.South, null))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ptz-grid-item"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    style: _objectSpread(_objectSpread({}, buttonStyles.move), {}, {
      backgroundColor: "#828283"
    }),
    onMouseDown: handleCameraSouthEast,
    onMouseUp: handleContinuousStop
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.SouthEast, null)))));
};
var _default = PTZControls;
exports["default"] = _default;