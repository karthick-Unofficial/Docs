"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeRules = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// const ruleBatchReceived = rules => {
// 	return {
// 		type: t.RULE_BATCH_RECEIVED,
// 		payload: {
// 			rules
// 		}
// 	};
// };

var ruleReceived = function ruleReceived(rule) {
  return {
    type: t.RULE_RECEIVED,
    payload: {
      rule: rule
    }
  };
};
var ruleRemoved = function ruleRemoved(rule) {
  return {
    type: t.RULE_REMOVED,
    payload: {
      rule: rule
    }
  };
};
var subscribeRules = function subscribeRules() {
  var optionalEntityId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return function (dispatch) {
    _clientAppCore.ruleService.streamRules(optionalEntityId, function (err, res) {
      if (err) console.log(err);else if (!res) return;else {
        var rule = res.new_val;
        if (!rule || rule.deleted === true) {
          dispatch(ruleRemoved(!rule ? res.old_val : rule));
        } else {
          dispatch(ruleReceived(rule));
        }
      }
    });
  };
};
exports.subscribeRules = subscribeRules;