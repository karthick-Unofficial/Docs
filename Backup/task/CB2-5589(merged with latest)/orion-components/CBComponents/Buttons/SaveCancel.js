"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  handleCancel: _propTypes["default"].func.isRequired,
  handleConfirm: _propTypes["default"].func.isRequired,
  disabled: _propTypes["default"].bool
};
var SaveCancel = function SaveCancel(_ref) {
  var handleCancel = _ref.handleCancel,
    handleConfirm = _ref.handleConfirm,
    disabled = _ref.disabled;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Fab, {
    size: "small",
    style: {
      backgroundColor: "#E85858",
      color: "#FFF",
      bottom: 24
    },
    onClick: handleCancel
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Close, null)), /*#__PURE__*/_react["default"].createElement(_material.Fab, {
    style: disabled ? {
      backgroundColor: "#4CAF50",
      color: "#FFF",
      opacity: 0.4
    } : {
      backgroundColor: "#4CAF50",
      color: "#FFF"
    },
    onClick: handleConfirm,
    disabled: disabled
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Check, null)));
};
SaveCancel.propTypes = propTypes;
var _default = SaveCancel;
exports["default"] = _default;