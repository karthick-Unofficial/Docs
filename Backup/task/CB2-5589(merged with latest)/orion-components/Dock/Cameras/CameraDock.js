"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _react = _interopRequireWildcard(require("react"));
var _nearestPoint = _interopRequireDefault(require("@turf/nearest-point"));
var _CameraDockModule = _interopRequireDefault(require("./components/CameraDockModule"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./actions"));
var _selectors = require("./selectors");
var _Selectors = require("../../AppState/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var CamerasDock = function CamerasDock(_ref) {
  var _context;
  var map = (0, _map["default"])(_ref),
    readOnly = _ref.readOnly,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    floorPlansWithFacilityFeed = _ref.floorPlansWithFacilityFeed;
  var dispatch = (0, _reactRedux.useDispatch)();
  var addToDock = actionCreators.addToDock,
    clearFindNearestMode = actionCreators.clearFindNearestMode,
    removeDockedCameraAndState = actionCreators.removeDockedCameraAndState,
    setCameraPriority = actionCreators.setCameraPriority,
    setFindNearestMode = actionCreators.setFindNearestMode,
    clearCameraReplaceMode = actionCreators.clearCameraReplaceMode,
    openDialog = actionCreators.openDialog,
    closeDialog = actionCreators.closeDialog,
    loadProfile = actionCreators.loadProfile;
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile;
  });
  var cameraDock = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selectors.cameraDockSelector)(state);
  });
  var dockData = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selectors.dockDataSelector)(state);
  });
  var camerasView = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapState)(state);
  });
  var dialog = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dialog.openDialog || "";
  });
  var hasProfile = (0, _reactRedux.useSelector)(function (state) {
    return !!state.appState.contextPanel;
  });
  // Check which org created camera

  var permissions = {};
  var camerasInt = (0, _filter["default"])(_context = user.integrations).call(_context, function (_int) {
    return _int.intId === "cameras";
  })[0];
  if (camerasInt && camerasInt.permissions) {
    var _context2;
    permissions.canControl = (0, _includes["default"])(_context2 = camerasInt.permissions).call(_context2, "control");
  }
  var userCameras = cameraDock.userCameras;
  var dockedCameras = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selectors.dockedCamerasSelector)(state);
  });
  var cameraView = camerasView ? camerasView.visible : false;
  var sidebarOpen = dockData.isOpen;
  var findNearestMode = cameraDock.findNearestMode;
  var findNearestPosition = cameraDock.findNearestPosition;
  var cameraReplaceMode = cameraDock.cameraReplaceMode;
  var fullScreenCameraOpen = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.fullscreenCameraOpen)(state);
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });

  // we need to set our map event handler here, so it won't get set multiple times per our module
  (0, _react.useEffect)(function () {
    if (map) {
      map.on("click", function (e) {
        return handleFindNearestCamera(e);
      });
    }
  }, [findNearestMode]);
  var handleFindNearestCamera = function handleFindNearestCamera(e) {
    if ((0, _includes["default"])(findNearestMode).call(findNearestMode, true)) {
      // Builds a GeoJSON FeatureCollection using data from available cameras
      var features = (0, _map["default"])(userCameras).call(userCameras, function (camera) {
        var entityData = camera.entityData;
        var geometry = entityData.geometry,
          properties = entityData.properties;
        return {
          type: "Feature",
          geometry: geometry,
          properties: properties
        };
      });
      var cleanFeatures = (0, _filter["default"])(features).call(features, function (f) {
        return f.geometry !== undefined && f.geometry !== null && f.geometry.type === "Point" && (0, _isArray["default"])(f.geometry.coordinates) && f.geometry.coordinates[0] !== null && f.geometry.coordinates[1] != null && !isNaN(f.geometry.coordinates[0]) && !isNaN(f.geometry.coordinates[1]);
      });
      var coords = e.lngLat;
      var coordinate = [coords.lng, coords.lat];
      var featureCollection = {
        type: "FeatureCollection",
        features: cleanFeatures
      };
      // set nearest camera using turf
      var nearestCamera = (0, _nearestPoint["default"])(coordinate, featureCollection);
      // add to dock
      dispatch(addToDock(nearestCamera.properties.id, findNearestPosition, dockedCameras));
      // reset state and buttons
      dispatch(clearFindNearestMode());
    }
  };
  var cameraModules = (0, _map["default"])(dockedCameras).call(dockedCameras, function (id, index) {
    var camera = (0, _find["default"])(userCameras).call(userCameras, function (camera) {
      return camera.id === id;
    });
    var fromOrg = false;
    var fromEco = false;
    if (camera) {
      fromOrg = camera.ownerOrg === user.orgId;
      fromEco = camera.ownerOrg !== user.orgId;
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "docked-camera-wrapper " + (!camera && sidebarOpen ? "dashed-border" : ""),
      key: index
    }, /*#__PURE__*/_react["default"].createElement(_CameraDockModule["default"], {
      sidebarOpen: sidebarOpen,
      removeDockedCamera: removeDockedCameraAndState,
      addToDock: addToDock // method to add camera to dock
      ,
      cameraPosition: index,
      userCameras: userCameras,
      dockedCameras: dockedCameras // array of docked cameras
      ,
      camera: camera || null,
      fromEco: fromEco,
      fromOrg: fromOrg,
      cameraView: cameraView
      // Priority
      ,
      setCameraPriority: setCameraPriority
      // Map
      ,
      setFindNearestMode: setFindNearestMode,
      findNearestMode: findNearestMode,
      findNearestPosition: findNearestPosition
      // Replace on dock
      ,
      cameraReplaceMode: cameraReplaceMode,
      clearCameraReplaceMode: clearCameraReplaceMode,
      permissions: permissions
      // Dialog
      ,
      dialog: dialog,
      openDialog: openDialog,
      closeDialog: closeDialog
      // Profile
      ,
      hasProfile: hasProfile,
      loadProfile: loadProfile,
      fullscreenCameraOpen: fullScreenCameraOpen,
      user: user,
      readOnly: readOnly,
      dir: dir,
      selectFloorPlanOn: selectFloorPlanOn,
      floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
    }));
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      overflow: "scroll",
      height: "calc(100% - 80px)"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "camera-dock"
  }, cameraModules));
};
CamerasDock.propTypes = propTypes;
CamerasDock.defaultProps = defaultProps;
var _default = CamerasDock;
exports["default"] = _default;