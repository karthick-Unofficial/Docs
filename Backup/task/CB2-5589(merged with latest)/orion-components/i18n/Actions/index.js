"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalize = getLocalize;
exports.getTranslation = getTranslation;
exports.initI18n = initI18n;
exports.setLocaleWithFallback = setLocaleWithFallback;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _reactReduxI18n = require("react-redux-i18n");
var _i18n = require("../Config/i18n");
var _clientAppCore = require("client-app-core");
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
function initI18n(appId, store) {
  return function (dispatch) {
    if ((0, _isEmpty["default"])(store.i18n)) {
      dispatch(setLocaleWithFallback());
    }
    return new _promise["default"](function (resolve) {
      _clientAppCore.translationService.loadTranslations(appId, function (err, response) {
        if (err) {
          // console.log("translationServiceErr", err);
        } else {
          dispatch((0, _reactReduxI18n.loadTranslations)(response.translations));
          resolve();
        }
      });
    });
  };
}
function setLocaleWithFallback(desiredLocale) {
  var _context, _context2;
  var browserLocale = navigator.language.split("-");
  var finalLocale = (0, _includes["default"])(_context = (0, _keys["default"])(_i18n.supportedLocales)).call(_context, desiredLocale) ? desiredLocale : (0, _includes["default"])(_context2 = (0, _keys["default"])(_i18n.supportedLocales)).call(_context2, browserLocale[0]) ? browserLocale[0] : _i18n.fallbackLocale;
  return function (dispatch) {
    return dispatch((0, _reactReduxI18n.setLocale)(finalLocale));
  };
}
function getTranslation(code, count, primaryValue, secondaryValue) {
  return _reactReduxI18n.I18n.t(code, {
    count: count != undefined ? count : "",
    primaryValue: primaryValue != undefined ? primaryValue : "",
    secondaryValue: secondaryValue != undefined ? secondaryValue : ""
  });
}
function getLocalize(code, format) {
  return _reactReduxI18n.I18n.l(code, {
    dateFormat: format != undefined ? format : "date.min"
  });
}