"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/slice");
var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");
var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");
var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");
var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeFeedPermissions = exports.subscribeAppFeedPermissions = exports.setFeedPermissions = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var feedPermissionReceived = function feedPermissionReceived(feedId, name, canView, source, entityType, ownerOrg, mapIconTemplate, profileIconTemplate, renderSilhouette) {
  var marineTrafficVisible = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;
  return {
    type: t.FEED_PERMISSION_RECEIVED,
    payload: {
      feedId: feedId,
      name: name,
      canView: canView,
      source: source,
      entityType: entityType,
      ownerOrg: ownerOrg,
      mapIconTemplate: mapIconTemplate,
      profileIconTemplate: profileIconTemplate,
      renderSilhouette: renderSilhouette,
      marineTrafficVisible: marineTrafficVisible
    }
  };
};
var subscribeFeedPermissions = function subscribeFeedPermissions(userId) {
  return function (dispatch) {
    _clientAppCore.feedService.streamUserIntegration(userId, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      switch (response.type) {
        case "initial":
        case "change":
          {
            var config = response.new_val.config;
            dispatch(feedPermissionReceived(response.feedId, response.name, config.canView, response.source, response.entityType, response.ownerOrg, response.mapIconTemplate, response.profileIconTemplate, response.renderSilhouette));
          }
          break;
        default:
          break;
      }
    });
  };
};
exports.subscribeFeedPermissions = subscribeFeedPermissions;
var setFeedPermissions = function setFeedPermissions(feedPermissions) {
  return function (dispatch) {
    var _iterator = _createForOfIteratorHelper(feedPermissions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var permission = _step.value;
        dispatch(feedPermissionReceived(permission.feedId, permission.name, permission.canView || true, permission.source, permission.entityType, permission.ownerOrg, permission.mapIconTemplate, permission.profileIconTemplate, permission.renderSilhouette));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
};
exports.setFeedPermissions = setFeedPermissions;
var subscribeAppFeedPermissions = function subscribeAppFeedPermissions(userId, appId) {
  return function (dispatch) {
    _clientAppCore.feedService.streamUserAppIntegration(userId, appId, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      switch (response.type) {
        case "initial":
        case "change":
          {
            var config = response.new_val.config;
            dispatch(feedPermissionReceived(response.feedId, response.name, config.canView, response.source, response.entityType, response.ownerOrg, response.mapIconTemplate, response.profileIconTemplate, response.renderSilhouette, response.marineTrafficVisible));
          }
          break;
        default:
          break;
      }
    });
  };
};
exports.subscribeAppFeedPermissions = subscribeAppFeedPermissions;