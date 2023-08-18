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
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _CBComponents = require("orion-components/CBComponents");
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  attachment: _propTypes["default"].object.isRequired,
  handleDeleteFile: _propTypes["default"].func,
  canEdit: _propTypes["default"].bool,
  entityType: _propTypes["default"].string,
  dir: _propTypes["default"].string
};
var defaultProps = {
  handleDeleteFile: function handleDeleteFile() {},
  canEdit: false
};
var FileLink = function FileLink(_ref) {
  var attachment = _ref.attachment,
    canEdit = _ref.canEdit,
    handleDeleteFile = _ref.handleDeleteFile,
    entityType = _ref.entityType,
    dir = _ref.dir;
  var styles = {
    video: {
      width: "100%"
    },
    imageViewDiv: {
      position: "relative"
    },
    deleteImageButton: _objectSpread(_objectSpread(_objectSpread({
      position: "absolute",
      top: 0
    }, dir === "ltr" && {
      right: 0
    }), dir === "rtl" && {
      left: 0
    }), {}, {
      zIndex: 50,
      color: "rgba(255,255,255,0.7)"
    }),
    defaultImageButton: {
      position: "absolute",
      color: "rgba(255,255,255,0.7)"
    },
    image: {
      width: "100%",
      cursor: "pointer"
    },
    fileListItem: {
      backgroundColor: "#494D53",
      borderRadius: 5
    }
  };
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    stageDelete = _useState4[0],
    setStageDelete = _useState4[1];
  var _useState5 = (0, _react.useState)(),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    fileExt = _useState6[0],
    setFileExt = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    isImage = _useState8[0],
    setIsImage = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    isVideo = _useState10[0],
    setIsVideo = _useState10[1];
  var _useState11 = (0, _react.useState)(),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    mediaSrc = _useState12[0],
    setMediaSrc = _useState12[1];
  (0, _react.useEffect)(function () {
    var mimeType = attachment.mimeType,
      handle = attachment.handle,
      source = attachment.source;
    setFileExt(mimeType ? mimeType.substring((0, _indexOf["default"])(mimeType).call(mimeType, "/") + 1) : "");
    var newIsImage = (0, _includes["default"])(mimeType).call(mimeType, "image");
    var newIsVideo = (0, _includes["default"])(mimeType).call(mimeType, "video");
    setIsImage(newIsImage);
    setIsVideo(newIsVideo);
    var isExternal = source != null && source == "external";
    if (newIsImage || newIsVideo) {
      if (!isExternal) {
        setMediaSrc("/_download?handle=".concat(handle));
      } else {
        setMediaSrc(handle);
      }
    }
    return function () {
      setExpanded(false);
      setStageDelete(false);
    };
  }, [attachment]);
  var setDefault = function setDefault() {
    var fileId = attachment.fileId,
      targetId = attachment.targetId;
    _clientAppCore.attachmentService.updateFile(fileId, targetId);
  };
  var handleStageDelete = function handleStageDelete(e) {
    if (e) {
      e.preventDefault();
    }
    setStageDelete(!stageDelete);
  };
  var handleDelete = function handleDelete() {
    var fileId = attachment.fileId;
    handleDeleteFile(fileId);
    handleStageDelete();
  };
  var videoPlayer = function videoPlayer() {
    return /*#__PURE__*/_react["default"].createElement("video", {
      muted: true,
      autoPlay: true,
      loop: true,
      style: styles.video
    }, /*#__PURE__*/_react["default"].createElement("source", {
      src: mediaSrc,
      type: attachment.mimeType
    }));
  };
  var imageView = function imageView() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: styles.imageViewDiv
    }, canEdit && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      style: styles.deleteImageButton,
      onClick: handleStageDelete
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null)), !attachment.defaultImage && (entityType === "track" || entityType === "shapes") && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      style: styles.defaultImageButton,
      onClick: setDefault
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircle, null)), attachment.defaultImage && (entityType === "track" || entityType === "shapes") && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      disabled: true,
      className: "defaultImg"
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.CheckCircle, null))), /*#__PURE__*/_react["default"].createElement("img", {
      alt: attachment.filename,
      style: styles.image,
      src: mediaSrc,
      onClick: function onClick() {
        return setExpanded(true);
      }
    }));
  };
  var fileView = function fileView() {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      button: true,
      component: "button",
      dense: true,
      key: attachment.fileId,
      href: "/_download?handle=".concat(attachment.handle),
      download: attachment.filename,
      style: _objectSpread(_objectSpread({}, styles.fileListItem), {}, {
        paddingRight: canEdit ? 0 : 16
      })
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
      style: {
        marginRight: 0
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "".concat(fileExt, " generic-fallback fileicon")
    })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      style: {
        paddingLeft: 0
      },
      primary: attachment.filename
    }), canEdit && Boolean(handleDeleteFile) && /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      style: {
        padding: 0
      },
      onClick: function onClick(e) {
        return handleStageDelete(e);
      }
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null))));
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, attachment && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: 12
    }
  }, isVideo ? videoPlayer() : isImage ? imageView() : fileView()), /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    open: expanded,
    maxWidth: "lg"
  }, /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: function onClick() {
      return setExpanded(false);
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Clear, null))), /*#__PURE__*/_react["default"].createElement(_material.DialogContent, {
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement("img", {
    alt: attachment.filename,
    src: mediaSrc,
    style: {
      maxHeight: "80vh"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.DialogActions, null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    fullWidth: true,
    color: "primary",
    href: mediaSrc,
    download: attachment.filename
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBFileLink.downloadImg"
  })))), /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: stageDelete,
    title: (0, _i18n.getTranslation)("global.CBComponents.CBFileLink.dialog.title"),
    textContent: (0, _i18n.getTranslation)("global.CBComponents.CBFileLink.dialog.textContent"),
    confirm: {
      label: (0, _i18n.getTranslation)("global.CBComponents.CBFileLink.dialog.delete"),
      action: handleDelete
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.CBComponents.CBFileLink.dialog.cancel"),
      action: handleStageDelete
    }
  }));
};
FileLink.propTypes = propTypes;
FileLink.defaultProps = defaultProps;
var _default = FileLink;
exports["default"] = _default;