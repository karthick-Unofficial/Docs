"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
var PlaySettingsActions = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/PlaySettings/actions"));
var PlaySettingsActionTypes = _interopRequireWildcard(require("orion-components/GlobalData/WowzaWebRTC/PlaySettings/actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PlaySettings = function PlaySettings(_ref) {
  var streamName = _ref.streamName,
    applicationName = _ref.applicationName,
    signalingURL = _ref.signalingURL,
    toggleLoading = _ref.toggleLoading;
  var dispatch = (0, _reactRedux.useDispatch)();
  var setPlaySettings = function setPlaySettings() {
    dispatch({
      type: PlaySettingsActionTypes.SET_PLAY_SETTINGS,
      signalingURL: signalingURL,
      streamName: streamName,
      applicationName: applicationName
    });
    dispatch(PlaySettingsActions.startPlay(streamName));
    toggleLoading();
  };
  (0, _react.useEffect)(function () {
    setPlaySettings();
  }, [streamName, applicationName, signalingURL]);
  return null;
};
var _default = PlaySettings;
exports["default"] = _default;