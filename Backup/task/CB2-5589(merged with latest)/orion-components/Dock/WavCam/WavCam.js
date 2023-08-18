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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _parseFloat2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-float"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _js = require("@mdi/js");
var _CBComponents = require("orion-components/CBComponents");
var _WavCamOverlay = _interopRequireDefault(require("./WavCamOverlay"));
var _clientAppCore = require("client-app-core");
var _debounce = _interopRequireDefault(require("debounce"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _selectors = require("./selectors");
var _uuid = require("uuid");
var _selectors2 = require("../Cameras/selectors");
var _selector = require("orion-components/i18n/Config/selector");
var actionCreators = _interopRequireWildcard(require("./wavCamActions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context7, _context8; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context7 = ownKeys(Object(source), !0)).call(_context7, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context8 = ownKeys(Object(source))).call(_context8, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var WavCam = function WavCam() {
  var dispatch = (0, _reactRedux.useDispatch)();
  var toggleWavCam = actionCreators.toggleWavCam,
    toggleWavCamLabels = actionCreators.toggleWavCamLabels,
    getWavCamState = actionCreators.getWavCamState,
    startFOVItemStream = actionCreators.startFOVItemStream,
    setWavPanoState = actionCreators.setWavPanoState,
    setSelectedWavCam = actionCreators.setSelectedWavCam;
  var userCameras = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selectors2.userCamerasSelector)(state);
  }, _reactRedux.shallowEqual);
  var filteredUserCams = (0, _filter["default"])(userCameras).call(userCameras, function (cam) {
    var _context;
    return cam.entityData.properties.features && (0, _includes["default"])(_context = cam.entityData.properties.features).call(_context, "ribbon");
  });
  var wavCams = (0, _map["default"])(filteredUserCams).call(filteredUserCams, function (cam) {
    return {
      id: cam.id,
      name: cam.entityData.properties.name,
      instanceId: (0, _uuid.v4)(),
      config: cam.connection
    };
  });
  var wavCamPersistedState = (0, _reactRedux.useSelector)(function (state) {
    var _state$appState$persi, _state$appState$persi2;
    return (_state$appState$persi = (_state$appState$persi2 = state.appState.persisted) === null || _state$appState$persi2 === void 0 ? void 0 : _state$appState$persi2.wavcam_pano) !== null && _state$appState$persi !== void 0 ? _state$appState$persi : {
      wavCamMetadata: {}
    };
  }, _reactRedux.shallowEqual);
  var selectedWavCam = null;
  if (wavCams.length > 0) {
    selectedWavCam = wavCamPersistedState && wavCamPersistedState.selectedWavCam ? (0, _find["default"])(wavCams).call(wavCams, function (c) {
      return c.id === wavCamPersistedState.selectedWavCam;
    }) : wavCams[0];
  }
  var context = (0, _reactRedux.useSelector)(function (state) {
    return wavCams.length > 0 && selectedWavCam ? (0, _selectors.getContext)(selectedWavCam.id)(state) : null;
  }, _reactRedux.shallowEqual);
  var open = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.dockData.WavCam;
  }, _reactRedux.shallowEqual);
  var showWavCamLabels = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.dockData.showWavCamLabels || true;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var styles = {
    containerStyle: {
      height: 240,
      width: "100%",
      margin: "auto",
      background: "#1F1F21",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      userSelect: "none",
      placeContent: "center"
    },
    wavImageContainer: _objectSpread(_objectSpread(_objectSpread({
      position: "relative",
      width: "100%",
      height: "100%",
      margin: "0px"
    }, dir === "ltr" && {
      "float": "left"
    }), dir === "rtl" && {
      "float": "right"
    }), {}, {
      alignItems: "center",
      flex: 10,
      justifyContent: "center",
      userSelect: "none"
    }),
    wavImageInnerContainer: {
      position: "absolute",
      margin: "0px",
      alignItems: "center",
      overflow: "hidden",
      userSelect: "none",
      visibility: "hidden"
    },
    wavCamControlsContainer: _objectSpread(_objectSpread(_objectSpread({
      width: 48,
      height: "100%",
      background: "rgb(44, 45, 47, 0.5)"
    }, dir === "ltr" && {
      "float": "right"
    }), dir === "rtl" && {
      "float": "left"
    }), {}, {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      userSelect: "none"
    }),
    zoomControlsContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      userSelect: "none"
    },
    controlButtons: {
      color: "white",
      width: 24,
      height: 24,
      userSelect: "none"
    },
    circularProgress: _objectSpread(_objectSpread({
      position: "absolute"
    }, dir === "ltr" && {
      left: "50%"
    }), dir === "rtl" && {
      right: "50%"
    }),
    textAlignRight: {
      textAlign: "right"
    }
  };
  var wavContainerRef = _react["default"].useRef();
  var wavImageContainerRef = _react["default"].useRef();
  var wavOverlayContainerRef = _react["default"].useRef();
  var wavOverlayRef = _react["default"].useRef();
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    initialized = _useState2[0],
    setInitialized = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    initialFrameReceived = _useState4[0],
    setInitialFrameReceived = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    initialSyncComplete = _useState6[0],
    setInitialSyncComplete = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    metadata = _useState8[0],
    setMetadata = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    drawerOpen = _useState10[0],
    setDrawerOpen = _useState10[1];
  var stateRef = _react["default"].useRef({
    initialized: false,
    baseWavImageW: 0,
    baseWavImageH: 0,
    zoom: 0,
    zoomFactor: 0.1,
    panOffsetX: 0,
    panOffsetY: 0,
    zoomOffsetX: 0,
    zoomOffsetY: 0,
    factoredOffsetX: 0,
    factoredOffsetY: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    wavX: 0,
    wavY: 0,
    wavW: 0,
    wavH: 0,
    lastCommand: "",
    selectedWavCamId: null,
    seqNum: -1,
    activeSeqNum: -1
  });
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    isPanning = _useState12[0],
    setIsPanning = _useState12[1];
  (0, _react.useEffect)(function () {
    if (open) dispatch(getWavCamState());
    return function cleanup() {
      //	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
    };
  }, [open]);
  (0, _react.useEffect)(function () {
    if (initialFrameReceived === true) {
      syncStream();
    }
    return function cleanup() {
      //	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
    };
  }, [initialFrameReceived]);
  (0, _react.useEffect)(function () {
    if (wavImageContainerRef.current && wavOverlayContainerRef.current) {
      if (initialSyncComplete) {
        wavImageContainerRef.current.style.visibility = "visible";
        wavOverlayContainerRef.current.style.visibility = "visible";
      } else {
        wavImageContainerRef.current.style.visibility = "hidden";
        wavOverlayContainerRef.current.style.visibility = "hidden";
      }
    }
    return function cleanup() {
      //	-- returns on a useEffect are used for cleaning up like when we want to unsubscribe from something. React will only call it when it's time to clean up (unmount)--
    };
  }, [initialSyncComplete]);
  var getFullImageSize = function getFullImageSize(meta) {
    var newW = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    meta = meta ? meta : metadata;
    var horzExtent = (0, _parseInt2["default"])(meta["x-wavcam-horizontal-extents"]);
    var vertExtent = (0, _parseInt2["default"])(meta["x-wavcam-vertical-extents"]);
    var pixHPerPixW = vertExtent / horzExtent;
    var fullScaleW = Math.round(stateRef.current.baseWavImageW + stateRef.current.baseWavImageW * stateRef.current.zoom);
    var fullScaleH = fullScaleW * pixHPerPixW;
    var containerH = wavContainerRef.current.offsetHeight;
    var offsetTop = containerH > fullScaleH ? (containerH - fullScaleH) / 2 : 0;
    var maxWavImageW = stateRef.current.baseWavImageW * 2;
    var virtualXOffset = stateRef.current.wavX > 0 ? wavImageContainerRef.current.offsetWidth - maxWavImageW : 0;
    var offsetX = fullScaleW <= maxWavImageW ? 0 : (fullScaleW - virtualXOffset) * stateRef.current.wavX; /* + stateRef.current.factoredOffsetX; */

    return [fullScaleW, fullScaleH, offsetX, offsetTop, pixHPerPixW];
  };
  var updateMetadata = function updateMetadata(meta) {
    if (meta) {
      var imgSize = getFullImageSize(meta);
      var md = _objectSpread(_objectSpread({}, meta), {
        "wav-image-w": imgSize[0],
        "wav-image-h": imgSize[1],
        "wav-container-offset-x": imgSize[2],
        "wav-container-offset-y": imgSize[3],
        "wav-container-w": wavImageContainerRef.current.offsetWidth,
        "wav-container-h": wavImageContainerRef.current.offsetHeight,
        "wav-container-x": wavImageContainerRef.current.offsetLeft,
        "wav-container-y": wavImageContainerRef.current.offsetTop,
        "wav-container-base-w": stateRef.current.baseWavImageW,
        "wav-container-base-h": stateRef.current.baseWavImageH
      });
      md["x-wavcam-lat"] = selectedWavCam.config.lat || md["x-wavcam-lat"];
      md["x-wavcam-lon"] = selectedWavCam.config.lon || md["x-wavcam-lon"];
      md["x-wavcam-az"] = selectedWavCam.config.az || md["x-wavcam-az"];
      md["x-wavcam-el"] = selectedWavCam.config.el || md["x-wavcam-el"];
      md["x-wavcam-camera-az"] = selectedWavCam.config.az || md["x-wavcam-camera-az"];
      md["x-wavcam-camera-el"] = selectedWavCam.config.el || md["x-wavcam-camera-el"];
      md["x-wavcam-alt"] = selectedWavCam.config.alt || md["x-wavcam-alt"];
      md["x-wavcam-height"] = selectedWavCam.config.height || md["x-wavcam-height"];
      md["x-wavcam-hfov"] = selectedWavCam.config.hfov || md["x-wavcam-hfov"];
      md["x-wavcam-vfov"] = selectedWavCam.config.vfov || md["x-wavcam-vfov"];
      md["x-wavcam-horizontal-extents"] = selectedWavCam.config.horzExtent || md["x-wavcam-horizontal-extents"];
      md["x-wavcam-vertical-extents"] = selectedWavCam.config.vertExtent || md["x-wavcam-vertical-extents"];
      setMetadata(md);
      wavOverlayRef.current.refresh(md);
      dispatch(setWavPanoState(stateRef.current.selectedWavCamId, _objectSpread(_objectSpread({}, md), {
        stateRef: stateRef.current
      }), showWavCamLabels));
    }
  };
  var calcWavSlice = function calcWavSlice(tempMetadata) {
    var md = tempMetadata || metadata;
    if (!md) return;
    var horzExtent = (0, _parseInt2["default"])(md["x-wavcam-horizontal-extents"]);
    var vertExtent = (0, _parseInt2["default"])(md["x-wavcam-vertical-extents"]);
    var pixHPerPixW = vertExtent / horzExtent;

    // Full scale image - determine what portion is within current -> max container size
    var fullScaleW = Math.round(stateRef.current.baseWavImageW + stateRef.current.baseWavImageW * stateRef.current.zoom);
    var fullScaleH = fullScaleW * pixHPerPixW;
    var maxOffsetX = stateRef.current.baseWavImageW / 2;
    var maxOffsetY = stateRef.current.baseWavImageH / 2;
    var maxWavImageW = stateRef.current.baseWavImageW * 2;
    var maxWavImageH = stateRef.current.baseWavImageH * 2;
    var wavW = fullScaleW < maxWavImageW ? 1 : maxWavImageW / fullScaleW;
    var wavH = fullScaleH < maxWavImageH ? 1 : maxWavImageH / fullScaleH;

    // Calculate wavX on center - Zero if max zoom offset not reached otherwise diff from max as a percentage of the full image
    var wavX = Math.abs(stateRef.current.zoomOffsetX) < maxOffsetX ? 0 : (Math.abs(stateRef.current.zoomOffsetX) - maxOffsetX) / fullScaleW;
    // first take delta between image width at full scale and max image width
    if (wavX > 0) {
      // Percentage delta from center used to offset wavX percentage
      var overflowW = (fullScaleW - maxWavImageW) / 2;
      var percentOffset = stateRef.current.panOffsetX / overflowW;
      // If percentOffset > 1 then we have exceeded - anything exceeded now needs to apply to containerX with wavX staying fixed at 0 or 1
      if (percentOffset > 1) {
        wavX = 0;
        stateRef.current.factoredOffsetX = stateRef.current.panOffsetX - overflowW;
      } else if (percentOffset < -1) {
        wavX = 1 - wavW;
        stateRef.current.factoredOffsetX = stateRef.current.panOffsetX + overflowW;
      } else {
        wavX = wavX - wavX * percentOffset;
        stateRef.current.factoredOffsetX = 0;
      }
    } else {
      stateRef.current.factoredOffsetX = stateRef.current.panOffsetX; //0;
    }

    var wavY = Math.abs(stateRef.current.zoomOffsetY) < maxOffsetY ? 0 : (Math.abs(stateRef.current.zoomOffsetX) - maxOffsetY) / fullScaleH;
    if (wavY > 0) {
      // Percentage delta from center used to offset wavY percentage
      var overflowH = (fullScaleH - maxWavImageH) / 2;
      var _percentOffset = stateRef.current.panOffsetY / overflowH;
      // If percentOffset > 1 then we have exceeded - anything exceeded now needs to apply to containerY with wavY staying fixed at 0 or 1
      if (_percentOffset > 1) {
        wavY = 0;
        stateRef.current.factoredOffsetY = stateRef.current.panOffsetY - overflowH;
      } else if (_percentOffset < -1) {
        wavY = 1 - wavH;
        stateRef.current.factoredOffsetY = stateRef.current.panOffsetY + overflowH;
      } else {
        wavY = wavY - wavY * _percentOffset;
        stateRef.current.factoredOffsetY = 0;
      }
    } else {
      stateRef.current.factoredOffsetY = stateRef.current.panOffsetY; //0;
    }

    wavX = wavX > 1 - wavW ? 1 - wavW : wavX;
    wavY = wavY > 1 - wavH ? 1 - wavH : wavY;
    stateRef.current.wavX = wavX;
    stateRef.current.wavY = wavY;
    stateRef.current.wavW = wavW;
    stateRef.current.wavH = wavH;
    var winW = Math.round(fullScaleW < maxWavImageW ? fullScaleW : maxWavImageW);
    var winH = Math.round(fullScaleH < maxWavImageH ? fullScaleH : maxWavImageH);
    return {
      wavX: wavX,
      wavY: wavY,
      wavW: wavW,
      wavH: wavH,
      winW: winW,
      winH: winH
    };
  };
  var syncStream = function syncStream(tempMetadata) {
    var slice = calcWavSlice(tempMetadata);
    if (slice) {
      var _context2, _context3, _context4, _context5, _context6;
      var cmd = (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = (0, _concat["default"])(_context5 = (0, _concat["default"])(_context6 = "x=".concat(slice.wavX, "&y=")).call(_context6, slice.wavY, "&w=")).call(_context5, slice.wavW, "&h=")).call(_context4, slice.wavH, "&windowWidth=")).call(_context3, slice.winW, "&windowHeight=")).call(_context2, slice.winH);
      // -- always allow first otherwise don't execute duplicate commands
      if (stateRef.current.seqNum === -1 || cmd !== stateRef.current.lastCommand) {
        stateRef.current.lastCommand = cmd;
        cmd += "&seqNum=".concat(stateRef.current.seqNum + 1);
        stateRef.current.seqNum += 1;
        _clientAppCore.cameraService.virtualCommand(stateRef.current.selectedWavCamId, metadata, cmd);
      }
    }
  };
  var handleCameraZoomIn = function handleCameraZoomIn(evt) {
    stateRef.current.zoom = (0, _parseFloat2["default"])((stateRef.current.zoom + stateRef.current.zoomFactor).toFixed(1)); // maybe need a max here???
    scaleImage(stateRef.current.zoomFactor);
    calcZoom(stateRef.current.zoom);
  };
  var handleCameraZoomOut = function handleCameraZoomOut(evt) {
    if ((0, _parseFloat2["default"])(stateRef.current.zoom.toFixed(1)) > 0) {
      stateRef.current.zoom = (0, _parseFloat2["default"])((stateRef.current.zoom - stateRef.current.zoomFactor).toFixed(1));
      scaleImage(stateRef.current.zoomFactor * -1);
      calcZoom(stateRef.current.zoom);
    }
  };
  var syncStreamDebounce = (0, _debounce["default"])(syncStream, 2000);
  var scaleImage = function scaleImage(scaleDelta) {
    var deltaWidth = stateRef.current.baseWavImageW * scaleDelta;
    var newW = wavImageContainerRef.current.offsetWidth + deltaWidth;
    var fsMetadata = getFullImageSize(metadata, newW);
    var deltaHeight = fsMetadata[4] * newW - fsMetadata[4] * wavImageContainerRef.current.offsetWidth;
    var newH = wavImageContainerRef.current.offsetHeight + (fsMetadata[1] < stateRef.current.baseWavImageH ? 0 : deltaHeight);
    var newL = wavImageContainerRef.current.offsetLeft - deltaWidth / 2;
    var newT = wavImageContainerRef.current.offsetTop - (fsMetadata[1] < stateRef.current.baseWavImageH ? 0 : deltaHeight / 2);
    wavImageContainerRef.current.style.width = newW + "px";
    wavImageContainerRef.current.style.height = newH + "px";
    wavImageContainerRef.current.style.left = newL + "px";
    wavImageContainerRef.current.style.top = newT + "px";
    wavOverlayContainerRef.current.style.width = newW + "px";
    wavOverlayContainerRef.current.style.height = newH + "px";
    wavOverlayContainerRef.current.style.left = newL + "px";
    wavOverlayContainerRef.current.style.top = newT + "px";
    updateMetadata(metadata);
    syncStreamDebounce();
  };
  var calcZoom = function calcZoom(z) {
    var newW = Math.round(stateRef.current.baseWavImageW + stateRef.current.baseWavImageW * z);
    var fsMetadata = getFullImageSize(metadata, newW);
    var newH = fsMetadata[1] > stateRef.current.baseWavImageH ? fsMetadata[1] : stateRef.current.baseWavImageH;
    stateRef.current.zoomOffsetX = Math.round((newW - stateRef.current.baseWavImageW) / 2) * -1;
    stateRef.current.zoomOffsetY = Math.round((newH - stateRef.current.baseWavImageH) / 2) * -1;
  };
  var imageChange = function imageChange(meta, imgDimensions) {
    if (!stateRef.current.selectedWavCamId && selectedWavCam.id !== stateRef.current.selectedWavCamId) {
      return;
    }
    // Center if dimensions of image are beyond dimensions of max W/H
    var currentSeqNum = (0, _parseInt2["default"])(meta["x-wavcam-last-seq-number"]);
    if (!stateRef.current.initialized || currentSeqNum > stateRef.current.activeSeqNum) {
      var horzExtent = (0, _parseInt2["default"])(meta["x-wavcam-horizontal-extents"]);
      var vertExtent = (0, _parseInt2["default"])(meta["x-wavcam-vertical-extents"]);
      var pixHPerPixW = vertExtent / horzExtent;

      // Full scale image - determine what portion is within current -> max container size
      var fullScaleW = Math.round(stateRef.current.baseWavImageW + stateRef.current.baseWavImageW * stateRef.current.zoom);
      var fullScaleH = fullScaleW * pixHPerPixW;
      var maxWavImageW = stateRef.current.baseWavImageW * 2;
      var maxWavImageH = stateRef.current.baseWavImageH * 2;
      var winW = Math.round(fullScaleW < maxWavImageW ? fullScaleW : maxWavImageW);
      var winH = Math.round(fullScaleH < maxWavImageH ? fullScaleH : maxWavImageH);
      winH = winH < stateRef.current.baseWavImageH ? stateRef.current.baseWavImageH : winH;
      var left = (winW - stateRef.current.baseWavImageW) / 2 * -1 + stateRef.current.factoredOffsetX;
      var top = (winH - stateRef.current.baseWavImageH) / 2 * -1 + stateRef.current.factoredOffsetY; //+ stateRef.current.panOffsetY;

      wavImageContainerRef.current.style.width = winW + "px";
      wavImageContainerRef.current.style.height = winH + "px";
      wavImageContainerRef.current.style.left = "".concat(left, "px");
      wavImageContainerRef.current.style.top = "".concat(top, "px");
      wavOverlayContainerRef.current.style.width = winW + "px";
      wavOverlayContainerRef.current.style.height = winH + "px";
      wavOverlayContainerRef.current.style.left = "".concat(left, "px");
      wavOverlayContainerRef.current.style.top = "".concat(top, "px");
      stateRef.current.activeSeqNum = currentSeqNum;
      updateMetadata(meta);
      stateRef.current.initialized = true;
      // if I set initial call to fetch frame from here (streamUrl) then it could load correct initial image
      // I can make an optional setStreamUrl from here
      if (!initialFrameReceived) {
        setInitialFrameReceived(true);
      }
      if (stateRef.current.seqNum === 0) {
        setInitialSyncComplete(true);
      }
    }
    // if(initialFrameReceived) {
    // 	startFOVItemStream(selectedWavCam.id, "wavcam");
    // }
  };

  var handleZoomStop = function handleZoomStop() {};
  var _onPointerDown = function _onPointerDown(e) {
    setIsPanning(true);
    stateRef.current.pointerStartX = e.clientX;
    stateRef.current.pointerStartY = e.clientY;
  };
  var _onPointerUp = function _onPointerUp(e) {
    setIsPanning(false);
    updateMetadata(metadata);
    syncStreamDebounce();
  };
  var _onPointerMove = function _onPointerMove(e) {
    e.nativeEvent.stopImmediatePropagation();

    // TODO: Add limits so can't pan beyond edges of image (Based off Full Image Size even cropped)
    if (isPanning && wavImageContainerRef.current) {
      var movementX = e.clientX - stateRef.current.pointerStartX;
      var movementY = e.clientY - stateRef.current.pointerStartY;
      var pOX = stateRef.current.panOffsetX + movementX;
      var pOY = stateRef.current.panOffsetY + movementY;
      stateRef.current.panOffsetX = pOX;
      stateRef.current.panOffsetY = pOY;
      var newL = wavImageContainerRef.current.offsetLeft + movementX;
      var newT = wavImageContainerRef.current.offsetTop + movementY;
      wavImageContainerRef.current.style.left = "".concat(newL, "px");
      wavImageContainerRef.current.style.top = "".concat(newT, "px");
      wavOverlayContainerRef.current.style.left = "".concat(newL, "px");
      wavOverlayContainerRef.current.style.top = "".concat(newT, "px");
      stateRef.current.pointerStartX = e.clientX;
      stateRef.current.pointerStartY = e.clientY;
    }
  };
  var _onMouseWheel = function _onMouseWheel(e) {
    e.deltaY < 0 ? handleCameraZoomIn() : handleCameraZoomOut();
  };
  var collapseEntered = function collapseEntered(elem, isAppearing) {
    if (!stateRef.current.selectedWavCamId) stateRef.current.selectedWavCamId = wavCamPersistedState !== null && wavCamPersistedState !== void 0 && wavCamPersistedState.selectedWavCam ? wavCamPersistedState.selectedWavCam : selectedWavCam.id;
    var meta = wavCamPersistedState && wavCamPersistedState.wavCamMetadata ? wavCamPersistedState.wavCamMetadata[stateRef.current.selectedWavCamId] : null;
    var w = wavContainerRef.current.offsetWidth;
    var h = wavContainerRef.current.offsetHeight;
    var x = 0;
    var y = 0;
    if (meta) {
      delete meta["x-wavcam-image-control-endpoint"];
      delete meta["x-wavcam-image-endpoint"];
      delete meta["x-wavcam-instance-control-endpoint"];
      delete meta["x-wavcam-last-seq-number"];
      delete meta.stateRef.selectedWavCamId;
      stateRef.current = _objectSpread(_objectSpread({}, stateRef.current), meta.stateRef);
      stateRef.current.initialized = false;
      stateRef.current.lastCommand = "";
      stateRef.current.seqNum = -1;
      stateRef.current.activeSeqNum = -1;
      w = meta["wav-container-w"];
      h = meta["wav-container-h"];
      x = meta["wav-container-x"];
      y = meta["wav-container-y"];
      setMetadata(meta);
    }
    stateRef.current.baseWavImageW = wavContainerRef.current.offsetWidth;
    stateRef.current.baseWavImageH = wavContainerRef.current.offsetHeight;
    wavOverlayContainerRef.current.style.width = wavImageContainerRef.current.style.width = "".concat(w, "px");
    wavOverlayContainerRef.current.style.height = wavImageContainerRef.current.style.height = "".concat(h, "px");
    wavOverlayContainerRef.current.style.left = wavImageContainerRef.current.style.left = "".concat(x, "px");
    wavOverlayContainerRef.current.style.top = wavImageContainerRef.current.style.top = "".concat(y, "px");
    dispatch(startFOVItemStream(stateRef.current.selectedWavCamId, "wavcam"));
    setInitialized(true);
  };
  var collapseExited = function collapseExited(elem) {
    resetState();
  };
  var setLabelVisibility = function setLabelVisibility(isVisible) {
    dispatch(toggleWavCamLabels());
    dispatch(setWavPanoState(selectedWavCam.id, metadata, isVisible));
  };
  var resetState = function resetState() {
    setMetadata(null);
    stateRef.current.initialized = false;
    stateRef.current.baseWavImageW = 0;
    stateRef.current.baseWavImageH = 0;
    stateRef.current.zoom = 0;
    stateRef.current.panOffsetX = 0;
    stateRef.current.panOffsetY = 0;
    stateRef.current.zoomOffsetX = 0;
    stateRef.current.zoomOffsetY = 0;
    stateRef.current.factoredOffsetX = 0;
    stateRef.current.factoredOffsetY = 0;
    stateRef.current.pointerStartX = 0;
    stateRef.current.pointerStartY = 0;
    stateRef.current.wavX = 0;
    stateRef.current.wavY = 0;
    stateRef.current.wavW = 0;
    stateRef.current.wavH = 0;
    stateRef.current.lastCommand = "";
    setInitialFrameReceived(false);
    setInitialSyncComplete(false);
    stateRef.current.activeSeqNum = -1;
    stateRef.current.seqNum = -1;
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": open,
    mountOnEnter: true,
    unmountOnExit: true,
    onEntered: collapseEntered,
    onExited: collapseExited,
    width: 1
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Drawer, {
    PaperProps: {
      style: {
        right: 48,
        top: 48,
        height: 240
      }
    },
    anchor: dir == "rtl" ? "left" : "right",
    open: drawerOpen,
    onClose: function onClose() {
      return setDrawerOpen(false);
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    role: "presentation",
    style: {
      paddingLeft: 16,
      paddingTop: 8,
      paddingRight: 16,
      backgroundColor: "rgb(31, 31, 33)",
      width: 300,
      height: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("h4", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.wavCam.main.wavCamOptions"
  })), /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: dir == "rtl" ? {
      paddingLeft: 0
    } : {
      paddingRight: 0
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.dock.wavCam.main.wavCamLabels"),
    style: styles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    checked: showWavCamLabels,
    color: "primary",
    onChange: function onChange(e, checked) {
      return setLabelVisibility(checked);
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItem, null, /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "WavCam-selection",
    label: (0, _i18n.getTranslation)("global.dock.wavCam.main.selectWavCam"),
    handleChange: function handleChange(e) {
      resetState();
      dispatch(setSelectedWavCam(e.target.value));
      stateRef.current.selectedWavCamId = e.target.value;
      collapseEntered(null, true);
    },
    value: selectedWavCam ? selectedWavCam.id : null,
    items: wavCams,
    dir: dir
  })))))), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.containerStyle
  }, !initialSyncComplete && /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, {
    style: styles.circularProgress
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wavImageContainer,
    ref: wavContainerRef,
    onPointerDown: _onPointerDown,
    onPointerMove: _onPointerMove,
    onPointerUp: _onPointerUp,
    onWheel: _onMouseWheel
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wavImageInnerContainer,
    ref: wavImageContainerRef
  }, wavImageContainerRef.current && /*#__PURE__*/_react["default"].createElement(_CBComponents.WSImagePlayer, {
    cameraId: selectedWavCam.id,
    instanceId: selectedWavCam.instanceId,
    videoProfile: "desktop",
    imageChange: imageChange,
    fullscreen: false,
    displayProgress: false
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wavImageInnerContainer,
    ref: wavOverlayContainerRef
  }, wavImageContainerRef.current && /*#__PURE__*/_react["default"].createElement(_WavCamOverlay["default"], {
    imageMetadata: metadata,
    fovItems: context ? context.fovItems : [],
    visible: showWavCamLabels,
    ref: wavOverlayRef
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wavCamControlsContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wavCamControlsContainer
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: {
      paddingTop: 12
    },
    onClick: function onClick() {
      return dispatch(toggleWavCam());
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    style: styles.controlButtons
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiCloseCircle
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.zoomControlsContainer
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: {
      paddingBottom: 6
    },
    onMouseDown: handleCameraZoomIn,
    onMouseUp: handleZoomStop
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.AddBox, {
    style: styles.controlButtons
  })), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: {
      paddingTop: 6
    },
    onMouseDown: handleCameraZoomOut,
    onMouseUp: handleZoomStop
  }, /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    style: styles.controlButtons
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiMinusBox
  })))), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: {
      paddingBottom: 12
    },
    onClick: function onClick() {
      return setDrawerOpen(!drawerOpen);
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.MenuOpen, {
    style: styles.controlButtons
  }))))));
};
var _default = WavCam;
exports["default"] = _default;