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
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("../CBComponents");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
var _Selectors = require("orion-components/ContextPanel/Selectors");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  facility: _propTypes["default"].object.isRequired,
  loadProfile: _propTypes["default"].func.isRequired,
  selectedEntity: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var FacilityCard = function FacilityCard(_ref) {
  var facility = _ref.facility,
    loadProfile = _ref.loadProfile;
  var dispatch = (0, _reactRedux.useDispatch)();
  var selectedEntity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.selectedEntityState)(state);
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var id = facility.id,
    entityData = facility.entityData;
  var handleSelect = (0, _react.useCallback)(function () {
    if (entityData.properties) {
      dispatch(loadProfile(id, entityData.properties.name, "facility", "profile"));
    }
  }, [entityData, id, loadProfile]);
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.CollectionItem, {
    item: {
      id: id,
      feedId: facility.feedId ? facility.feedId : "facilities"
    },
    type: "Facility",
    primaryText: entityData.properties.name,
    secondaryText: entityData.properties.description,
    geometry: entityData.geometry,
    handleSelect: handleSelect,
    selected: selectedEntity && selectedEntity.id === facility.id,
    dir: dir
  });
};
FacilityCard.propTypes = propTypes;
var _default = FacilityCard;
exports["default"] = _default;