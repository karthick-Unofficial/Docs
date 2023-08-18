"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeUnitMembers = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Add or update a unit member in state
 * @param unit member: a unit member object
 */
var unitMemberReceived = function unitMemberReceived(member) {
  return {
    type: t.UNIT_MEMBER_RECEIVED,
    payload: {
      member: member
    }
  };
};

/*
 * Remove a unit member in state
 * @param unit member: ID of a unit member to be removed
 */
var unitMemberRemoved = function unitMemberRemoved(unitMemberId) {
  return {
    type: t.UNIT_MEMBER_REMOVED,
    payload: {
      unitMemberId: unitMemberId
    }
  };
};

/*
 * Subscribe to unit member feed
 */
var subscribeUnitMembers = function subscribeUnitMembers() {
  return function (dispatch) {
    _clientAppCore.unitService.streamUnitMembers(function (err, response) {
      if (err) console.log(err);else {
        if (!response) return;
        switch (response.type) {
          case "initial":
          case "add":
          case "change":
            dispatch(unitMemberReceived(response.new_val));
            break;
          case "remove":
            dispatch(unitMemberRemoved(response.old_val.id));
            break;
          default:
        }
      }
    });
  };
};
exports.subscribeUnitMembers = subscribeUnitMembers;