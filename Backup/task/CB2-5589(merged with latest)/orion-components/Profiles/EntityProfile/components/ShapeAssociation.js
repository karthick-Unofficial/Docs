"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("../../../CBComponents");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ShapeAssociation = function ShapeAssociation(_ref) {
  var closeDialog = _ref.closeDialog,
    open = _ref.open,
    dialogData = _ref.dialogData,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var handleClose = function handleClose() {
    dispatch(closeDialog("shape-association"));
  };
  var rules;
  var styles = {
    body: _objectSpread(_objectSpread({
      margin: "15px"
    }, dir === "ltr" && {
      textAlign: "left"
    }), dir === "rtl" && {
      textAlign: "right"
    }),
    rule: {
      paddingTop: "12px"
    }
  };

  // Prevent null pointer
  if (open) {
    rules = dialogData.rules;
  }
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    key: "shape-association",
    open: open,
    confirm: {
      label: (0, _i18n.getTranslation)("global.profiles.entityProfile.shapeAssoc.ok"),
      action: handleClose
    }
  }, open && dialogData.action === "delete" ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b3",
    style: styles.body
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: {
      fontWeight: "bold"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.entityProfile.shapeAssoc.cannotDelete"
  })), rules && (0, _map["default"])(rules).call(rules, function (item, idx) {
    return /*#__PURE__*/_react["default"].createElement("p", {
      style: styles.rule,
      key: idx
    }, item);
  }))) : /*#__PURE__*/_react["default"].createElement("div", null), open && dialogData.action === "hide" ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b3",
    style: styles.body
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: {
      fontWeight: "bold"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.entityProfile.shapeAssoc.cannotBeHidden"
  })), rules && (0, _map["default"])(rules).call(rules, function (item, idx) {
    return /*#__PURE__*/_react["default"].createElement("p", {
      style: styles.rule,
      key: idx
    }, item);
  }))) : /*#__PURE__*/_react["default"].createElement("div", null));
};
ShapeAssociation.propTypes = {
  dialog: _propTypes["default"].string,
  dialogData: _propTypes["default"].any
};
var _default = ShapeAssociation;
exports["default"] = _default;