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
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _react = _interopRequireWildcard(require("react"));
var _NotificationsTab = _interopRequireDefault(require("./Notifications/NotificationsTab"));
var _CameraDock = _interopRequireDefault(require("./Cameras/CameraDock"));
var _SystemHealth = _interopRequireDefault(require("./SystemHealth/SystemHealth"));
var _ErrorBoundary = _interopRequireDefault(require("../ErrorBoundary"));
var _ZetronCallingPanel = _interopRequireDefault(require("./CallingPanel/ZetronCallingPanel"));
var _StatusBoard = _interopRequireDefault(require("./StatusBoard/StatusBoard"));
var _UnitsPanel = _interopRequireDefault(require("./UnitsPanel/UnitsPanel"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// components

//Material UI

var propTypes = {
  selectFloorPlanOn: _propTypes["default"].func,
  floorPlansWithFacilityFeed: _propTypes["default"].object
};
var defaultProps = {
  selectFloorPlanOn: function selectFloorPlanOn() {},
  floorPlansWithFacilityFeed: null
};
var Dock = function Dock(_ref) {
  var _context;
  var setTab = _ref.setTab,
    componentState = _ref.componentState,
    map = (0, _map["default"])(_ref),
    readOnly = _ref.readOnly,
    dir = _ref.dir,
    selectFloorPlanOn = _ref.selectFloorPlanOn,
    floorPlansWithFacilityFeed = _ref.floorPlansWithFacilityFeed,
    toggleOpen = _ref.toggleOpen,
    notifications = _ref.notifications,
    unitSettings = _ref.unitSettings,
    statusBoardApp = _ref.statusBoardApp;
  var dispatch = (0, _reactRedux.useDispatch)();

  // TODO: MAKE CONTROLLED AND ADJUST LABEL AND INK BAR STYLES FOR UNSELECTED
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "sidebar-inner-wrapper",
    className: "cf"
  }, /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, componentState.isOpen && /*#__PURE__*/_react["default"].createElement("div", {
    onClick: function onClick() {
      return dispatch(toggleOpen());
    },
    className: "ad-toggle-mobile"
  }, /*#__PURE__*/_react["default"].createElement("a", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: dir && dir == "rtl" ? "close-ad-textRTL" : "close-ad-text"
  }, /*#__PURE__*/_react["default"].createElement(_Close["default"], {
    sx: {
      color: "#FFF"
    }
  })))), componentState.tab === "Notifications" && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "margin-container"
  }, /*#__PURE__*/_react["default"].createElement(_NotificationsTab["default"], {
    map: map,
    notifications: notifications,
    componentState: componentState,
    selectFloorPlanOn: selectFloorPlanOn,
    floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
  }))), componentState.tab === "Cameras" && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_CameraDock["default"], {
    map: map,
    readOnly: readOnly,
    selectFloorPlanOn: selectFloorPlanOn,
    floorPlansWithFacilityFeed: floorPlansWithFacilityFeed
  })), componentState.tab === "System_health" && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_SystemHealth["default"], null)), componentState.tab === "Status_board" && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_StatusBoard["default"], {
    canManage: (0, _includes["default"])(_context = statusBoardApp.permissions).call(_context, "manage")
  })), componentState.tab === "Units_panel" && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_UnitsPanel["default"], {
    unitSettings: unitSettings,
    dir: dir
  })), componentState.tab === "Calling_Panel" && /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_ZetronCallingPanel["default"], null))));
};
Dock.propTypes = propTypes;
Dock.defaultProps = defaultProps;
var _default = /*#__PURE__*/(0, _react.memo)(Dock);
exports["default"] = _default;