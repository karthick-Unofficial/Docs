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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _SharedComponents = require("../../SharedComponents");
var _reactRedux = require("react-redux");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var PinnedItem = function PinnedItem(_ref) {
  var loadProfile = _ref.loadProfile,
    entity = _ref.entity,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();

  // shouldComponentUpdate(nextProps, nextState) {
  // 	const entity = this.props.entity;
  // 	const nextEntity = nextProps.entity;
  // 	const id = this.props.entity.id;
  // 	const nextId = nextProps.entity.id;
  // 	const target = this.props.targetIcon;
  // 	const nextTarget = nextProps.targetIcon;

  // 	// If new item, rerender
  // 	// If new name, rerender
  // 	// If targeting icon becomes null, rerender
  // 	// If targeting icon becomes component from null, rerender
  // 	if (
  // 		nextId !== id ||
  // 		nextEntity.entityData.properties.name !==
  // 			entity.entityData.properties.name ||
  // 		(target === null && nextTarget !== null) ||
  // 		(target !== null && nextTarget === null)
  // 	) {
  // 		return true;
  // 	}

  // 	return false;
  // }

  var loadEntityData = function loadEntityData(event, entity) {
    event.stopPropagation();
    switch (entity.entityType) {
      case "track":
      case "shapes":
        dispatch(loadProfile(entity.id, entity.entityData.properties.name, entity.entityType, "profile"));
        break;
      case "camera":
        dispatch(loadProfile(entity.id, entity.entityData.properties.name, "camera", "profile"));
        break;
      default:
        break;
    }
  };
  var style = _objectSpread(_objectSpread(_objectSpread({
    marginBottom: ".75rem",
    backgroundColor: "#41454A",
    width: "90%"
  }, dir === "ltr" && {
    marginLeft: "10%"
  }), dir === "rtl" && {
    marginRight: "10%"
  }), {}, {
    padding: "none"
  });
  var targetIcon = /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    id: entity.id,
    feedId: entity.feedId
  });
  return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    key: entity.id,
    style: style,
    onClick: function onClick(e) {
      return loadEntityData(e, entity);
    },
    primaryText: entity.entityData.properties.name,
    secondaryText: entity.entityData.properties.type,
    leftAvatar: /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
      backgroundColor: "#41454A"
    },
    // Target icon rendered per entity passed down
    targetIcon)
  });
};
var _default = PinnedItem;
exports["default"] = _default;