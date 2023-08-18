"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.openDialog = exports.closeDialog = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Open a dialog via its reference, optionally passing data to it
 * @param {string} dialogRef -- string reference to dialog to open
 * @param {any} dialogData -- optional, additional data you'd like to pass to your dialog
 */
var openDialog = function openDialog(dialogRef) {
  var dialogData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return {
    type: t.OPEN_DIALOG,
    payload: {
      dialogRef: dialogRef,
      dialogData: dialogData
    }
  };
};

/**
 * Close a dialog via its reference, and clear optional dialog data if it exists
 * @param {string} dialogRef -- string reference to dialog to close
 */
exports.openDialog = openDialog;
var closeDialog = function closeDialog(dialogRef) {
  return {
    type: t.CLOSE_DIALOG,
    payload: {
      dialogRef: dialogRef
    }
  };
};
exports.closeDialog = closeDialog;