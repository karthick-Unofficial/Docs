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
exports.initialState = exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = {
  searchValue: "",
  searchResult: [],
  mapFilters: {},
  eventSearch: "",
  eventTemplateSearch: ""
};
exports.initialState = initialState;
var listPanel = function listPanel() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case "UPDATE_SEARCH_VALUE":
      {
        var query = payload.query;
        return _objectSpread(_objectSpread({}, state), {}, {
          searchValue: query
        });
      }
    case "UPDATE_SEARCH_RESULTS":
      {
        var results = payload.results;
        return _objectSpread(_objectSpread({}, state), {}, {
          searchResults: results
        });
      }
    case "CLEAR_SEARCH_RESULTS":
      return _objectSpread(_objectSpread({}, state), {}, {
        searchResults: []
      });
    case "ADD_TO_MAP_FILTERS":
      {
        var collectionId = payload.collectionId,
          members = payload.members;
        return _objectSpread(_objectSpread({}, state), {}, {
          mapFilters: _objectSpread(_objectSpread({}, state.mapFilters), {}, (0, _defineProperty2["default"])({}, collectionId, members))
        });
      }
    case "REMOVE_FROM_MAP_FILTERS":
      {
        var _collectionId = payload.collectionId;
        var newMapFilters = _objectSpread({}, state.mapFilters);
        delete newMapFilters[_collectionId];
        return _objectSpread(_objectSpread({}, state), {}, {
          mapFilters: newMapFilters
        });
      }
    case "CLEAR_MAP_FILTERS":
      return _objectSpread(_objectSpread({}, state), {}, {
        mapFilters: {}
      });
    case "UPDATE_EVENT_SEARCH":
      {
        var _query = payload.query;
        return _objectSpread(_objectSpread({}, state), {}, {
          eventSearch: _query
        });
      }
    case "UPDATE_EVENT_TEMPLATE_SEARCH":
      {
        var _query2 = payload.query;
        return _objectSpread(_objectSpread({}, state), {}, {
          eventTemplateSearch: _query2
        });
      }
    default:
      return state;
  }
};
var _default = listPanel;
exports["default"] = _default;