"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _VideoPlayer = _interopRequireDefault(require("./components/VideoPlayer"));
var _FullscreenVideoModal = _interopRequireDefault(require("./components/FullscreenVideoModal"));
var _Actions = require("orion-components/AppState/Actions");
var propTypes = {
  camera: _propTypes["default"].shape({
    id: _propTypes["default"].string.isRequired,
    player: _propTypes["default"].shape({
      type: _propTypes["default"].string.isRequired,
      url: _propTypes["default"].string
    })
  }).isRequired,
  instanceId: _propTypes["default"].string,
  entityId: _propTypes["default"].string,
  entityType: _propTypes["default"].string,
  fillAvailable: _propTypes["default"].bool,
  modal: _propTypes["default"].bool,
  dialogKey: _propTypes["default"].string,
  dialog: _propTypes["default"].string,
  canControl: _propTypes["default"].bool,
  openDialog: _propTypes["default"].func,
  expanded: _propTypes["default"].bool,
  inDock: _propTypes["default"].bool
};
var defaultProps = {
  camera: {
    player: {
      url: null
    }
  },
  instanceId: "",
  entityId: "",
  entityType: "",
  fillAvailable: false,
  modal: false,
  dialogKey: "",
  dialog: "",
  canControl: false,
  openDialog: function openDialog() {},
  expanded: false,
  inDock: false
};
var VideoPlayerWrapper = function VideoPlayerWrapper(_ref) {
  var camera = _ref.camera,
    instanceId = _ref.instanceId,
    entityId = _ref.entityId,
    entityType = _ref.entityType,
    modal = _ref.modal,
    dialog = _ref.dialog,
    dialogKey = _ref.dialogKey,
    fillAvailable = _ref.fillAvailable,
    openDialog = _ref.openDialog,
    canControl = _ref.canControl,
    setCameraPriority = _ref.setCameraPriority,
    expanded = _ref.expanded,
    readOnly = _ref.readOnly,
    playbackStartTime = _ref.playbackStartTime,
    playBarValue = _ref.playBarValue,
    playbackPlaying = _ref.playbackPlaying,
    currentReplayMedia = _ref.currentReplayMedia,
    addReplayMedia = _ref.addReplayMedia,
    removeReplayMedia = _ref.removeReplayMedia,
    dir = _ref.dir,
    inDock = _ref.inDock;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "video-player-wrapper ".concat(expanded ? "large" : "small")
  }, /*#__PURE__*/_react["default"].createElement(_VideoPlayer["default"], {
    camera: camera,
    instanceId: instanceId,
    entityId: entityId,
    entityType: entityType,
    inDock: inDock,
    fillAvailable: fillAvailable,
    modal: modal,
    dialogKey: dialogKey,
    openDialog: openDialog,
    expanded: expanded,
    setCameraPriority: setCameraPriority,
    readOnly: readOnly,
    playbackStartTime: playbackStartTime,
    playBarValue: playBarValue,
    playbackPlaying: playbackPlaying,
    currentReplayMedia: currentReplayMedia,
    addReplayMedia: addReplayMedia,
    removeReplayMedia: removeReplayMedia
  }), dialog === dialogKey && /*#__PURE__*/_react["default"].createElement(_FullscreenVideoModal["default"], {
    camera: camera,
    dialog: dialog,
    dialogKey: dialogKey,
    canControl: canControl,
    closeDialog: _Actions.closeDialog,
    setCameraPriority: setCameraPriority,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_VideoPlayer["default"], {
    key: "fullscreen",
    camera: camera,
    instanceId: instanceId,
    entityId: entityId,
    entityType: entityType,
    inDock: false,
    modal: false
    // Do not allow modal to open when already open
    ,
    dialogKey: "",
    fullscreen: true
  })));
};
VideoPlayerWrapper.propTypes = propTypes;
VideoPlayerWrapper.defaultProps = defaultProps;
var _default = VideoPlayerWrapper;
exports["default"] = _default;