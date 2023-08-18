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
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _material = require("@mui/material");
var _CBComponents = require("../../../CBComponents");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// import { integrationService } from "client-app-core";

var propTypes = {
  order: _propTypes["default"].number,
  entity: _propTypes["default"].object.isRequired,
  vesselData: _propTypes["default"].object.isRequired,
  displayProps: _propTypes["default"].object,
  classes: _propTypes["default"].object,
  dir: _propTypes["default"].string
};
var defaultProps = {
  order: 0,
  displayProps: null,
  dir: "ltr"
};
var MarineTrafficParticularsWidget = function MarineTrafficParticularsWidget(_ref) {
  var _context2;
  var dir = _ref.dir,
    selected = _ref.selected,
    expanded = _ref.expanded,
    enabled = _ref.enabled,
    order = _ref.order,
    data = _ref.data;
  var _useState = (0, _react.useState)(),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    vesselData = _useState2[0],
    setVesselData = _useState2[1];
  var formatData = function formatData(data) {
    var _context;
    var newData = [];
    (0, _forEach["default"])(_context = (0, _keys["default"])(data)).call(_context, function (key) {
      var newObject = {
        label: key,
        value: data[key]
      };
      newData.push(newObject);
    });
    return newData;
  };
  var getParticulars = function getParticulars() {
    var particulars = vesselData;
    if ((0, _isEmpty["default"])(particulars)) {
      return /*#__PURE__*/_react["default"].createElement(_material.Typography, {
        style: {
          margin: "12px auto"
        },
        align: "center",
        variant: "caption"
      }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
        value: "global.profiles.widgets.marineTrafficParticulars.noParticulars"
      }));
    } else {
      return /*#__PURE__*/_react["default"].createElement(_CBComponents.SimpleTable, {
        rows: particulars,
        dir: dir
      });
    }
  };
  (0, _react.useEffect)(function () {
    setVesselData(formatData(data));
  }, [data]);
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("section", {
    className: (0, _concat["default"])(_context2 = "marineTrafficParticulars-widget widget-wrapper ".concat("index-" + order, " ")).call(_context2, expanded ? "expanded" : "collapsed")
  }, !expanded && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-inner"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.marineTrafficParticulars.title"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, getParticulars())));
};
MarineTrafficParticularsWidget.propTypes = propTypes;
MarineTrafficParticularsWidget.defaultProps = defaultProps;
var _default = MarineTrafficParticularsWidget;
exports["default"] = _default;