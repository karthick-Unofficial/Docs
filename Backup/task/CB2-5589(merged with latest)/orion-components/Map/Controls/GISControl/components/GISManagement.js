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
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  open: _propTypes["default"].bool.isRequired,
  handleClose: _propTypes["default"].func.isRequired,
  serviceId: _propTypes["default"].string.isRequired,
  name: _propTypes["default"].string.isRequired,
  properties: _propTypes["default"].object.isRequired,
  updateGISService: _propTypes["default"].func.isRequired,
  deleteGISService: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var GISManagement = function GISManagement(_ref) {
  var properties = _ref.properties,
    authentication = _ref.authentication,
    serviceId = _ref.serviceId,
    handleClose = _ref.handleClose,
    updateGISService = _ref.updateGISService,
    deleteGISService = _ref.deleteGISService,
    open = _ref.open,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(properties),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    propertiesState = _useState2[0],
    setPropertiesState = _useState2[1];
  var _useState3 = (0, _react.useState)(authentication),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    authenticationState = _useState4[0],
    setAuthenticationState = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    state = _useState6[0],
    setState = _useState6[1];
  var theme = (0, _styles.useTheme)();
  var isXS = (0, _material.useMediaQuery)(theme.breakpoints.only("xs"));
  var handleSave = function handleSave() {
    dispatch(updateGISService(serviceId, {
      properties: _objectSpread({}, propertiesState),
      authenticationState: authenticationState
    }));
    handleClose();
  };
  var handleAuthSelect = function handleAuthSelect(event) {
    setAuthenticationState({
      username: "",
      password: "",
      token: "",
      type: event.target.value
    });
  };
  var handleDelete = function handleDelete() {
    dispatch(deleteGISService(serviceId));
    handleClose();
  };
  var handleCancel = function handleCancel() {
    handleClose();
    (0, _setTimeout2["default"])(function () {
      setPropertiesState(properties);
      setAuthenticationState(authentication);
    }, 1000);
  };
  var handleChange = function handleChange(name, field, dynamicSetState) {
    return function (event) {
      var dynamicState = name == "propertiesState" ? setPropertiesState : setAuthenticationState;
      dynamicSetState(_objectSpread(_objectSpread({}, dynamicState), {}, (0, _defineProperty2["default"])({}, field, event.target.value)));
      if (dynamicSetState) {
        dynamicSetState(_objectSpread(_objectSpread({}, name), {}, (0, _defineProperty2["default"])({}, field, event.target.value)));
      } else {
        setState(function (prevState) {
          return _objectSpread(_objectSpread({}, prevState), {}, (0, _defineProperty2["default"])({}, name, _objectSpread(_objectSpread({}, state[name]), {}, (0, _defineProperty2["default"])({}, field, event.target.value))));
        });
      }
    };
  };
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    confirm: {
      label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.save"),
      action: handleSave,
      disabled: (0, _reactFastCompare["default"])(properties, propertiesState) && (0, _reactFastCompare["default"])(authentication, authenticationState)
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.cancel"),
      action: handleCancel
    },
    deletion: {
      label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.delete"),
      action: handleDelete
    },
    open: open,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: isXS ? "auto" : 350
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "gis-rename",
    value: propertiesState.name,
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.fieldLabel.serviceName"),
    handleChange: handleChange("propertiesState", "name", setPropertiesState),
    fullWidth: true,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "url",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.fieldLabel.esriServiceEndpoint"),
    value: propertiesState.endpoint,
    handleChange: handleChange("propertiesState", "endpoint", setPropertiesState),
    fullWidth: true,
    helperText: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.helperText.exampleURL", "http://services.arcgis.com/ArcGIS/rest/services/Port/MapServer"),
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "auth-select",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.fieldLabel.authType"),
    handleChange: handleAuthSelect,
    value: authenticationState.type,
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "login",
    value: "login"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.gisManagement.menuItem.login"
  })), /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "token",
    value: "token"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.gisManagement.menuItem.token"
  })), /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "none",
    value: "none"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.gisManagement.menuItem.none"
  }))), authenticationState.type === "login" && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "username",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.fieldLabel.username"),
    value: authenticationState.username,
    handleChange: handleChange("authenticationState", "username", setAuthenticationState),
    fullWidth: true,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "password",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.fieldLabel.password"),
    value: authenticationState.password,
    handleChange: handleChange("authenticationState", "password", setAuthenticationState),
    fullWidth: true,
    type: "password",
    dir: dir
  })), authenticationState.type === "token" && /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
    id: "token",
    label: (0, _i18n.getTranslation)("global.map.controls.gisControl.gisManagement.fieldLabel.token"),
    value: authenticationState.token,
    handleChange: handleChange("authenticationState", "token", setAuthenticationState),
    fullWidth: true,
    dir: dir
  })));
};
GISManagement.propTypes = propTypes;
var _default = GISManagement;
exports["default"] = _default;