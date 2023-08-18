"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _shared = require("../shared");
var _RobotCameraCard = _interopRequireDefault(require("./components/RobotCameraCard"));
var _images = require("./images");
var _icons = require("./icons");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _mdiMaterialUi = require("mdi-material-ui");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context8, _context9; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context8 = ownKeys(Object(source), !0)).call(_context8, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context9 = ownKeys(Object(source))).call(_context9, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var CAMERA_POSITION_INDEX = ["frontLeft", "frontRight", "left", "right", "back", "top"];
var CAMERA_POSITION_STRING = {
  frontLeft: "Front/Left RGB Camera",
  frontRight: "Front/Right RGB Camera",
  left: "Left RGB Camera",
  right: "Right RGB Camera",
  back: "Back RGB Camera",
  top: "TOP RGB Camera"
};
var CAMERA_POSITION_CLASS = {
  frontLeft: "front-left-camera",
  frontRight: "front-right-camera",
  left: "left-camera",
  right: "right-camera",
  back: "back-camera",
  top: "top-camera"
};
var CAMERA_ICONS = [/*#__PURE__*/_react["default"].createElement(_icons.CameraFrontLeft, {
  className: "camera-svg",
  key: "cam-fl-icon"
}), /*#__PURE__*/_react["default"].createElement(_icons.CameraFrontRight, {
  className: "camera-svg",
  key: "cam-fr-icon"
}), /*#__PURE__*/_react["default"].createElement(_icons.CameraLeft, {
  className: "camera-svg",
  key: "cam-l-icon"
}), /*#__PURE__*/_react["default"].createElement(_icons.CameraRight, {
  className: "camera-svg",
  key: "cam-r-icon"
}), /*#__PURE__*/_react["default"].createElement(_icons.CameraBack, {
  className: "camera-svg",
  key: "cam-b-icon"
}), /*#__PURE__*/_react["default"].createElement(_icons.CameraTop, {
  className: "camera-svg",
  key: "cam-t-icon"
})];
var BLUEPRINT_IMAGES = {
  "Ghost Robotics Dog": _images.RobotDogBluePrint
};

// ***** TODO: setup propTypes correctly
var propTypes = {
  order: _propTypes["default"].number,
  dir: _propTypes["default"].string
};
var RobotCamerasWidget = function RobotCamerasWidget(_ref) {
  var order = _ref.order,
    enabled = _ref.enabled,
    entity = _ref.entity,
    cameras = _ref.cameras,
    robotCameras = _ref.robotCameras,
    robotCameraStates = _ref.robotCameraStates,
    loadProfile = _ref.loadProfile,
    sidebarOpen = _ref.sidebarOpen,
    dockedCameras = _ref.dockedCameras,
    addCameraToDockMode = _ref.addCameraToDockMode,
    removeDockedCamera = _ref.removeDockedCamera,
    entityType = _ref.entityType,
    readOnly = _ref.readOnly,
    contextId = _ref.contextId,
    dialog = _ref.dialog,
    openDialog = _ref.openDialog,
    closeDialog = _ref.closeDialog,
    subscriberRef = _ref.subscriberRef,
    setCameraPriority = _ref.setCameraPriority,
    fullscreenCamera = _ref.fullscreenCamera,
    user = _ref.user,
    toggleCameraState = _ref.toggleCameraState,
    hideBlueprint = _ref.hideBlueprint,
    dir = _ref.dir;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expandedCameras = _useState2[0],
    setExpandedCameras = _useState2[1];
  var _useState3 = (0, _react.useState)(true),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    hideCameras = _useState4[0],
    setHideCameras = _useState4[1];

  /* Generate cameras required for robot */
  var getRobotLayoutCameras = function getRobotLayoutCameras(hideInVisibleCameras) {
    var labels = ["FL", "FR", "L", "R", "B", "T", "O"];
    var positions = ["frontLeft", "frontRight", "left", "right", "back", "top", "other"];
    var camerasInitial = [];
    var otherCameraIndex = 6; //generally all position 'other' cameras will start from 6
    if (cameras && cameras.length > 0) {
      (0, _forEach["default"])(cameras).call(cameras, function (cam) {
        var camTmp = _objectSpread({}, cam);
        camTmp.isVisible = true;
        var robotCamera = (0, _find["default"])(robotCameras).call(robotCameras, function (robotCamera) {
          return robotCamera.id === camTmp.id;
        });
        if (robotCamera) {
          if (robotCamera.position !== "other") {
            var position = robotCamera.position;
            camTmp.entityData.properties = _objectSpread(_objectSpread({}, camTmp.entityData.properties), {}, {
              position: CAMERA_POSITION_STRING[position]
            });
            camTmp.index = (0, _indexOf["default"])(CAMERA_POSITION_INDEX).call(CAMERA_POSITION_INDEX, position);
            camTmp.positionLookup = position;
          } else {
            camTmp.index = otherCameraIndex++;
            camTmp.positionLookup = "";
          }
        }
        camerasInitial.push(camTmp);
      });
      (0, _forEach["default"])(robotCameras).call(robotCameras, function (robCam) {
        var index = (0, _indexOf["default"])(positions).call(positions, robCam.position);
        delete labels[index];
        delete positions[index];
      });
      var otherIndexPosition = (0, _findIndex["default"])(labels).call(labels, function (l) {
        return l === "O";
      }) || 6; //other position is 6

      //enter non visible dummy cameras
      var ix = 1;
      (0, _forEach["default"])(labels).call(labels, function () {
        //Note: CAMERA_POSITION_INDEX don't contain 'other'
        var indexTmp = ix >= otherIndexPosition + 1 ? otherIndexPosition + 1 : (0, _indexOf["default"])(CAMERA_POSITION_INDEX).call(CAMERA_POSITION_INDEX, positions[ix - 1]);
        camerasInitial.push({
          id: ix + "-invisible",
          index: indexTmp,
          positionLookup: positions[ix - 1],
          isVisible: false
        });
        ix = ix + 1;
      });

      //don't show on UI : cameras list.
      if (hideInVisibleCameras) {
        camerasInitial = (0, _filter["default"])(camerasInitial).call(camerasInitial, function (c) {
          return c.isVisible === true;
        });
      }
      return (0, _sort["default"])(camerasInitial).call(camerasInitial, function (a, b) {
        return a.index - b.index;
      });
    }
    return camerasInitial;
  };
  var layoutCameras = getRobotLayoutCameras(false);
  var getCameraIndexOnRobot = function getCameraIndexOnRobot(robotCamId) {
    var camTmp = (0, _find["default"])(layoutCameras).call(layoutCameras, function (c) {
      return c.id === robotCamId;
    });
    if (camTmp) {
      return camTmp.index;
    } else {
      return -1;
    }
  };
  /* */

  var getRobotCameras = function getRobotCameras(excludeOtherPositionType) {
    //Note: cameras containing position = 'other' should not be show on blueprint.
    if (robotCameras && robotCameras.length > 0 && excludeOtherPositionType) {
      return (0, _filter["default"])(robotCameras).call(robotCameras, function (c) {
        return c.position !== "other";
      });
    } else {
      return robotCameras || [];
    }
  };
  (0, _react.useEffect)(function () {
    if (!hideCameras && expandedCameras.length > 0 && (!robotCameras || robotCameras.length < 1)) {
      setExpandedCameras([]);
      setHideCameras(true);
    }
  }, [robotCameras]);
  (0, _react.useEffect)(function () {
    if (hideBlueprint && hideCameras && expandedCameras.length > 0) {
      (0, _forEach["default"])(expandedCameras).call(expandedCameras, function (camId) {
        toggleCameraState(camId, "off");
      });
      setExpandedCameras([]);
    }
  }, [hideBlueprint]);
  var toggleCameraList = function toggleCameraList() {
    setHideCameras(!hideCameras);
  };
  var blueprintCameraClick = function blueprintCameraClick(cameraId, cameraState) {
    // -- update camera state and expand camera card
    toggleCameraState(cameraId, cameraState);
    var cameraStates = (0, _find["default"])(robotCameras).call(robotCameras, function (robotCamera) {
      return robotCamera.id === cameraId;
    }).states;
    if ((0, _includes["default"])(expandedCameras).call(expandedCameras, cameraId) && cameraState === cameraStates[cameraStates.length - 1] || !(0, _includes["default"])(expandedCameras).call(expandedCameras, cameraId) && cameraState !== cameraStates[cameraStates.length - 1]) {
      handleCardExpand(cameraId);
    }
  };
  var handleCardExpand = function handleCardExpand(id) {
    var newExpandedCameras = (0, _toConsumableArray2["default"])(expandedCameras);
    var cameraIndex = (0, _indexOf["default"])(expandedCameras).call(expandedCameras, id);
    if (cameraIndex < 0) {
      newExpandedCameras.push(id);
      setExpandedCameras(newExpandedCameras);
    } else {
      (0, _splice["default"])(newExpandedCameras).call(newExpandedCameras, cameraIndex, 1);
      setExpandedCameras(newExpandedCameras);
    }
  };
  var toggleCardExpand = function toggleCardExpand(id) {
    var newExpandedCameras = (0, _toConsumableArray2["default"])(expandedCameras);
    var cameraIndex = (0, _indexOf["default"])(expandedCameras).call(expandedCameras, id);
    if (cameraIndex < 0) {
      newExpandedCameras.push(id);
      setExpandedCameras(newExpandedCameras);

      // -- turn camera state on
      var robotCamera = (0, _find["default"])(robotCameras).call(robotCameras, function (robotCamera) {
        return robotCamera.id === id;
      });
      if (robotCamera && robotCamera.states) {
        toggleCameraState(id, "off");
      }
    } else {
      (0, _splice["default"])(newExpandedCameras).call(newExpandedCameras, cameraIndex, 1);
      setExpandedCameras(newExpandedCameras);

      // -- turn camera state off
      var _robotCamera = (0, _find["default"])(robotCameras).call(robotCameras, function (robotCamera) {
        return robotCamera.id === id;
      });
      if (_robotCamera && _robotCamera.states) {
        toggleCameraState(id, _robotCamera.states[_robotCamera.states.length - 1]);
      }
    }
  };
  var getCameraCone = function getCameraCone(cameraIndex, cameraState, frontLeftCameraState, frontRightCameraState) {
    if (cameraIndex <= 1 && frontLeftCameraState === frontRightCameraState) {
      // -- one of the first 2 cameras and same state, check for double cone
      if (cameraIndex === 1) {
        // -- only return one double cone
        return null;
      }
      if (cameraState === "normal") {
        return /*#__PURE__*/_react["default"].createElement(_icons.BlueConeDouble, {
          className: "camera-double-cone"
        });
      } else if (cameraState === "thermal") {
        return /*#__PURE__*/_react["default"].createElement(_icons.RedConeDouble, {
          className: "camera-double-cone"
        });
      }
    } else {
      if (cameraState === "normal") {
        return /*#__PURE__*/_react["default"].createElement(_icons.BlueCone, {
          className: "camera-cone"
        });
      } else if (cameraState === "thermal") {
        return /*#__PURE__*/_react["default"].createElement(_icons.RedCone, {
          className: "camera-cone"
        });
      }
    }
    return null;
  };

  // -- check front camera for outside styling
  var isOutsideCamera = function isOutsideCamera(cameraIndex, frontLeftCameraState, frontRightCameraState) {
    if (frontLeftCameraState !== frontRightCameraState) {
      // -- push camera outside if different state from other front camera, and that camera is on
      if (cameraIndex === 0) {
        if (!frontRightCameraState) {
          return false;
        } else if (frontRightCameraState !== "off") {
          return true;
        }
      } else if (cameraIndex === 1) {
        if (!frontLeftCameraState) {
          return false;
        } else if (frontLeftCameraState !== "off") {
          return true;
        }
      }
    }
    return false;
  };
  var getCameraState = function getCameraState(id) {
    if (!id || expandedCameras.length < 1 || !(0, _includes["default"])(expandedCameras).call(expandedCameras, id) || !robotCameraStates || !robotCameraStates[id]) {
      return "off";
    } else {
      return robotCameraStates[id];
    }
  };

  // -- store front camera states for use in cone icon selection
  var frontLeftCameraState, frontRightCameraState;
  var setFrontLeftRightCameraState = function setFrontLeftRightCameraState() {
    var camFrontLeft = (0, _find["default"])(layoutCameras).call(layoutCameras, function (c) {
      return c.positionLookup === "frontLeft";
    });
    var camFrontRight = (0, _find["default"])(layoutCameras).call(layoutCameras, function (c) {
      return c.positionLookup === "frontRight";
    });
    frontLeftCameraState = getCameraState(camFrontLeft ? camFrontLeft.id : null);
    frontRightCameraState = getCameraState(camFrontRight ? camFrontRight.id : null);
  };
  if (layoutCameras.length > 0) {
    setFrontLeftRightCameraState();
  }
  var displaySensorsButton = (0, _react.useCallback)(function () {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "sensors-icon-container",
      style: {
        marginTop: hideBlueprint ? 10 : -5
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-container ".concat(hideCameras ? "b2-dark-gray" : "b2-white"),
      onClick: toggleCameraList
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon",
      style: {
        color: hideCameras ? "#828283" : "#4DB5F4"
      }
    }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.Video, null)), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-label"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.robotCams.main.cameras"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-container b2-dark-gray disabled"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon"
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.RecordVoiceOver, null)), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-label"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.robotCams.main.audio"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-container b2-dark-gray disabled"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon"
    }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.CarLightHigh, null)), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-label"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.robotCams.main.lights"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-container b2-dark-gray disabled"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon"
    }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.RobotIndustrial, null)), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-label"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.robotCams.main.arm"
    }))));
  }, [hideCameras]);
  var getBlueprintCameraLayout = (0, _react.useCallback)(function () {
    var _context;
    var robotType = entity && entity.entityData && entity.entityData.properties && entity.entityData.properties.subtype || "Unknown";
    return !hideBlueprint && /*#__PURE__*/_react["default"].createElement("div", {
      className: "camera-layout-container"
    }, robotType !== "Unknown" && /*#__PURE__*/_react["default"].createElement("img", {
      src: BLUEPRINT_IMAGES[robotType],
      className: "blueprint-image",
      alt: "Robot blueprint"
    }), (0, _map["default"])(_context = getRobotCameras(true)).call(_context, function (camera) {
      var _context2, _context3;
      var index = getCameraIndexOnRobot(camera.id);
      var isOutside = isOutsideCamera(index, frontLeftCameraState, frontRightCameraState);
      var cameraState = getCameraState(camera.id);
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
        key: camera.id
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: (0, _concat["default"])(_context2 = "blueprint-camera ".concat(CAMERA_POSITION_CLASS[camera.position], " ")).call(_context2, isOutside && "outside"),
        style: {
          zIndex: 2
        }
      }, getCameraCone(index, cameraState, frontLeftCameraState, frontRightCameraState), /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Videocam, {
        className: "camera-icon ".concat(cameraState),
        fontSize: "large"
      }), /*#__PURE__*/_react["default"].createElement("p", null, camera.label)), /*#__PURE__*/_react["default"].createElement("div", {
        className: (0, _concat["default"])(_context3 = "blueprint-camera click-handler ".concat(CAMERA_POSITION_CLASS[camera.position], " ")).call(_context3, isOutside && "outside"),
        style: {
          zIndex: 3
        },
        onClick: function onClick() {
          return blueprintCameraClick(camera.id, cameraState);
        }
      }));
    }));
  }, [hideBlueprint, robotCameras, robotCameraStates, frontLeftCameraState, frontRightCameraState]);
  var getCamerasPanel = (0, _react.useCallback)(function () {
    var camerasVisible = getRobotLayoutCameras(true);
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.List, {
      id: "camera-list"
    }, camerasVisible && camerasVisible.length > 0 && (0, _map["default"])(camerasVisible).call(camerasVisible, function (camera) {
      var _context4, _context5, _context6, _context7;
      var index = camera.index;
      var cameraIcon = CAMERA_ICONS[index] || /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Videocam, {
        fontSize: "large"
      });
      var isOpen = (0, _includes["default"])(expandedCameras).call(expandedCameras, camera.id);
      var showCamera = camera && (!hideCameras || hideCameras && isOpen);

      // canUnlink={canLink}
      // useCameraGeometry={useCameraGeometry}
      // unlinkCameras={unlinkCameras}
      // canTarget={!cameraDisabled}
      // geometry={geometry}
      return showCamera ? /*#__PURE__*/_react["default"].createElement(_RobotCameraCard["default"], {
        contextId: contextId,
        cameraIndex: index,
        entityType: entityType,
        key: camera.id,
        loadProfile: loadProfile,
        camera: camera,
        canExpand: !camera.isDeleted,
        toggleCardExpand: toggleCardExpand,
        hasMenu: isOpen && !camera.isDeleted,
        expanded: isOpen,
        sidebarOpen: sidebarOpen,
        dockedCameras: dockedCameras,
        addCameraToDockMode: addCameraToDockMode,
        removeDockedCamera: removeDockedCamera,
        dialog: dialog,
        openDialog: openDialog,
        closeDialog: closeDialog,
        readOnly: readOnly,
        canControl: !readOnly && user && user.integrations && (0, _find["default"])(_context4 = user.integrations).call(_context4, function (_int) {
          return _int.intId === camera.feedId;
        }) && (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int2) {
          return _int2.intId === camera.feedId;
        }).permissions && (0, _includes["default"])(_context6 = (0, _find["default"])(_context7 = user.integrations).call(_context7, function (_int3) {
          return _int3.intId === camera.feedId;
        }).permissions).call(_context6, "control"),
        subscriberRef: subscriberRef,
        setCameraPriority: setCameraPriority,
        fullscreenCamera: fullscreenCamera,
        cameraIcon: cameraIcon,
        dir: dir
      }) : null;
    })));
  }, [cameras, expandedCameras, hideCameras, contextId, entityType, sidebarOpen, dockedCameras, dialog, readOnly, user.integrations, fullscreenCamera]);
  return /*#__PURE__*/_react["default"].createElement(_shared.BaseWidget, {
    enabled: enabled,
    order: order,
    title: "",
    dir: dir
  }, getBlueprintCameraLayout(), displaySensorsButton(), getCamerasPanel());
};
RobotCamerasWidget.propTypes = propTypes;
var _default = RobotCamerasWidget;
exports["default"] = _default;