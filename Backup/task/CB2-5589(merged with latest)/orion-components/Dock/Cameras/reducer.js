"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports["default"] = void 0;
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = {
  userCameras: [],
  dockedCameras: [null, null, null],
  cameraPriority: {
    dockOpen: false,
    modalOpen: false
  },
  findNearestMode: [false, false, false],
  findNearestPosition: null,
  cameraReplaceMode: {
    camera: null,
    replaceMode: false
  },
  wavcam_pano: {
    showLabels: true
  }
};
exports.initialState = initialState;
var cameraDock = function cameraDock() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case "DOCK_APP_STATE_RECEIVED":
      return _objectSpread(_objectSpread({}, state), action.payload);
    case "CAMERAS_RECEIVED":
      {
        var newState = _objectSpread(_objectSpread({}, state), {}, {
          userCameras: action.payload
        });
        return newState;
      }
    case "CAMERA_DOCKED":
      {
        var dockedCameras = (0, _toConsumableArray2["default"])(state.dockedCameras);
        dockedCameras[action.payload.cameraPosition] = action.payload.response;
        return (0, _assign["default"])({}, state, {
          dockedCameras: dockedCameras
        });
      }
    case "REMOVE_DOCKED_CAMERA":
      {
        var _dockedCameras = (0, _toConsumableArray2["default"])(state.dockedCameras);
        _dockedCameras[action.payload.cameraPosition] = null;
        return (0, _assign["default"])({}, state, {
          dockedCameras: _dockedCameras
        });
      }
    case "CAMERA_PRIORITY_SET":
      {
        var dockOpen = action.payload.dockOpen;
        var modalOpen = action.payload.modalOpen;

        // If null is passed for either dockOpen or modalOpen, default to whatever is in state already
        // This allows the you to update whether the dock or modal is open without having to know the state of the other
        var _newState = _objectSpread(_objectSpread({}, state), {}, {
          cameraPriority: {
            dockOpen: dockOpen !== null ? dockOpen : state.cameraPriority.dockOpen,
            modalOpen: modalOpen !== null ? modalOpen : state.cameraPriority.modalOpen
          }
        });
        return _newState;
      }
    case "TOGGLE_FIND_NEAREST":
      {
        // reset other "find nearest" buttons
        var resetFindNearest = [false, false, false];

        // if specific find nearest is off, turn specific find nearest on, otherwise the above will turn it off
        if (state.findNearestMode[action.payload.cameraPosition] === false) {
          resetFindNearest[action.payload.cameraPosition] = true;
        }
        var _newState2 = _objectSpread(_objectSpread({}, state), {}, {
          findNearestMode: resetFindNearest,
          findNearestPosition: action.payload.cameraPosition
        });
        return _newState2;
      }
    case "CLEAR_FIND_NEAREST":
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          findNearestMode: [false, false, false],
          findNearestPosition: null
        });
      }
    case "CLEAR_CAMERA_REPLACE_MODE":
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          cameraReplaceMode: {
            camera: null,
            replaceMode: false
          }
        });
      }
    case "CAMERA_TO_DOCK_MODE":
      {
        var _context;
        // -- handle if camera already present in dock
        if ((0, _includes["default"])(_context = state.dockedCameras).call(_context, action.payload.camera.id)) {
          return _objectSpread({}, state);
        } else {
          return _objectSpread(_objectSpread({}, state), {}, {
            cameraReplaceMode: {
              camera: action.payload.camera,
              replaceMode: action.payload.replaceMode
            }
          });
        }
      }
    default:
      return state;
  }
};
var _default = cameraDock;
exports["default"] = _default;