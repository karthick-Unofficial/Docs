"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.setWavPanoState = exports.setSelectedWavCam = exports.getWavCamState = void 0;
_Object$defineProperty(exports, "startFOVItemStream", {
  enumerable: true,
  get: function get() {
    return _contextStreaming.startFOVItemStream;
  }
});
_Object$defineProperty(exports, "toggleWavCam", {
  enumerable: true,
  get: function get() {
    return _actions2.toggleWavCam;
  }
});
exports.toggleWavCamLabels = void 0;
var t = _interopRequireWildcard(require("../actionTypes"));
var _actions = require("../../AppState/Persisted/actions");
var _actions2 = require("../actions");
var _contextStreaming = require("orion-components/ContextualData/contextStreaming");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var toggleWavCamLabels = function toggleWavCamLabels() {
  return {
    type: t.TOGGLE_WAV_CAM_LABELS
  };
};
exports.toggleWavCamLabels = toggleWavCamLabels;
var getWavCamState = function getWavCamState() {
  return function (dispatch) {
    var app = "wavcam";
    dispatch((0, _actions.getAppState)(app));
  };
};
exports.getWavCamState = getWavCamState;
var setWavPanoState = function setWavPanoState(cameraId, metadata, showLabels) {
  return function (dispatch, getState) {
    var app = "wavcam";
    var currentState = getState().appState.persisted["wavcam_pano"];
    var keyVal = {
      selectedWavCam: cameraId,
      showLabels: showLabels,
      wavCamMetadata: currentState ? currentState["wavCamMetadata"] || {} : {}
    };
    keyVal.wavCamMetadata[cameraId] = metadata;
    dispatch((0, _actions.updatePersistedState)(app, "wavcam_pano", keyVal));
  };
};
exports.setWavPanoState = setWavPanoState;
var setSelectedWavCam = function setSelectedWavCam(cameraId) {
  return function (dispatch) {
    var app = "wavcam";
    var keyVal = {
      selectedWavCam: cameraId
    };
    dispatch((0, _actions.updatePersistedState)(app, "wavcam_pano", keyVal));
  };
};
exports.setSelectedWavCam = setSelectedWavCam;