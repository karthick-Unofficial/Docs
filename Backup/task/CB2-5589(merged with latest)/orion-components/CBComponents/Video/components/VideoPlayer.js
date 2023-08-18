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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _clientAppCore = require("client-app-core");
var _jquery = _interopRequireDefault(require("jquery"));
var _VideoIntegratedControls = _interopRequireDefault(require("../../../Profiles/Widgets/PTZControls/VideoIntegratedControls"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Actions = require("orion-components/AppState/Actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  camera: _propTypes["default"].shape({
    id: _propTypes["default"].string.isRequired,
    player: _propTypes["default"].shape({
      type: _propTypes["default"].string.isRequired,
      url: _propTypes["default"].string
    })
  }).isRequired,
  inDock: _propTypes["default"].bool,
  fillAvailable: _propTypes["default"].bool,
  modal: _propTypes["default"].bool,
  dialogKey: _propTypes["default"].string,
  setCameraPriority: _propTypes["default"].func,
  fullscreen: _propTypes["default"].bool,
  instanceId: _propTypes["default"].string,
  entityId: _propTypes["default"].string,
  entityType: _propTypes["default"].string
};
var defaultProps = {
  camera: {
    player: {
      url: null
    }
  },
  inDock: false,
  fillAvailable: false,
  modal: false,
  setCameraPriority: function setCameraPriority() {},
  dialogKey: "",
  fullscreen: false,
  instanceId: "",
  entityId: "",
  entityType: ""
};
var VideoPlayer = function VideoPlayer(props) {
  var _context;
  var camera = props.camera,
    fullscreen = props.fullscreen,
    instanceId = props.instanceId,
    entityId = props.entityId,
    entityType = props.entityType,
    readOnly = props.readOnly,
    playbackStartTime = props.playbackStartTime,
    playBarValue = props.playBarValue,
    playbackPlaying = props.playbackPlaying,
    currentReplayMedia = props.currentReplayMedia,
    addReplayMedia = props.addReplayMedia,
    removeReplayMedia = props.removeReplayMedia,
    inDock = props.inDock,
    dialogKey = props.dialogKey,
    setCameraPriority = props.setCameraPriority,
    modal = props.modal,
    expanded = props.expanded;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    streamUrl = _useState2[0],
    setStreamUrl = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    streamUrlError = _useState4[0],
    setStreamUrlError = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    showFullScreenButton = _useState6[0],
    setShowFullScreenButton = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    canToggleFullscreen = _useState8[0],
    setCanToggleFullscreen = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    currentFrame = _useState10[0],
    setCurrentFrame = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    currentAspectRatio = _useState12[0],
    setCurrentAspectRatio = _useState12[1];
  var frame = /*#__PURE__*/(0, _react.createRef)();
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return state;
    }),
    _useSelector$appState = _useSelector.appState.dock,
    dockData = _useSelector$appState.dockData,
    cameraDock = _useSelector$appState.cameraDock;
  var iscameraInDock = dockData.isOpen && dockData.tab === "Cameras" && (0, _includes["default"])(_context = cameraDock.dockedCameras).call(_context, camera.id);
  var docked = iscameraInDock && inDock ? false : iscameraInDock && !inDock ? true : false;
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)(null);
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    if (camera.player.type !== "ws-jpeg" && camera.player.type != "wowza") {
      getStreamURL(camera.id);
    }
  }, []);
  (0, _react.useEffect)(function () {
    if (prevProps) {
      var id = camera.id,
        player = camera.player;
      var prevId = prevProps.camera ? prevProps.camera.id : null;
      if (id !== prevId && player.type !== "wowza") {
        getStreamURL(id);
      }
    }
  }, [props]);
  (0, _react.useEffect)(function () {
    var isMobile = (0, _jquery["default"])(window).width() <= 1023;
    setCanToggleFullscreen((showFullScreenButton || isMobile) && !modal && !fullscreen && !expanded);
  }, [window, showFullScreenButton, modal, fullscreen, expanded]);
  (0, _react.useEffect)(function () {
    setCurrentAspectRatio(currentFrame ? currentFrame.clientHeight / (currentFrame.clientWidth * 1.0) : null);
  }, [currentFrame]);
  var getStreamURL = function getStreamURL(cameraId) {
    _clientAppCore.cameraService.getStreamURL(cameraId, function (err, response) {
      if (err) {
        console.log("ERROR", err);
        setStreamUrlError(true);
      }
      if (!response) return;
      var streamUrl = response.streamUrl;
      setStreamUrl(streamUrl);
    });
  };
  var getPlayer = function getPlayer() {
    var player = camera.player,
      id = camera.id;
    // -- handle cameras that have different player types for live and replay streaming
    var type = readOnly && player.replayType ? player.replayType : player.type;
    switch (type) {
      case "wowza":
        return /*#__PURE__*/_react["default"].createElement(_CBComponents.WowzaWebRTCPlayer, {
          camera: camera
        });
      case "flashphoner":
        return /*#__PURE__*/_react["default"].createElement(_CBComponents.WebRTCPlayer, {
          url: player.url,
          streamUrl: streamUrl,
          streamUrlError: streamUrlError
        });
      case "ws-jpeg":
        return /*#__PURE__*/_react["default"].createElement(_CBComponents.WSImagePlayer, {
          cameraId: id,
          videoProfile: "desktop",
          fullscreen: fullscreen,
          instanceId: instanceId,
          entityId: entityId,
          entityType: entityType,
          playbackStartTime: readOnly && playbackStartTime ? playbackStartTime : null,
          playBarValue: readOnly && playBarValue ? playBarValue : null,
          playbackPlaying: readOnly && playbackPlaying ? playbackPlaying : null,
          currentReplayMedia: readOnly && currentReplayMedia ? currentReplayMedia : [],
          addReplayMedia: readOnly && addReplayMedia ? addReplayMedia : function () {},
          removeReplayMedia: readOnly && removeReplayMedia ? removeReplayMedia : function () {}
        });
      case "file":
        return /*#__PURE__*/_react["default"].createElement("video", {
          muted: true,
          autoPlay: true,
          loop: true,
          style: {
            maxHeight: "100%",
            maxWidth: "100%"
          }
        }, /*#__PURE__*/_react["default"].createElement("source", {
          src: camera.entityData.properties.videoUrl,
          type: camera.entityData.properties.videoType
        }));
      default:
        return null;
    }
  };
  var drawAspectRatio = function drawAspectRatio(currentAspectRatio) {
    var contents = docked || modal ? /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: {
        position: "absolute"
      },
      variant: "subtitle1"
    }, docked ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.CBComponents.video.videoPlayer.camInDock"
    }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.CBComponents.video.videoPlayer.camInModal"
    })) : getPlayer();
    if (currentAspectRatio < 0.5625) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "maintain-height-aspect-ratio-box"
      }, /*#__PURE__*/_react["default"].createElement("svg", {
        className: "aspect-ratio-helper",
        xmlns: "http://www.w3.org/2000/svg",
        width: "320",
        height: "180"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "aspect-ratio-box-inside"
      }, contents));
    } else {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "maintain-width-aspect-ratio-box"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "aspect-ratio-box-inside"
      }, contents));
    }
  };
  var toggleFullscreen = function toggleFullscreen() {
    if (dialogKey === "") {
      return;
    }
    dispatch(setCameraPriority(null, true));
    dispatch((0, _Actions.openDialog)(dialogKey));
  };
  var hasCapability = function hasCapability(capability) {
    var _context2;
    return camera.entityData.properties.features && (0, _includes["default"])(_context2 = camera.entityData.properties.features).call(_context2, capability);
  };
  (0, _react.useEffect)(function () {
    if (!currentFrame) {
      setCurrentFrame(frame.current);
    }
  }, [frame.current, currentFrame]);
  var styles = {
    frame: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      placeContent: "center",
      backgroundColor: "#000",
      minHeight: 180,
      width: "100%",
      height: "100%"
    },
    fullScreenButtonDiv: {
      display: canToggleFullscreen ? "flex" : "none",
      backgroundColor: "rgba(65, 69, 74, 0.5)",
      zIndex: 10001,
      position: "absolute",
      height: 30,
      width: 30,
      top: 10,
      padding: 3,
      textAlign: "center",
      borderRadius: 8,
      right: 10
    },
    fullScreenButtonIcon: {
      color: "white",
      height: "100%",
      width: "100%",
      padding: 3
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: frame,
    style: styles.frame,
    onMouseOver: function onMouseOver() {
      return setShowFullScreenButton(true);
    },
    onMouseOut: function onMouseOut() {
      return setShowFullScreenButton(true);
    }
  }, !readOnly && /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.fullScreenButtonDiv
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.fullScreenButtonIcon,
    onClick: toggleFullscreen
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Fullscreen, null))), hasCapability("control") && hasCapability("video-integrated-control") && /*#__PURE__*/_react["default"].createElement(_VideoIntegratedControls["default"], {
    camera: camera,
    instanceId: instanceId
  }), currentAspectRatio && drawAspectRatio(currentAspectRatio));
};
VideoPlayer.propTypes = propTypes;
VideoPlayer.defaultProps = defaultProps;
var _default = VideoPlayer;
exports["default"] = _default;