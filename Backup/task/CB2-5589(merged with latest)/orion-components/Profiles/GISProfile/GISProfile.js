"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _react = _interopRequireDefault(require("react"));
var _DetailsWidget = _interopRequireDefault(require("../Widgets/Details/DetailsWidget.js"));
var _SummaryWidget = _interopRequireDefault(require("../Widgets/Summary/SummaryWidget"));
var _ErrorBoundary = _interopRequireDefault(require("../../ErrorBoundary"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _Selectors2 = require("orion-components/ContextPanel/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var GISProfile = function GISProfile(_ref) {
  var _context;
  var replayMapState = _ref.replayMapState;
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors2.selectedContextSelector)(state);
  });
  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile;
  });
  var mapStatus = (0, _reactRedux.useSelector)(function (state) {
    return replayMapState ? replayMapState(state) : (0, _Selectors.mapState)(state);
  });
  var mapVisible = mapStatus.visible;
  var timeFormatPreference = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global.timeFormat;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var entity = context.entity;
  var id = entity.id,
    entityData = entity.entityData;
  var geometry = entityData.geometry,
    properties = entityData.properties;
  var type = geometry.type;
  var layerName = properties.layerName,
    details = properties.details;
  var textField = properties["text-field"];
  return entity ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-profile-wrapper",
    style: {
      height: "100%",
      overflow: "scroll"
    }
  }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_SummaryWidget["default"], {
    id: id,
    user: user,
    name: (0, _concat["default"])(_context = "".concat(layerName ? layerName + ": " : "")).call(_context, textField),
    type: type,
    context: context,
    geometry: geometry,
    mapVisible: mapVisible,
    dir: dir
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widgets-container"
  }, /*#__PURE__*/_react["default"].createElement(_DetailsWidget["default"], {
    order: 0,
    details: details,
    timeFormatPreference: timeFormatPreference ? timeFormatPreference : "12-hour",
    dir: dir
  }))) : /*#__PURE__*/_react["default"].createElement("div", null);
};
var _default = GISProfile;
exports["default"] = _default;