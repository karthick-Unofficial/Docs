"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _i18n = require("orion-components/i18n");
var PlaySettingsActions = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/PlaySettings/actionTypes"));
var WebRTCPlayActions = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/WebRTCPlay/actionTypes"));
var _Selectors = require("orion-components/GlobalData/Selectors");
var _startPlay = _interopRequireDefault(require("./utils/startPlay"));
var _stopPlay = _interopRequireDefault(require("./utils/stopPlay"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var Player = function Player(_ref) {
  var getWowzaStream = _ref.getWowzaStream,
    setPlaySettings = _ref.setPlaySettings,
    wowzaResponseData = _ref.wowzaResponseData;
  var videoElement = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(true),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isLoading = _useState2[0],
    setIsLoading = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    socketRetryCount = _useState4[0],
    setSocketRetryCount = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    streamError = _useState6[0],
    setStreamError = _useState6[1];
  var dispatch = (0, _reactRedux.useDispatch)();
  var playSettings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.getPlaySettings)(state, wowzaResponseData.streamName);
  });
  var webrtcPlay = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.getWebrtcPlay)(state, wowzaResponseData.streamName);
  });
  var peerConnection = webrtcPlay ? webrtcPlay.peerConnection : null;
  var websocket = webrtcPlay ? webrtcPlay.websocket : null;
  var connected = webrtcPlay ? webrtcPlay.connected : null;
  var audioTrack = webrtcPlay ? webrtcPlay.audioTrack : null;
  var videoTrack = webrtcPlay ? webrtcPlay.videoTrack : null;
  var playStart = playSettings ? playSettings.playStart : false;
  var playStarting = playSettings ? playSettings.playStarting : false;
  var playStop = playSettings ? playSettings.playStop : false;
  var playStopping = playSettings ? playSettings.playStopping : false;

  // Listen for changes in the play* flags in the playSettings store
  // and stop or stop playback accordingly

  (0, _react.useEffect)(function () {
    if (playStart && !playStarting && !connected) {
      dispatch({
        type: PlaySettingsActions.SET_PLAY_FLAGS,
        playStart: false,
        playStarting: true,
        streamName: wowzaResponseData.streamName
      });
      (0, _startPlay["default"])(playSettings, websocket, {
        onError: function onError(error) {
          // handle error					
          if (hasOwn(error, "websocketError") && socketRetryCount < 3) {
            dispatch({
              type: PlaySettingsActions.RESET_PLAY_SETTINGS,
              data: wowzaResponseData
            });
            dispatch({
              type: WebRTCPlayActions.RESET_WEBRTC,
              data: wowzaResponseData
            });
            setPlaySettings();
            setSocketRetryCount(socketRetryCount + 1);
          } else {
            setIsLoading(false);
            setStreamError(true);
          }
        },
        onConnectionStateChange: function onConnectionStateChange(result) {
          var actionData = _objectSpread(_objectSpread({}, wowzaResponseData), result);
          dispatch({
            type: WebRTCPlayActions.SET_WEBRTC_PLAY_CONNECTED,
            data: actionData
          });
        },
        onSetPeerConnection: function onSetPeerConnection(result) {
          var actionData = _objectSpread(_objectSpread({}, wowzaResponseData), result);
          dispatch({
            type: WebRTCPlayActions.SET_WEBRTC_PLAY_PEERCONNECTION,
            data: actionData
          });
        },
        onSetWebsocket: function onSetWebsocket(result) {
          var actionData = _objectSpread(_objectSpread({}, wowzaResponseData), result);
          dispatch({
            type: WebRTCPlayActions.SET_WEBRTC_PLAY_WEBSOCKET,
            data: actionData
          });
        },
        onPeerConnectionOnTrack: function onPeerConnectionOnTrack(event) {
          if (event.track != null && event.track.kind != null) {
            if (event.track.kind === "audio") {
              var actionData = _objectSpread({
                audioTrack: event.track
              }, wowzaResponseData);
              dispatch({
                type: WebRTCPlayActions.SET_WEBRTC_PLAY_AUDIO_TRACK,
                data: actionData
              });
            } else if (event.track.kind === "video") {
              var _actionData = _objectSpread({
                videoTrack: event.track
              }, wowzaResponseData);
              dispatch({
                type: WebRTCPlayActions.SET_WEBRTC_PLAY_VIDEO_TRACK,
                data: _actionData
              });
            }
          }
        }
      });
    }
    if (playStarting && connected) {
      dispatch({
        type: PlaySettingsActions.SET_PLAY_FLAGS,
        playStarting: false,
        streamName: wowzaResponseData.streamName
      });
    }
    if (playStop && !playStopping && connected) {
      dispatch({
        type: PlaySettingsActions.SET_PLAY_FLAGS,
        playStop: false,
        playStopping: true,
        streamName: wowzaResponseData.streamName
      });
      (0, _stopPlay["default"])(peerConnection, websocket, {
        onSetPeerConnection: function onSetPeerConnection(result) {
          var actionData = _objectSpread(_objectSpread({}, wowzaResponseData), result);
          dispatch({
            type: WebRTCPlayActions.SET_WEBRTC_PLAY_PEERCONNECTION,
            data: actionData
          });
        },
        onSetWebsocket: function onSetWebsocket(result) {
          var actionData = _objectSpread(_objectSpread({}, wowzaResponseData), result);
          dispatch({
            type: WebRTCPlayActions.SET_WEBRTC_PLAY_WEBSOCKET,
            data: actionData
          });
        },
        onPlayStopped: function onPlayStopped() {
          var actionData = _objectSpread({
            connected: false
          }, wowzaResponseData);
          dispatch({
            type: WebRTCPlayActions.SET_WEBRTC_PLAY_CONNECTED,
            data: actionData
          });
        }
      });
    }
    if (playStopping && !connected) {
      dispatch({
        type: PlaySettingsActions.SET_PLAY_FLAGS,
        playStopping: false,
        streamName: wowzaResponseData.streamName
      });
    }
  }, [dispatch, videoElement, playSettings, peerConnection, websocket, connected]);
  (0, _react.useEffect)(function () {
    if (connected) {
      var newStream = new MediaStream();
      if (audioTrack != null) newStream.addTrack(audioTrack);
      if (videoTrack != null) newStream.addTrack(videoTrack);
      if (videoElement != null && videoElement.current != null) videoElement.current.srcObject = newStream;
    } else {
      if (videoElement != null && videoElement.current != null) videoElement.current.srcObject = null;
    }
  }, [audioTrack, videoTrack, connected, videoElement]);
  var styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      flex: "auto",
      flexDirection: "column",
      justifyContent: "center",
      padding: "2.5%"
    },
    button: {
      zIndex: 99,
      marginTop: 12
    }
  };
  (0, _react.useEffect)(function () {
    if (playStart) {
      setIsLoading(!isLoading);
    } else if (!connected && !playStarting && isLoading) {
      setIsLoading(!isLoading);
    }
  }, [playSettings]);
  var playContent = function playContent() {
    if (!connected && playStarting && isLoading) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          height: "100%",
          width: "100%",
          padding: "2.5%",
          textAlign: "center"
        }
      }, /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, null));
    } else if (!connected && !playStarting || streamError) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "camera-text-wrapper",
        style: styles.wrapper
      }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        align: "center",
        variant: "subtitle1"
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.CBComponents.video.webRTCPlayer.camProblem"
      })), /*#__PURE__*/_react["default"].createElement(_material.Fab, {
        style: styles.button,
        color: "primary",
        onClick: getWowzaStream,
        size: "small"
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Refresh, {
        style: {
          color: "#FFF"
        }
      })));
    } else {
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "WebRTCPlayer-play-video-container",
        style: {
          height: "100%",
          width: "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("video", {
        id: "player-video",
        style: {
          height: "100%",
          width: "100%",
          padding: "2.5%"
        },
        ref: videoElement,
        autoPlay: true,
        playsInline: true,
        muted: true
      }));
    }
  };
  return playContent();
};
var _default = Player;
exports["default"] = _default;