"use strict";

var _typeof3 = require("@babel/runtime-corejs3/helpers/typeof");
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
var _lastIndexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/last-index-of"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("orion-components/CBComponents");
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _uuid = require("uuid");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
// const CBSwitch = withStyles({
// 	switchBase: {
// 	  "&$checked": {
// 			color: "#29B6F6"
// 	  },
// 	  "&$checked + $track": {
// 			backgroundColor: "#84D5FA"
// 	  }
// 	},
// 	checked: {},
// 	track: {}
// })(Switch);

var propTypes = {
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var CameraCard = function CameraCard(_ref) {
  var _context3, _context4;
  var camera = _ref.camera,
    loadProfile = _ref.loadProfile,
    addCameraToDockMode = _ref.addCameraToDockMode,
    removeDockedCamera = _ref.removeDockedCamera,
    dockedCameras = _ref.dockedCameras,
    cameraIndex = _ref.cameraIndex,
    isInDock = _ref.isInDock,
    playbackStartTime = _ref.playbackStartTime,
    removeReplayMedia = _ref.removeReplayMedia,
    geometry = _ref.geometry,
    floorPlansWithFacilityFeed = _ref.floorPlansWithFacilityFeed,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    contextId = _ref.contextId,
    entityType = _ref.entityType,
    expanded = _ref.expanded,
    canUnlink = _ref.canUnlink,
    canExpand = _ref.canExpand,
    handleCardExpand = _ref.handleCardExpand,
    canTarget = _ref.canTarget,
    hasMenu = _ref.hasMenu,
    useCameraGeometry = _ref.useCameraGeometry,
    sidebarOpen = _ref.sidebarOpen,
    dialog = _ref.dialog,
    canControl = _ref.canControl,
    subscriberRef = _ref.subscriberRef,
    setCameraPriority = _ref.setCameraPriority,
    fullscreenCamera = _ref.fullscreenCamera,
    disableSlew = _ref.disableSlew,
    readOnly = _ref.readOnly,
    playBarValue = _ref.playBarValue,
    playbackPlaying = _ref.playbackPlaying,
    currentReplayMedia = _ref.currentReplayMedia,
    addReplayMedia = _ref.addReplayMedia,
    unlinkCameras = _ref.unlinkCameras,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var instanceId = (0, _uuid.v4)();
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    presetsOpen = _useState4[0],
    setPresetsOpen = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    presets = _useState6[0],
    setPresets = _useState6[1]; // this should get populated with valid preset values, example: {label: "Home", value: "home"}
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    reRenderFlag = _useState8[0],
    setReRenderFlag = _useState8[1];
  var setupPresets = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var presets;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _clientAppCore.cameraService.getPresets(camera.id);
          case 2:
            presets = _context.sent;
            setPresets(presets);
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function setupPresets() {
      return _ref2.apply(this, arguments);
    };
  }();
  (0, _react.useEffect)(function () {
    setupPresets();
  }, []);
  var handleHeaderClick = function handleHeaderClick(e, camera) {
    e.stopPropagation();
    var id = camera.id,
      entityData = camera.entityData;
    dispatch(loadProfile(id, entityData.properties.name, "camera", "profile"));
  };
  var handleAddToDock = function handleAddToDock() {
    dispatch(addCameraToDockMode(camera, true));
    setAnchorEl(null);
  };
  var handleRemoveFromDock = function handleRemoveFromDock() {
    // -- remove selected camera if removed from inside Dock, otherwise remove the last instance of the camera in the dock
    var dockIndex = isInDock ? cameraIndex : (0, _lastIndexOf["default"])(dockedCameras).call(dockedCameras, camera.id);
    dispatch(removeDockedCamera(dockIndex, dockedCameras));

    // -- remove replay media if playback camera
    if (playbackStartTime) {
      dispatch(removeReplayMedia(camera.id));
    }
    setAnchorEl(null);
  };
  var handleSlew = function handleSlew(e) {
    e.stopPropagation();
    var coordinates = geometry.coordinates;
    // Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
    _clientAppCore.cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
  };
  var showFloorPlanOnTargetClick = function showFloorPlanOnTargetClick() {
    if (floorPlansWithFacilityFeed === null) {
      dispatch(selectFloorPlanOn(camera));
    } else {
      var _entityData = camera.entityData;
      if (_entityData.displayType === "facility") {
        var floorPlanData = floorPlansWithFacilityFeed[_entityData.displayTargetId];
        if (floorPlanData.id === _entityData.displayTargetId) {
          dispatch(selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId));
        }
      }
    }
  };
  var handleSlewLock = function handleSlewLock(e, locked) {
    var id = camera.id;
    e.stopPropagation();
    locked ? _clientAppCore.cameraService.releaseSlewLock(id, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        // -- force rerender to pick up latest camera value
        setReRenderFlag(!reRenderFlag);
      }
    }) : _clientAppCore.cameraService.setSlewLock(id, contextId, entityType, geometry, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        // -- force rerender to pick up latest camera value
        setReRenderFlag(!reRenderFlag);
      }
    });
  };
  var handleExpandMenu = function handleExpandMenu(e) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setPresetsOpen(false);
  };
  var handlePopoverClick = function handlePopoverClick(e) {
    // -- stop propagation outside the popover
    e.stopPropagation();
  };
  var handleCloseMenu = function handleCloseMenu() {
    setAnchorEl(null);
  };

  // handleToggle = (e, name) => {
  // 	this.setState({ [name]: e.target.checked });
  // };

  var handlePresetsClick = function handlePresetsClick() {
    setPresetsOpen(true);
  };
  var handleBackClick = function handleBackClick() {
    setPresetsOpen(false);
  };
  var execFeatureCommand = function execFeatureCommand(cmd) {
    _clientAppCore.cameraService.sendAuxCmd(camera.id, cmd);
  };
  var selectPreset = function selectPreset(preset) {
    // fire preset
    _clientAppCore.cameraService.gotoPreset(camera.id, preset);
    setAnchorEl(null);
    // close menu
  };

  var hasCapability = function hasCapability(capability) {
    var _context2;
    return camera.entityData.properties.features && (0, _includes["default"])(_context2 = camera.entityData.properties.features).call(_context2, capability);
  };
  var backgroundColor = expanded ? "#1F1F21" : "#494D53";
  var styles = {
    marginAuto: _objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: "auto"
    }), dir === "rtl" && {
      marginRight: "auto"
    }),
    cardExpand: _objectSpread({
      backgroundColor: backgroundColor,
      padding: "0px 6px",
      minHeight: 48
    }, dir === "rtl" && {
      direction: "rtl"
    }),
    listItemText: _objectSpread({
      padding: 0
    }, dir === "rtl" && {
      textAlign: "right"
    }),
    listItemSecondaryAction: _objectSpread({}, dir === "rtl" && {
      right: "unset",
      left: 16
    }),
    textAlignRight: _objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    }),
    arrow: _objectSpread(_objectSpread({
      color: "#FFF",
      fontSize: "medium"
    }, dir === "rtl" && {
      marginLeft: 10
    }), dir === "ltr" && {
      marginRight: 10
    })
  };
  var id = camera.id,
    feedId = camera.feedId,
    entityData = camera.entityData,
    slewLock = camera.slewLock;
  var name = entityData.properties.name;
  var cameraFeatures = camera.entityData.properties.features || null;
  var buttonFeatures = cameraFeatures ? (0, _filter["default"])(cameraFeatures).call(cameraFeatures, function (feat) {
    return (0, _typeof2["default"])(feat) === "object" && feat.type === "button";
  }) : null;
  var unlinkControls = canUnlink && camera.linkedWith && camera.linkedWith === contextId ? /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.marginAuto
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: function onClick() {
      return dispatch(unlinkCameras([{
        id: contextId,
        type: entityType
      }, {
        id: camera.id,
        type: "camera"
      }], "manually-assigned-camera"));
    },
    color: "primary",
    style: {
      textTransform: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.cameras.camCard.unlinkCam"
  }))) : /*#__PURE__*/_react["default"].createElement("div", null);
  var slewControls = !disableSlew ? /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.marginAuto
  }, !slewLock && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: function onClick(e) {
      return handleSlew(e);
    },
    color: "primary",
    style: {
      textTransform: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.cameras.camCard.slew"
  })), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: {
      padding: 0
    },
    onClick: function onClick(e) {
      return handleSlewLock(e, slewLock);
    }
  }, slewLock ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Lock, {
    color: "primary"
  }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.LockOpen, null))) : /*#__PURE__*/_react["default"].createElement("div", null);
  return /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: {
      borderRadius: 0,
      marginBottom: 12
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: canExpand,
    onClick: function onClick() {
      return handleCardExpand(id);
    },
    style: styles.cardExpand
  }, canTarget && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    selectFloor: showFloorPlanOnTargetClick,
    geometry: useCameraGeometry ? camera.entityData.geometry : null,
    id: id,
    feedId: feedId
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: styles.listItemText,
    primary: expanded && loadProfile && !readOnly ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: function onClick(e) {
        return handleHeaderClick(e, camera);
      },
      color: "primary",
      style: {
        textTransform: "none"
      }
    }, name) : /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        padding: "0px 12px"
      }
    }, name),
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1"
    }
  }), hasMenu && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    "aria-label": "more",
    "aria-controls": "long-menu",
    "aria-haspopup": "true",
    onClick: handleExpandMenu
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.MoreVert, {
    style: {
      color: "#FFF"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    open: !!anchorEl,
    anchorEl: anchorEl,
    anchorOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    onClose: handleCloseMenu,
    onClick: handlePopoverClick
  }, /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: {
      background: "#4A4D52",
      width: 300
    }
  }, !presetsOpen ? /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: {
      paddingLeft: 16,
      paddingRight: 16,
      height: 30
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: ""
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: styles.listItemSecondaryAction,
    onClick: handleCloseMenu
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    edge: dir == "rtl" ? "start" : "end",
    "aria-label": "close"
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Close, {
    style: {
      color: "#FFF"
    }
  })))), sidebarOpen && (0, _includes["default"])(dockedCameras).call(dockedCameras, id) ? /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: handleRemoveFromDock
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.cameras.camCard.removeFromDock"),
    style: styles.textAlignRight
  })) : /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: handleAddToDock
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.cameras.camCard.addToDock"),
    style: styles.textAlignRight
  })), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      background: "#626466"
    }
  }), hasCapability("control") && canControl && /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: handlePresetsClick
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.cameras.camCard.presets"),
    style: styles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: styles.listItemSecondaryAction
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    edge: dir == "rtl" ? "start" : "end"
  }, dir == "rtl" ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowBackIos, {
    style: {
      color: "#FFF",
      fontSize: "medium"
    }
  }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowForwardIos, {
    style: {
      color: "#FFF",
      fontSize: "medium"
    }
  })))), hasCapability("control") && canControl && buttonFeatures && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      background: "#626466"
    }
  }), (0, _map["default"])(buttonFeatures).call(buttonFeatures, function (feat, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: "feature-".concat(index, "-list-item"),
      button: true,
      style: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: feat.label,
      style: styles.textAlignRight
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
      style: styles.listItemSecondaryAction,
      onClick: function onClick() {
        return execFeatureCommand(feat.auxCmd);
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      size: "small",
      style: {
        height: "22px",
        backgroundColor: "#4DB5F4",
        color: "#FFF"
      }
    }, feat.buttonLabel || " ")));
  }))) : /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    onClick: handleBackClick,
    style: {
      paddingLeft: 16,
      paddingRight: 16,
      height: 30
    }
  }, dir == "rtl" ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowForwardIos, {
    style: styles.arrow
  }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowBackIos, {
    style: styles.arrow
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.cameras.camCard.back"),
    style: styles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: styles.listItemSecondaryAction,
    onClick: handleCloseMenu
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    edge: dir == "rtl" ? "start" : "end",
    "aria-label": "close"
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Close, {
    style: {
      color: "#FFF"
    }
  })))), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      background: "#626466"
    }
  }), presets.length > 0 ? (0, _map["default"])(presets).call(presets, function (preset) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: preset.value,
      button: true,
      style: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16
      },
      onClick: function onClick() {
        return selectPreset(preset.value);
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: preset.label,
      style: styles.textAlignRight
    }));
  }) : /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    key: "none",
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.cameras.camCard.noPresets"),
    style: styles.textAlignRight
  }))))))), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    unmountOnExit: true,
    "in": expanded
  }, /*#__PURE__*/_react["default"].createElement(_material.CardContent, {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.VideoPlayerWrapper, {
    camera: camera,
    instanceId: instanceId,
    entityId: contextId,
    entityType: entityType,
    inDock: isInDock,
    dialogKey: (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = "".concat(subscriberRef, "-")).call(_context4, camera.id, "-")).call(_context3, cameraIndex),
    dialog: dialog,
    modal: fullscreenCamera,
    canControl: canControl,
    setCameraPriority: setCameraPriority,
    expanded: false,
    readOnly: readOnly,
    playbackStartTime: playbackStartTime,
    playBarValue: playBarValue,
    playbackPlaying: playbackPlaying,
    currentReplayMedia: currentReplayMedia,
    addReplayMedia: addReplayMedia,
    removeReplayMedia: removeReplayMedia,
    dir: dir
  })), !readOnly && /*#__PURE__*/_react["default"].createElement(_material.CardActions, {
    style: {
      backgroundColor: backgroundColor,
      padding: "0px 4px"
    }
  }, hasCapability("control") && unlinkControls, hasCapability("auto-slew") && slewControls)));
};
CameraCard.propTypes = propTypes;
CameraCard.defaultProps = defaultProps;
var _default = CameraCard;
exports["default"] = _default;