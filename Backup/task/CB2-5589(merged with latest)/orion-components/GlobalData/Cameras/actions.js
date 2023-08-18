"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeCameras = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Add an initial batch of cameras to state
 * @param cameras: an array of camera objects
 */
var cameraBatchReceived = function cameraBatchReceived(cameras) {
  return {
    type: t.CAMERA_BATCH_RECEIVED,
    payload: {
      cameras: cameras
    }
  };
};

/*
 * Add or update a camera in state
 * @param camera: a camera object
 */
var cameraReceived = function cameraReceived(camera) {
  return {
    type: t.CAMERA_RECEIVED,
    payload: {
      camera: camera
    }
  };
};

/*
 * Subscribe to camera feed
 * @param userId: logged in user's ID
 */
var subscribeCameras = function subscribeCameras() {
  var expandedRefs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (dispatch) {
    _clientAppCore.feedService.subscribeFilteredFeed("system", "cameras", {
      expandedRefs: expandedRefs
    }, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      switch (response.type) {
        case "initial-batch":
        case "change-batch":
          {
            var _context;
            var cameras = (0, _map["default"])(_context = response.changes).call(_context, function (response) {
              return response.new_val;
            });
            dispatch(cameraBatchReceived(cameras));
          }
          break;
        case "add":
        case "change":
          dispatch(cameraReceived(response.new_val));
          break;
        default:
          break;
      }
    });
  };
};
exports.subscribeCameras = subscribeCameras;