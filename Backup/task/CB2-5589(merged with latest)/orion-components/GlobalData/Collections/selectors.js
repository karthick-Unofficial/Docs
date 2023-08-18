"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.makeGetCollectionMembers = exports.makeGetCollection = exports.collectionsSelector = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _reselect = require("reselect");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _values = _interopRequireDefault(require("lodash/values"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
var createDeepEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _reactFastCompare["default"]);
var collectionState = function collectionState(state) {
  return state.globalData.collections;
};
var collectionsSelector = (0, _reselect.createSelector)(collectionState, function (collections) {
  return (0, _values["default"])(collections);
});
exports.collectionsSelector = collectionsSelector;
var getCollectionById = function getCollectionById(state, props) {
  var collection = state.globalData.collections[props.id];
  return collection;
};
var makeGetCollection = function makeGetCollection() {
  return (0, _reselect.createSelector)(getCollectionById, function (collection) {
    return collection;
  });
};
exports.makeGetCollection = makeGetCollection;
var getCollectionMembers = function getCollectionMembers(state, props) {
  return props.collection.members;
};
var makeGetCollectionMembers = function makeGetCollectionMembers() {
  return createDeepEqualSelector(getCollectionMembers, _Selectors.feedEntitiesSelector, function (members, entities) {
    var fullItems = (0, _pickBy["default"])(entities, function (entity) {
      return (0, _includes["default"])(members).call(members, entity.id);
    });
    return fullItems;
  });
};
exports.makeGetCollectionMembers = makeGetCollectionMembers;