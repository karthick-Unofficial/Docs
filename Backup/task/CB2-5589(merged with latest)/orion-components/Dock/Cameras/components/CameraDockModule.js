"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _react = _interopRequireDefault(require("react"));
var _DockedControls = _interopRequireDefault(require("./DockedControls"));
var _CameraCard = _interopRequireDefault(require("orion-components/Profiles/Widgets/Cameras/components/CameraCard"));
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var propTypes = {
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var CameraDockModule = function CameraDockModule(_ref) {
  var cameraPosition = _ref.cameraPosition,
    dockedCameras = _ref.dockedCameras,
    camera = _ref.camera,
    userCameras = _ref.userCameras,
    addToDock = _ref.addToDock,
    removeDockedCamera = _ref.removeDockedCamera,
    cameraView = _ref.cameraView,
    setCameraPriority = _ref.setCameraPriority,
    setFindNearestMode = _ref.setFindNearestMode,
    findNearestMode = _ref.findNearestMode,
    findNearestPosition = _ref.findNearestPosition,
    clearCameraReplaceMode = _ref.clearCameraReplaceMode,
    dialog = _ref.dialog,
    openDialog = _ref.openDialog,
    closeDialog = _ref.closeDialog,
    loadProfile = _ref.loadProfile,
    fullscreenCameraOpen = _ref.fullscreenCameraOpen,
    sidebarOpen = _ref.sidebarOpen,
    user = _ref.user,
    readOnly = _ref.readOnly,
    playbackStartTime = _ref.playbackStartTime,
    playBarValue = _ref.playBarValue,
    playbackPlaying = _ref.playbackPlaying,
    currentReplayMedia = _ref.currentReplayMedia,
    addReplayMedia = _ref.addReplayMedia,
    removeReplayMedia = _ref.removeReplayMedia,
    dir = _ref.dir,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    floorPlansWithFacilityFeed = _ref.floorPlansWithFacilityFeed,
    cameraReplaceMode = _ref.cameraReplaceMode;
  var dispatch = (0, _reactRedux.useDispatch)();
  var handleCameraReplace = function handleCameraReplace(newCameraId) {
    dispatch(removeDockedCamera(cameraPosition, dockedCameras));
    (0, _setTimeout2["default"])(function () {
      dispatch(addToDock(newCameraId, cameraPosition, dockedCameras));
      dispatch(clearCameraReplaceMode());
    }, 100);
  };

  // set overlay mode
  var renderCameraDisplay = function renderCameraDisplay(cameraReplaceMode, newCamera) {
    // If name of camera includes word camera, don't add it to the dock placeholder
    // Set camera name if camera exists
    var cameraTextFix = "Camera";
    var cameraName;
    if (newCamera) {
      var _context;
      cameraName = newCamera.entityData.properties.name;
      if ((0, _includes["default"])(_context = newCamera.entityData.properties.name.toLowerCase()).call(_context, "camera")) {
        cameraTextFix = "";
      }
    }

    // if no camera and not trying to add one, show 'add camera' controls
    if (camera === null && !cameraReplaceMode.replaceMode) {
      return /*#__PURE__*/_react["default"].createElement(_DockedControls["default"], {
        userCameras: userCameras // cameras user has access to
        ,
        dockedCameras: dockedCameras // cameras that are docked
        ,
        cameraPosition: cameraPosition // index of camera in array
        ,
        addToDock: addToDock // method to dock camera
        //addCamera={addCamera}
        ,
        cameraView: cameraView,
        setFindNearestMode: setFindNearestMode,
        findNearestMode: findNearestMode,
        findNearestPosition: findNearestPosition,
        dir: dir
      });
      // if no camera and trying to replace, show camera add placeholder
    } else if (camera === null && cameraReplaceMode.replaceMode) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "add-to-dock-placeholder",
        onClick: function onClick() {
          dispatch(addToDock(newCamera.id, cameraPosition, dockedCameras));
          dispatch(clearCameraReplaceMode());
        }
      }, cameraTextFix == "Camera" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.dock.cameras.camDockModule.addStatic",
        primaryValue: newCamera.entityData.properties.name
      }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.dock.cameras.camDockModule.addDynamic",
        primaryValue: newCamera.entityData.properties.name,
        secondaryValue: cameraTextFix
      }));
      // otherwise, render a camera, or a camera with an overlay if trying to replace
    } else {
      var _context2, _context3, _context4, _context5;
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: "relative"
        }
      }, cameraReplaceMode.replaceMode && /*#__PURE__*/_react["default"].createElement("p", {
        className: "overlay-text",
        onClick: function onClick() {
          return handleCameraReplace(newCamera.id);
        } // handle replacing docked camera
      }, " ", cameraName ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.dock.cameras.camDockModule.replaceWith",
        count: cameraName
      }) : "", " "), /*#__PURE__*/_react["default"].createElement("div", {
        className: cameraReplaceMode.replaceMode ? "camera-overlay" : ""
      }, /*#__PURE__*/_react["default"].createElement(_CameraCard["default"], {
        cameraIndex: cameraPosition,
        canUnlink: false,
        useCameraGeometry: true,
        loadProfile: loadProfile,
        camera: camera,
        canExpand: false,
        handleCardExpand: function handleCardExpand() {},
        canTarget: true,
        hasMenu: true,
        expanded: true,
        disableSlew: true,
        sidebarOpen: sidebarOpen,
        dockedCameras: dockedCameras,
        removeDockedCamera: removeDockedCamera,
        isInDock: true,
        dialog: dialog,
        openDialog: openDialog,
        closeDialog: closeDialog,
        readOnly: !!readOnly,
        playbackStartTime: playbackStartTime,
        playBarValue: playBarValue,
        playbackPlaying: playbackPlaying,
        currentReplayMedia: currentReplayMedia,
        addReplayMedia: addReplayMedia,
        removeReplayMedia: removeReplayMedia,
        canControl: !readOnly && user && user.integrations && (0, _find["default"])(_context2 = user.integrations).call(_context2, function (_int) {
          return _int.intId === camera.feedId;
        }) && (0, _find["default"])(_context3 = user.integrations).call(_context3, function (_int2) {
          return _int2.intId === camera.feedId;
        }).permissions && (0, _includes["default"])(_context4 = (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int3) {
          return _int3.intId === camera.feedId;
        }).permissions).call(_context4, "control"),
        subscriberRef: "dock",
        setCameraPriority: setCameraPriority,
        fullscreenCamera: fullscreenCameraOpen,
        dir: dir,
        selectFloorPlanOn: selectFloorPlanOn,
        floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
      })));
    }
  };
  // .active = boolean, .cameraId = id
  // cameraReplaceMode, cameraName, camera from camera widget
  var cameraDisplay = renderCameraDisplay(cameraReplaceMode, cameraReplaceMode.camera);
  return /*#__PURE__*/_react["default"].createElement("div", null, sidebarOpen ? cameraDisplay : /*#__PURE__*/_react["default"].createElement("div", null));
};
CameraDockModule.propTypes = propTypes;
CameraDockModule.defaultProps = defaultProps;
var _default = CameraDockModule;
exports["default"] = _default;