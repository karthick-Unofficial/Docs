"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _reactRouterDom = require("react-router-dom");
var _index = require("orion-components/i18n/Actions/index.js");
var _Dock = require("orion-components/Dock");
var _AppMenu = require("orion-components/AppMenu");
var _selector = require("orion-components/i18n/Config/selector");
var _material = require("@mui/material");
var _AppMenu2 = require("../AppMenu");
var _iconsMaterial = require("@mui/icons-material");
var _propTypes = _interopRequireDefault(require("prop-types"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  titleText: _propTypes["default"].string,
  appId: _propTypes["default"].string,
  handleGoHome: _propTypes["default"].func,
  isMenu: _propTypes["default"].bool,
  toggleOptionsDrawer: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object,
  selectFloorPlanOn: _propTypes["default"].func,
  map: _propTypes["default"].object
};
var defaultProps = {
  appId: "",
  handleGoHome: function handleGoHome() {},
  isMenu: false,
  toggleOptionsDrawer: function toggleOptionsDrawer() {},
  map: {},
  floorPlansWithFacilityFeed: {},
  selectFloorPlanOn: function selectFloorPlanOn() {}
};
var AppBar = function AppBar(_ref) {
  var titleText = _ref.titleText,
    handleGoHome = _ref.handleGoHome,
    appId = _ref.appId,
    isMenu = _ref.isMenu,
    toggleOptionsDrawer = _ref.toggleOptionsDrawer,
    floorPlansWithFacilityFeed = _ref.floorPlansWithFacilityFeed,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    map = (0, _map["default"])(_ref);
  var location = (0, _reactRouterDom.useLocation)();
  var title;
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var application = (0, _reactRedux.useSelector)(function (state) {
    return state.application;
  });
  if (titleText) {
    title = titleText;
  } else if (location.state && location.state.name) {
    title = location.state.name;
  } else if (application && application.name) {
    title = application.name;
  }
  var styles = {
    appBar: _objectSpread(_objectSpread({
      height: 48,
      lineHeight: "48px",
      backgroundColor: "#41454a",
      position: "relative",
      zIndex: 600
    }, dir === "ltr" && {
      paddingRight: 6
    }), dir === "rtl" && {
      paddingLeft: 6
    }),
    appBarTitle: _objectSpread(_objectSpread({
      display: "flex"
    }, dir === "ltr" && {
      marginLeft: "2%"
    }), dir === "rtl" && {
      marginRight: "2%"
    }),
    appBarTitleText: {
      paddingLeft: "10px",
      lineHeight: "48px",
      fontFamily: "Roboto",
      fontSize: "20px"
    },
    appBarMenuIcon: _objectSpread(_objectSpread({}, dir === "ltr" && {
      margin: "0px 12px 0px 0px"
    }), dir === "rtl" && {
      margin: "0px 0px 0px 12px"
    }),
    appBarDockWrapper: _objectSpread(_objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: "auto"
    }), dir === "rtl" && {
      marginRight: "auto"
    }), {}, {
      display: "flex"
    }),
    iconButton: _objectSpread(_objectSpread({
      height: 48
    }, dir === "rtl" && {
      marginLeft: 8,
      marginRight: -16
    }), dir === "ltr" && {
      marginRight: 8,
      marginLeft: -16
    })
  };
  var renderTitle = function renderTitle() {
    switch (appId) {
      case "reports-app":
        return /*#__PURE__*/_react["default"].createElement("div", {
          style: styles.appBarTitle
        }, title !== "Reports" ? /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
          onClick: handleGoHome
        }, dir === "rtl" ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowForward, {
          style: {
            color: "#ffffff"
          }
        }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ArrowBack, {
          style: {
            color: "#ffffff"
          }
        })) : /*#__PURE__*/_react["default"].createElement(_material.IconButton, null), (0, _index.getTranslation)(title));
      default:
        return /*#__PURE__*/_react["default"].createElement("div", {
          style: styles.appBarTitle
        }, isMenu ? drawerMenu() : null, /*#__PURE__*/_react["default"].createElement("div", {
          style: styles.appBarTitleText
        }, title));
    }
  };
  var drawerMenu = function drawerMenu() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: styles.iconButton
    }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      onClick: toggleOptionsDrawer,
      style: {
        color: "#FFF",
        width: 48
      }
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Menu, null)));
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.AppBar, {
    style: styles.appBar
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex"
    }
  }, renderTitle(), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.appBarDockWrapper
  }, /*#__PURE__*/_react["default"].createElement(_Dock.Dock, {
    map: map,
    selectFloorPlanOn: selectFloorPlanOn,
    floorPlansWithFacilityFeed: floorPlansWithFacilityFeed,
    shouldStreamCameras: true,
    shouldStreamNotifications: true
  }), /*#__PURE__*/_react["default"].createElement(_AppMenu.AppMenu, {
    user: user.profile,
    isHydrated: user.isHydrated,
    logOut: _AppMenu2.logOut
  })))));
};
AppBar.propTypes = propTypes;
AppBar.defaultProps = defaultProps;
var _default = AppBar;
exports["default"] = _default;