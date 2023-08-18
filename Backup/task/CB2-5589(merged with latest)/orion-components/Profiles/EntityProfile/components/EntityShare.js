"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
// Material UI

var EntityShare = function EntityShare(_ref) {
  var handleClick = _ref.handleClick,
    handleClose = _ref.handleClose,
    shared = _ref.shared,
    open = _ref.open;
  var actions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleClick,
    key: "share-action-button"
  }, shared ? (0, _i18n.getTranslation)("global.profiles.entityProfile.entityShare.unshare") : (0, _i18n.getTranslation)("global.profiles.entityProfile.entityShare.share")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleClose,
    key: "cancel-action-button"
  }, (0, _i18n.getTranslation)("global.profiles.entityProfile.entityShare.cancel"))];
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    actions: actions,
    className: "share-dialog",
    open: open,
    onRequestClose: handleClose
  }, /*#__PURE__*/_react["default"].createElement("p", null, shared ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.entityProfile.entityShare.unshareEntity"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.entityProfile.entityShare.confirmationText"
  })));
};
var _default = EntityShare;
exports["default"] = _default;