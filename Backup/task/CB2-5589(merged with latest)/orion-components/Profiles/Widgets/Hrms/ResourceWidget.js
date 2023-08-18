"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _ManageModal = _interopRequireDefault(require("./components/ManageModal"));
var _WidgetTable = _interopRequireDefault(require("./components/WidgetTable"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  expanded: _propTypes["default"].bool.isRequired,
  selectWidget: _propTypes["default"].func,
  selected: _propTypes["default"].bool.isRequired,
  order: _propTypes["default"].number,
  settings: _propTypes["default"].object,
  dir: _propTypes["default"].string,
  forReplay: _propTypes["default"].bool
};
var defaultProps = {
  selectWidget: null,
  order: 0,
  settings: null,
  dir: "ltr",
  forReplay: false
};
var ResourceWidget = function ResourceWidget(_ref) {
  var _context;
  var selectWidget = _ref.selectWidget,
    expanded = _ref.expanded,
    selected = _ref.selected,
    expandable = _ref.expandable,
    enabled = _ref.enabled,
    order = _ref.order,
    contextId = _ref.contextId,
    settings = _ref.settings,
    dir = _ref.dir,
    canManage = _ref.canManage;
  var dispatch = (0, _reactRedux.useDispatch)();
  var styles = {
    widgetExpandButton: _objectSpread(_objectSpread({
      width: "auto"
    }, dir == "rtl" && {
      paddingLeft: 0
    }), dir == "ltr" && {
      paddingRight: 0
    })
  };
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    openDialog = _useState2[0],
    setOpenDialog = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    checkResourceData = _useState4[0],
    setCheckResourceData = _useState4[1];
  (0, _react.useEffect)(function () {
    if ("resources" in settings) {
      if (settings.resources.length > 0) {
        setCheckResourceData(true);
      } else {
        setCheckResourceData(false);
      }
    } else {
      setCheckResourceData(false);
    }
  }, [settings]);
  var openHrmsDialog = function openHrmsDialog() {
    setOpenDialog(true);
  };
  var closeHrmsDialog = function closeHrmsDialog() {
    setOpenDialog(false);
  };
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Resources"));
  };
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: (0, _concat["default"])(_context = "widget-wrapper ".concat(expanded ? "expanded" : "collapsed", " ")).call(_context, "index-" + order)
  }, openDialog && /*#__PURE__*/_react["default"].createElement(_ManageModal["default"], {
    open: openDialog,
    close: closeHrmsDialog,
    lookupType: "resources",
    contextId: contextId,
    settings: settings,
    assignedData: settings.resources,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", {
    id: "resource-wrapper"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.hrms.resourcesWidget.resources"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button"
  }, canManage && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: openHrmsDialog
  }, (0, _i18n.getTranslation)("global.profiles.widgets.hrms.resourcesWidget.manage"))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, expandable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))) : null)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, checkResourceData ? /*#__PURE__*/_react["default"].createElement(_WidgetTable["default"], {
    WidgetType: "resources",
    tableData: settings.resources,
    expanded: expanded,
    dir: dir
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: 12
    },
    component: "p",
    align: "center",
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.hrms.resourcesWidget.noResources"
  })))));
};
ResourceWidget.propTypes = propTypes;
ResourceWidget.defaultProps = defaultProps;
var _default = ResourceWidget;
exports["default"] = _default;