"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _RespondingUnit = _interopRequireDefault(require("./components/RespondingUnit"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var RespondingUnitsWidget = function RespondingUnitsWidget(_ref) {
  var loadProfile = _ref.loadProfile,
    respondingUnits = _ref.respondingUnits,
    order = _ref.order,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var handleLoadEntityDetails = function handleLoadEntityDetails(item) {
    dispatch(loadProfile(item.id, item.unitId, "track", "profile"));
  };
  return /*#__PURE__*/_react["default"].createElement("section", {
    className: "widget-wrapper cad-details-widget ".concat("index-" + order)
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.respondingUnits.title"
  }))), respondingUnits && (0, _map["default"])(respondingUnits).call(respondingUnits, function (respondingUnit, index) {
    return /*#__PURE__*/_react["default"].createElement(_RespondingUnit["default"], {
      key: "responding_unit_".concat(index),
      entity: respondingUnit,
      handleLoadEntityDetails: handleLoadEntityDetails,
      dir: dir
    });
  }));
};
var _default = RespondingUnitsWidget;
exports["default"] = _default;