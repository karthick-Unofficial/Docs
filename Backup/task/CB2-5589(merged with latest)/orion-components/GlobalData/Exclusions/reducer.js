"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialExclusionState = {};
var exclusions = function exclusions() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialExclusionState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "EXCLUSION_RECEIVED":
      {
        var exclusion = payload.exclusion;
        var userId = exclusion.userId;
        var newState = (0, _cloneDeep["default"])(state);
        if (!newState[userId]) {
          newState[userId] = [exclusion];
        } else {
          var _context;
          var newExclusions = (0, _filter["default"])(_context = newState[userId]).call(_context, function (exc) {
            return exc.entityId !== exclusion.entityId;
          });
          newExclusions.push(exclusion);
          newState[userId] = newExclusions;
        }
        return newState;
      }
    case "EXCLUSION_REMOVED":
      {
        var _exclusion = payload.exclusion;
        var _userId = _exclusion.userId;
        var hasMultiple = !!(state[_userId] && state[_userId].length > 1);
        var _newState = _objectSpread({}, state);
        if (!hasMultiple) {
          delete _newState[_userId];
        } else {
          var _context2;
          _newState[_userId] = (0, _filter["default"])(_context2 = _newState[_userId]).call(_context2, function (item) {
            return item.id !== _exclusion.id;
          });
        }
        return _newState;
      }
    default:
      return state;
  }
};
var _default = exclusions;
exports["default"] = _default;