"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleLoading = exports.setLoading = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Set the loading status for a component
 * @param component: listPanel, profile, dialog, etc.
 * @param loading: true/false
 */
var setLoading = function setLoading(component, loading) {
  return {
    type: t.SET_LOADING,
    payload: {
      component: component,
      loading: loading
    }
  };
};

/*
 * Toggle the loading status for a component
 * @param component: listPanel, profile, dialog, etc.
 */
exports.setLoading = setLoading;
var toggleLoading = function toggleLoading(component) {
  return {
    type: t.TOGGLE_LOADING,
    payload: {
      component: component
    }
  };
};
exports.toggleLoading = toggleLoading;