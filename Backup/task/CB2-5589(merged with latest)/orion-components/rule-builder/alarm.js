"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _react = _interopRequireDefault(require("react"));
var _conditionBuilder = _interopRequireDefault(require("./condition-builder.js"));
var _i18n = require("orion-components/i18n");
var VOWELS = ["a", "e", "i", "o", "u"];
var alarmBuilder = function alarmBuilder(rule, collections) {
  // -- Alert me when {feed} fires a {subFilter ? subFilter : filter} alarm.
  if (rule.alarmFeeds && rule.alarmFeeds.length > 0) {
    var feed = _getFeed(rule);
    if (!feed || feed === "") {
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "rule-statement",
        className: "cb-font-b9"
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.ruleBuilder.alarm.alarmRule"
      }));
    } else {
      var filter = _getFilter(rule);
      var article = filter === "" || (0, _includes["default"])(VOWELS).call(VOWELS, filter.charAt(0)) ? "an" : "a";
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "rule-statement",
        className: "cb-font-b9"
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.ruleBuilder.alarm.alertMe",
        count: feed,
        primaryValue: article,
        secondaryValue: filter
      }), (0, _conditionBuilder["default"])(rule, collections));
    }
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", {
      id: "rule-statement",
      className: "cb-font-b9"
    }, _getDefault(rule));
  }
};
var _getDefault = function _getDefault(rule) {
  // -- use rule statement when alarmFeeds is not available (eg. when viewing the rule rather than creating/editing it)
  if (rule.statement && rule.statement.length > 0) return rule.statement;
  return "";
};
var _getFeed = function _getFeed(rule) {
  var _context;
  var selectedFeed = (0, _filter["default"])(_context = rule.alarmFeeds).call(_context, function (feed) {
    return feed.value === rule.feed;
  })[0];
  if (selectedFeed) {
    return selectedFeed.label;
  }
  return "";
};
var _getFilter = function _getFilter(rule) {
  var _context2;
  var selectedFeed = (0, _filter["default"])(_context2 = rule.alarmFeeds).call(_context2, function (feed) {
    return feed.value === rule.feed;
  })[0];
  if (selectedFeed) {
    var _context3, _context4;
    var selectedFilter = (0, _filter["default"])(_context3 = selectedFeed.filters).call(_context3, function (filter) {
      return filter.value === (0, _filter["default"])(rule);
    })[0];
    var selectedSubFilter = selectedFilter ? (0, _filter["default"])(_context4 = selectedFilter.subFilters).call(_context4, function (subFilter) {
      return subFilter.value === rule.subFilter;
    })[0] : null;
    return selectedSubFilter ? selectedSubFilter.label : selectedFilter ? selectedFilter.label : "";
  }
  return "";
};
var _default = alarmBuilder;
exports["default"] = _default;