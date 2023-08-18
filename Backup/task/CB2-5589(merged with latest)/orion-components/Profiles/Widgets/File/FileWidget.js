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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _PhoenixDropzone = _interopRequireDefault(require("./components/PhoenixDropzone"));
var _CBComponents = require("orion-components/CBComponents");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var FileWidget = function FileWidget(_ref) {
  var _context, _context2;
  var contextId = _ref.contextId,
    unsubscribeFromFeed = _ref.unsubscribeFromFeed,
    subscriberRef = _ref.subscriberRef,
    isPrimary = _ref.isPrimary,
    selectWidget = _ref.selectWidget,
    entityType = _ref.entityType,
    attachments = _ref.attachments,
    attachFiles = _ref.attachFiles,
    hasAccess = _ref.hasAccess,
    canDelete = _ref.canDelete,
    enabled = _ref.enabled,
    order = _ref.order,
    selected = _ref.selected,
    widgetsExpandable = _ref.widgetsExpandable,
    widgetsLaunchable = _ref.widgetsLaunchable,
    readOnly = _ref.readOnly,
    isAlertProfile = _ref.isAlertProfile,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var styles = {
    widgetExpandButton: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "ltr" && {
      paddingRight: 0
    }), dir === "rtl" && {
      paddingLeft: 0
    })
  };
  (0, _react.useEffect)(function () {
    return function () {
      if (!isPrimary && unsubscribeFromFeed) dispatch(unsubscribeFromFeed(contextId, "attachments", subscriberRef));
    };
  }, []);
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Files"));
  };
  var handleLaunch = function handleLaunch() {
    // -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
    if (entityType === "event") {
      window.open("/events-app/#/entity/".concat(contextId, "/widget/files"));
    } else if (entityType === "camera") {
      window.open("/cameras-app/#/entity/".concat(contextId, "/widget/files"));
    } else if (entityType === "facility") {
      window.open("/facilities-app/#/entity/".concat(contextId));
    }
  };
  var handleDeleteFile = function handleDeleteFile(id) {
    _clientAppCore.attachmentService.removeAttachment(contextId, entityType, id, function (err, result) {
      if (err) console.log(err, result);
    });
  };
  return !enabled || selected ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("section", {
    className: "collapsed ".concat("index-" + order, " widget-wrapper")
  }, !isAlertProfile && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.files.title"
  })), hasAccess && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button"
  }, /*#__PURE__*/_react["default"].createElement(_PhoenixDropzone["default"], {
    targetEntityId: contextId,
    targetEntityType: entityType,
    attachAction: attachFiles
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, widgetsExpandable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))) : null, widgetsLaunchable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: styles.widgetExpandButton,
    onClick: handleLaunch
  }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null))) : null)), attachments !== undefined && attachments.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content ep-files"
  }, (0, _map["default"])(_context = (0, _sort["default"])(_context2 = (0, _sort["default"])(attachments).call(attachments, function (a, b) {
    var _context3, _context4;
    if (!(0, _includes["default"])(_context3 = a.mimeType).call(_context3, "image") && (0, _includes["default"])(_context4 = b.mimeType).call(_context4, "image")) {
      return 1;
    } else {
      return -1;
    }
  })).call(_context2, function (a, b) {
    if (a.createdDate < b.createdDate) {
      return 1;
    } else {
      return -1;
    }
  })).call(_context, function (attachment, index) {
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.FileLink, {
      key: index,
      attachment: attachment,
      canEdit: !readOnly && canDelete,
      handleDeleteFile: handleDeleteFile,
      entityType: entityType,
      dir: dir
    });
  })) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: 12,
      color: "#fff"
    },
    align: "center",
    variant: "caption",
    component: "p"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.files.noAssocFiles"
  })));
};
var _default = /*#__PURE__*/(0, _react.memo)(FileWidget, function (prevProps, nextProps) {
  return (0, _isEqual["default"])(prevProps, nextProps);
});
exports["default"] = _default;