"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/GlobalData/Selectors");
var _FocusEntitiesBound = _interopRequireDefault(require("orion-components/Units/components/FocusEntitiesBound"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _SharedComponents = require("orion-components/SharedComponents");
var _js = require("@mdi/js");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var usePrevious = function usePrevious(value) {
  var ref = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
};
var UnitCard = function UnitCard(_ref) {
  var unit = _ref.unit,
    unitDataId = _ref.unitDataId,
    dir = _ref.dir,
    feedSettings = _ref.feedSettings,
    handleNotify = _ref.handleNotify;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    unitGeometry = _useState2[0],
    setUnitGeometry = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    zoomEntities = _useState4[0],
    setZoomEntities = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    targetIds = _useState6[0],
    setTargetIds = _useState6[1];
  var unitMembers = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.unitMemberSelector)(state, unitDataId, feedSettings);
  });
  var prevUnitMembers = usePrevious(unitMembers);
  var getUnitgeoFromMembers = (0, _react.useCallback)(function () {
    var geoArr = [];
    var unitIdArr = [];
    (0, _forEach["default"])(unitMembers).call(unitMembers, function (member) {
      if (member.geometry && member.geometry.coordinates) {
        var geometry = member.geometry;
        geometry["targetEntityId"] = member.targetEntityId;
        unitIdArr.push(member.targetEntityId);
      }
    });
    setUnitGeometry(geoArr);
    setTargetIds(unitIdArr);
  });

  //zoom entities
  var setFocus = function setFocus() {
    setZoomEntities(true);
    (0, _setTimeout2["default"])(function () {
      setZoomEntities(false);
    }, 3000);
  };
  (0, _react.useEffect)(function () {
    if (!(0, _isEqual["default"])(unitMembers, prevUnitMembers)) {
      getUnitgeoFromMembers();
    }
  }, [unitMembers]);
  var styles = {
    unitCard: _objectSpread(_objectSpread({
      minHeight: 40
    }, dir === "rtl" && {
      direction: "rtl",
      padding: "0 6px 0 10px"
    }), dir === "ltr" && {
      padding: "0 10px 0 6px"
    }),
    unitListItemText: _objectSpread(_objectSpread({}, dir === "rtl" && {
      padding: "0 5px 0 0",
      textAlign: "right"
    }), dir === "ltr" && {
      padding: "0 0 0 5px"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: styles.unitCard
  }, unitGeometry.length > 0 ? /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    setFocus: setFocus,
    geometry: unitGeometry,
    targetIds: targetIds,
    multipleTargets: true
  }) : /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: 48
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: styles.unitListItemText,
    primary: /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: {
        fontSize: 12,
        lineHeight: 1.3
      }
    }, unit.name), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: {
        fontSize: 11,
        lineHeight: 1
      }
    }, unit.locationName)),
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1"
    }
  }), unit.notified ? /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    style: {
      width: "24px",
      height: "24px",
      color: "#378ABC"
    }
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiCheckCircle
  })) : /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    style: {
      textTransform: "none",
      fontSize: 11,
      minWidth: "unset",
      padding: "6px 5px",
      color: "#4BAEE8"
    },
    onClick: function onClick() {
      return handleNotify([unit.recommendationId]);
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.timelineCard.notify"
  }))), zoomEntities && /*#__PURE__*/_react["default"].createElement(_FocusEntitiesBound["default"], {
    items: unitMembers
  }));
};
var _default = UnitCard;
exports["default"] = _default;