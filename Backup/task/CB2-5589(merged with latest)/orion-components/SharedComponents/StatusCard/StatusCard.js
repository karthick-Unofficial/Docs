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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _moment = _interopRequireDefault(require("moment"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _iconsMaterial = require("@mui/icons-material");
var _StatusCardDialog = _interopRequireDefault(require("./StatusCardDialog/StatusCardDialog"));
var _ShareStatusCardDialog = _interopRequireDefault(require("./ShareStatusCardDialog/ShareStatusCardDialog"));
var _Selector = _interopRequireDefault(require("./StatusControls/Selector"));
var _Slides = _interopRequireDefault(require("./StatusControls/Slides"));
var _Text = _interopRequireDefault(require("./StatusControls/Text"));
var _i18n = require("orion-components/i18n");
var _SvgIcon = _interopRequireDefault(require("@mui/material/SvgIcon"));
var _js = require("@mdi/js");
var _material = require("@mui/material");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  card: _propTypes["default"].object.isRequired,
  index: _propTypes["default"].number.isRequired,
  setEditingMode: _propTypes["default"].func.isRequired,
  disableControls: _propTypes["default"].bool.isRequired,
  disableMenu: _propTypes["default"].bool,
  userCanEdit: _propTypes["default"].bool.isRequired,
  userCanShare: _propTypes["default"].bool.isRequired,
  dir: _propTypes["default"].string,
  locale: _propTypes["default"].string
};
var StatusCard = function StatusCard(_ref) {
  var _context4;
  var card = _ref.card,
    setEditingMode = _ref.setEditingMode,
    disableControls = _ref.disableControls,
    disableMenu = _ref.disableMenu,
    userCanEdit = _ref.userCanEdit,
    userCanShare = _ref.userCanShare,
    dir = _ref.dir,
    locale = _ref.locale;
  var name = card.name;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    editMode = _useState2[0],
    setEditMode = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    shareMode = _useState4[0],
    setShareMode = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    anchorEl = _useState6[0],
    setAnchorEl = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    forceUpdate = _useState8[0],
    setForceUpdate = _useState8[1];

  // Ensure click event on buttons, icons, etc do not activate
  // the draggable grid 'drag' event
  var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
  };
  var toggleEditMode = function toggleEditMode() {
    if (setEditingMode) setEditingMode(!editMode);
    setEditMode(!editMode);
    setAnchorEl(null);
  };
  var toggleShareMode = function toggleShareMode() {
    setShareMode(!shareMode);
    setAnchorEl(null);
  };
  var updateSelected = function updateSelected(dataIndex) {
    return function (selectedIndex) {
      _clientAppCore.statusBoardService.updateSelectedIndex(card.id, dataIndex, selectedIndex, function (err) {
        if (err) {
          console.log("Error", err);
        }
        setForceUpdate(!forceUpdate);
      });
    };
  };
  var styles = {
    container: {
      height: "100%",
      backgroundColor: "rgb(73, 77, 83)",
      position: "relative",
      borderRadius: 7
    },
    topBar: {
      cursor: "grab",
      backgroundColor: "rgb(65, 69, 74)",
      display: "flex",
      alignItems: "center",
      position: "relative",
      padding: "4px",
      height: "55px"
    },
    headerDiv: {
      width: "100%",
      wordBreak: "break-all",
      height: "100%"
    },
    header: {
      color: "white",
      textAlign: "center",
      verticalAlign: "middle",
      fontSize: "16px",
      overflow: "hidden"
    },
    contentArea: {
      height: "100%",
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      padding: "10px 0"
    },
    updatedText: _objectSpread(_objectSpread({
      color: "#B5B9BE",
      lineHeight: "1.5",
      fontSize: 12
    }, dir === "rtl" && {
      marginRight: "1rem"
    }), dir === "ltr" && {
      marginLeft: "1rem"
    }),
    bottomBar: {
      backgroundColor: "#494D53",
      display: "flex",
      height: "36px",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "0 25px",
      marginTop: "5px"
    },
    iconButton: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      padding: "6px",
      marginLeft: "15px"
    }), dir === "ltr" && {
      padding: "6px",
      marginRight: "15px"
    }), {}, {
      color: "#fff"
    }),
    typography: _objectSpread(_objectSpread({
      color: "#B5B9BE",
      fontSize: 12
    }, dir === "rtl" && {
      marginRight: "1rem"
    }), dir === "ltr" && {
      marginLeft: "1rem"
    }),
    statusCardTitle: _objectSpread(_objectSpread({
      width: "calc(100% - 110px)"
    }, dir === "rtl" && {
      marginRight: "auto"
    }), dir === "ltr" && {
      marginLeft: "auto"
    }),
    textAlignRight: _objectSpread({
      margin: "0 20px"
    }, dir === "rtl" && {
      textAlign: "right"
    })
  };
  var getControlComponent = function getControlComponent(type, statusControl, index, dir) {
    var _context, _context2, _context3;
    switch (type) {
      case "selector":
        return /*#__PURE__*/_react["default"].createElement(_Selector["default"], {
          key: (0, _concat["default"])(_context = "".concat(card.id, "-")).call(_context, index),
          control: statusControl,
          updateSelected: updateSelected(index),
          dir: dir
        });
      case "slides":
        return /*#__PURE__*/_react["default"].createElement(_Slides["default"], {
          key: (0, _concat["default"])(_context2 = "".concat(card.id, "-")).call(_context2, index),
          control: statusControl,
          updateSelected: updateSelected(index),
          disableControls: disableControls || !userCanEdit,
          dir: dir,
          forceUpdate: forceUpdate
        });
      case "text":
        return /*#__PURE__*/_react["default"].createElement(_Text["default"], {
          key: (0, _concat["default"])(_context3 = "".concat(card.id, "-")).call(_context3, index),
          control: statusControl,
          dir: dir,
          id: card.id
        });
      default:
        break;
    }
  };
  _moment["default"].relativeTimeThreshold("h", 24);
  var handleExpandMenu = function handleExpandMenu(e) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  var handleCloseMenu = function handleCloseMenu() {
    setAnchorEl(null);
  };
  var handlePopoverClick = function handlePopoverClick(e) {
    // -- stop propagation outside the popover
    e.stopPropagation();
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "status-card-container",
    style: styles.container
  }, /*#__PURE__*/_react["default"].createElement("section", {
    style: styles.contentArea
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.statusCardTitle
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "status-card-header-div",
    style: styles.headerDiv
  }, /*#__PURE__*/_react["default"].createElement("p", {
    style: styles.header
  }, name))), !disableControls && !disableMenu ? /*#__PURE__*/_react["default"].createElement(_IconButton["default"], {
    className: "status-card-button card-button-share",
    style: styles.iconButton,
    onClick: handleExpandMenu,
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation
  }, /*#__PURE__*/_react["default"].createElement(_SvgIcon["default"], {
    style: styles.controlButtons
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiDotsHorizontal
  }))) : /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "42px"
    }
  }), (0, _map["default"])(_context4 = card.data).call(_context4, function (statusControl, idx) {
    var Component = getControlComponent(statusControl.type, statusControl, idx, dir);
    return Component;
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.bottomBar
  }, disableControls ? /*#__PURE__*/_react["default"].createElement(_Typography["default"], {
    variant: "body1",
    style: styles.typography
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.statusCard.main.sharedFrom",
    count: card.ownerOrgName
  })) : /*#__PURE__*/_react["default"].createElement("div", null), card.lastUpdatedBy ? /*#__PURE__*/_react["default"].createElement("p", {
    style: styles.updatedText
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.statusCard.main.changed",
    count: (0, _moment["default"])(card.lastUpdateDate).locale(locale).fromNow()
  }), /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.statusCard.main.by",
    count: card.lastUpdatedBy
  })) : null)), /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    open: !!anchorEl,
    anchorEl: anchorEl,
    anchorOrigin: {
      vertical: "top",
      horizontal: dir === "rtl" ? "left" : "right"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: dir === "rtl" ? "left" : "right"
    },
    onClose: handleCloseMenu,
    onClick: handlePopoverClick,
    style: {
      borderRadius: "0"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: {
      background: "#4A4D52"
    }
  }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, userCanEdit && !disableControls && /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: toggleEditMode
  }, /*#__PURE__*/_react["default"].createElement(_SvgIcon["default"], {
    style: styles.controlButtons
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiPencil
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.main.editCard"),
    style: styles.textAlignRight
  })), !disableControls && userCanShare && /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    style: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16
    },
    onClick: toggleShareMode
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Share, {
    style: {
      color: card.sharedWith.length ? "#4eb5f3" : "#fff"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.sharedComponents.statusCard.main.share"),
    style: styles.textAlignRight
  }))))), /*#__PURE__*/_react["default"].createElement(_StatusCardDialog["default"], {
    open: editMode,
    closeDialog: toggleEditMode,
    card: card,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_ShareStatusCardDialog["default"], {
    open: shareMode,
    closeDialog: toggleShareMode,
    cardId: card.id,
    sharedWith: card.sharedWith
  }));
};
StatusCard.propTypes = propTypes;
var _default = StatusCard;
exports["default"] = _default;