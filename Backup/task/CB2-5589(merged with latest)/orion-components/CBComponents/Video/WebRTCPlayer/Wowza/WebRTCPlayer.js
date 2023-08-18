"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _Player = _interopRequireDefault(require("./Player"));
var _PlaySettings = _interopRequireDefault(require("./PlaySettings"));
var _clientAppCore = require("client-app-core");
var _reactRedux = require("react-redux");
var PlaySettingsActions = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/PlaySettings/actions"));
var PlaySettingsActionTypes = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/PlaySettings/actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var WowzaWebRTCPlayer = function WowzaWebRTCPlayer(_ref) {
  var camera = _ref.camera;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    wowzaResponseData = _useState2[0],
    setWowzaResponseData = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    isLoaded = _useState4[0],
    setIsLoaded = _useState4[1];
  var getWowzaStream = function getWowzaStream() {
    var id = camera.id,
      player = camera.player;
    //Logic for retrieving wowza webrtc information
    _clientAppCore.cameraService.getWowzaStream(id, function (err, response) {
      if (err) {
        console.log("ERROR", err);
      }
      if (!response) return;
      var streamConnected = response.data.streamConnected;
      if (streamConnected) {
        var streamName = response.data.streamName;
        var applicationName = player.applicationName,
          url = player.url;
        setWowzaResponseData(function (prevState) {
          return _objectSpread(_objectSpread({}, prevState), {}, {
            streamName: streamName,
            applicationName: applicationName,
            signalingURL: url
          });
        });
      }
    });
  };
  (0, _react.useEffect)(function () {
    getWowzaStream();
  }, [camera]);
  var setPlaySettings = function setPlaySettings() {
    var streamName = wowzaResponseData.streamName,
      applicationName = wowzaResponseData.applicationName,
      signalingURL = wowzaResponseData.signalingURL;
    dispatch({
      type: PlaySettingsActionTypes.SET_PLAY_SETTINGS,
      signalingURL: signalingURL,
      streamName: streamName,
      applicationName: applicationName
    });
    dispatch(PlaySettingsActions.startPlay(streamName));
  };
  var toggleLoading = function toggleLoading() {
    setIsLoaded(!isLoaded);
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    spacing: 3,
    className: "mt-3",
    id: "WebRTCPlayer-play-content"
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 12,
    md: 12,
    sm: 12,
    lg: 12
  }, isLoaded ? /*#__PURE__*/_react["default"].createElement(_Player["default"], {
    getWowzaStream: getWowzaStream,
    setPlaySettings: setPlaySettings,
    wowzaResponseData: wowzaResponseData
  }) : /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: "100%",
      width: "100%",
      padding: "2.5%",
      textAlign: "center"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, null))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 12
  }, (0, _keys["default"])(wowzaResponseData).length !== 0 && /*#__PURE__*/_react["default"].createElement(_PlaySettings["default"], {
    signalingURL: wowzaResponseData.signalingURL,
    applicationName: wowzaResponseData.applicationName,
    streamName: wowzaResponseData.streamName,
    toggleLoading: toggleLoading
  })));
};
var _default = WowzaWebRTCPlayer;
exports["default"] = _default;