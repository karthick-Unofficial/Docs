"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _Selectors = require("../../../GlobalData/Selectors");
var _map = _interopRequireDefault(require("lodash/map"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var _Icons = require("orion-components/CBComponents/Icons");
var _i18n = require("orion-components/i18n");
var _filter = _interopRequireDefault(require("lodash/filter"));
var Collections = function Collections(props) {
  var _context;
  var getCollectionMember = (0, _Selectors.makeGetCollectionMembers)();
  var entities = (0, _reactRedux.useSelector)(function (state) {
    return getCollectionMember(state, props);
  });
  var profileIconTemplates = {};
  var userFeeds = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.userFeedsSelector)(state);
  });
  (0, _forEach["default"])(_context = (0, _values["default"])(userFeeds)).call(_context, function (feed) {
    profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
  });
  var getCollectionMembers = function getCollectionMembers() {
    var filteredMembers = (0, _pickBy["default"])(entities, function (member) {
      var entityData = member.entityData,
        id = member.id;
      if (entityData) {
        var _context2, _context3, _context4;
        var properties = entityData.properties;
        var name = properties.name,
          description = properties.description,
          type = properties.type;
        properties.profileIconTemplate = profileIconTemplates[member.feedId];
        return (0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = "".concat(name, "|")).call(_context4, description, "|")).call(_context3, type, "|")).call(_context2, id).toLowerCase();
      } else {
        return false;
      }
    });
    return filteredMembers;
  };
  var getCollectionIcons = function getCollectionIcons(icon) {
    switch (icon) {
      case "shapes":
        return /*#__PURE__*/_react["default"].createElement("img", {
          alt: "marker_yellow",
          style: {
            width: 29,
            height: 29
          },
          src: require("../../../SharedComponents/ShapeEdit/icons/Marker_yellow.png")
        });
      case "facility":
        return /*#__PURE__*/_react["default"].createElement(_Icons.FacilityBlueIcon, {
          style: {
            width: 29,
            height: 29
          }
        });
      default:
        return null;
    }
  };
  var members = getCollectionMembers();
  var titleId = props.titleId;
  var filteredMembers = (0, _filter["default"])(members, function (member) {
    return member.entityType === "shapes" && titleId === "interdictionPointCollection" && member.entityData.type === "Point" || member.entityType === "facility" && titleId === "targetCollection";
  });
  return /*#__PURE__*/_react["default"].createElement("div", null, filteredMembers.length > 0 ? (0, _map["default"])(filteredMembers, function (member, index) {
    var entityData = member.entityData,
      feedId = member.feedId,
      entityType = member.entityType;
    var properties = entityData.properties;
    var name = properties.name,
      type = properties.type;
    var id = member.id ? member.id : properties.id ? properties.id : "";
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      container: true
    }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2,
      style: {
        paddingTop: "5px"
      }
    }, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
      id: id,
      feedId: feedId,
      geometry: true,
      feedLayerCheck: true
    })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        marginTop: "10px"
      }
    }, getCollectionIcons(entityType))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      xs: 8,
      sm: 8,
      md: 8,
      lg: 8
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        marginTop: "10px"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      fontSize: "12px"
    }, name), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      fontSize: "8px"
    }, type)))), index !== filteredMembers.length - 1 ? /*#__PURE__*/_react["default"].createElement(_material.Divider, {
      style: {
        background: "#ff",
        marginBottom: "3px",
        padding: "0px 4px"
      }
    }) : null);
  }) : /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    fontSize: "14px",
    style: {
      textAlign: "center",
      paddingTop: "20px"
    }
  }, titleId === "interdictionPointCollection" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.collections.noInterdictionLocations"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.units.components.collections.noTargetLocation"
  }))));
};
var _default = Collections;
exports["default"] = _default;