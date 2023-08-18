"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSearchValue = exports.updateSearchResults = exports.updateEventTemplateSearch = exports.updateEventSearch = exports.removeFromMapFilters = exports.clearSearchResults = exports.clearMapFilters = exports.addToMapFilters = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Update the search value in state
 * @param query: user input string
 */
var updateSearchValue = function updateSearchValue(query) {
  return {
    meta: {
      debounce: "search"
    },
    type: t.UPDATE_SEARCH_VALUE,
    payload: {
      query: query
    }
  };
};

/*
 * Update the search results in state
 * @param results: an array of result objects
 */
exports.updateSearchValue = updateSearchValue;
var updateSearchResults = function updateSearchResults(results) {
  return {
    type: t.SHOW_SEARCH_RESULTS,
    payload: {
      results: results
    }
  };
};

/*
 * Clear the search results from state
 */
exports.updateSearchResults = updateSearchResults;
var clearSearchResults = function clearSearchResults() {
  return {
    type: t.SHOW_SEARCH_RESULTS
  };
};

/*
 * Add a collection's members to filter entities on map by
 * @param collectionId: collection's ID
 * @param members: array of collection's member entity IDs
 */
exports.clearSearchResults = clearSearchResults;
var addToMapFilters = function addToMapFilters(collectionId, members) {
  return {
    type: t.ADD_TO_MAP_FILTERS,
    payload: {
      collectionId: collectionId,
      members: members
    }
  };
};

/*
 * Remove a collection's entities from filters
 * @param collectionId: collection's ID
 */
exports.addToMapFilters = addToMapFilters;
var removeFromMapFilters = function removeFromMapFilters(collectionId) {
  return {
    type: t.REMOVE_FROM_MAP_FILTERS,
    payload: {
      collectionId: collectionId
    }
  };
};

/*
 * Clear all collections from filters
 */
exports.removeFromMapFilters = removeFromMapFilters;
var clearMapFilters = function clearMapFilters() {
  return {
    type: t.CLEAR_MAP_FILTERS
  };
};

/*
 * Update the event search value in state
 * @param query: user input string
 */
exports.clearMapFilters = clearMapFilters;
var updateEventSearch = function updateEventSearch(query) {
  return {
    meta: {
      debounce: "search"
    },
    type: t.UPDATE_EVENT_SEARCH,
    payload: {
      query: query
    }
  };
};

/*
 * Update the event template search value in state
 * @param query: user input string
 */
exports.updateEventSearch = updateEventSearch;
var updateEventTemplateSearch = function updateEventTemplateSearch(query) {
  return {
    meta: {
      debounce: "search"
    },
    type: t.UPDATE_EVENT_TEMPLATE_SEARCH,
    payload: {
      query: query
    }
  };
};
exports.updateEventTemplateSearch = updateEventTemplateSearch;