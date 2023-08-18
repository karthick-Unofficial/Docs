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
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _index = require("../../../CBComponents/index");
var _filter2 = _interopRequireDefault(require("lodash/filter"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var EventShareDialog = function EventShareDialog(_ref) {
  var event = _ref.event,
    user = _ref.user,
    closeDialog = _ref.closeDialog,
    shareEvent = _ref.shareEvent,
    publishEvent = _ref.publishEvent,
    dialog = _ref.dialog,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(event.sharedWith),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    sharedWith = _useState2[0],
    setSharedWith = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    orgs = _useState4[0],
    setOrgs = _useState4[1];
  (0, _react.useEffect)(function () {
    _clientAppCore.organizationService.getAllOrgsForSharing(function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      var orgs = (0, _filter2["default"])(response.result, function (org) {
        return org.orgId !== user.orgId;
      });
      setOrgs(orgs);
    });
  }, []);
  var handleClosePublishDialog = function handleClosePublishDialog() {
    dispatch(closeDialog("eventPublishDialog"));
  };
  var handleCloseShareDialog = function handleCloseShareDialog() {
    dispatch(closeDialog("eventShareDialog"));
    var sharedWith = event.sharedWith;
    setSharedWith(sharedWith);
  };
  var handleConfirmShare = function handleConfirmShare() {
    dispatch(shareEvent(event.id, sharedWith));
    dispatch(closeDialog("eventShareDialog"));
  };

  // Move to next dialog after first is confirmed
  var handleConfirmPublish = function handleConfirmPublish(id) {
    // Publish to org
    dispatch(publishEvent(id));
    handleClosePublishDialog();
  };
  var handleShareToggle = function handleShareToggle(orgId) {
    var _context;
    (0, _includes["default"])(sharedWith).call(sharedWith, orgId) ? setSharedWith((0, _filter["default"])(sharedWith).call(sharedWith, function (org) {
      return org !== orgId;
    })) : setSharedWith((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(sharedWith), [orgId]));
  };
  var sharePromptText = event.isTemplate ? (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.sharePromptTemplate") : (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.sharePromptEvent");
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_index.Dialog, {
    open: dialog === "eventPublishDialog",
    confirm: {
      label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.confirm"),
      action: function action() {
        return handleConfirmPublish(event.id);
      }
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.cancel"),
      action: handleClosePublishDialog
    },
    title: sharePromptText,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_index.Dialog, {
    open: dialog === "eventShareDialog",
    confirm: {
      label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.confirm"),
      action: handleConfirmShare,
      disabled: orgs.length < 1
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.cancel"),
      action: handleCloseShareDialog
    },
    title: orgs.length >= 1 ? (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.shareTitle", event.name) : (0, _i18n.getTranslation)("global.profiles.eventProfile.eventShareDialog.noOrganizations"),
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(orgs).call(orgs, function (org) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: org.orgId
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: org.name,
      primaryTypographyProps: {
        noWrap: true
      },
      style: dir == "rtl" ? {
        textAlign: "right"
      } : {}
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
      style: dir == "rtl" ? {
        right: "unset",
        left: 16
      } : {}
    }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
      color: "primary",
      checked: (0, _includes["default"])(sharedWith).call(sharedWith, org.orgId),
      onChange: function onChange() {
        return handleShareToggle(org.orgId);
      }
    })));
  }))));
};
var _default = /*#__PURE__*/(0, _react.memo)(EventShareDialog);
exports["default"] = _default;