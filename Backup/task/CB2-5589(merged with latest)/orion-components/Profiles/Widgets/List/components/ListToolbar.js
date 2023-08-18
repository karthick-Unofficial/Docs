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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _Delete = _interopRequireDefault(require("@mui/icons-material/Delete"));
var _Done = _interopRequireDefault(require("@mui/icons-material/Done"));
var _i18n = require("orion-components/i18n");
var _iconsMaterial = require("@mui/icons-material");
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  root: {
    backgroundColor: "#2C2D2F",
    minWidth: 200
  },
  menuItem: {
    "&:hover": {
      backgroundColor: "#494551"
    }
  }
};
var DeleteMenu = function DeleteMenu(props) {
  var deleteMenuStyles = {
    edit: _objectSpread(_objectSpread(_objectSpread({}, props.dir === "ltr" && {
      marginLeft: "auto"
    }), props.dir === "rtl" && {
      marginRight: "auto"
    }), {}, {
      color: "#828283"
    })
  };
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorEl = _useState2[0],
    setAnchorEl = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    open = _useState4[0],
    setOpen = _useState4[1];
  var handleMenuToggle = function handleMenuToggle(event) {
    setOpen(!open);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  if (props.removing) return /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: function onClick() {
      return props.submitDeleteMode(props.listId);
    },
    style: {
      height: "100%",
      padding: 0
    }
  }, /*#__PURE__*/_react["default"].createElement(_Delete["default"], {
    color: "#6C6C6E"
  }));else if (props.editableRow) return /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_Done["default"], {
    onClick: props.submitAddRow,
    color: "#6C6C6E"
  }));else if (props.canRemove && !props.editTitle) {
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      onClick: handleMenuToggle,
      style: deleteMenuStyles.edit
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.MoreVert, null)), /*#__PURE__*/_react["default"].createElement(_material.Menu, {
      anchorEl: anchorEl,
      MenuListProps: {
        className: props.classes.root
      },
      open: open,
      onClose: handleMenuToggle,
      anchorOrigin: {
        vertical: "top",
        horizontal: "left"
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "right"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      onClick: function onClick() {
        setOpen(false);
        setAnchorEl(null);
        props.toggleDialog("deleteList" + props.listId);
      },
      classes: {
        root: props.classes.menuItem
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: {
        fontSize: "16px"
      },
      color: "inherit"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.list.listToolbar.deleteList"
    }))), /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      onClick: function onClick() {
        setOpen(false);
        setAnchorEl(null);
        props.toggleEditTitle();
      },
      classes: {
        root: props.classes.menuItem
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: {
        fontSize: "16px"
      },
      color: "inherit"
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.list.listToolbar.renameList"
    })))));
  } else return /*#__PURE__*/_react["default"].createElement("div", null);
};
var EditMenu = function EditMenu(props) {
  if (props.editableRow) return /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: props.cancelAddRow
  }, (0, _i18n.getTranslation)("global.profiles.widgets.list.listToolbar.cancel"));else if (props.removing) return /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: props.cancelDeleteMode,
    style: {
      marginTop: 1
    }
  }, (0, _i18n.getTranslation)("global.profiles.widgets.list.listToolbar.cancel"));else if (props.editTitle) return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    style: {
      width: "30%",
      minWidth: 0
    },
    variant: "text",
    color: "primary",
    onClick: props.handleSaveNewTitle
  }, (0, _i18n.getTranslation)("global.profiles.widgets.list.listToolbar.save")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    style: {
      width: "70%",
      minWidth: 0
    },
    variant: "text",
    color: "primary",
    onClick: props.handleCancelRename
  }, (0, _i18n.getTranslation)("global.profiles.widgets.list.listToolbar.cancel")));else return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    style: {
      width: "30%",
      minWidth: 0
    },
    variant: "text",
    color: "primary",
    onClick: function onClick() {
      return props.toggleDialog("rowAdd" + props.listId);
    }
  }, (0, _i18n.getTranslation)("global.profiles.widgets.list.listToolbar.add")), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    style: {
      width: "70%",
      minWidth: 0
    },
    variant: "text",
    color: "primary",
    onClick: props.startDeleteMode
  }, (0, _i18n.getTranslation)("global.profiles.widgets.list.listToolbar.remove")));
};
var ListToolbar = function ListToolbar(_ref) {
  var expanded = _ref.expanded,
    editableRow = _ref.editableRow,
    removing = _ref.removing,
    listStyle = _ref.listStyle,
    canRemove = _ref.canRemove,
    canEdit = _ref.canEdit,
    toggleEditTitle = _ref.toggleEditTitle,
    editTitle = _ref.editTitle,
    handleCancelRename = _ref.handleCancelRename,
    handleSaveNewTitle = _ref.handleSaveNewTitle,
    listId = _ref.listId,
    dir = _ref.dir,
    cancelAddRow = _ref.cancelAddRow,
    cancelDeleteMode = _ref.cancelDeleteMode,
    addRow = _ref.addRow,
    startDeleteMode = _ref.startDeleteMode,
    toggleDialog = _ref.toggleDialog,
    submitDeleteMode = _ref.submitDeleteMode,
    submitAddRow = _ref.submitAddRow,
    classes = _ref.classes;
  return canEdit || canRemove ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.Toolbar, {
    style: {
      backgroundColor: expanded ? "#35383c" : "#2c2d2f",
      padding: "none",
      borderBottom: "1px solid #41454A",
      minHeight: 45
    },
    disableGutters: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      paddingRight: 8
    }), dir === "ltr" && {
      paddingLeft: 8
    }), listStyle.buttons)
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/_react["default"].createElement(EditMenu, {
    editableRow: editableRow,
    removing: removing
    // Methods
    ,
    cancelAddRow: cancelAddRow,
    cancelDeleteMode: cancelDeleteMode,
    addRow: addRow,
    startDeleteMode: startDeleteMode,
    editTitle: editTitle,
    handleCancelRename: handleCancelRename,
    handleSaveNewTitle: handleSaveNewTitle,
    toggleDialog: toggleDialog,
    listId: listId,
    dir: dir
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: listStyle.spacer
  }), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(DeleteMenu, {
    canRemove: canRemove,
    removing: removing,
    editableRow: editableRow,
    classes: classes
    // Methods
    ,
    submitDeleteMode: submitDeleteMode,
    submitAddRow: submitAddRow,
    toggleDialog: toggleDialog,
    toggleEditTitle: toggleEditTitle,
    editTitle: editTitle,
    listId: listId,
    dir: dir
  })))) : null;
};
var _default = (0, _styles.withStyles)(styles)(ListToolbar);
exports["default"] = _default;