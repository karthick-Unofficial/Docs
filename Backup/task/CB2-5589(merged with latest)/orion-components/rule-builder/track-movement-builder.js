"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _conditionBuilder = _interopRequireDefault(require("./condition-builder.js"));
var _i18n = require("orion-components/i18n");
var trackMovementBuilder = function trackMovementBuilder(rule, collections, targetAction, hasLinks) {
  // No linking/targeting
  if (!hasLinks) {
    targetAction = function targetAction() {};
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "rule-statement",
    className: "cb-font-b9"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.ruleBuilder.trackMovementBuilder.alertMe"
  }), _getSubjects(rule, collections, targetAction, hasLinks), /*#__PURE__*/_react["default"].createElement("span", null, " " + rule.trigger, rule.trigger === "cross" ? "es " : "s "), _getTargets(rule, collections, targetAction, hasLinks), (0, _conditionBuilder["default"])(rule, collections, targetAction, hasLinks));
};
var _getSubjects = function _getSubjects(rule, collections, targetAction, hasLinks) {
  if (rule.subject.length === 0) {
    return /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.ruleBuilder.trackMovementBuilder.anyTrack"
    });
  } else {
    // Render the subject portion of the rule statement
    if (rule.subject[0].entityType === "feed") {
      var _context;
      // -- any tracks within 1 or more feeds
      var subjectStrings = ["any track in "];
      (0, _forEach["default"])(_context = rule.subject).call(_context, function (feed, index) {
        subjectStrings.push( /*#__PURE__*/_react["default"].createElement("span", {
          key: index
        }, index > 0 && /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
          value: "global.ruleBuilder.trackMovementBuilder.or"
        }), feed.name));
      });
      return subjectStrings;
    } else {
      var _context2;
      // -- specific tracks
      return (0, _map["default"])(_context2 = rule.subject).call(_context2, function (track, index) {
        return /*#__PURE__*/_react["default"].createElement("span", {
          key: track.id,
          className: "rule-statement-container"
        }, index > 0 && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
          value: "global.ruleBuilder.trackMovementBuilder.or"
        })), /*#__PURE__*/_react["default"].createElement("span", {
          className: "".concat(hasLinks ? "cb-font-link" : ""),
          onClick: function onClick() {
            targetAction(track.id, track.name || track.id, "track", "profile", "secondary");
          }
        }, track.name));
      });
    }
  }
};
var _getTargets = function _getTargets(rule, collections, targetAction, hasLinks) {
  if (rule.targets.length === 0) {
    return rule.trigger == "cross" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.ruleBuilder.trackMovementBuilder.anyLine"
    }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.ruleBuilder.trackMovementBuilder.anyPolygon"
    });
  } else {
    var _context3;
    // Render the trigger portion of the rule statement

    return (0, _map["default"])(_context3 = rule.targets).call(_context3, function (poly, index) {
      return /*#__PURE__*/_react["default"].createElement("span", {
        key: poly.id,
        className: "rule-statement-container"
      }, index > 0 && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.ruleBuilder.trackMovementBuilder.or"
      })), /*#__PURE__*/_react["default"].createElement("span", {
        className: "".concat(hasLinks ? "cb-font-link" : ""),
        onClick: function onClick() {
          return targetAction(poly.id, poly.entityData.properties.name, poly.entityType, "profile", "secondary");
        }
      }, poly.entityData.properties.name));
    });
  }
};
var _default = trackMovementBuilder;
exports["default"] = _default;