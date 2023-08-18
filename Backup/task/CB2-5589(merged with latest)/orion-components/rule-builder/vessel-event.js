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
var vesselEventBuilder = function vesselEventBuilder(rule, collections) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "rule-statement",
    className: "cb-font-b9"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.ruleBuilder.vesselEvent.alertMe",
    count: _getMain(rule, collections)
  }), _getTargets(rule, collections), (0, _conditionBuilder["default"])(rule, collections));
};
var _getMain = function _getMain(rule) {
  var main = "";
  switch (rule.trigger) {
    case "berth-assignment-created":
      main = (0, _i18n.getTranslation)("global.ruleBuilder.vesselEvent.newBerthCreated");
      break;
    case "berth-assignment-approval":
      main = (0, _i18n.getTranslation)("global.ruleBuilder.vesselEvent.berthApproved");
      break;
    case "berth-assignment-update":
      main = (0, _i18n.getTranslation)("global.ruleBuilder.vesselEvent.assignmentUpdated");
      break;
    case "arrival":
      main = (0, _i18n.getTranslation)("global.ruleBuilder.vesselEvent.arrival");
      break;
    case "departure":
      main = (0, _i18n.getTranslation)("global.ruleBuilder.vesselEvent.departure");
      break;
    case "berth-security-violation":
      main = (0, _i18n.getTranslation)("global.ruleBuilder.vesselEvent.securityViolation");
      break;
    default:
      break;
  }
  return main;
};
var _getTargets = function _getTargets(rule) {
  if (rule.targets.length === 0) {
    return "";
  } else {
    var _context;
    return (0, _map["default"])(_context = rule.targets).call(_context, function (berth, index) {
      return /*#__PURE__*/_react["default"].createElement("span", {
        key: berth.id,
        className: "rule-statement-container"
      }, index === 0 && /*#__PURE__*/_react["default"].createElement("span", null, rule.trigger === "berth-assignment-update" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.ruleBuilder.vesselEvent.for"
      }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.ruleBuilder.vesselEvent.at"
      })), index > 0 && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.ruleBuilder.vesselEvent.or"
      })), /*#__PURE__*/_react["default"].createElement("span", null, berth.name));
    });
  }
};
var _default = vesselEventBuilder;
exports["default"] = _default;