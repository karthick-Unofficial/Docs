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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _TrackAssociationCard = _interopRequireDefault(require("./components/TrackAssociationCard"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _filter = _interopRequireDefault(require("lodash/filter"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var DroneAssociation = function DroneAssociation(props) {
  var context = props.context,
    order = props.order,
    loadProfile = props.loadProfile,
    enabled = props.enabled;
  var _context$entity = context.entity,
    feedId = _context$entity.feedId,
    entityData = _context$entity.entityData;
  var _entityData$propertie = entityData.properties,
    type = _entityData$propertie.type,
    flightId = _entityData$propertie.flightId;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    tracks = _useState2[0],
    setTracks = _useState2[1];
  var flightTracks = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.getFeedEntitiesByProperty)(state, feedId, "flightId", flightId);
  }, _reactRedux.shallowEqual);
  (0, _react.useEffect)(function () {
    var items = (0, _filter["default"])(flightTracks, function (track) {
      return track && track.entityData.properties.type !== type;
    });
    setTracks(items);
  }, [flightTracks]);
  return enabled ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-wrapper collapsed ".concat("index-" + order, " ")
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.droneTrackAssociation.title"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content",
    style: {
      display: "flex"
    }
  }, tracks && tracks.length > 0 ? (0, _map["default"])(tracks).call(tracks, function (associatedTrack, index) {
    return /*#__PURE__*/_react["default"].createElement(_TrackAssociationCard["default"], {
      associatedTrack: associatedTrack,
      key: index,
      loadProfile: loadProfile,
      canTarget: true,
      readOnly: false
    });
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      margin: "12px auto"
    },
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.droneTrackAssociation.noAssociatedTracks"
  })))) : /*#__PURE__*/_react["default"].createElement(_react.Fragment, null);
};
var _default = /*#__PURE__*/(0, _react.memo)(DroneAssociation);
exports["default"] = _default;