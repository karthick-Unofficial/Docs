"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var CameraDialog = function CameraDialog(_ref) {
  var camera = _ref.camera,
    open = _ref.open,
    close = _ref.close,
    update = _ref.update,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(camera ? camera.entityData.properties.name : ""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    name = _useState2[0],
    setName = _useState2[1];
  var _useState3 = (0, _react.useState)(camera ? camera.entityData.properties.description : ""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    description = _useState4[0],
    setDescription = _useState4[1];
  var type = camera ? camera.entityData.properties.deviceType : "";
  var cameraId = camera ? camera.connection.cameraId : "";
  var system = camera ? camera.cameraSystem : "";
  var _useState5 = (0, _react.useState)({
      name: ""
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var handleClose = function handleClose() {
    close();
  };
  var handleNameChange = function handleNameChange(event) {
    if (event.target.value.length > 50) {
      setError(_objectSpread(_objectSpread({}, error), {}, {
        name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.errorText.lessThanFifty")
      }));
      return;
    }
    setName(event.target.value);
    setError(_objectSpread(_objectSpread({}, error), {}, {
      name: ""
    }));
  };
  var handleDescriptionChange = function handleDescriptionChange(event) {
    setDescription(event.target.value);
  };
  var handleCancel = function handleCancel() {
    setName(camera ? camera.entityData.properties.name : "");
    setDescription(camera ? camera.entityData.properties.description : "");
    handleClose();
  };
  var handleSave = function handleSave() {
    if (!name) {
      setError(_objectSpread(_objectSpread({}, error), {}, {
        name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.errorText.noName")
      }));
      return;
    }
    var Update = {
      camera: {
        properties: _objectSpread(_objectSpread({}, camera.entityData.properties), {}, {
          name: name,
          description: description
        })
      }
    };
    dispatch(update(camera.id, Update));
    handleClose();
  };
  var dialogStyles = {
    dialog: {
      maxWidth: 500
    }
  };
  var textFieldStyles = {
    marginBottom: "2rem",
    backgroundColor: "#2C2D2F",
    // Force styling in Map app
    input: {
      textOverflow: "ellipsis"
    }
  };
  var actions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    style: {
      color: "#B2B6BB"
    },
    onClick: handleCancel,
    key: "cancel-action-button"
  }, (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleSave,
    key: "confirm-action-button"
  }, (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.confirm"))];
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    open: open,
    onRequestClose: handleCancel,
    PaperProps: {
      sx: _objectSpread({}, dialogStyles.dialog)
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, {
    sx: {
      marginBottom: "1.5rem"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    sx: {
      fontWeight: "400",
      fontSize: "22px"
    }
  }, (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.editCam"))), /*#__PURE__*/_react["default"].createElement(_material.DialogContent, {
    sx: {
      paddingTop: "25px",
      paddingBottom: "25px",
      borderTop: "none",
      borderBottom: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "camera-name",
    fullWidth: true,
    label: (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.camName"),
    value: name,
    variant: "standard",
    onChange: handleNameChange,
    sx: textFieldStyles,
    errorText: error.name,
    InputProps: {
      style: textFieldStyles.input
    },
    InputLabelProps: {
      style: {
        color: "#646465",
        transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
        left: "unset"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "camera-description",
    fullWidth: true,
    variant: "standard",
    label: (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.desc"),
    value: description,
    onChange: handleDescriptionChange,
    sx: textFieldStyles,
    InputProps: {
      style: textFieldStyles.input
    },
    InputLabelProps: {
      style: {
        color: "#646465",
        transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
        left: "unset"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "camera-type",
    fullWidth: true,
    variant: "standard",
    label: (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.type"),
    disabled: true,
    value: type,
    sx: textFieldStyles,
    InputProps: {
      style: textFieldStyles.input
    },
    InputLabelProps: {
      style: {
        color: "#646465",
        transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
        left: "unset"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "camera-id",
    fullWidth: true,
    variant: "standard",
    label: (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.camId"),
    disabled: true,
    value: cameraId,
    sx: textFieldStyles,
    InputProps: {
      style: textFieldStyles.input
    },
    InputLabelProps: {
      style: {
        color: "#646465",
        transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
        left: "unset"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "camera-system",
    fullWidth: true,
    variant: "standard",
    label: (0, _i18n.getTranslation)("global.profiles.cameraProfile.cameraDialog.systemName"),
    disabled: true,
    value: system,
    sx: textFieldStyles,
    InputProps: {
      style: textFieldStyles.input
    },
    InputLabelProps: {
      style: {
        color: "#646465",
        transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
        left: "unset"
      }
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, actions));
};
var _default = CameraDialog;
exports["default"] = _default;