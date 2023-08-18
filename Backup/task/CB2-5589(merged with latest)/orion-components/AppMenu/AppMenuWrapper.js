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
var _CBComponents = require("../CBComponents");
var _AppMenu = _interopRequireDefault(require("./AppMenu"));
var _material = require("@mui/material");
var _Apps = _interopRequireDefault(require("@mui/icons-material/Apps"));
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// material-ui
// Added for popover menu patch (CB2-904):

var AppMenuWrapper = function AppMenuWrapper(_ref) {
  var isHydrated = _ref.isHydrated,
    logOut = _ref.logOut;
  var dispatch = (0, _reactRedux.useDispatch)();
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile;
  });
  var org = (0, _reactRedux.useSelector)(function (state) {
    return state.session.organization.profile;
  });
  var emailConfig = (0, _reactRedux.useSelector)(function (state) {
    return state.clientConfig.supportEmail;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    anchorEl = _useState4[0],
    setAnchorEl = _useState4[1];
  var toggle = function toggle() {
    setIsOpen(!isOpen);
  };
  var handleTouchTap = function handleTouchTap(event) {
    event.preventDefault(); // This prevents ghost click.
    setAnchorEl(event.currentTarget);
    toggle();
  };
  var id = isOpen ? "apps-popover" : undefined;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 48
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.AudioAlertPlayer, null), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleTouchTap,
    "aria-describedby": id,
    sx: {
      width: 48,
      height: 48
    }
  }, /*#__PURE__*/_react["default"].createElement(_Apps["default"], {
    sx: {
      color: "#FFF"
    }
  })), isOpen && /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    id: id,
    open: isOpen,
    anchorEl: anchorEl,
    anchorOrigin: {
      horizontal: "right",
      vertical: "bottom"
    },
    transformOrigin: {
      horizontal: "bottom",
      vertical: "top"
    },
    onClose: function onClose() {
      setIsOpen(false);
      setAnchorEl(null);
    },
    PaperProps: {
      sx: {
        top: "50px !important",
        backgroundColor: "transparent",
        boxShadow: "0"
      }
    },
    sx: {
      left: "10px"
    }
  }, isHydrated && /*#__PURE__*/_react["default"].createElement(_AppMenu["default"], {
    user: user,
    org: org,
    emailConfig: emailConfig,
    dir: dir,
    logOut: logOut,
    dispatch: dispatch
  })));
};
var _default = AppMenuWrapper;
exports["default"] = _default;