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
var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _CBComponents = require("orion-components/CBComponents");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  camera: _propTypes["default"].object.isRequired,
  dir: _propTypes["default"].string
};
var LradControls = function LradControls(_ref) {
  var camera = _ref.camera,
    dir = _ref.dir;
  var _useState = (0, _react.useState)(0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    volume = _useState2[0],
    setVolume = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    tempVolume = _useState4[0],
    setTempVolume = _useState4[1]; // Only for purpose of displaying intermediate state on slider
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    beamOn = _useState6[0],
    setBeamOn = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    strobeOn = _useState8[0],
    setStrobeOn = _useState8[1];
  var _useState9 = (0, _react.useState)([]),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    audioFiles = _useState10[0],
    setAudioFiles = _useState10[1];
  var _useState11 = (0, _react.useState)(""),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    selectedAudioFile = _useState12[0],
    setSelectedAudioFile = _useState12[1];
  var _useState13 = (0, _react.useState)("stopped"),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    playStatus = _useState14[0],
    setPlayStatus = _useState14[1];
  var playStatusIntHandleRef = (0, _react.useRef)(null);
  var styles = {
    playAudioSelectContainer: _objectSpread(_objectSpread({
      display: "flex",
      flexDirection: "column",
      minWidth: 250
    }, dir === "rtl" && {
      paddingLeft: 10
    }), dir === "ltr" && {
      paddingRight: 10
    }),
    volumeSliderContainer: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      marginRight: 10
    }), dir === "ltr" && {
      marginLeft: 10
    }), {}, {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column"
    })
  };
  var logError = function logError(err, response) {
    if (err) {
      console.log("Error: " + err);
    } else if (response && response.reason) {
      console.log("Error: " + response.reason.message);
    }
  };
  var handleFetchVolume = function handleFetchVolume(err, response) {
    if (err || !response || !response.success) {
      logError(err, response);
      return;
    }
    var vol = Math.round(response.volume);
    setVolume(vol);
    setTempVolume(vol);
  };
  var handleFetchBeamInfo = function handleFetchBeamInfo(err, response) {
    if (err || !response || !response.success) {
      logError(err, response);
      return;
    }
    var _response$beamInfo = response.beamInfo,
      beam = _response$beamInfo.beam,
      strobe = _response$beamInfo.strobe;
    setBeamOn(beam);
    setStrobeOn(strobe);
  };
  var handleFetchAudioFiles = function handleFetchAudioFiles(err, response) {
    if (err || !response || !response.success) {
      logError(err, response);
      return;
    }
    setAudioFiles(response.files);
  };
  var playAudio = function playAudio() {
    if (selectedAudioFile) {
      _clientAppCore.lradService.playAudio(camera.id, selectedAudioFile, function (err, response) {
        if (err || !response || !response.success) {
          logError(err, response);
          return;
        }
        setPlayStatus("playing");
        var handle = (0, _setInterval2["default"])(checkIfPlaying, 1000);
        playStatusIntHandleRef.current = handle;
      });
    }
  };
  var stopAudio = function stopAudio() {
    _clientAppCore.lradService.stopAudio(camera.id, function (err, response) {
      if (err || !response || !response.success) {
        logError(err, response);
        return;
      }
      setPlayStatus("stopped");
      if (playStatusIntHandleRef.current) {
        clearInterval(playStatusIntHandleRef.current);
        playStatusIntHandleRef.current = null;
      }
    });
  };
  var checkIfPlaying = function checkIfPlaying() {
    _clientAppCore.lradService.getAudioPlayStatus(camera.id, function (err, response) {
      if (err || !response || !response.success) {
        logError(err, response);
        if (playStatusIntHandleRef.current) {
          clearInterval(playStatusIntHandleRef.current);
          playStatusIntHandleRef.current = null;
        }
        return;
      }
      if (response.playStatus === "stopped") {
        setPlayStatus(response.playStatus);
        if (playStatusIntHandleRef.current) {
          clearInterval(playStatusIntHandleRef.current);
          playStatusIntHandleRef.current = null;
        }
      }
    });
  };
  var updateVolume = function updateVolume(value) {
    _clientAppCore.lradService.setVolume(camera.id, value, function (err, response) {
      if (err || !response || !response.success) {
        logError(err, response);
        return;
      }
      setVolume(value);
      setTempVolume(value);
    });
  };
  var toggleBeam = function toggleBeam() {
    if (beamOn) {
      _clientAppCore.lradService.setBeamOff(camera.id, function (err, response) {
        if (err || !response || !response.success) {
          logError(err, response);
          return;
        }
        setBeamOn(false);
        // Beam off also means strobe off
        setStrobeOn(false);
      });
    } else {
      _clientAppCore.lradService.setBeamOn(camera.id, function (err, response) {
        if (err || !response || !response.success) {
          logError(err, response);
          return;
        }
        setBeamOn(true);
      });
    }
  };
  var toggleStrobe = function toggleStrobe() {
    if (strobeOn) {
      _clientAppCore.lradService.setStrobeOff(camera.id, function (err, response) {
        if (err || !response || !response.success) {
          logError(err, response);
          return;
        }
        setStrobeOn(false);
        // Strobe off also means beam off
        setBeamOn(false);
      });
    } else {
      _clientAppCore.lradService.setStrobeOn(camera.id, function (err, response) {
        if (err || !response || !response.success) {
          logError(err, response);
          return;
        }
        setStrobeOn(true);
        // Strobe on also means beam on
        setBeamOn(true);
      });
    }
  };
  (0, _react.useEffect)(function () {
    _clientAppCore.lradService.getVolume(camera.id, handleFetchVolume);
    _clientAppCore.lradService.getBeamInfo(camera.id, handleFetchBeamInfo);
    _clientAppCore.lradService.getAudioFiles(camera.id, handleFetchAudioFiles);
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("h5", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.lradControls.title"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.playAudioSelectContainer
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "playAudioSelect",
    label: (0, _i18n.getTranslation)("global.profiles.widgets.lradControls.playAudio"),
    handleChange: function handleChange(e) {
      return setSelectedAudioFile(e.target.value);
    },
    value: selectedAudioFile,
    underlineShow: false,
    style: {
      minWidth: 250
    }
  }, (0, _map["default"])(audioFiles).call(audioFiles, function (audioFile) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      key: audioFile,
      value: audioFile
    }, audioFile);
  })), selectedAudioFile && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      marginTop: 20,
      alignItems: "center"
    }
  }, playStatus === "stopped" &&
  /*#__PURE__*/
  // Display Play button
  _react["default"].createElement("svg", {
    style: {
      margin: 5,
      cursor: "pointer"
    },
    width: 35,
    height: 35,
    viewBox: "0 0 35 35",
    onClick: function onClick() {
      return playAudio();
    }
  }, /*#__PURE__*/_react["default"].createElement("circle", {
    cx: "17.5",
    cy: "17.5",
    r: "17.5",
    fill: "#4DB5F4"
  }), /*#__PURE__*/_react["default"].createElement("path", {
    d: "M13,11L13,25L24,18Z",
    fill: "#fff"
  })), playStatus === "playing" &&
  /*#__PURE__*/
  // Display Stop button
  _react["default"].createElement("svg", {
    style: {
      margin: 5,
      cursor: "pointer"
    },
    width: 35,
    height: 35,
    viewBox: "0 0 35 35",
    onClick: function onClick() {
      return stopAudio();
    }
  }, /*#__PURE__*/_react["default"].createElement("circle", {
    cx: "17.5",
    cy: "17.5",
    r: "17.5",
    fill: "#4DB5F4"
  }), /*#__PURE__*/_react["default"].createElement("path", {
    d: "M12,11L12,25L24,25L24,11Z",
    fill: "#fff"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.volumeSliderContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "b2-bright-gray"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.lradControls.volume"
  })), /*#__PURE__*/_react["default"].createElement(_material.Slider, {
    value: tempVolume,
    min: 0,
    max: 100,
    step: 1,
    onChange: function onChange(e, value) {
      return setTempVolume(value);
    },
    onChangeCommitted: function onChangeCommitted(e, value) {
      return updateVolume(value);
    },
    marks: [{
      value: 0,
      label: "0"
    }, {
      value: 100,
      label: "100"
    }],
    valueLabelDisplay: "auto"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      marginLeft: 50,
      marginRight: 50
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      checked: beamOn,
      color: "primary",
      onChange: function onChange() {
        return toggleBeam();
      }
    }),
    label: (0, _i18n.getTranslation)("global.profiles.widgets.lradControls.beam")
  }), /*#__PURE__*/_react["default"].createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      checked: strobeOn,
      color: "primary",
      onChange: function onChange() {
        return toggleStrobe();
      }
    }),
    label: (0, _i18n.getTranslation)("global.profiles.widgets.lradControls.strobe")
  }))));
};
LradControls.propTypes = propTypes;
var _default = LradControls;
exports["default"] = _default;