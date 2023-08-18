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
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _index = require("../index");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var actionCreators = _interopRequireWildcard(require("./appMenuActions"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _includes = _interopRequireDefault(require("lodash/includes"));
var _map = _interopRequireDefault(require("lodash/map"));
var _filter = _interopRequireDefault(require("lodash/filter"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var styles = {
  paper: {
    backgroundColor: "#1f1f21",
    color: "#fff",
    maxWidth: 340,
    display: "flex",
    flexDirection: "column"
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  user: _propTypes["default"].object.isRequired,
  logOut: _propTypes["default"].func.isRequired
};
var CBAppMenu = function CBAppMenu(_ref) {
  var classes = _ref.classes;
  var dispatch = (0, _reactRedux.useDispatch)();
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user;
  });
  var logOut = actionCreators.logOut;
  var checkAccess = function checkAccess(app) {
    return (0, _isString["default"])(app) ? !(0, _includes["default"])(window.location.href, app) : app.config.canView && !(0, _includes["default"])(window.location.href, app.name);
  };
  var profile = user.profile;
  var applications = profile.applications;
  var styles = {
    link: {
      textDecoration: "none"
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Paper, {
    className: classes.paper
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: {
      flexGrow: 1
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemAvatar, null, /*#__PURE__*/_react["default"].createElement(_index.Avatar, {
    image: profile.profileImage ? "/_download?handle=".concat(profile.profileImage) : null,
    name: profile.name
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: profile.name,
    secondary: profile.orgRole.title,
    primaryTypographyProps: {
      noWrap: true
    },
    secondaryTypographyProps: {
      noWrap: true
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: function onClick() {
      return dispatch(logOut());
    },
    color: "primary"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBAppMenu.logOut"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Divider, null), /*#__PURE__*/_react["default"].createElement(_material.ImageList, {
    sx: {
      height: 120
    }
  }, checkAccess("settings") && /*#__PURE__*/_react["default"].createElement(_material.ImageListItem, {
    className: classes.root,
    style: {
      width: "33%"
    }
  }, /*#__PURE__*/_react["default"].createElement("a", {
    style: styles.link,
    alt: (0, _i18n.getTranslation)("global.CBComponents.CBAppMenu.settings"),
    href: "/settings-app/my-profile"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    style: {
      height: 60
    },
    alt: (0, _i18n.getTranslation)("global.CBComponents.CBAppMenu.settings"),
    src: "../../static/app-icons/app.settings.png"
  }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    align: "center"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBAppMenu.settings"
  })))), (0, _map["default"])((0, _filter["default"])(applications, function (app) {
    return checkAccess(app);
  }), function (app) {
    var appIconSrc = "/_fileDownload?bucketName=app-icons&fileName=app.".concat(app.appId.replace(/-app/g, ""), ".png");
    return /*#__PURE__*/_react["default"].createElement(_material.ImageListItem, {
      key: app.appId,
      className: classes.root,
      style: {
        width: "33%"
      }
    }, /*#__PURE__*/_react["default"].createElement("a", {
      style: styles.link,
      alt: app.name,
      href: "/".concat(app.appId)
    }, /*#__PURE__*/_react["default"].createElement("img", {
      style: {
        height: 60
      },
      alt: app.name,
      src: appIconSrc
    }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      align: "center"
    }, app.name)));
  }), /*#__PURE__*/_react["default"].createElement(_material.ImageListItem, {
    className: classes.root,
    style: {
      width: "33%"
    }
  }, /*#__PURE__*/_react["default"].createElement("a", {
    style: styles.link,
    alt: (0, _i18n.getTranslation)("global.CBComponents.CBAppMenu.support"),
    target: "_blank",
    rel: "noopener noreferrer",
    href: "http://support.commandbridge.com/helpdesk/"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    style: {
      height: 60
    },
    alt: "Settings",
    src: "../../static/app-icons/app.support.png"
  }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    align: "center"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBAppMenu.support"
  })))))));
};
CBAppMenu.propTypes = propTypes;
var _default = (0, _styles.withStyles)(styles)(CBAppMenu);
exports["default"] = _default;