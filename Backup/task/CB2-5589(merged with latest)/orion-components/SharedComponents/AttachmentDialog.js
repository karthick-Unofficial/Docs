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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _i18n = require("orion-components/i18n");
var _filter = _interopRequireDefault(require("lodash/filter"));
var _includes = _interopRequireDefault(require("lodash/includes"));
var _map = _interopRequireDefault(require("lodash/map"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var RowEdit = function RowEdit(_ref) {
  var row = _ref.row,
    list = _ref.list,
    handleCloseDialog = _ref.handleCloseDialog,
    dialogRef = _ref.dialogRef,
    dialog = _ref.dialog,
    dir = _ref.dir;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    attachments = _useState2[0],
    setAttachments = _useState2[1];
  var theme = (0, _styles.useTheme)();
  var isXS = (0, _material.useMediaQuery)(theme.breakpoints.only("xs"));
  var attachmentRef = (0, _react.useRef)([]);
  (0, _react.useEffect)(function () {
    if (row) {
      _clientAppCore.attachmentService.subscribeByTarget(list.id, function (err, response) {
        var _context, _context2;
        if (err) console.log(err);
        if (response) {
          switch (response.type) {
            case "initial":
            case "add":
              attachmentRef.current = (0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(attachmentRef.current), [response.new_val]);
              setAttachments((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(attachments), [response.new_val]));
              break;
            case "remove":
              attachmentRef.current = (0, _filter["default"])(attachmentRef.current, function (attachment) {
                return attachment.fileId !== response.old_val.fileId;
              });
              setAttachments((0, _filter["default"])(attachments, function (attachment) {
                return attachment.fileId !== response.old_val.fileId;
              }));
              break;
            default:
              break;
          }
        }
      });
    }
  }, []);
  var handleClose = function handleClose() {
    handleCloseDialog(dialogRef);
  };
  var rowAttachments = (0, _filter["default"])(attachmentRef.current, function (attachment) {
    return (0, _includes["default"])(row.attachments, attachment.fileId);
  });

  // Prevent Edit and Add dialog from rendering simultaneously
  return dialog === dialogRef ? /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    key: "attachment-dialog",
    open: dialog === dialogRef,
    confirm: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.attachmentDialog.close"),
      action: handleClose
    },
    title: (0, _i18n.getTranslation)("global.sharedComponents.attachmentDialog.title"),
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: isXS ? "auto" : 350
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      paddingTop: 24
    }
  }, (0, _map["default"])(rowAttachments, function (attachment) {
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.FileLink, {
      key: attachment.fileId,
      attachment: attachment
      //handleDeleteFile={handleDeleteFile}-- no definition
      ,
      canEdit: false,
      dir: dir
    });
  })))) : null;
};
var _default = RowEdit;
exports["default"] = _default;