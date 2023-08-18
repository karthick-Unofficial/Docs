"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _mdiMaterialUi = require("mdi-material-ui");
var _UserAvatar = _interopRequireDefault(require("../UserAvatar"));
var _utility = require("./utility");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context9, _context10; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context9 = ownKeys(Object(source), !0)).call(_context9, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context10 = ownKeys(Object(source))).call(_context10, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var AppMenu = function AppMenu(_ref) {
  var _context5, _context6, _context8;
  var user = _ref.user,
    org = _ref.org,
    emailConfig = _ref.emailConfig,
    dir = _ref.dir,
    logOut = _ref.logOut,
    dispatch = _ref.dispatch;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    supportURL = _useState2[0],
    setSupportURL = _useState2[1];
  (0, _react.useEffect)(function () {
    if (org && org.supportURL) {
      setSupportURL(org.supportURL);
    }
  }, []);
  var openMailClient = function openMailClient() {
    var _context, _context2, _context3, _context4;
    // %0D%0A = line break
    var supportEmailBody = (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "\n\t\t\t".concat(emailConfig.body, "\n\t\t\t", "%0D%0A", "\n\t\t\t", "%0D%0A", "\n\t\t\tAdditional Information\n\t\t\t", "%0D%0A", "\n\t\t\tTime: ")).call(_context2, new Date().toString(), "\n\t\t\t", "%0D%0A", "\n\t\t\tURL: ")).call(_context, window.location.href, "\n\t\t\t", "%0D%0A", "\n\t\t\t", "%0D%0A", "\n\t\t");
    window.location.href = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = "mailto:".concat(emailConfig.address, "?subject=")).call(_context4, emailConfig.subject, "&body=")).call(_context3, supportEmailBody);
  };
  var applications = user.applications;

  // get user agent
  var ua = window.navigator.userAgent;

  // Check if using embedded browser
  var isMobile = (0, _indexOf["default"])(ua).call(ua, "CBMobile") > -1;
  var styles = {
    avatarStyles: _objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: "16px"
    }), dir === "rtl" && {
      marginRight: "16px"
    }),
    ButtonStyles: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, isMobile && {
      visibility: "hidden"
    }), !isMobile && {
      paddingLeft: "0px",
      paddingRight: "0px"
    }), dir === "rtl" && {
      marginRight: "auto"
    }), dir === "ltr" && {
      marginLeft: "auto"
    })
  };
  var userApps = (0, _filter["default"])(applications).call(applications, function (app) {
    return app.config.canView;
  });
  var defaultApps = [{
    appId: "settings",
    name: (0, _i18n.getTranslation)("global.appMenu.main.settings"),
    link: "/settings-app/my-account-settings"
  }, {
    appId: "support",
    name: (0, _i18n.getTranslation)("global.appMenu.main.support"),
    link: supportURL || "http://aressecuritycorp.com/contact/"
  }];

  // everyone has mobile home link
  if (isMobile) {
    userApps.push({
      appId: "mobileHome",
      name: (0, _i18n.getTranslation)("global.appMenu.main.home"),
      link: "cbmobile://close-browser" // cSpell:ignore cbmobile
    });
  }

  var filteredApps = (0, _filter["default"])(_context5 = (0, _concat["default"])(_context6 = []).call(_context6, (0, _toConsumableArray2["default"])(userApps), defaultApps)).call(_context5, function (app) {
    var _context7;
    return !((0, _indexOf["default"])(_context7 = window.location.href).call(_context7, app.appId) > -1);
  });
  var title = user.ecoAdmin ? (0, _i18n.getTranslation)("global.appMenu.main.ecoAdmin") : user.admin ? (0, _i18n.getTranslation)("global.appMenu.main.orgAdmin") : (0, _utility.transformRole)(user.orgRole.title);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "app-menu-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "user-info"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "/home",
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement(_UserAvatar["default"], {
    user: user,
    size: 40,
    style: styles.avatarStyles
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: dir === "rtl" ? "user-detailsRTL" : "user-details"
  }, /*#__PURE__*/_react["default"].createElement("div", null, user.name), /*#__PURE__*/_react["default"].createElement("span", null, title)), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    id: "logout-button",
    style: styles.ButtonStyles,
    variant: "text",
    color: "primary",
    onClick: function onClick() {
      return dispatch(logOut());
    }
  }, (0, _i18n.getTranslation)("global.appMenu.main.logOut")), /*#__PURE__*/_react["default"].createElement(_material.Divider, null)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "app-list apps-menu"
  }, /*#__PURE__*/_react["default"].createElement("ul", null, (0, _map["default"])(_context8 = (0, _sort["default"])(filteredApps).call(filteredApps, function (a, b) {
    return a.name > b.name ? 1 : -1;
  })).call(_context8, function (app) {
    var appId = app.appId,
      link = app.link,
      name = app.name;
    var appIconSrc = "/_fileDownload?bucketName=app-icons&fileName=app.".concat(appId.replace(/-app/g, ""), ".png");
    return /*#__PURE__*/_react["default"].createElement("li", {
      key: appId
    }, /*#__PURE__*/_react["default"].createElement("a", {
      className: "app-link",
      target: appId === "support" ? "_blank" : "",
      href: link || "/".concat(appId, "/"),
      rel: "noreferrer"
    }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("span", {
      className: "app-icon",
      style: {
        backgroundImage: "url(".concat(appIconSrc, ")")
      }
    })), /*#__PURE__*/_react["default"].createElement("span", {
      className: "label"
    }, name)));
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: "44px",
      width: "100%",
      backgroundColor: "#41454a",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.EmailSendOutline, {
    style: {
      width: "24px",
      height: "48px",
      color: "rgba(255,255,255,0.5)"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    id: "send-support-email",
    color: "primary",
    variant: "text",
    sx: {
      textTransform: "none"
    },
    disableTouchRipple: true,
    onClick: openMailClient
  }, (0, _i18n.getTranslation)("global.appMenu.main.emailSupport"))));
};
var _default = AppMenu;
exports["default"] = _default;