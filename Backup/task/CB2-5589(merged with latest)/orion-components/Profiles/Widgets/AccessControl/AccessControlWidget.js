"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _i18n = require("orion-components/i18n");
var _material = require("@mui/material");
var _shared = require("../shared");
var _clientAppCore = require("client-app-core");
var propTypes = {
  accessPoint: _propTypes["default"].object.isRequired,
  enabled: _propTypes["default"].bool,
  order: _propTypes["default"].number,
  dir: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool
};
var AccessControlWidget = function AccessControlWidget(_ref) {
  var _context;
  var accessPoint = _ref.accessPoint,
    enabled = _ref.enabled,
    order = _ref.order,
    dir = _ref.dir,
    readOnly = _ref.readOnly;
  var status = accessPoint.entityData.properties.status;
  var controlClicked = function controlClicked(feature) {
    _clientAppCore.restClient.exec_post(feature.command, null, function (err, result) {
      if (err) {
        console.log("There was an error executing command (".concat(feature.command, ")"), err, result);
      } else {
        console.log("Command (".concat(feature.command, ") executed successfully."));
      }
    });
  };
  var styles = {
    status: {
      color: "#FFFFFF",
      fontSize: 14,
      opacity: 0.5,
      margin: "8px 8px 0"
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_shared.BaseWidget, {
    enabled: enabled,
    order: order,
    title: (0, _i18n.getTranslation)("global.profiles.accessPointProfile.accessControlWidget.title"),
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: styles.status
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.accessPointProfile.accessControlWidget.statusHeader",
    count: status
  })), !readOnly && (0, _map["default"])(_context = accessPoint.entityData.properties.features).call(_context, function (feature) {
    return /*#__PURE__*/_react["default"].createElement(_material.Button, {
      key: "".concat(feature.control, "_control-button"),
      variant: "contained",
      onClick: function onClick() {
        controlClicked(feature);
      },
      color: "primary",
      style: {
        width: "calc(100% - 16px)",
        margin: "8px 8px 0 8px",
        color: "#fff",
        padding: "10px"
      }
    }, feature.label);
  }));
};
AccessControlWidget.propTypes = propTypes;
var _default = AccessControlWidget;
exports["default"] = _default;