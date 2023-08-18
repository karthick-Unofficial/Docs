"use strict";

var _typeof3 = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
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
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _uuid = require("uuid");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  camera: _propTypes["default"].object.isRequired,
  cameraIcon: _propTypes["default"].object,
  cameraIndex: _propTypes["default"].number,
  canControl: _propTypes["default"].bool,
  canExpand: _propTypes["default"].bool,
  contextId: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
  dialog: _propTypes["default"].object,
  dockedCameras: _propTypes["default"].array.isRequired,
  entityType: _propTypes["default"].string.isRequired,
  expanded: _propTypes["default"].bool,
  fullscreenCamera: _propTypes["default"].bool,
  // geometry: PropTypes.object,
  hasMenu: _propTypes["default"].bool,
  isInDock: _propTypes["default"].bool,
  readOnly: _propTypes["default"].bool,
  sidebarOpen: _propTypes["default"].bool,
  subscriberRef: _propTypes["default"].string,
  addCameraToDockMode: _propTypes["default"].func,
  closeDialog: _propTypes["default"].func,
  toggleCardExpand: _propTypes["default"].func,
  loadProfile: _propTypes["default"].func,
  openDialog: _propTypes["default"].func,
  removeDockedCamera: _propTypes["default"].func,
  setCameraPriority: _propTypes["default"].func,
  dir: _propTypes["default"].string
};
var instanceId = (0, _uuid.v4)();
var RobotCameraCard = function RobotCameraCard(_ref) {
  var _context2, _context3;
  var camera = _ref.camera,
    cameraIcon = _ref.cameraIcon,
    cameraIndex = _ref.cameraIndex,
    canControl = _ref.canControl,
    canExpand = _ref.canExpand,
    contextId = _ref.contextId,
    dialog = _ref.dialog,
    dockedCameras = _ref.dockedCameras,
    entityType = _ref.entityType,
    expanded = _ref.expanded,
    fullscreenCamera = _ref.fullscreenCamera,
    hasMenu = _ref.hasMenu,
    isInDock = _ref.isInDock,
    readOnly = _ref.readOnly,
    sidebarOpen = _ref.sidebarOpen,
    subscriberRef = _ref.subscriberRef,
    addCameraToDockMode = _ref.addCameraToDockMode,
    closeDialog = _ref.closeDialog,
    toggleCardExpand = _ref.toggleCardExpand,
    loadProfile = _ref.loadProfile,
    openDialog = _ref.openDialog,
    removeDockedCamera = _ref.removeDockedCamera,
    setCameraPriority = _ref.setCameraPriority,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var presets = [];
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    presetsOpen = _useState4[0],
    setPresetsOpen = _useState4[1];
  (0, _react.useEffect)(function () {
    // async function fetchCameraPresets() {
    // 	// load camera presets
    // 	const cameraPresets = await cameraService.getPresets(camera.id);
    // 	setPresets(cameraPresets);
    // }
    // fetchCameraPresets();
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
    setAnchorEl(null);
  };

  // const handleSlew = e => {
  // 	e.stopPropagation();
  // 	const { coordinates } = geometry;
  // 	// Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
  // 	cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
  // };

  // const handleSlewLock = (e, locked) => {
  // 	const { id } = camera;
  // 	e.stopPropagation();
  // 	locked
  // 		? cameraService.releaseSlewLock(id, (err, response) => {
  // 			if (err) {
  // 				console.log(err);
  // 			}
  // 			else {
  // 				// -- force rerender to pick up latest camera value
  // 				this.setState({ state: this.state });
  // 			}
  // 		})
  // 		: cameraService.setSlewLock(
  // 			id,
  // 			contextId,
  // 			entityType,
  // 			geometry,
  // 			(err, response) => {
  // 				if (err) {
  // 					console.log(err);
  // 				}
  // 				else {
  // 					// -- force rerender to pick up latest camera value
  // 					this.setState({ state: this.state });
  // 				}
  // 			}
  // 		  );
  // };

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

    // close menu
    setAnchorEl(null);
  };
  var hasCapability = function hasCapability(capability) {
    var _context;
    return camera.entityData.properties.features && (0, _includes["default"])(_context = camera.entityData.properties.features).call(_context, capability);
  };
  var backgroundColor = expanded ? "#1F1F21" : "#FFFFFF00";
  var id = camera.id,
    entityData = camera.entityData;
  var _entityData$propertie = entityData.properties,
    name = _entityData$propertie.name,
    position = _entityData$propertie.position;
  var cameraFeatures = camera.entityData.properties.features || null;
  var buttonFeatures = cameraFeatures ? (0, _filter["default"])(cameraFeatures).call(cameraFeatures, function (feat) {
    return (0, _typeof2["default"])(feat) === "object" && feat.type === "button";
  }) : null;
  return /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: {
      backgroundColor: "#FFFFFF00",
      boxShadow: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: canExpand,
    onClick: function onClick() {
      return toggleCardExpand(id);
    },
    className: "camera-list-item",
    style: {
      backgroundColor: backgroundColor,
      minHeight: 48
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    color: "primary",
    checked: expanded
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
    className: "camera-icon ".concat(expanded ? "enabled" : "disabled")
  }, cameraIcon), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: {
      padding: 0
    },
    primary: expanded && loadProfile && !readOnly ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: function onClick(e) {
        return handleHeaderClick(e, camera);
      },
      color: "primary",
      style: {
        textTransform: "none"
      }
    }, position || name) : /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        padding: "0px 12px"
      }
    }, position || name),
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
    onClick: handleCloseMenu
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    edge: "end",
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
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.robotCams.robotCamDock.removeFromDock")
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
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.robotCams.robotCamDock.addToDock")
  })), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      background: "#626466"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: handlePresetsClick
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.robotCams.robotCamDock.presets")
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    edge: "end"
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowForwardIos, {
    style: {
      color: "#FFF",
      fontSize: "medium"
    }
  })))), hasCapability("control") && buttonFeatures && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      background: "#626466"
    }
  }), (0, _map["default"])(buttonFeatures).call(buttonFeatures, function (feat, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      button: true,
      style: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16
      },
      key: "feature-button-".concat(index)
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: feat.label
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
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
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowBackIos, {
    style: {
      color: "#FFF",
      fontSize: "medium",
      marginRight: 10
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.robotCams.robotCamDock.back")
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    onClick: handleCloseMenu
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    edge: "end",
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
      primary: preset.label
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
    primary: (0, _i18n.getTranslation)("global.profiles.widgets.robotCams.robotCamDock.noPresetsAvailable")
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
    docked: !isInDock && sidebarOpen && (0, _includes["default"])(dockedCameras).call(dockedCameras, id),
    dialogKey: (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "".concat(subscriberRef, "-")).call(_context3, camera.id, "-")).call(_context2, cameraIndex),
    dialog: dialog,
    modal: fullscreenCamera,
    openDialog: openDialog,
    closeDialog: closeDialog,
    canControl: canControl,
    setCameraPriority: setCameraPriority,
    expanded: false,
    readOnly: readOnly,
    dir: dir
  }))));
};
RobotCameraCard.propTypes = propTypes;
var _default = RobotCameraCard;
exports["default"] = _default;