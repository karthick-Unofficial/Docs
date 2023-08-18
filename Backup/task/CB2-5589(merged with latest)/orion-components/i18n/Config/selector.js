"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getCultureCode = getCultureCode;
exports.getDir = getDir;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var rtlLocales = ["ar", "ar_kw"];
function getDir(state) {
  return (0, _includes["default"])(rtlLocales).call(rtlLocales, state.i18n.locale) ? "rtl" : "ltr";
}
function getCultureCode(state) {
  switch (state.i18n.locale) {
    case "ar":
      return "ar-EG";
    case "ar_kw":
      return "ar-KW";
    case "en":
      return "en-US";
    default:
      return "en-US";
  }
}