"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _shared = require("../shared");
var _iconsMaterial = require("@mui/icons-material");
var _reactRedux = require("react-redux");
var MapWidget = function MapWidget(_ref) {
  var selectWidget = _ref.selectWidget,
    title = _ref.title,
    order = _ref.order,
    enabled = _ref.enabled,
    expanded = _ref.expanded,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("map-view"));
  };
  return /*#__PURE__*/_react["default"].createElement(_shared.BaseWidget, {
    order: order,
    enabled: enabled,
    title: title,
    expanded: expanded,
    expandable: true,
    handleExpand: handleExpand,
    icon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Map, {
      fontSize: "large"
    }),
    dir: dir
  });
};
var _default = MapWidget;
exports["default"] = _default;