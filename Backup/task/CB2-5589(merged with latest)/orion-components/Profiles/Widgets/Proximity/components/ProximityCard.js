"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _CBComponents = require("orion-components/CBComponents");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  proximity: _propTypes["default"].object.isRequired,
  event: _propTypes["default"].object.isRequired
};
var ProximityCard = function ProximityCard(_ref) {
  var _context;
  var proximity = _ref.proximity,
    canRemove = _ref.canRemove,
    handleRemove = _ref.handleRemove,
    canEdit = _ref.canEdit,
    handleEdit = _ref.handleEdit,
    loadProfile = _ref.loadProfile,
    handleLoadEntityDetails = _ref.handleLoadEntityDetails,
    widgetExpanded = _ref.widgetExpanded,
    entities = _ref.entities,
    dir = _ref.dir;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var handleExpand = function handleExpand() {
    setExpanded(!expanded);
  };
  var radius = proximity.distanceUnits === "mi" ? proximity.radius * 1.609344 : proximity.radius;
  return /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: {
      borderRadius: 0,
      marginBottom: 12,
      background: "transparent"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: {
      backgroundColor: "#494d53",
      padding: "0px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleExpand
  }, expanded ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: {
      paddingLeft: 0,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      color: "white"
    },
    primary: proximity.name,
    primaryTypographyProps: {
      variant: "body1",
      noWrap: true
    }
  }), canEdit && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: handleEdit
  }, (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityCard.edit")), canRemove && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleRemove
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null))), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded
  }, /*#__PURE__*/_react["default"].createElement(_material.CardContent, {
    style: {
      padding: 0,
      border: "1px solid #494d53"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      maxHeight: "400px"
    },
    className: "proximityEntitiesScroll scrollbar"
  }, entities && entities.length > 0 ? (0, _map["default"])(_context = (0, _filter["default"])(entities).call(entities, function (entity) {
    return entity.proximityId === Number(radius);
  })).call(_context, function (entity) {
    var entityData = entity.entityData,
      feedId = entity.feedId,
      id = entity.id,
      isDeleted = entity.isDeleted;
    var _entityData$propertie = entityData.properties,
      name = _entityData$propertie.name,
      type = _entityData$propertie.type,
      subtype = _entityData$propertie.subtype;
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionCardItem, {
      canRemove: false,
      disabled: isDeleted,
      feedId: feedId,
      handleClick: loadProfile ? function () {
        return handleLoadEntityDetails(entity);
      } : null,
      id: id,
      key: id,
      name: name,
      type: widgetExpanded ? subtype ? subtype : type : "",
      dir: dir
    });
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: 12
    },
    align: "center",
    variant: "caption",
    component: "p"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.proximity.proximityCard.noEntities"
  }))))));
};
ProximityCard.propTypes = propTypes;
var _default = ProximityCard;
exports["default"] = _default;