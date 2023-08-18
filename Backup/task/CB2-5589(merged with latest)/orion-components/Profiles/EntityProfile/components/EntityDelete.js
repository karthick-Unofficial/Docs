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
var _reactRedux = require("react-redux");
var EntityDelete = function EntityDelete(_ref) {
  var closeDialog = _ref.closeDialog,
    name = _ref.name,
    id = _ref.id,
    deleteShape = _ref.deleteShape,
    open = _ref.open;
  var dispatch = (0, _reactRedux.useDispatch)();
  var handleClose = function handleClose() {
    dispatch(closeDialog("shapeDeleteDialog"));
  };
  var handleConfirmDelete = function handleConfirmDelete() {
    dispatch(deleteShape(id, name));
    handleClose();
  };
  var actions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleClose,
    key: "cancel-action-button"
  }, (0, _i18n.getTranslation)("global.profiles.entityProfile.entityDelete.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleConfirmDelete,
    key: "delete-action-button"
  }, (0, _i18n.getTranslation)("global.profiles.entityProfile.entityDelete.delete"))];
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    open: open,
    sx: {
      padding: "24px"
    },
    onRequestClose: handleClose
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogContent, {
    sx: {
      maxWidth: "500px",
      color: "#fff"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "dialog-first-section"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.entityProfile.entityDelete.confirmationText"
  }))), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, actions));
};
var _default = EntityDelete;
exports["default"] = _default;