"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.updateList = exports.streamLists = exports.getLookupValues = exports.getAllLists = exports.duplicateList = exports.deleteList = exports.createList = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var setLookupValues = function setLookupValues(lookupType, values) {
  return {
    type: t.LOOKUP_DATA_RECEIVED,
    payload: {
      lookupType: lookupType,
      values: values
    }
  };
};
/*
 * Add list data to state
 * @param lists: an associative array of lists
 */
var listsReceived = function listsReceived(lists) {
  return {
    type: t.LISTS_RECEIVED,
    payload: {
      lists: lists
    }
  };
};

// Get all Original Lists from DB
var getAllLists = function getAllLists() {
  return function (dispatch) {
    _clientAppCore.listService.getAll(function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      dispatch(listsReceived(response));
    });
  };
};

// Stream all original (Lists App) lists from DB
exports.getAllLists = getAllLists;
var streamLists = function streamLists() {
  return function (dispatch) {
    _clientAppCore.listService.streamOriginalLists(function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      dispatch(listReceived(response.new_val.id, response.new_val));
    });
  };
};

/*
 * Update list data in state
 * @param listId: id of list to be updated
 * @param list: updated list data
 */
exports.streamLists = streamLists;
var listReceived = function listReceived(listId, list) {
  return {
    type: t.LIST_RECEIVED,
    payload: {
      listId: listId,
      list: list
    }
  };
};

/*
 * Create a new list
 * @param list: list data
 */
var createList = function createList(list) {
  return function () {
    _clientAppCore.listService.createList(list, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
    });
  };
};

/*
 * Remove list data from state
 * @param listId: id of list to be removed
 */
exports.createList = createList;
var updateList = function updateList(listId, list) {
  return function () {
    _clientAppCore.listService.updateList(listId, list, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
    });
  };
};

/* Remove list from DB
 * @param listId: id of list to be removed
 */
exports.updateList = updateList;
var deleteList = function deleteList(listId) {
  return function () {
    _clientAppCore.listService.deleteList(listId, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
    });
  };
};

/* Duplicate
 * @param listId: id of list to be shared
 * @param list: new list data ({name, type})
 */
exports.deleteList = deleteList;
var duplicateList = function duplicateList(listId, list) {
  return function () {
    _clientAppCore.listService.cloneList(listId, list, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
    });
  };
};
exports.duplicateList = duplicateList;
var getLookupValues = function getLookupValues(lookupType) {
  return function (dispatch) {
    _clientAppCore.userService.getAllOrgUsers(function (err, result) {
      if (err) console.log(err);else {
        dispatch(setLookupValues(lookupType, result));
      }
    });
  };
};
exports.getLookupValues = getLookupValues;