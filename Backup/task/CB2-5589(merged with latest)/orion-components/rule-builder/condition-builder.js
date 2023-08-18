"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _clientAppCore = require("client-app-core");
var _find = _interopRequireDefault(require("lodash/find"));
var _i18n = require("orion-components/i18n");
var getConditions = function getConditions(rule, collections) {
  if (rule.conditions.length === 0) {
    return "";
  } else {
    var _context;
    var andString = "";
    var timeFormatPreference = rule.timeFormatPreference ? rule.timeFormatPreference : "12-hour";

    // Render conditions portion of rule statement
    var conditions = (0, _map["default"])(_context = rule.conditions).call(_context, function (cond) {
      switch (cond.type) {
        case "time":
          {
            var startTime = _momentTimezone["default"].utc(cond.startTime, "h:mm A");
            var endTime = _momentTimezone["default"].utc(cond.endTime, "h:mm A");
            var timeFormat = timeFormatPreference === "24-hour" ? "H:mm z" : "h:mm A z";
            var startTimeTZ = _clientAppCore.timeConversion.convertToUserTime(startTime, timeFormat);
            var endTimeTZ = _clientAppCore.timeConversion.convertToUserTime(endTime, timeFormat);
            var finalString = "";
            if (cond.anyTimeOfDay) {
              finalString += "";
            } else {
              finalString += (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.betweenValues", "", startTimeTZ, endTimeTZ);
            }
            if (cond.weekdays.length === 7) {
              finalString += "";
            } else {
              var _context2;
              if (finalString.length === 0) {
                finalString += (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.itIs");
              }
              var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              finalString += (0, _map["default"])(_context2 = cond.weekdays).call(_context2, function (index, i) {
                return (i === cond.weekdays.length && i > 1 ? (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.or") : " ") + (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.".concat(days[index]));
              }).join(",");
            }
            if (cond.indefinite) {
              finalString += "";
            } else {
              var startDate = _clientAppCore.timeConversion.convertToUserTime(cond.startDate, "ll");
              var endDate = _clientAppCore.timeConversion.convertToUserTime(cond.endDate, "ll");
              if (cond.weekdays.length && cond.weekdays.length !== 7) {
                finalString += (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.and");
              }
              finalString += startDate === endDate ? (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.dateIs", startDate) : (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.duringPeriod", "", startDate, endDate);
            }
            finalString += "";
            andString = (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.and");
            return finalString;
          }
        case "speed":
          {
            var _conditions = [];
            if (cond.minSpeed) {
              var minSpeed = (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.travelingSlower", "", cond.minSpeed, cond.unit);
              _conditions.push(minSpeed);
            }
            if (cond.maxSpeed) {
              var maxSpeed = (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.travelingFaster", "", cond.maxSpeed, cond.unit);
              _conditions.push(maxSpeed);
            }
            andString = (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.and");
            return _conditions.join((0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.or"));
          }
        case "in-collection":
          {
            var collection = (0, _find["default"])(collections, function (col) {
              return col.id === cond.id;
            });
            if (!collection) {
              return "";
            }
            var collectionName = collection.name;
            andString = (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.and");
            return (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.inCollection", collectionName);
          }
        case "not-in-collection":
          {
            var _collection = (0, _find["default"])(collections, function (col) {
              return col.id === cond.id;
            });
            if (!_collection) {
              return "";
            }
            var _collectionName = _collection.name;
            andString = (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.and");
            return (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.notInCollection", _collectionName);
          }
        case "duration":
          {
            var duration = cond.duration;
            return duration === 1 ? (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.longerThanMin", duration) : (0, _i18n.getTranslation)("global.ruleBuilder.conditionBuilder.longerThanMins", duration);
          }
        default:
          break;
      }
    });
    return (0, _map["default"])(conditions).call(conditions, function (condition) {
      if (!condition) {
        return null;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        key: condition,
        className: "rule-statement-container"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "and-string"
      }, andString), /*#__PURE__*/_react["default"].createElement("span", null, condition));
    });
  }
};
var _default = getConditions;
exports["default"] = _default;