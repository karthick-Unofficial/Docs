"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _endsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _react = _interopRequireDefault(require("react"));
var _conditionBuilder = _interopRequireDefault(require("./condition-builder.js"));
var _i18n = require("orion-components/i18n");
var VOWELS = ["a", "e", "i", "o", "u", "y"];
var createEventBuilder = function createEventBuilder(rule, collections) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "rule-statement",
    className: "cb-font-b9"
  }, _getMain(rule), (0, _conditionBuilder["default"])(rule, collections));
};
var _getMain = function _getMain(rule) {
  var eventTypeString = "an event";
  var templateString = "";
  if (rule.eventType) {
    var _context;
    // -- add event type if present
    var eventSubtypeString = "";
    var selectedEventType = (0, _filter["default"])(_context = rule.eventTypes).call(_context, function (et) {
      return et.eventTypeId === rule.eventType;
    })[0];
    if (selectedEventType) {
      var _context3, _context4, _context5;
      if (rule.eventSubtype) {
        var _context2;
        // -- add event subtype if present
        var selectedEventSubtype = (0, _filter["default"])(_context2 = selectedEventType.subtypes).call(_context2, function (st) {
          return st.id === rule.eventSubtype;
        })[0];
        if (selectedEventSubtype) {
          eventSubtypeString = "".concat(selectedEventSubtype.name, " - ");
        }
      }
      eventTypeString = (0, _concat["default"])(_context3 = "".concat(eventSubtypeString)).call(_context3, selectedEventType.name);
      if (!(0, _endsWith["default"])(_context4 = eventTypeString.toLowerCase()).call(_context4, "event")) {
        eventTypeString += " event";
      }
      eventTypeString = (0, _concat["default"])(_context5 = "".concat((0, _includes["default"])(VOWELS).call(VOWELS, eventTypeString.toLowerCase().charAt(0)) ? "an" : "a", " ")).call(_context5, eventTypeString);
    }
  }
  if (rule.template) {
    var _context6;
    // -- add event template if present
    var selectedTemplate = (0, _filter["default"])(_context6 = rule.availableTemplates).call(_context6, function (template) {
      return template.id === rule.template;
    })[0];
    if (selectedTemplate) {
      templateString = (0, _i18n.getTranslation)("global.ruleBuilder.createEvent.templateString", selectedTemplate.name);
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.ruleBuilder.createEvent.alertMe",
    primaryValue: eventTypeString,
    secondaryValue: templateString
  });
};
var _default = createEventBuilder;
exports["default"] = _default;