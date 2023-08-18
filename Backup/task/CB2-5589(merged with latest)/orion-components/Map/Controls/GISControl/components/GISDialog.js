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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  open: _propTypes["default"].bool.isRequired,
  error: _propTypes["default"].string,
  success: _propTypes["default"].bool.isRequired,
  isFetching: _propTypes["default"].bool,
  createService: _propTypes["default"].func.isRequired,
  resetRequest: _propTypes["default"].func.isRequired,
  handleClose: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var defaultProps = {
  error: "",
  isFetching: false,
  dir: "ltr"
};
var GISDialog = function GISDialog(_ref) {
  var success = _ref.success,
    resetRequest = _ref.resetRequest,
    handleClose = _ref.handleClose,
    createService = _ref.createService,
    open = _ref.open,
    error = _ref.error,
    isFetching = _ref.isFetching,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)({
      username: "",
      password: "",
      token: ""
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    creds = _useState2[0],
    setCreds = _useState2[1];
  var _useState3 = (0, _react.useState)({
      name: "",
      url: ""
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    newService = _useState4[0],
    setNewService = _useState4[1];
  var _useState5 = (0, _react.useState)("none"),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    authType = _useState6[0],
    setAuthType = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    submitted = _useState8[0],
    setSubmitted = _useState8[1];
  var theme = (0, _styles.useTheme)();
  var isXS = (0, _material.useMediaQuery)(theme.breakpoints.only("xs"));
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevSuccess = usePrevious(success);
  (0, _react.useEffect)(function () {
    if (!prevSuccess && success) {
      handleCloseEvent();
    }
  }, [success]);
  var handleChange = function handleChange(name, field, dynamicSetState) {
    return function (event) {
      var dynamicState = name == "newService" ? newService : creds;
      dynamicSetState(_objectSpread(_objectSpread({}, dynamicState), {}, (0, _defineProperty2["default"])({}, field, event.target.value)));
      setSubmitted(false);
    };
  };
  var handleAuthSelect = function handleAuthSelect(event) {
    setAuthType(event.target.value);
    setCreds({
      username: "",
      password: "",
      token: "",
      submitted: false
    });
  };
  var handleCloseEvent = function handleCloseEvent() {
    setCreds({
      username: "",
      password: ""
    });
    setNewService({
      name: "",
      url: ""
    });
    setAuthType("none");
    setSubmitted(false);
    dispatch(resetRequest());
    handleClose("gisDialog");
  };
  var handleSave = function handleSave() {
    var username = creds.username,
      password = creds.password,
      token = creds.token;
    var name = newService.name,
      url = newService.url;
    dispatch(createService(name, url, username, password, token, authType));
  };
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: open,
    confirm: {
      label: error ? (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.retry") : (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.add"),
      action: handleSave,
      disabled: !newService.name || !newService.url || authType === "login" && (!creds.username || !creds.password) || authType === "token" && !creds.token
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.cancel"),
      action: handleCloseEvent
    },
    requesting: isFetching,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: isXS ? "auto" : 350
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "name",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.fieldLabel.serviceName"),
    value: newService.name,
    handleChange: handleChange("newService", "name", setNewService),
    fullWidth: true,
    autoFocus: true,
    dir: dir,
    inputLabelStyle: {
      fontSize: 14
    }
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "url",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.fieldLabel.esriServiceEndpoint"),
    value: newService.url,
    handleChange: handleChange("newService", "url", setNewService),
    fullWidth: true,
    helperText: (0, _i18n.getTranslation)("global.map.controls.gisDialog.helperText.exampleURL", "http://services.arcgis.com/ArcGIS/rest/services/Port/MapServer"),
    dir: dir,
    inputLabelStyle: {
      fontSize: 14
    }
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "auth-select",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.fieldLabel.authType"),
    handleChange: handleAuthSelect,
    value: authType,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "login",
    value: "login"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.gisDialog.menuItem.login"
  })), /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "token",
    value: "token"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.gisDialog.menuItem.token"
  })), /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "none",
    value: "none"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.gisDialog.menuItem.none"
  }))), authType === "login" && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "username",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.fieldLabel.username"),
    value: creds.username,
    handleChange: handleChange("creds", "username", setCreds),
    fullWidth: true,
    dir: dir,
    inputLabelStyle: {
      fontSize: 14
    }
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "password",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.fieldLabel.password"),
    value: creds.password,
    handleChange: handleChange("creds", "password", setCreds),
    fullWidth: true,
    type: "password",
    dir: dir,
    inputLabelStyle: {
      fontSize: 14
    }
  })), authType === "token" && /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "token",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisDialog.fieldLabel.token"),
    value: creds.token,
    handleChange: handleChange("creds", "token", setCreds),
    fullWidth: true,
    dir: dir,
    inputLabelStyle: {
      fontSize: 14
    }
  }), error && /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    color: "error"
  }, error)));
};
GISDialog.propTypes = propTypes;
GISDialog.defaultProps = defaultProps;
var _default = GISDialog;
exports["default"] = _default;