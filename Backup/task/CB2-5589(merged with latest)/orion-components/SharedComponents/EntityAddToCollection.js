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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _CBComponents = require("orion-components/CBComponents");
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Material Ui

var styles = {
  disabled: {
    color: "#fff!important",
    opacity: "0.3"
  }
};
var EntityAddToCollection = function EntityAddToCollection(_ref) {
  var close = _ref.close,
    handleCopyComplete = _ref.handleCopyComplete,
    addition = _ref.addition,
    createCollection = _ref.createCollection,
    open = _ref.open,
    dir = _ref.dir,
    dispatch = _ref.dispatch,
    classes = _ref.classes;
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    newCollectionValue = _useState2[0],
    setNewCollectionValue = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    errorMsg = _useState4[0],
    setErrorMsg = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    mounted = _useState6[0],
    setMounted = _useState6[1];
  if (!mounted) {
    document.addEventListener("keydown", _handleKeyDown);
    setMounted(true);
  }
  (0, _react.useEffect)(function () {
    setMounted(true);
    return function () {
      document.removeEventListener("keydown", _handleKeyDown);
    };
  }, [_handleKeyDown]);

  // Enter to submit
  var _handleKeyDown = (0, _react.useCallback)(function (event) {
    if (event.key === "Enter" && newCollectionValue.length > 0) {
      handleSubmit();
    }
  }, []);
  var handleNewCollectionChange = function handleNewCollectionChange(event) {
    setNewCollectionValue(event.target.value);
  };
  var handleClose = function handleClose() {
    // Close both dialogs
    close();
    handleCopyComplete();
    setNewCollectionValue("");
    setErrorMsg("");
  };
  var handleSubmit = function handleSubmit() {
    if (!newCollectionValue) {
      return;
    } else {
      var name = newCollectionValue;
      dispatch(createCollection(name, addition));
      handleClose();
    }
  };
  var actions = [/*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "cancel-action-button",
    className: "customActionButton",
    onClick: handleClose,
    variant: "text"
  }, (0, _i18n.getTranslation)("global.sharedComponents.entityAddToColl.cancel")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    key: "submit-action-button",
    className: "customActionButton",
    onClick: handleSubmit,
    variant: "text",
    disabled: !newCollectionValue,
    classes: {
      disabled: classes.disabled
    }
  }, (0, _i18n.getTranslation)("global.sharedComponents.entityAddToColl.submit"))];
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    className: "collection-dialog",
    modal: false,
    open: open,
    onClose: close,
    PaperProps: {
      style: {
        maxWidth: 500,
        width: "75%"
      }
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, {
    sx: {
      padding: "24px 24px 20px",
      fontSize: "22px",
      fontWeight: 400,
      lineHeight: "32px",
      background: "#1f1f21"
    }
  }, (0, _i18n.getTranslation)("global.sharedComponents.entityAddToColl.title")), errorMsg && /*#__PURE__*/_react["default"].createElement("p", {
    className: "dialog-error"
  }, errorMsg), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      color: "rgba(255, 255, 255, 0.6)",
      padding: "0px 24px 24px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    label: (0, _i18n.getTranslation)("global.sharedComponents.entityAddToColl.newColl"),
    placeholder: (0, _i18n.getTranslation)("global.sharedComponents.entityAddToColl.enterCollTitle"),
    value: newCollectionValue,
    handleChange: handleNewCollectionChange,
    autoFocus: true,
    dir: dir,
    inputLabelStyle: {
      fontSize: 16
    },
    formControlStyles: {
      width: "256px"
    },
    labelShrink: true
  })), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, {
    sx: {
      flexDirection: "row!important"
    },
    disableSpacing: true
  }, actions));
};
var _default = (0, _styles.withStyles)(styles)(EntityAddToCollection);
exports["default"] = _default;