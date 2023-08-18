"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
exports.getUnassignedMembers = exports.getUnAssignedMemberFeed = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _reselect = require("reselect");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _forOwn = _interopRequireDefault(require("lodash/forOwn"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _reactFastCompare["default"]);
var unAssignedMemberState = function unAssignedMemberState(state) {
  return state.globalData.unitMembers;
};
var unAssignedMemberSelector = function unAssignedMemberSelector(state) {
  var unitMembers = unAssignedMemberState(state);
  var result = {};
  (0, _forOwn["default"])(unitMembers, function (value) {
    var feedObj = (0, _defineProperty2["default"])({}, value.targetEntityId, value);
    result = _objectSpread(_objectSpread({}, result), feedObj);
  });
  return result;
};
var getUnAssignedMemberFeed = function getUnAssignedMemberFeed(state, feedSettings) {
  var feeds = {};
  if (feedSettings.length > 0) {
    (0, _forEach["default"])(feedSettings).call(feedSettings, function (feed) {
      var data = state.globalGeo[feed].data; // using global geo here because track feeds' global data is not streaming geometry
      feeds = _objectSpread(_objectSpread({}, feeds), data);
    });
  }
  return feeds;
};
exports.getUnAssignedMemberFeed = getUnAssignedMemberFeed;
var getUnassignedMembers = function getUnassignedMembers() {
  return createDeepEqualSelector(getUnAssignedMemberFeed, unAssignedMemberSelector, function (entities, members) {
    var result = [];
    (0, _forOwn["default"])(entities, function (feedValue, key) {
      if (members[key]) {
        if (members[key].targetEntityId === key) {
          var entityData = feedValue.entityData;
          if (members[key].unitId === null) {
            members[key].geometry = entityData.geometry;
            members[key].feedId = feedValue.feedId;
            members[key].disabled = false;
            members[key].isFeed = false;
            members[key].entityId = key;
            if (!("phone" in members[key])) {
              members[key].phone = null;
            }
            result.push(members[key]);
          }
          // Unassigned members with unitIds other than null are skipped.
        }
      } else {
        var _entityData = feedValue.entityData;
        var convertToMembers = {
          id: key,
          targetEntityId: key,
          entityId: key,
          isActive: false,
          disabled: true,
          memberType: "person",
          entityType: feedValue.entityType,
          name: _entityData ? _entityData.properties.name : null,
          unitId: null,
          geometry: _entityData.geometry,
          feedId: feedValue.feedId,
          isFeed: true
        };
        result.push(convertToMembers);
      }
    });
    return result;
  });
};
exports.getUnassignedMembers = getUnassignedMembers;