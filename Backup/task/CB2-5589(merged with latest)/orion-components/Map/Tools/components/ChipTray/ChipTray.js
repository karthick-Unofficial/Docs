"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var ChipTray = function ChipTray(_ref) {
  var children = _ref.children,
    buttonCount = _ref.buttonCount;
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return (0, _Selectors.mapState)(state);
    }),
    offset = _useSelector.offset;
  var dockState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.dock.dockData;
  });
  var styles = {
    wrapper: {
      left: 360 + offset,
      right: 64 * buttonCount,
      position: "absolute",
      bottom: "2.55rem",
      width: "auto",
      marginRight: 8,
      alignItems: "center",
      //transition: "transform 200ms linear", //Leaving out for now because it's choppy
      transform: "translateX(-".concat(dockState.isOpen ? 420 : 0, "px)")
    },
    row: {
      display: "flex",
      flexDirection: "row-reverse",
      overflowX: "scroll",
      marginTop: 8
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.wrapper
  }, (0, _isArray["default"])(children) ? (0, _map["default"])(children).call(children, function (child, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: index,
      style: styles.row
    }, child);
  }) : /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.row
  }, children));
};
var _default = ChipTray;
exports["default"] = _default;