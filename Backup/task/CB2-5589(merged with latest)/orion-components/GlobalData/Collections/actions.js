"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeCollections = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Add or update a collection in state
 * @param collection: a collection object
 */
var collectionReceived = function collectionReceived(collection) {
  return {
    type: t.COLLECTION_RECEIVED,
    payload: {
      collection: collection
    }
  };
};

/*
 * Remove a collection in state
 * @param collection: ID of a collection to be removed
 */
var collectionRemoved = function collectionRemoved(collectionId) {
  return {
    type: t.COLLECTION_REMOVED,
    payload: {
      collectionId: collectionId
    }
  };
};

/*
 * Subscribe to collections feed
 */
var subscribeCollections = function subscribeCollections() {
  return function (dispatch) {
    _clientAppCore.entityCollection.subscribeAll(function (err, response) {
      if (err) console.log(err);else {
        if (!response) return;
        switch (response.type) {
          case "initial":
            dispatch(collectionReceived(response.new_val));
            break;
          case "add":
            dispatch(collectionReceived(response.new_val));
            break;
          case "remove":
            dispatch(collectionRemoved(response.old_val.id));
            break;
          case "change":
            dispatch(collectionReceived(response.new_val));
            break;
          default:
        }
      }
    });
  };
};
exports.subscribeCollections = subscribeCollections;