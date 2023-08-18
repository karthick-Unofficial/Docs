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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactDropzone = _interopRequireDefault(require("react-dropzone"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PhoenixDropzone = function PhoenixDropzone(_ref) {
  var attachAction = _ref.attachAction,
    targetEntityId = _ref.targetEntityId,
    targetEntityType = _ref.targetEntityType;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    files = _useState2[0],
    setFiles = _useState2[1];
  var dropzone = (0, _react.useRef)();
  var onDrop = function onDrop(acceptedFiles) {
    (0, _map["default"])(acceptedFiles).call(acceptedFiles, function (file) {
      return (0, _assign["default"])(file, {
        preview: _url["default"].createObjectURL(file)
      });
    });
    dispatch(attachAction(targetEntityId, targetEntityType, acceptedFiles));
    setFiles(acceptedFiles);
  };
  var onOpenClick = function onOpenClick() {
    dropzone.current.open();
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_reactDropzone["default"], {
    ref: dropzone,
    onDrop: onDrop,
    style: {
      display: "none"
    }
  }, function (_ref2) {
    var getRootProps = _ref2.getRootProps,
      getInputProps = _ref2.getInputProps;
    return /*#__PURE__*/_react["default"].createElement("div", getRootProps(), /*#__PURE__*/_react["default"].createElement("input", getInputProps()));
  }), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: onOpenClick
  }, (0, _i18n.getTranslation)("global.profiles.widgets.files.phoenixDropzone.uploadFiles")));
};
var _default = PhoenixDropzone;
exports["default"] = _default;