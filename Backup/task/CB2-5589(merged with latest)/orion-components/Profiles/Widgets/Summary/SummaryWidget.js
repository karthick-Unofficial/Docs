"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _react = _interopRequireDefault(require("react"));
var _Apm = require("../../../Apm");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _getButtons = _interopRequireDefault(require("./getButtons"));
var _getAction = _interopRequireDefault(require("./getAction"));
var _toUpper = _interopRequireDefault(require("lodash/toUpper"));
var _i18n = require("orion-components/i18n");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context3, _context4; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context3 = ownKeys(Object(source), !0)).call(_context3, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context4 = ownKeys(Object(source))).call(_context4, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  context: _propTypes["default"].object.isRequired,
  id: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
  user: _propTypes["default"].object.isRequired,
  name: _propTypes["default"].string,
  displayType: _propTypes["default"].string,
  type: _propTypes["default"].string,
  description: _propTypes["default"].string,
  geometry: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].bool]),
  actions: _propTypes["default"].array,
  scrolledUp: _propTypes["default"].bool,
  handleExpand: _propTypes["default"].func,
  appId: _propTypes["default"].string,
  mapVisible: _propTypes["default"].bool,
  isHiding: _propTypes["default"].bool,
  profileIconTemplate: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool,
  dir: _propTypes["default"].string,
  selectFloor: _propTypes["default"].func
};
var defaultProps = {
  name: "",
  displayType: "",
  type: "",
  description: "",
  geometry: null,
  actions: null,
  scrolledUp: false,
  handleExpand: null,
  mapVisible: false,
  isHiding: false,
  profileIconTemplate: null,
  dir: "ltr",
  selectFloor: function selectFloor() {}
};
var SummaryWidget = function SummaryWidget(_ref) {
  var _context, _context2;
  var context = _ref.context,
    id = _ref.id,
    user = _ref.user,
    name = _ref.name,
    displayType = _ref.displayType,
    type = _ref.type,
    description = _ref.description,
    geometry = _ref.geometry,
    actions = _ref.actions,
    scrolledUp = _ref.scrolledUp,
    handleExpand = _ref.handleExpand,
    appId = _ref.appId,
    profileIconTemplate = _ref.profileIconTemplate,
    readOnly = _ref.readOnly,
    dir = _ref.dir,
    selectFloor = _ref.selectFloor;
  var entity = context.entity;
  var ownerName = entity.ownerName,
    feedId = entity.feedId;
  var buttons = (0, _getButtons["default"])(user, context, appId, actions, readOnly);
  if (buttons) {
    (0, _map["default"])(buttons).call(buttons, function (button) {
      (0, _forEach["default"])(actions).call(actions, function (action) {
        if (action.name === button.name) {
          button.action = action.action;
        }

        // Prevents multiple simultaneous clicks
        // On-click, set flag in parent profile, pass down as action.debounce
        if (action.debounce) {
          button.disabled = true;
        }
      });
      if (!button.action) {
        button.viewable = false;
      }
      return button;
    });
  }
  var localizeType = function localizeType(type) {
    switch (type) {
      case "Facility":
      case "Track":
      case "Line":
      case "Polygon":
      case "Camera":
        return (0, _i18n.getTranslation)("global.profiles.widgets.summary.".concat(type));
      default:
        return type;
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "summary-wrapper ".concat(scrolledUp ? "scrolled-up" : "", " ")
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    className: "summary-info",
    disableGutters: true
  }, geometry && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    id: id,
    feedId: feedId,
    geometry: geometry || null,
    selectFloor: selectFloor
  }), type && (0, _SharedComponents.getIconByTemplate)(type, entity, "2rem", profileIconTemplate) && /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
    style: _objectSpread(_objectSpread({
      color: "#828283",
      fontSize: "2rem"
    }, dir === "rtl" && {
      marginLeft: 0,
      marginRight: 12
    }), dir === "ltr" && {
      marginRight: 0,
      marginLeft: 12
    })
  }, (0, _SharedComponents.getIconByTemplate)(type, entity, "2rem", profileIconTemplate)), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    className: " ".concat(scrolledUp ? "MuiTypography-noWrap" : ""),
    primary: (0, _toUpper["default"])(name || id),
    secondary: ownerName ? (0, _i18n.getTranslation)("global.profiles.widgets.summary.createdBy", "", localizeType(displayType || type), ownerName) : localizeType(displayType || type),
    primaryTypographyProps: {
      style: {
        color: "#FFF",
        lineHeight: 1,
        textOverflow: "ellipsis",
        overflow: "hidden",
        wordWrap: "break-word",
        direction: dir
      },
      variant: "h6"
    },
    secondaryTypographyProps: {
      style: {
        color: "#828283",
        direction: dir
      },
      noWrap: scrolledUp
    }
  }), scrolledUp && (buttons || description) && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.MoreHoriz, {
    style: {
      color: "#FFF"
    }
  }))), !scrolledUp && (buttons || description) && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "0 10px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "summary-description",
    style: dir === "rtl" ? {
      textAlign: "right",
      marginRight: "5px"
    } : {}
  }, /*#__PURE__*/_react["default"].createElement("p", null, description)), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-end",
      flexWrap: "nowrap"
    }
  }, buttons && (0, _map["default"])(_context = (0, _filter["default"])(buttons).call(buttons, function (button) {
    return button.viewable;
  })).call(_context, function (button) {
    var name = button.name,
      toggled = button.toggled,
      disabled = button.disabled,
      action = button.action,
      icon = button.icon;
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.FontIconButton, {
      key: name,
      label: name,
      icon: icon,
      action: action,
      toggled: toggled,
      disabled: disabled
    });
  }), entity.actions && (0, _map["default"])(_context2 = entity.actions).call(_context2, function (action) {
    var label = action.label,
      type = action.type;
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.FontIconButton, {
      key: label,
      label: label,
      icon: (0, _SharedComponents.getIcon)(type, 24),
      action: (0, _getAction["default"])(action)
    });
  }))));
};
SummaryWidget.propTypes = propTypes;
SummaryWidget.defaultProps = defaultProps;
var _default = (0, _Apm.withSpan)("summary-widget", "profile-widget")(SummaryWidget);
exports["default"] = _default;