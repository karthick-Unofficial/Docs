"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = {
  blue: null,
  green: null,
  yellow: null
};
var spotlights = function spotlights() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var payload = action.payload,
    type = action.type;
  switch (type) {
    case "SPOTLIGHT_SET":
      {
        var _context;
        var spotlight = payload.spotlight;
        var newState;
        (0, _forEach["default"])(_context = (0, _keys["default"])(state)).call(_context, function (key) {
          if (newState) {
            return;
          }
          if (state[key] && state[key].id === spotlight.id) {
            newState = _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, key, spotlight));
          }
          if (!state[key]) {
            var strokeColor = key === "blue" ? "#0084BA" : key === "green" ? "#3AB55A" : "#EEA648";
            newState = _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, key, _objectSpread(_objectSpread({}, spotlight), {}, {
              properties: {
                strokeColor: strokeColor,
                key: key
              }
            })));
          }
        });
        return newState || state;
      }
    case "SPOTLIGHT_RESTART":
      {
        var _spotlight = payload.spotlight;
        return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, _spotlight.properties.key, _spotlight));
      }
    case "SPOTLIGHT_REMOVE":
      {
        var _context2;
        var id = payload.id;
        var newSpotlights = _objectSpread({}, state);
        var target = (0, _find["default"])(_context2 = (0, _values["default"])(state)).call(_context2, function (s) {
          return s && s.id === id;
        });
        if (target) {
          newSpotlights[target.properties.key] = null;
        }
        return newSpotlights;
      }
    default:
      return state;
  }
};
var _default = spotlights;
exports["default"] = _default;