"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.addToCollection = addToCollection;
exports.removeFromCollection = removeFromCollection;
var _clientAppCore = require("client-app-core");
var _index = require("orion-components/Dock/Actions/index.js");
// Only used to undo the below removeFromCollection action
function addToCollection(collectionName, collectionId, members, entityName, undoing) {
  return function (dispatch) {
    _clientAppCore.entityCollection.addMembers(collectionId, members, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        if (!undoing) {
          var undo = true;
          var undoFunc = function undoFunc() {
            dispatch(removeFromCollection(collectionName, collectionId, members, undo));
          };
          dispatch((0, _index.createUserFeedback)(entityName + " added to " + collectionName + ".", undoFunc));
        }
      }
    });
  };
}
function removeFromCollection(collectionName, collectionId, members, undoing) {
  return function (dispatch) {
    _clientAppCore.entityCollection.removeMembers(collectionId, members, function (err, response) {
      if (err) {
        console.log(err, response);
      } else {
        if (!undoing) {
          var undo = true;
          var undoFunc = function undoFunc() {
            // entityName = null as number of items vary on removal
            dispatch(addToCollection(collectionName, collectionId, members, null, undo));
          };
          var messageBody = members.length > 1 ? " items removed from " : " item removed from ";
          dispatch((0, _index.createUserFeedback)(members.length + messageBody + collectionName + ".", undoFunc));
        }
      }
    });
  };
}