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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  notifications: _propTypes["default"].array.isRequired,
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
    onExiting: _propTypes["default"].func
  }),
  clearSystemNotifications: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var defaultProps = {
  notifications: [],
  dir: "ltr"
};
var stopPropagation = function stopPropagation(e) {
  e.stopPropagation();
};
var NotificationsDialog = function NotificationsDialog(_ref) {
  var _context, _context2;
  var notifications = _ref.notifications,
    options = _ref.options,
    paperPropStyles = _ref.paperPropStyles,
    titlePropStyles = _ref.titlePropStyles,
    clearSystemNotifications = _ref.clearSystemNotifications,
    dir = _ref.dir;
  var styles = {
    dialog: {
      backgroundColor: "#2c2d2f"
    },
    title: {
      color: "#fff"
    },
    pageCounter: _objectSpread(_objectSpread(_objectSpread({
      position: "absolute",
      top: "0"
    }, dir === "rtl" && {
      left: 0
    }), dir === "ltr" && {
      right: 0
    }), {}, {
      margin: "0",
      padding: "16px 24px",
      color: "#fff",
      fontSize: "12px"
    }),
    text: {
      color: "#B5B9BE",
      minWidth: "552px",
      minHeight: "130px"
    },
    confirm: {
      color: "#35b7f3"
    }
  };
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(notifications.length > 0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(1),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    currentPage = _useState4[0],
    setCurrentPage = _useState4[1];
  var _useState5 = (0, _react.useState)(notifications[0]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    currentNotification = _useState6[0],
    setCurrentNotification = _useState6[1];
  (0, _react.useEffect)(function () {
    // -- open dialog if new notifications and currently closed
    if (open === false) {
      setOpen(notifications.length > 0);
      setCurrentNotification(notifications[0]);
    }
  }, [notifications]);
  var goToNextPage = function goToNextPage(newPage) {
    // -- move on to the next notification if available, or close the dialog
    var newNotification = notifications[newPage - 1];
    if (newNotification) {
      if (newNotification.ack) {
        // -- skip notification if already acknowledged
        goToNextPage(newPage + 1);
      } else {
        setCurrentNotification(newNotification);
        setCurrentPage(newPage);
      }
    } else {
      // -- close dialog and remove system notifications
      setOpen(false);
      dispatch(clearSystemNotifications());
    }
  };
  var onConfirmClick = function onConfirmClick() {
    // -- run action associated with confirmation
    currentNotification.confirm.action();
    goToNextPage(currentPage + 1);
  };
  return currentNotification ? /*#__PURE__*/_react["default"].createElement(_material.Dialog, (0, _extends2["default"])({}, options, {
    PaperProps: {
      style: _objectSpread(_objectSpread({}, styles.dialog), paperPropStyles ? paperPropStyles : {})
    },
    open: open,
    disableEnforceFocus: true,
    scroll: "paper",
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }), currentNotification.title && /*#__PURE__*/_react["default"].createElement(_material.DialogTitle, {
    style: _objectSpread(_objectSpread({}, styles.title), titlePropStyles),
    disableTypography: true
  }, currentNotification.title), notifications.length > 1 && /*#__PURE__*/_react["default"].createElement("p", {
    style: styles.pageCounter
  }, (0, _concat["default"])(_context = "".concat(currentPage, "/")).call(_context, notifications.length)), /*#__PURE__*/_react["default"].createElement(_material.DialogContent, null, currentNotification.textContent && /*#__PURE__*/_react["default"].createElement(_material.DialogContentText, {
    variant: "body2",
    style: styles.text
  }, (0, _map["default"])(_context2 = currentNotification.textContent.split("\n")).call(_context2, function (text, index, array) {
    // -- don't add line break on last item
    var lastItem = index === array.length - 1;
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
      key: index
    }, text, !lastItem && /*#__PURE__*/_react["default"].createElement("br", null));
  }))), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, currentNotification.confirm && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    disabled: currentNotification.confirm.disabled,
    onClick: onConfirmClick,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation,
    color: "primary"
  }, currentNotification.confirm.label))) : null;
};
NotificationsDialog.propTypes = propTypes;
NotificationsDialog.defaultProps = defaultProps;
var _default = NotificationsDialog;
exports["default"] = _default;