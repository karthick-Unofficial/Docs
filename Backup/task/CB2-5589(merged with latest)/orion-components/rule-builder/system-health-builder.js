"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _conditionBuilder = _interopRequireDefault(require("./condition-builder.js"));
var _i18n = require("orion-components/i18n");
var systemHealthBuilder = function systemHealthBuilder(rule, collections, targetAction, hasLinks) {
  // No linking/targeting
  if (!hasLinks) {
    targetAction = function targetAction() {};
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "rule-statement",
    className: "cb-font-b9"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.ruleBuilder.systemHealthBuilder.alertMe"
  }), _getTargets(rule, collections, targetAction, hasLinks), (0, _conditionBuilder["default"])(rule, collections, targetAction, hasLinks));
};
var _getTargets = function _getTargets(rule, collections, targetAction, hasLinks) {
  if (rule.targets.length === 0) {
    return /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.ruleBuilder.systemHealthBuilder.anySystem"
    });
  } else {
    var _context;
    // Render the trigger portion of the rule statement

    return (0, _map["default"])(_context = rule.targets).call(_context, function (system, index) {
      return /*#__PURE__*/_react["default"].createElement("span", {
        key: system.id,
        className: "rule-statement-container"
      }, index > 0 && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.ruleBuilder.systemHealthBuilder.or"
      })), /*#__PURE__*/_react["default"].createElement("span", {
        className: "".concat(hasLinks ? "cb-font-link" : ""),
        onClick: function onClick() {
          return targetAction(system);
        }
      }, system.name));
    });
  }
};
var _default = systemHealthBuilder;
exports["default"] = _default;