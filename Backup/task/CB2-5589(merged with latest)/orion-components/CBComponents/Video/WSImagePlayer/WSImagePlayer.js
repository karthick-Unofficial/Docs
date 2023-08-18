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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _contextStreaming = require("orion-components/ContextualData/contextStreaming");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  cameraId: _propTypes["default"].string.isRequired,
  instanceId: _propTypes["default"].string,
  videoProfile: _propTypes["default"].string,
  fullscreen: _propTypes["default"].bool,
  entityId: _propTypes["default"].string,
  entityType: _propTypes["default"].string,
  displayProgress: _propTypes["default"].bool,
  playbackStartTime: _propTypes["default"].string,
  playbackPlaying: _propTypes["default"].bool,
  currentReplayMedia: _propTypes["default"].array,
  addReplayMedia: _propTypes["default"].func,
  removeReplayMedia: _propTypes["default"].func,
  imageChange: _propTypes["default"].func
};
var defaultProps = {
  instanceId: "",
  videoProfile: "desktop",
  fullscreen: false,
  entityId: "",
  entityType: "",
  displayProgress: true,
  playbackStartTime: null,
  playbackPlaying: null,
  currentReplayMedia: [],
  addReplayMedia: function addReplayMedia() {},
  removeReplayMedia: function removeReplayMedia() {}
};
var WSImagePlayer = function WSImagePlayer(props) {
  var cameraId = props.cameraId,
    videoProfile = props.videoProfile,
    instanceId = props.instanceId,
    entityType = props.entityType,
    playbackStartTime = props.playbackStartTime,
    entityId = props.entityId,
    playBarValue = props.playBarValue,
    playbackPlaying = props.playbackPlaying,
    removeReplayMedia = props.removeReplayMedia,
    currentReplayMedia = props.currentReplayMedia,
    addReplayMedia = props.addReplayMedia,
    imageChange = props.imageChange,
    displayProgress = props.displayProgress;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    videoData = _useState2[0],
    setVideoData = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    metadata = _useState4[0],
    setMetadata = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    subscription = _useState6[0],
    setSubscription = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    error = _useState8[0],
    setError = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    playbackVideoId = _useState10[0],
    setPlaybackVideoId = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    playbackStreamStarted = _useState12[0],
    setPlaybackStreamStarted = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    replaySetupStream = _useState14[0],
    setReplaySetupStream = _useState14[1];
  var _useState15 = (0, _react.useState)(),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    recoverPlaybackStreamState = _useState16[0],
    setRecoverPlaybackStreamState = _useState16[1];
  var prevPropCameraId = (0, _react.useRef)();
  var prevPropPlaybackPlaying = (0, _react.useRef)();
  var prevPropCurrentReplayMedia = (0, _react.useRef)();
  var imageRef = (0, _react.useRef)();
  var playerDiv = (0, _react.useRef)();
  var isMounted = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    isMounted.current = true;
    return function () {
      isMounted.current = false;
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (!playbackStartTime) {
      play(cameraId, videoProfile, instanceId, entityId, entityType);
    } else {
      setupPlaybackStream(cameraId, videoProfile, playbackStartTime);
    }
  }, []);

  // If stream, kill it on unmount
  (0, _react.useEffect)(function () {
    return function () {
      if (subscription) {
        //simpleUnsub(subscription.channel);
        subscription.unsubscribe();
      }
    };
  }, [subscription]);

  // If camera changes, unsub old camera and sub to new camera
  (0, _react.useEffect)(function () {
    // If camera is different on prop change
    if (prevPropCameraId.current !== cameraId) {
      prevPropCameraId.current = cameraId;
      // If subscription, unsub
      if (subscription) {
        (0, _contextStreaming.simpleUnsub)(subscription.channel);
      }
      if (playbackVideoId) {
        // -- if there is a playback video loaded, decrement the loadedVideos state count
        dispatch(removeReplayMedia(cameraId));
      }

      // Clear out state
      setVideoData(null);
      setSubscription(null);
      setError(null);
      setPlaybackVideoId(null);
      setPlaybackStreamStarted(false);
      setRecoverPlaybackStreamState(false);

      // Start new video
      if (!playbackStartTime) {
        play(cameraId, videoProfile, instanceId, entityId, entityType);
      } else {
        setupPlaybackStream(cameraId, videoProfile, playbackStartTime);
      }
    } else {
      // -- Pause/Play playback stream if applicable
      if (playbackVideoId && prevPropPlaybackPlaying.current !== playbackPlaying) {
        if (playbackPlaying) {
          startPlaybackStream(cameraId, playbackVideoId);
        } else {
          pausePlaybackStream(cameraId, playbackVideoId);
        }
        prevPropPlaybackPlaying.current = playbackPlaying;
      }
    }

    // -- FOR REPLAY - restart playback video if new media (audio or video) has been loaded
    if (prevPropCurrentReplayMedia.current !== currentReplayMedia && currentReplayMedia.length > 0 && playbackStartTime) {
      prevPropCurrentReplayMedia.current = currentReplayMedia;
      // -- restart playback video if the new media is not this camera
      var newMediaId = (0, _filter["default"])(currentReplayMedia).call(currentReplayMedia, function (media) {
        var _context;
        return !(0, _includes["default"])(_context = prevPropCurrentReplayMedia.current).call(_context, media);
      })[0];
      if (newMediaId && newMediaId !== cameraId) {
        // If subscription, unsub
        if (subscription) {
          (0, _contextStreaming.simpleUnsub)(subscription.channel);
        }
        // Clear out state
        setVideoData(null);
        setSubscription(null);
        setError(null);
        setPlaybackVideoId(null);
        setPlaybackStreamStarted(false);
        // -- Establish a new stream at current play bar value without firing the videoUpdated event
        restartPlaybackStream(cameraId, videoProfile, playbackStartTime);
      }
    }
    if (recoverPlaybackStreamState) {
      // Clear out state
      setVideoData(null);
      setSubscription(null);
      setError(null);
      setPlaybackVideoId(null);
      setPlaybackStreamStarted(false);
      setRecoverPlaybackStreamState(false);
      // -- Establish a new stream without firing the videoUpdated event
      restartPlaybackStream(cameraId, videoProfile, playBarValue, true);
    }
  }, [props, recoverPlaybackStreamState]);
  var play = function play(cameraId, videoProfile, instanceId, entityId, entityType) {
    // -- Live video
    var options = {
      instanceId: instanceId,
      playerWidth: playerDiv.current.offsetWidth,
      playerHeight: playerDiv.current.offsetHeight
    };
    if (entityId) options["entityId"] = entityId;
    if (entityType) options["entityType"] = entityType;
    _clientAppCore.cameraService.streamVideo(cameraId, videoProfile, options, function (err, response) {
      if (err) console.log(err);
      if (!response || !isMounted.current) return;
      var code = response.code,
        Data = response.Data,
        metadata = response.metadata;
      if (code) {
        setError(true);
      } else if (Data) {
        setVideoData("data:image/jpeg;base64," + Data);
        setMetadata(metadata);
      }
    }).then(function (sub) {
      setSubscription(sub);
    });
  };
  var setupPlaybackStream = function setupPlaybackStream(cameraId, videoProfile, playbackStartTime) {
    // -- Playback video
    _clientAppCore.cameraService.setupPlaybackStream(cameraId, videoProfile, playbackStartTime, function (err, response) {
      if (err) console.log(err);
      if (!response) return;

      // -- allow a null image for now, as milestone can't always access the exact time in the recorder service
      if (response.result && response.result.videoId) {
        var videoId = response.result.videoId;
        setVideoData(response.result.image || null);
        setPlaybackVideoId(videoId);
        setReplaySetupStream(false);
        dispatch(addReplayMedia(cameraId));
      } else {
        setError(true);
        setReplaySetupStream(false);
      }
    });

    // -- enable loading icon
    setReplaySetupStream(true);
  };
  var restartPlaybackStream = function restartPlaybackStream(cameraId, videoProfile, playbackStartTime) {
    var autoStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    // -- Playback video
    var t0 = performance.now();
    _clientAppCore.cameraService.setupPlaybackStream(cameraId, videoProfile, playbackStartTime, function (err, response) {
      if (err) console.log(err);
      if (!response || response.result === false) {
        setError(true);
        return console.log("Error restarting stream. Check camera-app logs for more details.");
      }
      var t1 = performance.now();
      console.log("Time to restart playback stream took ".concat(t1 - t0, " milliseconds."));

      // -- allow a null image for now, as milestone can't always access the exact time in the recorder service
      if (response.result && response.result.videoId) {
        var videoId = response.result.videoId;
        setVideoData(response.result.image || null);
        setPlaybackVideoId(videoId);
        setReplaySetupStream(false);
        if (autoStart) {
          startPlaybackStream(cameraId, videoId);
        }
      } else {
        setError(true);
        setReplaySetupStream(false);
      }
    });

    // -- enable loading icon
    setReplaySetupStream(true);
  };
  var startPlaybackStream = function startPlaybackStream(cameraId, videoId) {
    // -- start stream and image retrieval stream
    _clientAppCore.cameraService.startPlaybackStream(cameraId, videoId, function (err, response) {
      if (err) console.log(err);
      if (!response || response.result === false) {
        return console.log("Error starting stream. Check camera-app logs for more details.");
      }
      if (!playbackStreamStarted) {
        _clientAppCore.cameraService.streamPlayback(cameraId, videoId, function (err, response) {
          if (err) console.log(err);
          if (!response) return;
          var code = response.code,
            image = response.image;
          if (code) {
            setRecoverPlaybackStreamState(true);
          } else if (image) {
            setError(false);
            setVideoData(image);
          }
        }).then(function (sub) {
          setSubscription(sub);
          setPlaybackStreamStarted(true);
        });
      }
    });
  };
  var pausePlaybackStream = function pausePlaybackStream(cameraId, videoId) {
    // -- pause stream and stop image retrieval
    _clientAppCore.cameraService.pausePlaybackStream(cameraId, videoId, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
    });
  };
  var styles = {
    wrapper: {
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      placeContent: "center",
      justifyContent: "center"
    },
    video: {
      width: "100%",
      margin: "auto",
      maxWidth: "100%",
      objectFit: "contain",
      maxHeight: "100%",
      height: "100%"
    }
  };
  var handleImageChange = function handleImageChange() {
    var dim = imageRef.current ? [imageRef.current.offsetWidth, imageRef.current.offsetHeight] : null;
    if (imageChange) imageChange(metadata, dim);
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wrapper,
    ref: playerDiv
  }, displayProgress && !error && (subscription || replaySetupStream) && !videoData && /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, null), error && /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    align: "center",
    variant: "subtitle1"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.video.wsImagePlayer.encounteredText"
  })), videoData && /*#__PURE__*/_react["default"].createElement("img", {
    ref: imageRef,
    onLoad: handleImageChange,
    key: "camera",
    alt: "camera",
    src: videoData,
    style: styles.video
  }));
};
WSImagePlayer.propTypes = propTypes;
WSImagePlayer.defaultProps = defaultProps;
var _default = WSImagePlayer;
exports["default"] = _default;