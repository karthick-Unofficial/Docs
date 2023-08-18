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
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  open: _propTypes["default"].bool.isRequired,
  title: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]),
  children: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  textContent: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]),
  confirm: _propTypes["default"].shape({
    label: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]),
    action: _propTypes["default"].func.isRequired,
    disabled: _propTypes["default"].bool,
    style: _propTypes["default"].object
  }),
  abort: _propTypes["default"].shape({
    label: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]).isRequired,
    action: _propTypes["default"].func.isRequired,
    disabled: _propTypes["default"].bool,
    style: _propTypes["default"].object
  }),
  deletion: _propTypes["default"].shape({
    label: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]).isRequired,
    action: _propTypes["default"].func.isRequired,
    disabled: _propTypes["default"].bool
  }),
  textFooter: _propTypes["default"].string,
  requesting: _propTypes["default"].bool,
  deleteConfirmation: _propTypes["default"].bool,
  // The options prop allows you to pass in any Material-ui Dialog prop
  // Found here: https://material-ui.com/api/dialog/#props
  options: _propTypes["default"].shape({
    disableBackdropClick: _propTypes["default"].bool,
    disableEscapeKeyDown: _propTypes["default"].bool,
    fullScreen: _propTypes["default"].bool,
    fullWidth: _propTypes["default"].bool,
    maxWidth: _propTypes["default"].oneOf(["xs", "sm", "md", "lg", "xl", false]),
    onBackdropClick: _propTypes["default"].func,
    onClose: _propTypes["default"].func,
    onEnter: _propTypes["default"].func,
    onEntered: _propTypes["default"].func,
    onEntering: _propTypes["default"].func,
    onEscapeKeyDown: _propTypes["default"].func,
    onExit: _propTypes["default"].func,
    onExited: _propTypes["default"].func,
    onExiting: _propTypes["default"].func,
    dir: _propTypes["default"].string
  }),
  paperPropStyles: _propTypes["default"].object,
  titlePropStyles: _propTypes["default"].object,
  dir: _propTypes["default"].string,
  classes: _propTypes["default"].object,
  dialogContentStyles: _propTypes["default"].object,
  actionPropStyles: _propTypes["default"].object,
  actions: _propTypes["default"].bool,
  DialogActionsFunction: _propTypes["default"].func
};
var defaultProps = {
  title: "",
  children: [],
  textContent: "",
  confirm: null,
  abort: null,
  deletion: null,
  textFooter: "",
  requesting: false,
  deleteConfirmation: true,
  actionPropStyles: {},
  actions: false,
  DialogActionsFunction: function DialogActionsFunction() {}
};
var stopPropagation = function stopPropagation(e) {
  e.stopPropagation();
};
var styleOverrides = {
  disabled: {
    color: "#fff!important",
    opacity: "0.3"
  }
};
var CBDialog = function CBDialog(_ref) {
  var open = _ref.open,
    title = _ref.title,
    children = _ref.children,
    textContent = _ref.textContent,
    confirm = _ref.confirm,
    abort = _ref.abort,
    deletion = _ref.deletion,
    textFooter = _ref.textFooter,
    requesting = _ref.requesting,
    deleteConfirmation = _ref.deleteConfirmation,
    options = _ref.options,
    paperPropStyles = _ref.paperPropStyles,
    titlePropStyles = _ref.titlePropStyles,
    dir = _ref.dir,
    classes = _ref.classes,
    dialogContentStyles = _ref.dialogContentStyles,
    actionPropStyles = _ref.actionPropStyles,
    actions = _ref.actions,
    DialogActionsFunction = _ref.DialogActionsFunction;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    deletionConfirm = _useState2[0],
    setDeletionConfirm = _useState2[1];
  var styles = {
    dialog: {
      backgroundColor: "#2c2d2f"
    },
    title: {
      color: "#fff",
      letterSpacing: "unset",
      lineHeight: "unset"
    },
    confirm: {
      color: "#35b7f3"
    },
    footer: {
      margin: "32px 0"
    },
    deleteConfirmationBtn: _objectSpread({
      color: deletionConfirm ? "#FFF" : "#E85858",
      "&.MuiButton-root": {
        background: deletionConfirm ? "#E85858" : ""
      }
    }, dir === "ltr" && {
      marginRight: "auto"
    }),
    deleteBtn: _objectSpread(_objectSpread({
      color: "#E85858"
    }, dir === "ltr" && {
      marginRight: "auto"
    }), dir === "rtl" && {
      marginLeft: "auto"
    })
  };
  var askForDeleteConfirmation = function askForDeleteConfirmation() {
    setDeletionConfirm(true);
    (0, _setTimeout2["default"])(function () {
      setDeletionConfirm(false);
    }, 5000);
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, (0, _extends2["default"])({}, options, {
    PaperProps: {
      sx: _objectSpread(_objectSpread({}, styles.dialog), paperPropStyles ? paperPropStyles : {})
    },
    open: open,
    disableEnforceFocus: true,
    scroll: "paper",
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }), title && /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, {
    sx: _objectSpread(_objectSpread({}, styles.title), titlePropStyles),
    disableTypography: true
  }, title), /*#__PURE__*/_react["default"].createElement(_material.DialogContent, {
    sx: dialogContentStyles
  }, textContent && /*#__PURE__*/_react["default"].createElement(_material.DialogContentText, {
    variant: "body2",
    color: "#fff"
  }, textContent), children, textFooter && /*#__PURE__*/_react["default"].createElement(_material.DialogContentText, {
    variant: "body2",
    style: styles.footer
  }, textFooter)), actions ? DialogActionsFunction() : /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, deletion && !requesting && (deleteConfirmation ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
    sx: styles.deleteConfirmationBtn,
    onClick: deletionConfirm ? deletion.action : askForDeleteConfirmation,
    variant: deletionConfirm ? "contained" : "text",
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, deletionConfirm ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBDialog.confirmDelete"
  }) : deletion.label) : /*#__PURE__*/_react["default"].createElement(_material.Button, {
    sx: styles.deleteBtn,
    onClick: deletion.action,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation,
    style: actionPropStyles
  }, deletion.label)), abort && !requesting && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: abort.action,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation,
    style: actionPropStyles,
    sx: _objectSpread({
      color: abort.style ? abort.style : "#B3B7BC"
    }, actionPropStyles)
  }, abort.label), confirm && !requesting && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    disabled: confirm.disabled,
    onClick: confirm.action,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation,
    sx: _objectSpread({}, actionPropStyles),
    color: "primary",
    style: confirm.style,
    classes: {
      disabled: classes.disabled
    }
  }, confirm.label), requesting && /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, null)));
};
CBDialog.propTypes = propTypes;
CBDialog.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styleOverrides)(CBDialog);
exports["default"] = _default;