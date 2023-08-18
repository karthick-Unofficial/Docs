"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedLocales = exports.fallbackLocale = void 0;
// cSpell:disable
var supportedLocales = {
  en: "English",
  ar: "عربي",
  ar_kw: "عربي - الكويت"
};
exports.supportedLocales = supportedLocales;
var fallbackLocale = "en";
exports.fallbackLocale = fallbackLocale;