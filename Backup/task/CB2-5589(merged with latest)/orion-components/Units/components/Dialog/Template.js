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
var _styles = require("@mui/styles");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  checkError: _propTypes["default"].func
};
var defaultProps = {
  checkError: function checkError() {},
  onCancel: function onCancel() {}
};
var useStyles = (0, _styles.makeStyles)({
  scrollPaper: {
    width: "70%",
    margin: "0px auto"
  }
});
var Template = function Template(_ref) {
  var open = _ref.open,
    closeDialog = _ref.closeDialog,
    title = _ref.title,
    children = _ref.children,
    onSubmit = _ref.onSubmit,
    name = _ref.name,
    checkError = _ref.checkError,
    onCancel = _ref.onCancel;
  var overrides = {
    paperProps: {
      width: "480px",
      borderRadius: "5px",
      padding: "25px"
    }
  };
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    unitName = _useState4[0],
    setUnitName = _useState4[1];
  var classes = useStyles();
  (0, _react.useEffect)(function () {
    setIsOpen(open);
    setUnitName(name);
  }, [open, name]);
  var save = function save() {
    var emptyString = new RegExp("^\\s*$");
    if (emptyString.test(unitName)) {
      checkError("unitName");
    } else {
      onSubmit(unitName);
      handleDialogClose();
    }
  };
  var handleDialogClose = function handleDialogClose() {
    setIsOpen(!isOpen);
    setUnitName("");
    closeDialog();
    checkError("");
    onCancel();
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    PaperProps: {
      sx: overrides.paperProps
    },
    open: isOpen,
    onClose: handleDialogClose,
    classes: {
      scrollPaper: classes.scrollPaper
    },
    sx: {
      zIndex: "1200"
    },
    disableEnforceFocus: true,
    scroll: "paper"
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "16px",
    style: {
      marginBottom: "12px",
      fontWeight: "300px"
    }
  }, title)), /*#__PURE__*/_react["default"].createElement(_material.DialogContent, null, children), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 3,
    sm: 3,
    md: 3,
    lg: 3
  }), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 4,
    sm: 4,
    md: 4,
    lg: 4
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    className: "themedButton",
    variant: "text",
    style: {
      textTransform: "none",
      color: "#8A8E92"
    },
    onClick: handleDialogClose
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.dialog.template.cancel"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 4,
    sm: 4,
    md: 4,
    lg: 4
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    className: "themedButton",
    variant: "text",
    style: {
      textTransform: "none",
      backgroundColor: "#4DB5F4",
      width: "175px",
      color: "#fff",
      borderRadius: "10px"
    },
    onClick: save
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.dialog.template.save"
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1
  }))))));
};
Template.propTypes = propTypes;
Template.defaultProps = defaultProps;
var _default = Template;
exports["default"] = _default;