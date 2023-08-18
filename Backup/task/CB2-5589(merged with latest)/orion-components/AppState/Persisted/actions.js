"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
exports.updatePersistedState = exports.setLocalAppState = exports.setAppState = exports.getAppState = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
var _keys = _interopRequireDefault(require("lodash/keys"));
var _get = _interopRequireDefault(require("lodash/get"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
/*
 * Set persisted app state from DB
 * @params appState: app state object
 */
var appStateReceived = function appStateReceived(appState) {
  return {
    type: t.APP_STATE_RECEIVED,
    payload: {
      appState: appState
    }
  };
};

/*
 * Get persisted app state from DB
 * @params app: app name string
 */
var getAppState = function getAppState(app) {
  return function (dispatch) {
    return new _promise["default"](function (resolve) {
      _clientAppCore.userService.getAppState(app, function (err, result) {
        if (err) console.log(err);else {
          dispatch(appStateReceived(_objectSpread({}, result.state)));
          resolve();
        }
      });
    });
  };
};

/*
 * Set app state from caller - for offline usage, i.e. standalone replay
 * @params app: app name string
 * @params state: app state object
 */
exports.getAppState = getAppState;
var setAppState = function setAppState(app, state) {
  return function (dispatch) {
    dispatch(appStateReceived(_objectSpread({}, state)));
  };
};

/*
 * Update persisted app state in local state
 * @params keyVal: an object with a key-value pair to update in the local state (ex: { mapZoom: 11 })
 */
exports.setAppState = setAppState;
var setLocalAppState = function setLocalAppState(key, value) {
  return {
    type: t.SET_LOCAL_APP_STATE,
    payload: {
      key: key,
      value: value
    }
  };
};

/*
 * Update persisted app state in DB and local state
 * @params app: app name string
 * @params key: an object key string to update in the DB and local state
 * @params value: an object value to update in the DB and local state
 * @params reliable: if set to true, the local state would be updated only after the persistence
 *                   on server is successful. Default value is true.
 */
exports.setLocalAppState = setLocalAppState;
var updatePersistedState = function updatePersistedState(app, key, value) {
  var reliable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return function (dispatch, getState) {
    var _context;
    // Check to see if we are updating a nested object
    var isNested = !(0, _includes["default"])(_context = (0, _keys["default"])(value)).call(_context, key);
    var oldValue = getState().appState.persisted[key];
    // If not updating a nested object, only return the value
    var update = isNested ? _objectSpread(_objectSpread({}, oldValue || value), value) : (0, _get["default"])(value, key);
    if (!reliable) {
      // We update the local state straight-away
      dispatch(setLocalAppState(key, update));
    }
    _clientAppCore.userService.setAppState(app, (0, _defineProperty2["default"])({}, key, update), function (err, result) {
      if (err) {
        console.log(err, result);
      } else {
        if (reliable) {
          dispatch(setLocalAppState(key, update));
        }
      }
    });
  };
};
exports.updatePersistedState = updatePersistedState;