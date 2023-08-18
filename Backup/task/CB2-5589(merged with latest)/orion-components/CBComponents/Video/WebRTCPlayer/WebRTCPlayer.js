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
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _flashphoner = _interopRequireDefault(require("./flashphoner.js"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var constants = _flashphoner["default"].constants;
var SESSION_STATUS = constants.SESSION_STATUS,
  STREAM_STATUS = constants.STREAM_STATUS;
var ESTABLISHED = SESSION_STATUS.ESTABLISHED,
  DISCONNECTED = SESSION_STATUS.DISCONNECTED,
  FAILED = SESSION_STATUS.FAILED;
var PENDING = STREAM_STATUS.PENDING,
  PLAYING = STREAM_STATUS.PLAYING,
  PLAYBACK_PROBLEM = STREAM_STATUS.PLAYBACK_PROBLEM,
  STOPPED = STREAM_STATUS.STOPPED,
  NOT_ENOUGH_BANDWIDTH = STREAM_STATUS.NOT_ENOUGH_BANDWIDTH;
// Potentially necessary to connect across different networks
// const mediaOptions = {
// 	iceServers: [
// 		{
// 			urls: "turn:turn.flashphoner.com:443?transport=tcp",
// 			username: "flashphoner",
// 			credential: "coM77EMrV7Cwhyan"
// 		}
// 	]
// };

var propTypes = {
  url: _propTypes["default"].string.isRequired,
  streamUrl: _propTypes["default"].string,
  streamUrlError: _propTypes["default"].bool
};
var defaultProps = {
  streamUrl: ""
};
var WebRTCPlayer = function WebRTCPlayer(props) {
  var url = props.url,
    streamUrl = props.streamUrl,
    streamUrlError = props.streamUrlError;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    status = _useState2[0],
    setStatus = _useState2[1];
  var frame = (0, _react.useRef)(null);
  var _isMounted = (0, _react.useRef)(false);
  var _useState3 = (0, _react.useState)(),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    session = _useState4[0],
    setSession = _useState4[1];
  var _useState5 = (0, _react.useState)(),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    stream = _useState6[0],
    setStream = _useState6[1];
  var streamUrlRef = (0, _react.useRef)(streamUrl);
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)(null);
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);

  //force update
  var _useState7 = (0, _react.useState)(),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    updateState = _useState8[1];
  var forceUpdate = (0, _react.useCallback)(function () {
    return updateState({});
  }, []);
  (0, _react.useEffect)(function () {
    // If we have a URL and it's either the first one or changed
    if (!!url && (!prevProps || url !== prevProps.url)) {
      if (session) {
        // Since there's an existing session, we need to kill it and create a new one
        handleRefresh();
      } else {
        // No existing session, so we just need to start one
        startSession();
      }
    }
  }, [url]);
  (0, _react.useEffect)(function () {
    streamUrlRef.current = streamUrl;
    // If there's no existing session, we won't do anything here
    if (session) {
      // If we have a streamUrl and it's either the first one or changed
      if (!!streamUrl && (!prevProps || streamUrl !== prevProps.streamUrl)) {
        if (stream) {
          // Existing stream, so we need to stop it first
          stream.stop();
        }

        // Start new stream
        startStream(session);
      }
    }
  }, [streamUrl]);
  (0, _react.useEffect)(function () {
    _isMounted.current = true;
    return function () {
      _isMounted.current = false;
      endSession();
    };
  }, []);
  var endSession = function endSession() {
    if (stream) stream.stop();
    if (session) session.disconnect();
  };
  var startSession = function startSession() {
    if (!frame.current) {
      forceUpdate();
    }
    try {
      _flashphoner["default"].init({
        receiverLocation: "WSReceiver2.js",
        decoderLocation: "video-worker2.js",
        preferredMediaProviders: []
      });
      _flashphoner["default"].createSession({
        urlServer: url
      }).on(ESTABLISHED, function (session) {
        if (_isMounted.current) {
          setStatus(session.status());

          // If we have a streamUrl, we'll go ahead and start the stream
          // If we don't, we will start the stream when we have one.
          if (streamUrlRef.current) {
            startStream(session);
          }
          setSession(session);
        } else {
          session.disconnect();
        }
      }).on(DISCONNECTED, function () {
        if (_isMounted.current) {
          setStatus("DISCONNECTED");
        }
      }).on(FAILED, function () {
        if (_isMounted.current) {
          setStatus("FAILED");
        }
      });
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  var startStream = function startStream(session) {
    var options = {
      name: streamUrlRef.current,
      display: frame.current
    };
    var stream = session.createStream(options).on(PENDING, function () {
      if (_isMounted.current) {
        setStatus("PENDING");
        var video = document.getElementById(stream.id());
        video.style.maxWidth = "100%";
        video.style.maxHeight = "100%";
        video.style.objectFit = "contain";
        video.style.height = "100%";
        video.style.display = "none";
      }
    }).on(PLAYBACK_PROBLEM, function () {
      if (_isMounted.current) {
        setStatus("FAILED");
      }
    }).on(PLAYING, function () {
      if (_isMounted.current) {
        setStatus("PLAYING");
        var video = document.getElementById(stream.id());
        video.style.display = "block";
      } else {
        stream.stop();
      }
    }).on(STOPPED, function () {
      if (_isMounted.current) {
        setStatus("STOPPED");
      }
    }).on(STREAM_STATUS.FAILED, function () {
      if (_isMounted.current) {
        setStatus("FAILED");
      }
    }).on(NOT_ENOUGH_BANDWIDTH, function () {
      if (_isMounted.current) {
        setStatus("LOW BANDWIDTH");
      }
    });
    setStream(stream);
    stream.play();
  };
  var handleRefresh = function handleRefresh(e) {
    if (e) {
      e.stopPropagation();
    }
    endSession();
    setStatus(null);
    startSession();
  };
  var styles = {
    wrapper: {
      display: "flex",
      position: "absolute",
      alignItems: "center",
      flex: "auto",
      flexDirection: "column",
      justifyContent: "center"
    },
    button: {
      zIndex: 99,
      marginTop: 12
    }
  };
  var statusIndicator = function statusIndicator() {
    if (status === "FAILED") {
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        align: "center",
        variant: "subtitle1"
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.CBComponents.video.webRTCPlayer.camProblem"
      })), /*#__PURE__*/_react["default"].createElement(_material.Fab, {
        style: styles.button,
        color: "primary",
        onClick: handleRefresh,
        size: "small"
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Refresh, {
        style: {
          color: "#FFF"
        }
      })));
    } else if (streamUrlError) {
      return /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        align: "center",
        variant: "subtitle1"
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.CBComponents.video.webRTCPlayer.unableToAccess"
      }));
    } else if (status === "PLAYING") {
      return null;
    } else {
      return /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, null);
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: frame,
    className: "camera-text-wrapper",
    style: styles.wrapper
  }, statusIndicator());
};
WebRTCPlayer.propTypes = propTypes;
WebRTCPlayer.defaultProps = defaultProps;
var _default = WebRTCPlayer;
exports["default"] = _default;