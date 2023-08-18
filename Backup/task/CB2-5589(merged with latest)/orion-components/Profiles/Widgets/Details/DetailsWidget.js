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
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Apm = require("../../../Apm");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("../../../CBComponents");
var _shared = require("../shared");
var _VisualDetail = _interopRequireDefault(require("./components/VisualDetail"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _i18n = require("orion-components/i18n");
var _map2 = _interopRequireDefault(require("lodash/map"));
var _pickBy = _interopRequireDefault(require("lodash/pickBy"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  order: _propTypes["default"].number,
  details: _propTypes["default"].object.isRequired,
  displayProps: _propTypes["default"].array,
  dir: _propTypes["default"].string
};
var defaultProps = {
  order: 0,
  displayProps: null,
  dir: "ltr"
};
var DetailsWidget = function DetailsWidget(_ref) {
  var displayProps = _ref.displayProps,
    details = _ref.details,
    timeFormatPreference = _ref.timeFormatPreference,
    dir = _ref.dir,
    order = _ref.order,
    enabled = _ref.enabled;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var _useState3 = (0, _react.useState)(!!displayProps),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    hasVisuals = _useState4[0],
    setHasVisuals = _useState4[1];
  (0, _react.useEffect)(function () {
    if (displayProps) {
      var _hasVisuals = (0, _find["default"])(displayProps).call(displayProps, function (prop) {
        var visual = prop.visual,
          key = prop.key;
        return visual && details[key];
      });
      setHasVisuals(!!_hasVisuals);
    }
  }, []);
  var getSimpleDetails = function getSimpleDetails() {
    var rows = [];
    if (displayProps) {
      var simpleProps = (0, _filter["default"])(displayProps).call(displayProps, function (prop) {
        var visual = prop.visual,
          key = prop.key;
        return !visual && (details[key] || typeof details[key] === "number") && details[key] !== "";
      });
      rows = (0, _map["default"])(simpleProps).call(simpleProps, function (prop) {
        var key = prop.key,
          label = prop.label,
          unit = prop.unit;
        var value = details[key];
        if (unit) {
          switch (unit) {
            case "time":
              value = _clientAppCore.timeConversion.convertToUserTime(details[key], "full_".concat(timeFormatPreference));
              break;
            default:
              value = details[key];
              break;
          }
        }
        return {
          label: label,
          unit: unit,
          value: value
        };
      });
    } else {
      rows = (0, _map2["default"])((0, _pickBy["default"])(details, function (detail) {
        return !!detail;
      }), function (value, label) {
        if (value) {
          return {
            label: label,
            value: value
          };
        }
      });
    }
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.SimpleTable, {
      rows: rows,
      dir: dir
    });
  };
  var getVisualDetails = function getVisualDetails() {
    var visualProps = (0, _filter["default"])(displayProps).call(displayProps, function (prop) {
      var visual = prop.visual,
        key = prop.key,
        tooltip = prop.tooltip;
      return visual && (details[key] || typeof details[key] === "number" || details[tooltip]) && details[key] !== "";
    });
    var visuals = (0, _map["default"])(visualProps).call(visualProps, function (prop) {
      var key = prop.key,
        label = prop.label,
        tooltip = prop.tooltip,
        unit = prop.unit,
        visual = prop.visual;
      return /*#__PURE__*/_react["default"].createElement(_material.Grid, {
        key: key,
        item: true
      }, /*#__PURE__*/_react["default"].createElement(_VisualDetail["default"], {
        label: label,
        tooltip: details[tooltip],
        unit: unit,
        value: details[key],
        visual: visual
      }));
    });
    return visuals;
  };
  var handleExpand = function handleExpand() {
    setExpanded(!expanded);
  };
  return /*#__PURE__*/_react["default"].createElement(_shared.BaseWidget, {
    enabled: enabled,
    order: order,
    title: (0, _i18n.getTranslation)("global.profiles.widgets.details.title"),
    dir: dir
  }, hasVisuals && /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    style: {
      margin: "10px -12px"
    },
    justifyContent: "space-around",
    spacing: 3,
    alignContent: "center"
  }, getVisualDetails()), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    className: "list-body-wrapper",
    style: {
      overflowX: "scroll"
    },
    "in": expanded || !hasVisuals
  }, getSimpleDetails()), hasVisuals && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: handleExpand
  }, expanded ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.details.showLess"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.details.showMore"
  }), expanded ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)));
};
DetailsWidget.propTypes = propTypes;
DetailsWidget.defaultProps = defaultProps;
var _default = (0, _Apm.withSpan)("details-widget", "profile-widget")(DetailsWidget);
exports["default"] = _default;