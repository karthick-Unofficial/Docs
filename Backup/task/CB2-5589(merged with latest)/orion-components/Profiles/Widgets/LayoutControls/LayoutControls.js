"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _react = _interopRequireWildcard(require("react"));
var _reactSortableHoc = require("react-sortable-hoc");
var _WidgetCard = _interopRequireDefault(require("./components/WidgetCard"));
var _material = require("@mui/material");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _commonActions = require("orion-components/SharedActions/commonActions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref) {
  var value = _ref.value,
    _enable = _ref.enable,
    _disable = _ref.disable,
    isExpanded = _ref.isExpanded;
  return /*#__PURE__*/_react["default"].createElement(_WidgetCard["default"], {
    widget: value,
    enable: function enable(id) {
      return _enable(id);
    },
    disable: function disable(id) {
      return _disable(id);
    },
    isExpanded: isExpanded
  });
});
var SortableList = (0, _reactSortableHoc.SortableContainer)(function (_ref2) {
  var items = _ref2.items,
    _enable2 = _ref2.enable,
    _disable2 = _ref2.disable,
    expandedWidget = _ref2.expandedWidget;
  var isWidgetExpanded = function isWidgetExpanded(widget) {
    if (expandedWidget === "map-view") {
      return widget.id === "map";
    } else {
      return expandedWidget === widget.name;
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_material.List, {
    className: "widget-list"
  }, (0, _map["default"])(items).call(items, function (value, index) {
    return /*#__PURE__*/_react["default"].createElement(SortableItem, {
      key: "widget-".concat(value.id),
      index: index,
      value: value,
      enable: function enable(id) {
        return _enable2(id);
      },
      disable: function disable(id) {
        return _disable2(id);
      },
      isExpanded: isWidgetExpanded(value)
    });
  }));
});
var LayoutControls = function LayoutControls(_ref3) {
  var widgetOrder = _ref3.widgetOrder,
    open = _ref3.open,
    anchor = _ref3.anchor,
    close = _ref3.close,
    expandedWidget = _ref3.expandedWidget,
    profile = _ref3.profile;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    widgets = _useState2[0],
    setWidgets = _useState2[1];
  (0, _react.useEffect)(function () {
    setWidgets(widgetOrder);
  }, [widgetOrder]);
  var onSortEnd = function onSortEnd(_ref4) {
    var oldIndex = _ref4.oldIndex,
      newIndex = _ref4.newIndex;
    setWidgets((0, _reactSortableHoc.arrayMove)(widgets, oldIndex, newIndex));
  };
  var handleSaveOrder = function handleSaveOrder() {
    dispatch((0, _commonActions.setWidgetOrder)(profile, widgets));
    close();
  };
  var handleEnableWidget = function handleEnableWidget(id) {
    var newWidgets = (0, _toConsumableArray2["default"])(widgets);
    newWidgets = (0, _map["default"])(widgets).call(widgets, function (widget) {
      if (widget.id === id) {
        return _objectSpread(_objectSpread({}, widget), {}, {
          enabled: true
        });
      } else {
        return widget;
      }
    });
    setWidgets(newWidgets);
  };
  var handleDisableWidget = function handleDisableWidget(id) {
    var widgetsData = (0, _slice["default"])(widgets).call(widgets);
    var newWidgets = (0, _map["default"])(widgetsData).call(widgetsData, function (widget) {
      if (widget.id === id) {
        return _objectSpread(_objectSpread({}, widget), {}, {
          enabled: false
        });
      } else {
        return widget;
      }
    });
    setWidgets(newWidgets);
  };

  // Prevent list sorting when clicking on enable/disable button
  var shouldCancelStart = function shouldCancelStart(e) {
    var _context;
    var buttonClick = (0, _filter["default"])(_context = e.composedPath()).call(_context, function (tag) {
      var tagName = tag.tagName;
      if (tagName) {
        return tagName.toLowerCase() === "button";
      }
    });
    if (buttonClick.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    open: open,
    onClose: close,
    anchorEl: anchor,
    anchorOrigin: {
      vertical: "top",
      horizontal: "center"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center"
    }
    //zDepth={5}
    ,
    PaperProps: {
      sx: {
        left: "100px",
        width: 340,
        backgroundColor: "#41454A"
      }
    }
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "layout-button-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: handleSaveOrder,
    variant: "contained",
    color: "primary",
    style: {
      width: "100%",
      color: "white",
      textTransform: "uppercase",
      borderRadius: "3px"
    }
  }, (0, _i18n.getTranslation)("global.profiles.widgets.layoutControls.done"))), /*#__PURE__*/_react["default"].createElement(SortableList, {
    items: widgets,
    onSortEnd: onSortEnd,
    enable: function enable(id) {
      return handleEnableWidget(id);
    },
    disable: function disable(id) {
      return handleDisableWidget(id);
    },
    shouldCancelStart: shouldCancelStart,
    expandedWidget: expandedWidget
  })));
};

// TODO: Prevent unnecessary rendering from moving features and remove this life-cycle hook
// I believe the CB2-5573 fix has resolved the unwanted re-rendering issues; however, more testing is required to confirm that the fix is working as expected.

var componentUpdate = function componentUpdate(prevProps, nextProps) {
  if (!(0, _isEqual["default"])(prevProps.widgetOrder, nextProps.widgetOrder)) {
    return false;
  } else if (!(0, _isEqual["default"])(prevProps.open, nextProps.open)) {
    return false;
  } else {
    return true;
  }
};
var _default = /*#__PURE__*/(0, _react.memo)(LayoutControls, componentUpdate);
exports["default"] = _default;