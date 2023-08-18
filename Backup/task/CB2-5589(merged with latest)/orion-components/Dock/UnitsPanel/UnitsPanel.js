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
exports["default"] = exports.UnitsPanelContext = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _Units = _interopRequireDefault(require("orion-components/Units/Units"));
var _clientAppCore = require("client-app-core");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var UnitsPanelContext = /*#__PURE__*/(0, _react.createContext)();
exports.UnitsPanelContext = UnitsPanelContext;
var UnitsPanel = function UnitsPanel(_ref) {
  var unitSettings = _ref.unitSettings,
    dir = _ref.dir;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitStatusTypes = _useState2[0],
    setUnitStatusTypes = _useState2[1];
  var getUnitsData = (0, _Selectors.getUnits)();
  var units = (0, _reactRedux.useSelector)(function (state) {
    return getUnitsData(state);
  });
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    memberRoleTypes = _useState4[0],
    setMemberRoleTypes = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    countryCodesArray = _useState6[0],
    setCountryCodesArray = _useState6[1];
  (0, _react.useEffect)(function () {
    getUnitStatusTypes();
    getUnitMemberRoleTypes();
    getCountryCodes();
  }, []);
  var getUnitMemberRoleTypes = function getUnitMemberRoleTypes() {
    _clientAppCore.unitService.getUnitMemberRoleTypes(function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      } else {
        setMemberRoleTypes(response);
      }
    });
  };
  var getUnitStatusTypes = function getUnitStatusTypes() {
    _clientAppCore.unitService.getUnitStatusTypes(function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      } else {
        setUnitStatusTypes(response);
      }
    });
  };
  var getCountryCodes = function getCountryCodes() {
    _clientAppCore.unitService.getAppSettingsByKey("units-app", "countryCodes", function (err, response) {
      if (err) {
        console.log("ERROR:", err);
      } else {
        if (response.value) {
          setCountryCodesArray(response.value);
        }
      }
    });
  };
  var styles = {
    container: {
      overflow: "scroll",
      height: "calc(100% - 80px)",
      width: "90%",
      margin: "auto"
    },
    title: _objectSpread({
      fontWeight: 600,
      // Medium
      fontSize: "14px",
      color: "#fff",
      padding: "4px 6px"
    }, dir === "rtl" && {
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(UnitsPanelContext.Provider, {
    value: {
      memberRoleTypes: memberRoleTypes,
      unitStatusTypes: unitStatusTypes,
      countryCodesArray: countryCodesArray
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.container
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    style: styles.title
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.dock.unitsPanel.title"
  })), unitSettings && unitSettings.length > 0 ? /*#__PURE__*/_react["default"].createElement(_Units["default"], {
    feedSettings: unitSettings,
    units: units,
    memberRoleTypes: memberRoleTypes
  }) : null));
};
var _default = UnitsPanel;
exports["default"] = _default;