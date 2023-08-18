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
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _HealthService = _interopRequireDefault(require("./HealthService/HealthService"));
var _ConfigService = _interopRequireDefault(require("./ConfigService/ConfigService"));
var _SystemNotificationService = _interopRequireDefault(require("./SystemNotificationService/SystemNotificationService"));
var _ApplicationProfileService = _interopRequireDefault(require("./ApplicationProfile/ApplicationProfileService"));
var _StatusCardService = _interopRequireDefault(require("./StatusCardService/StatusCardService"));
var actionCreators = _interopRequireWildcard(require("./servicesActions.js"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var Services = function Services(_ref) {
  var exclude = _ref.exclude,
    children = _ref.children;
  if (!exclude) exclude = [];
  var dispatch = (0, _reactRedux.useDispatch)();
  var servicesReady = actionCreators.servicesReady;
  var _useState = (0, _react.useState)((0, _indexOf["default"])(exclude).call(exclude, "config") >= 0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    configReady = _useState2[0],
    setConfigReady = _useState2[1];
  var _useState3 = (0, _react.useState)((0, _indexOf["default"])(exclude).call(exclude, "applicationProfile") >= 0),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    applicationProfileReady = _useState4[0],
    setApplicationProfileReady = _useState4[1];
  (0, _react.useEffect)(function () {
    if (configReady && applicationProfileReady) {
      dispatch(servicesReady());
    }
  }, [configReady, applicationProfileReady]);
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, (0, _indexOf["default"])(exclude).call(exclude, "health") < 0 && /*#__PURE__*/_react["default"].createElement(_HealthService["default"], null), (0, _indexOf["default"])(exclude).call(exclude, "config") < 0 && /*#__PURE__*/_react["default"].createElement(_ConfigService["default"], {
    setReady: function setReady() {
      return setConfigReady(true);
    }
  }), (0, _indexOf["default"])(exclude).call(exclude, "applicationProfile") < 0 && /*#__PURE__*/_react["default"].createElement(_ApplicationProfileService["default"], {
    setReady: function setReady() {
      return setApplicationProfileReady(true);
    }
  }), (0, _indexOf["default"])(exclude).call(exclude, "systemNotification") < 0 && /*#__PURE__*/_react["default"].createElement(_SystemNotificationService["default"], null), (0, _indexOf["default"])(exclude).call(exclude, "statusCards") < 0 && /*#__PURE__*/_react["default"].createElement(_StatusCardService["default"], null), children);
};
var _default = Services;
exports["default"] = _default;