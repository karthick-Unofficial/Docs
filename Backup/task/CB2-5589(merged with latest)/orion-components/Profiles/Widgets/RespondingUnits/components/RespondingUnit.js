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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _SharedComponents = require("../../../../SharedComponents");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _iconsMaterial = require("@mui/icons-material");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var materialStyles = function materialStyles(theme) {
  return {
    entity: {
      paddingTop: 8,
      color: "white",
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #41454A",
      borderLeft: "1px solid #41454A",
      borderRight: "1px solid #41454A",
      fontSize: 15,
      backgroundColor: "#41454A",
      paddingRight: 16,
      borderRadius: 15
    },
    entityRTL: {
      paddingTop: 8,
      color: "white",
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #41454A",
      borderLeft: "1px solid #41454A",
      borderRight: "1px solid #41454A",
      fontSize: 15,
      backgroundColor: "#41454A",
      paddingLeft: 16,
      borderRadius: 15
    }
  };
};
var RespondingUnit = function RespondingUnit(_ref) {
  var _context;
  var entity = _ref.entity,
    handleLoadEntityDetails = _ref.handleLoadEntityDetails,
    classes = _ref.classes,
    dir = _ref.dir;
  var listStyles = {
    details: {
      minWidth: "55%"
    },
    unitId: _objectSpread(_objectSpread(_objectSpread({
      fontSize: 18
    }, dir === "rtl" && {
      paddingRight: 6
    }), dir === "ltr" && {
      paddingLeft: 6
    }), {}, {
      color: "rgb(53, 183, 243)"
    }),
    personnelDiv: {
      display: "flex",
      alignItems: "center"
    },
    personnelName: {
      fontSize: 10
    },
    close: {
      marginLeft: "auto",
      width: "auto",
      height: "auto",
      padding: 0
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    classes: {
      root: dir && dir == "rtl" ? classes.entityRTL : classes.entity
    }
  }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    feedId: entity.feedId,
    id: entity.id
  }), /*#__PURE__*/_react["default"].createElement("div", {
    id: "responding-unit-details",
    style: listStyles.details,
    className: "active-item",
    onClick: function onClick() {
      return handleLoadEntityDetails(entity);
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: listStyles.unitId
  }, entity.unitId), /*#__PURE__*/_react["default"].createElement("div", {
    style: listStyles.personnelName
  }, (0, _map["default"])(_context = entity.personnel).call(_context, function (personnel, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: listStyles.personnelDiv,
      key: "responding_unit_personnel_".concat(index)
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Person, null), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        marginTop: 8
      }
    }, personnel.name));
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: dir == "rtl" ? {
      marginRight: "auto"
    } : {
      marginLeft: "auto"
    }
  }, entity.status))));
};
var _default = (0, _styles.withStyles)(materialStyles)(RespondingUnit);
exports["default"] = _default;