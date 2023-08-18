"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _i18n = require("orion-components/i18n");
// See below export for example of use

/**
 * Transform an array of entities into a format that can be accepted by CBList
 * @param {array} entities -- Array of entity objects
 * @param {boolean} initials -- Show user avatars as initials instead of user avatar, default false
 * @param {function} method -- Method to be called with entity's ID as first argument on click, defaults to none
 * @param {string} firstArgProperty -- The TOP LEVEL property you would like bound to the first argument of the onClick function you pass
 */

var transformEntities = function transformEntities(entities) {
  var initials = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var firstArgProperty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var data = (0, _map["default"])(entities).call(entities, function (ent) {
    var avatar = "";
    var name = "";
    var id = "";
    var action = null;

    // SHAPES
    if (ent.entityType === "shape" || ent.entityType === "shapes") {
      var properties = ent.entityData.properties;
      var shapeType = properties.type;

      // set avatar
      if (shapeType === "Polygon") {
        avatar = "polygon";
      } else if (shapeType === "Point") {
        avatar = "point";
      } else if (shapeType === "Line") {
        avatar = "line";
      }

      // Set name and id
      name = properties.name;
      id = ent.id;
      if (method && firstArgProperty) {
        var curriedMethod = function curriedMethod() {
          method(ent[firstArgProperty]);
        };
        action = curriedMethod;
      }
    }

    // EVENTS
    if (ent.entityType === "event") {
      avatar = "event";
      name = ent.name;
      id = ent.id;
      if (method && firstArgProperty) {
        var _curriedMethod = function _curriedMethod() {
          method(ent[firstArgProperty]);
        };
        action = _curriedMethod;
      }
    }

    // USERS
    // TODO: Find a better property to check for users
    if (!ent.entityType && ent.username) {
      if (!initials) {
        avatar = "user";
      } else {
        var getInitials = ent.name.match(/\b(\w)/g);
        var _initials = (0, _slice["default"])(getInitials).call(getInitials, 0, 2).join("");
        avatar = _initials;
      }
      name = ent.name;
      id = ent.id;

      // Set action
      if (method && firstArgProperty) {
        var _curriedMethod2 = function _curriedMethod2() {
          method(ent[firstArgProperty]);
        };
        action = _curriedMethod2;
      }
    }

    // TRACKS
    if (ent.entityType === "track") {
      var _properties = ent.entityData.properties;

      // TODO: Find a better fallback & check correct properties
      avatar = "track";
      name = _properties.name ? _properties.name : (0, _i18n.getTranslation)("global.CBComponents.CBList.helpers.nameNotFound");
      id = ent.id;
      if (method && firstArgProperty) {
        var _curriedMethod3 = function _curriedMethod3() {
          method(ent[firstArgProperty]);
        };
        action = _curriedMethod3;
      }
    }

    // CAMERAS
    if (ent.entityType == "camera") {
      var _properties2 = ent.entityData.properties;
      avatar = "camera";
      name = _properties2.name;
      id = ent.id;
      if (method && firstArgProperty) {
        var _curriedMethod4 = function _curriedMethod4() {
          method(ent[firstArgProperty]);
        };
        action = _curriedMethod4;
      }
    }
    return {
      avatar: avatar,
      name: name,
      id: id,
      action: action
    };
  });
  return data;
};
var _default = transformEntities; // ------------------------- EXAMPLE OF USE -------------------------
// --- Import in the list component
//
// import { List } from "orion-components/CBComponents";
// --- Any array of CB data (users, shapes, tracks, events, etc) will work
//
// const data = [
//	{
// 		"createdDate": Fri Nov 02 2018 14:43:55 GMT+00:00 ,
// 		"entityData": {
// 			"geometry": { ... } ,
// 			"properties": { ... } ,
// 			"type":  "Polygon"
// 		} ,
// 		"entityType":  "shapes" ,
// 		"feedId":  "ares_security_corporation_shapes" ,
// 		"id":  "90235f8f-1f18-4ea6-9651-58c44858ee45" ,
// 		"isDeleted": false ,
// 		"isPublic": false ,
// 		"lastModifiedDate": Fri Nov 02 2018 14:43:55 GMT+00:00 ,
// 		"owner":  "2c9c0362-345b-4f33-9976-219a4566b9c3" ,
// 		"ownerOrg":  "ares_security_corporation"
// 	}
// ]
// -- Optional: Create a method you'd like to be called on list item click
//
// const openProfile = (id) => {
// 	this.openProfile(id);
// };
// --- Transform your data.
// --- Pass true to 2nd argument if you want user initials instead of icons,
// --- Pass function to 3rd argument if you want something called on each list item click
// --- If you passed a function to 3rd argument, pass a string to 4th argument of the entity property
// ------ that you want bound to the first argument of your passed in function
//
// const transformedData = listTransform(data, true, logShapeId, "id");
// Pass your data to the CB list
//
// <List listItems={transformedData} />
// In this case, each list item clicked will open their entity profile!
exports["default"] = _default;