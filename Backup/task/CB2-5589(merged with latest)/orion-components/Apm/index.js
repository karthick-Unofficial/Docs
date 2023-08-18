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
_Object$defineProperty(exports, "afterFrame", {
  enumerable: true,
  get: function get() {
    return _apmRumCore.afterFrame;
  }
});
_Object$defineProperty(exports, "apm", {
  enumerable: true,
  get: function get() {
    return _apmRum.apm;
  }
});
_Object$defineProperty(exports, "captureUserInteraction", {
  enumerable: true,
  get: function get() {
    return _userInteraction["default"];
  }
});
exports["default"] = void 0;
_Object$defineProperty(exports, "withSpan", {
  enumerable: true,
  get: function get() {
    return _withSpan["default"];
  }
});
_Object$defineProperty(exports, "withTransaction", {
  enumerable: true,
  get: function get() {
    return _withTransaction["default"];
  }
});
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = require("react");
var _apmRum = require("@elastic/apm-rum");
var _clientAppCore = require("client-app-core");
var _apmRumCore = require("@elastic/apm-rum-core");
var _withTransaction = _interopRequireDefault(require("./withTransaction.js"));
var _withSpan = _interopRequireDefault(require("./withSpan.js"));
var _userInteraction = _interopRequireDefault(require("./userInteraction.js"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var ApmIndex = function ApmIndex(props) {
  var baseConf = {
    serviceName: props.serviceName,
    serverUrl: "https://".concat(window.location.hostname),
    serviceVersion: "1.17.0",
    active: true,
    instrument: true,
    environment: "dev",
    logLevel: "debug",
    transactionSampleRate: 1.0,
    breakdownMetrics: true,
    ignoreTransactions: [/health-reports-with-auth*/],
    propogateTracestate: true,
    disableInstrumentations: ["eventtarget"] //["xmlhttprequest", "fetch"]
  };

  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    serverApmConfig = _useState2[0],
    setServerApmConfig = _useState2[1];
  (0, _react.useEffect)(function () {
    _clientAppCore.applicationService.getApplicationConfig(function (err, response) {
      if (err) console.log("ERROR", err);
      if (!response) return;
      var apm = response.apm;
      setServerApmConfig(_objectSpread(_objectSpread({}, baseConf), apm || {}));
    });
  }, []);
  serverApmConfig && (0, _apmRum.init)(serverApmConfig);
  return props.children;
};
var _default = ApmIndex;
exports["default"] = _default;