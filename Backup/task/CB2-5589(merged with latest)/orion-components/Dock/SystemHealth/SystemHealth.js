"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _react = _interopRequireDefault(require("react"));
var _SystemHealthCard = _interopRequireDefault(require("./components/SystemHealthCard"));
var _ErrorCard = _interopRequireDefault(require("./components/ErrorCard"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var hasError = function hasError(errorFlag, health) {
  if (errorFlag) {
    return true;
  } else if (hasOwn(health, "success") && !health.success) {
    return true;
  } else {
    return false;
  }
};
var SystemHealth = function SystemHealth() {
  var _context;
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var systemHealth = (0, _reactRedux.useSelector)(function (state) {
    return state.systemHealth.health;
  });
  var error = (0, _reactRedux.useSelector)(function (state) {
    return hasError(state.systemHealth.hasApiError, state.systemHealth.health);
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      overflow: "scroll",
      height: "calc(100% - 80px)",
      width: "90%",
      margin: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    style: {
      fontFamily: "roboto",
      marginBottom: "15px",
      marginTop: "15px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.systemHealth.title"
  })), !error ? (0, _map["default"])(_context = (0, _keys["default"])(systemHealth)).call(_context, function (key) {
    var health = systemHealth[key];
    return /*#__PURE__*/_react["default"].createElement(_SystemHealthCard["default"], {
      key: key,
      title: health.label,
      hasError: health.error,
      healthSystems: health.systems,
      dir: dir,
      locale: locale
    });
  }) : /*#__PURE__*/_react["default"].createElement(_ErrorCard["default"], {
    dir: dir
  }));
};
var _default = SystemHealth;
exports["default"] = _default;