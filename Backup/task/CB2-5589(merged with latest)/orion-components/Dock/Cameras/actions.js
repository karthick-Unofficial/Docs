"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.clearFindNearestMode = exports.clearCameraReplaceMode = exports.camerasReceived = exports.cameraReplaceModeCleared = exports.cameraDocked = exports.addToDock = exports.addCameraToDockMode = void 0;
_Object$defineProperty(exports, "closeDialog", {
  enumerable: true,
  get: function get() {
    return _Actions.closeDialog;
  }
});
exports.getAllCameras = void 0;
_Object$defineProperty(exports, "loadProfile", {
  enumerable: true,
  get: function get() {
    return _Actions2.loadProfile;
  }
});
_Object$defineProperty(exports, "openDialog", {
  enumerable: true,
  get: function get() {
    return _Actions.openDialog;
  }
});
exports.setFindNearestMode = exports.setCameraPriority = exports.removeDockedCameraById = exports.removeDockedCameraAndState = exports.removeDockedCamera = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var t = _interopRequireWildcard(require("./actionTypes.js"));
var _clientAppCore = require("client-app-core");
var _actions = require("../actions");
var _selectors = require("./selectors");
var _Actions = require("../../AppState/Actions");
var _Actions2 = require("../../ContextPanel/Actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var addCameraToDockMode = function addCameraToDockMode(camera, replaceMode) {
  return {
    type: t.CAMERA_TO_DOCK_MODE,
    payload: {
      camera: camera,
      replaceMode: replaceMode
    }
  };
};
exports.addCameraToDockMode = addCameraToDockMode;
var cameraDocked = function cameraDocked(cameraPosition, response) {
  return {
    type: t.CAMERA_DOCKED,
    payload: {
      cameraPosition: cameraPosition,
      response: response
    }
  };
};
exports.cameraDocked = cameraDocked;
var addToDock = function addToDock(cameraId, cameraPosition, dockedCameras) {
  return function (dispatch) {
    var cameras = (0, _toConsumableArray2["default"])(dockedCameras);
    cameras[cameraPosition] = cameraId;
    var keyVal = {
      dockedCameras: cameras
    };
    dispatch((0, _actions.setAppState)(keyVal));
    dispatch(cameraDocked(cameraPosition, cameraId));
  };
};
exports.addToDock = addToDock;
var removeDockedCamera = function removeDockedCamera(cameraPosition) {
  return {
    type: t.REMOVE_DOCKED_CAMERA,
    payload: {
      cameraPosition: cameraPosition
    }
  };
};
exports.removeDockedCamera = removeDockedCamera;
var removeDockedCameraAndState = function removeDockedCameraAndState(cameraPosition, dockedCameras) {
  return function (dispatch) {
    var cameras = dockedCameras;
    cameras[cameraPosition] = null;
    var keyVal = {
      dockedCameras: cameras
    };
    dispatch(removeDockedCamera(cameraPosition));
    dispatch((0, _actions.setAppState)(keyVal));
  };
};

/**
 * Remove a camera from the dock and userAppState via id
 * @param {string} cameraId
 */
exports.removeDockedCameraAndState = removeDockedCameraAndState;
var removeDockedCameraById = function removeDockedCameraById(cameraId) {
  return function (dispatch, getState) {
    var cameraIds = (0, _selectors.dockedCamerasSelector)(getState());
    var userCameras = (0, _selectors.userCamerasSelector)(getState());

    // Find all places the camera is docked, if any
    var cameraPositions = [];
    (0, _forEach["default"])(cameraIds).call(cameraIds, function (id, index) {
      if (id === cameraId) {
        cameraPositions.push(index);
      }
    });

    // If camera isn't docked, bail out
    if (!cameraPositions.length) {
      return;
    }

    // Build an array of camera objects for updating userAppState
    var cameraObjArr = (0, _map["default"])(cameraIds).call(cameraIds, function (id) {
      return (0, _find["default"])(userCameras).call(userCameras, function (camera) {
        return camera.id === id;
      });
    });

    // Filter removed cameras out of the camera object array
    var filteredCameras = (0, _map["default"])(cameraObjArr).call(cameraObjArr, function (cam) {
      if (cam && cam.id === cameraId) {
        return null;
      } else {
        return cam ? cam : null;
      }
    });
    var keyVal = {
      dockedCameras: filteredCameras
    };
    (0, _forEach["default"])(cameraPositions).call(cameraPositions, function (cameraPosition) {
      dispatch(removeDockedCamera(cameraPosition));
    });
    dispatch((0, _actions.setAppState)(keyVal));
  };
};
exports.removeDockedCameraById = removeDockedCameraById;
var camerasReceived = function camerasReceived(cameras) {
  return {
    type: t.CAMERAS_RECEIVED,
    payload: cameras
  };
};
exports.camerasReceived = camerasReceived;
var getAllCameras = function getAllCameras() {
  return function (dispatch) {
    _clientAppCore.cameraService.getMyCameras(function (err, response) {
      if (err) {
        console.log(err);
      } else {
        // Uncomment to save to userSidebarAppState
        // const keyVal = {userCameras: response};
        // dispatch(setAppState(keyVal));
        dispatch(camerasReceived(response));
      }
    });
  };
};
exports.getAllCameras = getAllCameras;
var setCameraPriority = function setCameraPriority(dockOpen, modalOpen) {
  return {
    type: t.CAMERA_PRIORITY_SET,
    payload: {
      dockOpen: dockOpen,
      modalOpen: modalOpen
    }
  };
};
exports.setCameraPriority = setCameraPriority;
var setFindNearestMode = function setFindNearestMode(cameraPosition) {
  return {
    type: t.TOGGLE_FIND_NEAREST,
    payload: {
      cameraPosition: cameraPosition
    }
  };
};
exports.setFindNearestMode = setFindNearestMode;
var clearFindNearestMode = function clearFindNearestMode() {
  return {
    type: t.CLEAR_FIND_NEAREST
  };
};
exports.clearFindNearestMode = clearFindNearestMode;
var cameraReplaceModeCleared = function cameraReplaceModeCleared() {
  return {
    type: t.CLEAR_CAMERA_REPLACE_MODE
  };
};
exports.cameraReplaceModeCleared = cameraReplaceModeCleared;
var clearCameraReplaceMode = function clearCameraReplaceMode() {
  return function (dispatch) {
    var keyVal = {
      cameraReplaceMode: {
        camera: null,
        replaceMode: false
      }
    };
    dispatch((0, _actions.setAppState)(keyVal));
    dispatch(cameraReplaceModeCleared());
  };
};
exports.clearCameraReplaceMode = clearCameraReplaceMode;