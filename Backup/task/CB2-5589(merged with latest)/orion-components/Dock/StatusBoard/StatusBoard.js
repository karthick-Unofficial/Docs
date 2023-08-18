"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _StatusCard = _interopRequireDefault(require("../../SharedComponents/StatusCard/StatusCard"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
var StatusBoard = function StatusBoard(_ref) {
  var canManage = _ref.canManage;
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var statusCards = (0, _reactRedux.useSelector)(function (state) {
    return state.statusCards && state.statusCards.cards;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var orgId = (0, _reactRedux.useSelector)(function (state) {
    return state.session.user.profile.orgId;
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      overflow: "scroll",
      height: "calc(100% - 80px)",
      width: "90%",
      margin: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    style: {
      fontFamily: "roboto",
      fontSize: "14px",
      fontWeight: 400,
      color: "#fff"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.statusBoard.title"
  })), (0, _map["default"])(statusCards).call(statusCards, function (card, index) {
    return card.global && /*#__PURE__*/_react["default"].createElement("div", {
      className: "globalStatusCard",
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/_react["default"].createElement(_StatusCard["default"], {
      key: card.id,
      index: index,
      card: card,
      disableControls: orgId !== card.ownerOrg && !canManage,
      disableMenu: true,
      userCanEdit: canManage,
      userCanShare: true,
      dir: dir,
      locale: locale
    }));
  }));
};
var _default = StatusBoard;
exports["default"] = _default;