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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _CameraCard = _interopRequireDefault(require("../Cameras/components/CameraCard"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _index = require("orion-components/Dock/Actions/index.js");
var _Selectors = require("orion-components/ContextPanel/Selectors");
var _isObject = _interopRequireDefault(require("lodash/isObject"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context6, _context7; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context6 = ownKeys(Object(source), !0)).call(_context6, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context7 = ownKeys(Object(source))).call(_context7, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  camera: _propTypes["default"].object.isRequired,
  expanded: _propTypes["default"].bool,
  enabled: _propTypes["default"].bool,
  dockedCameras: _propTypes["default"].array,
  sidebarOpen: _propTypes["default"].bool,
  subscriberRef: _propTypes["default"].string,
  selectWidget: _propTypes["default"].func,
  unsubscribeFromFeed: _propTypes["default"].func,
  addCameraToDockMode: _propTypes["default"].func,
  widgetsExpandable: _propTypes["default"].bool,
  order: _propTypes["default"].number,
  selected: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  expanded: false,
  enabled: true,
  dockedCameras: [],
  sidebarOpen: false,
  subscriberRef: "profile",
  selectWidget: function selectWidget() {},
  unsubscribeFromFeed: function unsubscribeFromFeed() {},
  addCameraToDockMode: function addCameraToDockMode() {},
  widgetsExpandable: false,
  order: 0,
  selected: false,
  dir: "ltr"
};
var LiveCameraWidget = function LiveCameraWidget(_ref) {
  var _context, _context2, _context3, _context4, _context5;
  var camera = _ref.camera,
    unsubscribeFromFeed = _ref.unsubscribeFromFeed,
    subscriberRef = _ref.subscriberRef,
    expanded = _ref.expanded,
    selectWidget = _ref.selectWidget,
    contextId = _ref.contextId,
    entityType = _ref.entityType,
    selected = _ref.selected,
    order = _ref.order,
    enabled = _ref.enabled,
    widgetsExpandable = _ref.widgetsExpandable,
    widgetsLaunchable = _ref.widgetsLaunchable,
    sidebarOpen = _ref.sidebarOpen,
    dockedCameras = _ref.dockedCameras,
    removeDockedCamera = _ref.removeDockedCamera,
    fullscreenCamera = _ref.fullscreenCamera,
    addCameraToDockMode = _ref.addCameraToDockMode,
    readOnly = _ref.readOnly,
    user = _ref.user,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.selectedContextSelector)(state);
  });
  var entity = context.entity;
  var appState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState;
  });
  var isLoaded = (0, _isObject["default"])(context) && !!entity;
  var dialog = isLoaded && appState.dialog.openDialog;
  var styles = {
    widgetExpandButton: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    })
  };
  (0, _react.useEffect)(function () {
    return function () {
      var id = camera.id;
      if (!expanded) dispatch(unsubscribeFromFeed(id, "liveCamera", subscriberRef));
    };
  }, []);
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Live Camera"));
  };
  var handleLaunch = function handleLaunch() {
    // -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
    if (entityType === "camera") {
      window.open("/cameras-app/#/entity/".concat(contextId, "/widget/live-camera"));
    }
  };
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: (0, _concat["default"])(_context = "widget-wrapper ".concat(expanded ? "expanded" : "collapsed", " ")).call(_context, "index-" + order, " ")
  }, !expanded && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.liveCam.title"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, widgetsExpandable && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))), widgetsLaunchable && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleLaunch
  }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null))))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, /*#__PURE__*/_react["default"].createElement(_CameraCard["default"], {
    contextId: contextId,
    cameraIndex: 0,
    canUnlink: false,
    entityType: entityType,
    useCameraGeometry: false,
    geometry: null,
    loadProfile: null,
    unlinkCameras: null,
    camera: camera,
    canExpand: false,
    handleCardExpand: function handleCardExpand() {},
    canTarget: false,
    hasMenu: true,
    expanded: true,
    disableSlew: true,
    sidebarOpen: sidebarOpen,
    dockedCameras: dockedCameras,
    addCameraToDockMode: addCameraToDockMode,
    removeDockedCamera: removeDockedCamera,
    dialog: dialog,
    readOnly: readOnly,
    canControl: !readOnly && user && user.integrations && (0, _find["default"])(_context2 = user.integrations).call(_context2, function (_int) {
      return _int.intId === camera.feedId;
    }) && (0, _find["default"])(_context3 = user.integrations).call(_context3, function (_int2) {
      return _int2.intId === camera.feedId;
    }).permissions && (0, _includes["default"])(_context4 = (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int3) {
      return _int3.intId === camera.feedId;
    }).permissions).call(_context4, "control"),
    subscriberRef: subscriberRef,
    setCameraPriority: _index.setCameraPriority,
    fullscreenCamera: fullscreenCamera,
    dir: dir
  })));
};
LiveCameraWidget.propTypes = propTypes;
LiveCameraWidget.defaultProps = defaultProps;
var _default = LiveCameraWidget;
exports["default"] = _default;