"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.unitMemberSelector = exports.unitMemberMemoized = exports.getUnits = exports.getAllUnits = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _reselect = require("reselect");
var _forOwn = _interopRequireDefault(require("lodash/forOwn"));
var _values = _interopRequireDefault(require("lodash/values"));
var _selectors = require("../UnitMembers/selectors");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _isEqual["default"]);
var getAllUnitMembers = function getAllUnitMembers(state) {
  return state.globalData.unitMembers;
};
var units = function units(state) {
  return state.globalData.units;
};
var getAllUnits = function getAllUnits(state) {
  var unitData = (0, _values["default"])(units(state));
  return unitData;
};
exports.getAllUnits = getAllUnits;
var getUnitsMemberByUnitId = function getUnitsMemberByUnitId(state, unitId, feedSettings) {
  var unitMembers = getAllUnitMembers(state);
  var unitMemberFeed = (0, _selectors.getUnAssignedMemberFeed)(state, feedSettings);
  var result = {};
  (0, _forOwn["default"])(unitMembers, function (value) {
    var targetEntityId = value.targetEntityId;
    if (value.unitId === unitId) {
      if (unitMemberFeed[targetEntityId]) {
        var _unitMemberFeed$targe = unitMemberFeed[targetEntityId],
          entityData = _unitMemberFeed$targe.entityData,
          feedId = _unitMemberFeed$targe.feedId;
        value.geometry = entityData.geometry;
        value.feedId = feedId;
        value.disabled = false;
        value.isFeed = false;
      }
      var feedObj = (0, _defineProperty2["default"])({}, targetEntityId, value);
      result = _objectSpread(_objectSpread({}, result), feedObj);
    }
  });
  return (0, _values["default"])(result);
};
var unitMemberSelector = (0, _reselect.createSelector)(function (state, unitId, feedSettings) {
  return getUnitsMemberByUnitId(state, unitId, feedSettings);
}, function (members) {
  return members;
});
exports.unitMemberSelector = unitMemberSelector;
var unitMemberMemoized = function unitMemberMemoized() {
  return createDeepEqualSelector(unitMemberSelector, function (result) {
    return result;
  });
};
exports.unitMemberMemoized = unitMemberMemoized;
var getUnits = function getUnits() {
  return createDeepEqualSelector(getAllUnits, function (units) {
    return units;
  });
};
exports.getUnits = getUnits;