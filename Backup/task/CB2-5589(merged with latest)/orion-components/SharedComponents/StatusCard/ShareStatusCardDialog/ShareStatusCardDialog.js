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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  open: _propTypes["default"].bool.isRequired,
  closeDialog: _propTypes["default"].func.isRequired,
  cardId: _propTypes["default"].string.isRequired,
  sharedWith: _propTypes["default"].array.isRequired
};
var styles = {
  listItem: {
    backgroundColor: "#41454A",
    height: "60px",
    margin: "8px 0"
  }
};
var ShareStatusCardDialog = function ShareStatusCardDialog(_ref) {
  var open = _ref.open,
    closeDialog = _ref.closeDialog,
    cardId = _ref.cardId,
    sharedWith = _ref.sharedWith;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    orgs = _useState2[0],
    setOrgs = _useState2[1];
  var _useState3 = (0, _react.useState)(sharedWith),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    selectedOrgs = _useState4[0],
    setSelectedOrgs = _useState4[1];
  (0, _react.useEffect)(function () {
    if (open) {
      _clientAppCore.organizationService.getAllOrgsForSharing(function (err, res) {
        if (err) {
          console.log("Error retrieving organizations:", err);
        } else {
          var _context;
          var _orgs = (0, _map["default"])(_context = res.result).call(_context, function (org) {
            return {
              name: org.name,
              orgId: org.orgId
            };
          });
          setOrgs(_orgs);
        }
      });
    }
  }, [open]);
  var handleToggle = function handleToggle(value) {
    return function () {
      var _context2;
      var selected = (0, _includes["default"])(selectedOrgs).call(selectedOrgs, value);
      var newSelected = selected ? (0, _filter["default"])(selectedOrgs).call(selectedOrgs, function (orgId) {
        return orgId !== value;
      }) : (0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(selectedOrgs), [value]);
      setSelectedOrgs(newSelected);
    };
  };
  var cancel = function cancel() {
    setSelectedOrgs(sharedWith);
    closeDialog();
  };
  var save = function save() {
    _clientAppCore.statusBoardService.shareWithOrgs(cardId, selectedOrgs, function (err) {
      if (err) {
        console.log("Error sharing card with organizations:", err);
      } else {
        closeDialog();
      }
    });
  };
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: open,
    confirm: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.shareStatusCardDialog.save"),
      action: function action() {
        return save();
      }
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.shareStatusCardDialog.cancel"),
      action: function action() {
        return cancel();
      }
    },
    title: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.shareStatusCardDialog.title"),
    options: {
      maxWidth: "xs",
      fullWidth: true
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(orgs).call(orgs, function (org) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: org.orgId + "-button",
      style: styles.listItem
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: org.name
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, null, /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
      color: "primary",
      edge: "end",
      checked: (0, _includes["default"])(selectedOrgs).call(selectedOrgs, org.orgId),
      onChange: handleToggle(org.orgId)
    })));
  })));
};
ShareStatusCardDialog.propTypes = propTypes;
var _default = ShareStatusCardDialog;
exports["default"] = _default;