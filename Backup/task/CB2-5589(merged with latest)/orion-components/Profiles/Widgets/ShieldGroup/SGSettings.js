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
var _shared = require("../shared");
var _styles = require("@mui/styles");
var _ProfileView = _interopRequireDefault(require("./components/ProfileView"));
var _EditView = _interopRequireDefault(require("./components/EditView"));
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _keys = _interopRequireDefault(require("lodash/keys"));
var _each = _interopRequireDefault(require("lodash/each"));
var _map = _interopRequireDefault(require("lodash/map"));
var _filter = _interopRequireDefault(require("lodash/filter"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {};
var propTypes = {
  selectWidget: _propTypes["default"].func,
  updateEvent: _propTypes["default"].func,
  selected: _propTypes["default"].bool.isRequired,
  expanded: _propTypes["default"].bool.isRequired,
  order: _propTypes["default"].number,
  contextId: _propTypes["default"].string.isRequired,
  settings: _propTypes["default"].object,
  pinnedItems: _propTypes["default"].array,
  isPublic: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  selectWidget: null,
  updateEvent: null,
  order: 0,
  settings: {
    points_of_contact: [],
    location_id: "",
    audience_individuals: [],
    audience_districts: [],
    audience_departments: [],
    audience_groups: [],
    shareToCMS: false,
    limited_to_audience: true,
    recurring_notification: false,
    push_disabled: false,
    shape_id: "",
    shape_points: null,
    threadId: ""
  },
  pinnedItems: [],
  isPublic: false,
  dir: "ltr"
};
var SGSettings = function SGSettings(_ref) {
  var selectWidget = _ref.selectWidget,
    selected = _ref.selected,
    expanded = _ref.expanded,
    order = _ref.order,
    updateEvent = _ref.updateEvent,
    canContribute = _ref.canContribute,
    contextId = _ref.contextId,
    settings = _ref.settings,
    pinnedItems = _ref.pinnedItems,
    expandable = _ref.expandable,
    isPublic = _ref.isPublic,
    enabled = _ref.enabled,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)({
      departments: [],
      districts: [],
      groups: [],
      locations: [],
      users: []
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  (0, _react.useEffect)(function () {
    var lookupTypes = (0, _keys["default"])(state);
    (0, _each["default"])(lookupTypes, function (type) {
      _clientAppCore.integrationService.getExternalSystemLookup("secure-share", type, function (err, response) {
        if (err) console.log("ERROR", err);
        if (!response) return;
        var data = response.data;
        if (data) setState(_objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, type, data)));
      });
    });
  }, []);
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("SecureShare Settings"));
  };
  var departments = state.departments,
    districts = state.districts,
    groups = state.groups,
    locations = state.locations,
    users = state.users;
  var zones = (0, _map["default"])((0, _filter["default"])(pinnedItems, function (item) {
    var entityData = item.entityData;
    var geometry = entityData.geometry,
      properties = entityData.properties;
    return geometry ? geometry.type === "Polygon" : properties.type === "Polygon";
  }), function (item) {
    var _item$entityData = item.entityData,
      properties = _item$entityData.properties,
      geometry = _item$entityData.geometry;
    return _objectSpread(_objectSpread({
      id: item.id
    }, properties), geometry);
  });

  // TODO: Add to config and check for enabled
  var display = selected && expanded || !selected && !expanded;
  return display ? /*#__PURE__*/_react["default"].createElement(_shared.BaseWidget, {
    order: order,
    enabled: enabled,
    title: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.main.secureShare"),
    handleExpand: handleExpand,
    expanded: expanded,
    expandable: expandable,
    dir: dir
  }, !expanded || !canContribute ? /*#__PURE__*/_react["default"].createElement(_ProfileView["default"], {
    users: users,
    locations: locations,
    groups: groups,
    districts: districts,
    departments: departments,
    settings: settings,
    zones: zones
  }) : /*#__PURE__*/_react["default"].createElement(_EditView["default"], {
    users: users,
    locations: locations,
    groups: groups,
    districts: districts,
    departments: departments,
    updateEvent: updateEvent,
    contextId: contextId,
    settings: settings,
    zones: zones,
    isPublic: isPublic,
    dir: dir
  })) : /*#__PURE__*/_react["default"].createElement(_react.Fragment, null);
};
SGSettings.propTypes = propTypes;
SGSettings.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(SGSettings);
exports["default"] = _default;