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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("../../../CBComponents");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _lodash = _interopRequireDefault(require("lodash"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var GenericDetailsWidget = function GenericDetailsWidget(_ref) {
  var kvPairs = _ref.kvPairs,
    displayProps = _ref.displayProps;
  var applyDisplayProps = function applyDisplayProps(kvPairs, displayProps) {
    var kvPairsReplaced = (0, _map["default"])(kvPairs).call(kvPairs, function (pair) {
      if (displayProps[pair.key]) {
        pair.key = displayProps[pair.key];
      }
      return pair;
    });
    return kvPairsReplaced;
  };
  var kvpDisplayProps = kvPairs;
  if (displayProps) {
    kvpDisplayProps = applyDisplayProps(kvPairs, displayProps);
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "details-widget"
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.KvpDisplay, {
    keyValuePairs: kvpDisplayProps
  }));
};
GenericDetailsWidget.propTypes = {
  kvPairs: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    key: _propTypes["default"].string,
    value: _propTypes["default"].string
  })).isRequired,
  displayProps: _propTypes["default"].object
};
GenericDetailsWidget.defaultProps = {
  kvPairs: [{
    key: "",
    value: ""
  }]
};
var onPropsChange = function onPropsChange(prevProps, nextProps) {
  if (!(0, _lodash["default"])(prevProps.kvPairs).xorWith(nextProps.kvPairs, _reactFastCompare["default"]).isEmpty() || !prevProps.displayProps.isEqual(nextProps.displayProps)) {
    return false;
  }
  return true;
};
var _default = /*#__PURE__*/(0, _react.memo)(GenericDetailsWidget, onPropsChange);
exports["default"] = _default;