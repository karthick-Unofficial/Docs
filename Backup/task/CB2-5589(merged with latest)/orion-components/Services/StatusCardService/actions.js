"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.streamStatusCards = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _clientAppCore = require("client-app-core");
var t = _interopRequireWildcard(require("./actionTypes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var initialCardsReceived = function initialCardsReceived(cards) {
  return {
    type: t.INITIAL_STATUS_CARDS_RECEIVED,
    payload: cards
  };
};

// Initial, add, change
var cardUpdateReceived = function cardUpdateReceived(card) {
  return {
    type: t.STATUS_CARD_UPDATE_RECEIVED,
    payload: card
  };
};

// Remove
var cardRemoved = function cardRemoved(cardId) {
  return {
    type: t.STATUS_CARD_REMOVED,
    payload: cardId
  };
};

/**
 * Stream a user's status cards
 */
var streamStatusCards = function streamStatusCards(globalOnly) {
  return function (dispatch) {
    _clientAppCore.statusBoardService.streamStatusCards(globalOnly, function (err, res) {
      if (err) {
        console.log("Error streaming status cards", err);
      } else {
        if (res.batch && res.batch === "initial") {
          var changes = res.changes;
          var initialValues = (0, _map["default"])(changes).call(changes, function (change) {
            return change.new_val;
          });
          dispatch(initialCardsReceived(initialValues));
        } else {
          var _context;
          var type = res.type,
            new_val = res.new_val,
            old_val = res.old_val;
          if ((0, _includes["default"])(_context = ["initial", "add", "change"]).call(_context, type)) {
            dispatch(cardUpdateReceived(new_val));
          } else if (type === "remove") {
            dispatch(cardRemoved(old_val.id));
          }
        }
      }
    });
  };
};
exports.streamStatusCards = streamStatusCards;