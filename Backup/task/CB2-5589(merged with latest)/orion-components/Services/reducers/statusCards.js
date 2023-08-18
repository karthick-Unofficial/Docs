"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _arrayMove = _interopRequireDefault(require("array-move"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var initialState = {
  initialReceived: false,
  orgsById: {},
  cards: [],
  searchValue: "",
  orgFilters: []
};
var statusCards = function statusCards() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var payload = action.payload,
    type = action.type;
  switch (type) {
    // Initial batch
    case "INITIAL_STATUS_CARDS_RECEIVED":
      {
        var orgsById = {};
        (0, _forEach["default"])(payload).call(payload, function (card) {
          orgsById[card.ownerOrg] = card.ownerOrgName;
        });
        return _objectSpread(_objectSpread({}, state), {}, {
          initialReceived: true,
          orgsById: orgsById,
          cards: payload
        });
      }
    // Add or Change
    case "STATUS_CARD_UPDATE_RECEIVED":
      {
        var newState = (0, _toConsumableArray2["default"])(state.cards);
        var newOrgState = _objectSpread({}, state.orgsById);
        var index = (0, _findIndex["default"])(newState).call(newState, function (item) {
          return item.id === payload.id;
        });
        if (index > -1) {
          newState[index] = payload;
        } else {
          newState.push(payload);
        }
        newOrgState[payload.ownerOrg] = payload.ownerOrgName;
        return _objectSpread(_objectSpread({}, state), {}, {
          cards: newState,
          orgsById: newOrgState
        });
      }
    // Sort
    case "STATUS_CARDS_SORTED":
      {
        var _newState = (0, _toConsumableArray2["default"])(state.cards);
        return _objectSpread(_objectSpread({}, state), {}, {
          cards: (0, _arrayMove["default"])(_newState, payload.oldIndex, payload.newIndex)
        });
      }
    // Remove
    case "STATUS_CARD_REMOVED":
      {
        var _newState2 = (0, _toConsumableArray2["default"])(state.cards);
        var removedState = (0, _filter["default"])(_newState2).call(_newState2, function (item) {
          return item.id !== payload;
        });
        var _orgsById = {};
        (0, _forEach["default"])(removedState).call(removedState, function (card) {
          _orgsById[card.ownerOrg] = card.ownerOrgName;
        });
        return _objectSpread(_objectSpread({}, state), {}, {
          cards: (0, _filter["default"])(_newState2).call(_newState2, function (item) {
            return item.id !== payload;
          }),
          orgsById: _orgsById
        });
      }
    case "SEARCH_UPDATED":
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          searchValue: payload
        });
      }
    case "ORG_FILTERS_CHANGED":
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          orgFilters: payload
        });
      }
    default:
      return state;
  }
};
var _default = statusCards;
exports["default"] = _default;