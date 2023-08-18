"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeExclusions = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Add an excluded entity to state
 * @param {object} exclusion
 */
var exclusionReceived = function exclusionReceived(exclusion) {
  return {
    type: t.EXCLUSION_RECEIVED,
    payload: {
      exclusion: exclusion
    }
  };
};

/**
 * Remove an excluded entity from state
 * @param {string} exclusionId
 */
var exclusionRemoved = function exclusionRemoved(exclusion) {
  return {
    type: t.EXCLUSION_REMOVED,
    payload: {
      exclusion: exclusion
    }
  };
};

/**
 * Subscribe to entities a user has chosen to exclude from their application
 */
var subscribeExclusions = function subscribeExclusions() {
  return function (dispatch) {
    _clientAppCore.authExclusionService.subscribeExclusions(function (err, res) {
      if (err) {
        console.log("Error subscribing exclusions:", err);
      }
      switch (res.type) {
        case "initial":
        case "add":
        case "change":
          {
            var exclusion = res.new_val;
            dispatch(exclusionReceived(exclusion));
            break;
          }
        case "remove":
          {
            var _exclusion = res.old_val;
            dispatch(exclusionRemoved(_exclusion));
            break;
          }
        default:
          break;
      }
    });
  };
};
exports.subscribeExclusions = subscribeExclusions;