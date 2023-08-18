"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _ListToolbar = _interopRequireDefault(require("./ListToolbar"));
var _CBComponents = require("../../../../CBComponents");
var _SharedComponents = require("../../../../SharedComponents");
var _lodash = _interopRequireDefault(require("lodash"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _iconsMaterial = require("@mui/icons-material");
var _mdiMaterialUi = require("mdi-material-ui");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  cardContentRoot: {
    border: "1px solid #41454A",
    padding: "0!important"
  },
  headerAction: {
    margin: 0
  },
  headerAvatar: {
    margin: "0 16px 0 0"
  },
  headerAvatarRTL: {
    margin: "0 0 0 16px"
  },
  checkboxRoot: {
    color: "#828283",
    "&$checked": {
      color: "#35b7f3!important"
    }
  },
  paddingCheckbox: {
    padding: "0 0 0 4px"
  },
  checkboxChecked: {
    color: "#35b7f3"
  },
  inputRoot: {
    height: "100%"
  }
};
var ListCard = function ListCard(_ref) {
  var list = _ref.list,
    getLookupValues = _ref.getLookupValues,
    lookupData = _ref.lookupData,
    dialog = _ref.dialog,
    openDialog = _ref.openDialog,
    closeDialog = _ref.closeDialog,
    dir = _ref.dir,
    cardStyles = _ref.cardStyles,
    adding = _ref.adding,
    checked = _ref.checked,
    handleSelectList = _ref.handleSelectList,
    canEdit = _ref.canEdit,
    canRemove = _ref.canRemove,
    user = _ref.user,
    secondaryExpanded = _ref.secondaryExpanded,
    locale = _ref.locale,
    defaultListPagination = _ref.defaultListPagination,
    classes = _ref.classes,
    listPaginationOptions = _ref.listPaginationOptions;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    editableRow = _useState2[0],
    setEditableRow = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    removing = _useState4[0],
    setRemoving = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    removals = _useState6[0],
    setRemovals = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    showLoading = _useState8[0],
    setShowLoading = _useState8[1];
  var _useState9 = (0, _react.useState)(list.name),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    title = _useState10[0],
    setTitle = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    editTitle = _useState12[0],
    setEditTitle = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    selectedRow = _useState14[0],
    setSelectedRow = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    expandedState = _useState16[0],
    setExpandedState = _useState16[1];
  (0, _react.useEffect)(function () {
    handleLookupDataRetrieval();
  }, []);
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevList = usePrevious(list);
  (0, _react.useEffect)(function () {
    if (prevList && prevList.columns.length < list.columns.length) {
      handleLookupDataRetrieval();
    }
  }, [list]);
  var deleteList = function deleteList() {
    setShowLoading(true);
    if (!list.targetId) {
      _clientAppCore.listService.deleteList(list.id, function (err, res) {
        if (err) {
          console.log(err, res);
        }
      });
    } else {
      _clientAppCore.eventService.deletePinnedList(list.targetId, list.id, function (err, res) {
        if (err) {
          console.log(err, res);
        }
      });
    }
    //When the closeDialog or openDialog actions are triggered from toggleDialog, the redux action's meta throws an error, causing the remaining lines of code to stop.
    toggleDialog("deleteList" + list.id);
  };
  var deleteMode = function deleteMode() {
    setRemoving(true);
  };
  var cancelDeleteMode = function cancelDeleteMode() {
    setRemoving(false);
    setRemovals([]);
  };
  var handleLookupDataRetrieval = function handleLookupDataRetrieval() {
    var lookingUp = {};
    for (var i = 0; i < list.columns.length; i++) {
      if (list.columns[i].type === "lookup" && !lookupData[list.columns[i].lookupType] && !lookingUp[list.columns[i].lookupType]) {
        lookingUp[list.columns[i].lookupType] = true;
        dispatch(getLookupValues(list.columns[i].lookupType));
      }
    }
  };
  var handleKeyDown = function handleKeyDown(event) {
    if (event) {
      if (event.key === "Enter" && editTitle) {
        handleSaveNewTitle();
      }
    }
  };
  var toggleEditTitle = function toggleEditTitle() {
    editTitle ? document.removeEventListener("keydown", handleKeyDown()) : document.addEventListener("keydown", handleKeyDown());
    setEditTitle(!editTitle);
  };
  var handleRenameList = function handleRenameList(event) {
    var title = event.target.value;
    setTitle(title);
  };
  var handleCancelRename = function handleCancelRename() {
    setTitle(list.name);
    setEditTitle(false);
    toggleEditTitle();
  };
  var handleSaveNewTitle = function handleSaveNewTitle() {
    if (!list.targetId) {
      _clientAppCore.listService.updateList(list.id, {
        name: title
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    } else {
      _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, {
        name: title
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    }
    toggleEditTitle();
  };
  var handleCheckboxToggle = function handleCheckboxToggle(order, id) {
    var newRows = (0, _toConsumableArray2["default"])(list.rows);
    var rowData = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (row) {
      return row.order === order;
    }).data;
    var toggled = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (row) {
      return row.order === order;
    }).data[id];
    if ("".concat(id, "_user-completed") in rowData) {
      if (toggled) {
        (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (row) {
          return row.order === order;
        }).data[id + "_user-completed"] = "";
      } else {
        (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (row) {
          return row.order === order;
        }).data[id + "_user-completed"] = user.name;
      }
    }
    if ("".concat(id, "_show-time") in rowData) {
      if (toggled) {
        (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (row) {
          return row.order === order;
        }).data[id + "_show-time"] = "";
      } else {
        (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (row) {
          return row.order === order;
        }).data[id + "_show-time"] = (0, _momentTimezone["default"])();
      }
    }
    (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (row) {
      return row.order === order;
    }).data[id] = !toggled;
    if (!list.targetId) {
      _clientAppCore.listService.updateList(list.id, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    } else {
      _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    }
  };
  var handleNotesChange = _lodash["default"].debounce(function (text, row, column) {
    var newRows = (0, _toConsumableArray2["default"])(list.rows);
    (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (newRow) {
      return newRow.order === row.order;
    }).data[column.id] = text;
    if (!list.targetId) {
      _clientAppCore.listService.updateList(list.id, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    } else {
      _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    }
  }, 1000);
  var handleToggleRemove = function handleToggleRemove(index) {
    var _context;
    var newRemovals = (0, _toConsumableArray2["default"])(removals);
    if ((0, _includes["default"])(_lodash["default"]).call(_lodash["default"], newRemovals, index)) {
      _lodash["default"].pull(newRemovals, index);
      setRemovals(newRemovals);
    } else setRemovals((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(newRemovals), [index]));
  };
  var toggleDialog = function toggleDialog(dialogRef) {
    dialog === dialogRef ? dispatch(closeDialog(dialogRef)) : dispatch(openDialog(dialogRef));
  };
  var handleConfirmRemove = function handleConfirmRemove(listId) {
    var newRows = (0, _toConsumableArray2["default"])(list.rows);
    _lodash["default"].remove(newRows, function (row) {
      return (0, _includes["default"])(_lodash["default"]).call(_lodash["default"], removals, row.order);
    });
    if (!list.targetId) {
      _clientAppCore.listService.updateList(listId, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    } else {
      _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    }
    setRemoving(false);
    setRemovals([]);
  };
  var handleRowEdit = function handleRowEdit(e, row, list) {
    setSelectedRow(row);
    toggleDialog("rowEdit" + list.id);
  };
  var handleSetNowDateTime = function handleSetNowDateTime(column, row, list) {
    var newRows = (0, _toConsumableArray2["default"])(list.rows);
    (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (newRow) {
      return newRow.order === row.order;
    }).data[column.id] = (0, _momentTimezone["default"])();
    if (!list.targetId) {
      _clientAppCore.listService.updateList(list.id, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    } else {
      _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, {
        rows: newRows
      }, function (err, res) {
        if (err) console.log(err, res);
      });
    }
  };
  var handleViewAttachments = function handleViewAttachments(e, row, list) {
    setSelectedRow(row);
    toggleDialog("attachmentDialog" + list.id);
  };
  var handleUpdateList = function handleUpdateList(listId, update) {
    if (!list.targetId) {
      _clientAppCore.listService.updateList(listId, update, function (err, res) {
        if (err) console.log(err, res);
      });
    } else {
      _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, update, function (err, res) {
        if (err) console.log(err, res);
      });
    }
  };
  var handleExpandClick = function handleExpandClick() {
    setExpandedState(!expandedState);
  };
  var getAvatar = function getAvatar() {
    var _context2;
    var avatarStyle = {
      backgroundColor: "#677588",
      border: "1px solid #FFFFFF",
      color: "#FFFFFF"
    };
    if (list.columns && list.columns.length > 0 && list.rows && list.rows.length > 0 && (0, _sort["default"])(_context2 = list.columns).call(_context2, function (col) {
      return col.order;
    })[0].type === "checkbox") {
      var _context3;
      var firstColumn = (0, _sort["default"])(_context3 = list.columns).call(_context3, function (col) {
        return col.order;
      })[0];
      if (firstColumn.type === "checkbox") {
        var _context4;
        var numberIncomplete = (0, _filter["default"])(_context4 = list.rows).call(_context4, function (row) {
          return row.data && row.data[firstColumn.id] === false;
        }).length;
        if (numberIncomplete > 0) {
          return /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
            style: avatarStyle
          }, numberIncomplete);
        } else {
          avatarStyle.backgroundColor = "#61BE49";
          return /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
            style: avatarStyle
          }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.Check, null));
        }
      }
    }
    return /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
      style: avatarStyle
    }, /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.ViewList, null));
  };
  var Title = editTitle ? title : list.name;
  var subheader = list.categoryRef ? list.categoryRef.name : "";
  var listStyle = {
    spacer: {
      flex: "1 1 100%"
    },
    buttons: {
      flex: "0 0 auto"
    },
    rowDeleteFlex: {
      color: "white",
      display: "flex",
      alignItems: "center",
      maxWidth: "100%",
      minWidth: 70,
      justifyContent: "flex-start"
    }
  };

  // Setting header based on whether or not the list should be rendered as a list template to be added,
  // or as a list that is attached to an event
  var header;
  if (adding) {
    header = /*#__PURE__*/_react["default"].createElement(_material.CardHeader, {
      style: _objectSpread({}, cardStyles.header),
      title: /*#__PURE__*/_react["default"].createElement("p", {
        style: {
          fontSize: 14,
          color: "#FFFFFF",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: secondaryExpanded ? 420 : 205
        }
      }, Title),
      subheader: /*#__PURE__*/_react["default"].createElement("p", {
        style: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: secondaryExpanded ? 420 : 205
        }
      }, subheader),
      action: /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        onClick: handleExpandClick,
        style: {
          color: "#FFFFFF"
        }
      }, expandedState ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)),
      classes: {
        action: classes.headerAction
      },
      avatar: /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
        color: "primary",
        classes: {
          root: classes.checkboxRoot,
          checked: classes.checkboxChecked
        },
        checked: checked,
        onChange: function onChange() {
          handleSelectList(list.id);
        }
      })
    });
  } else if (editTitle) {
    var textField = /*#__PURE__*/_react["default"].createElement(_material.TextField, {
      id: "title-field",
      fullWidth: true,
      variant: "standard",
      onChange: handleRenameList,
      value: Title,
      autoFocus: true,
      style: {
        backgroundColor: "#41454a",
        height: 40,
        color: "#fff"
      },
      InputProps: {
        classes: {
          root: classes.inputRoot
        }
      }
    });
    header = /*#__PURE__*/_react["default"].createElement(_material.CardHeader, {
      style: _objectSpread(_objectSpread({}, cardStyles.header), {}, {
        paddingTop: 0,
        paddingBottom: 0
      }),
      actAsExpander: false,
      showExpandableButton: true,
      title: textField
    });
  } else {
    header = /*#__PURE__*/_react["default"].createElement(_material.CardHeader, {
      style: _objectSpread(_objectSpread({}, cardStyles.header), {}, {
        backgroundColor: expandedState ? "#383D48" : "#41454A",
        direction: dir
      }),
      title: /*#__PURE__*/_react["default"].createElement("p", {
        style: {
          fontSize: 14,
          color: "#FFFFFF",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: secondaryExpanded ? 420 : 205
        }
      }, Title),
      subheader: /*#__PURE__*/_react["default"].createElement("p", {
        style: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: secondaryExpanded ? 420 : 205
        }
      }, subheader),
      action: /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        onClick: handleExpandClick,
        style: {
          color: "#FFFFFF"
        }
      }, expandedState ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)),
      classes: {
        action: classes.headerAction,
        avatar: dir === "rtl" ? classes.headerAvatarRTL : classes.headerAvatar
      },
      avatar: getAvatar()
    });
  }
  var hasAttachments = _lodash["default"].size((0, _filter["default"])(_lodash["default"]).call(_lodash["default"], list.rows, function (row) {
    return _lodash["default"].size(row.attachments) > 0;
  })) > 0;
  return list ? /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: {
      marginBottom: ".5rem"
    },
    key: "list-card-".concat(list.id)
  }, header, /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expandedState,
    unmountOnExit: true,
    style: {
      direction: dir
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.CardContent, {
    classes: {
      root: classes.cardContentRoot
    }
  }, !adding && /*#__PURE__*/_react["default"].createElement(_ListToolbar["default"], {
    listId: list.id,
    expanded: expandedState,
    editableRow: editableRow,
    deleteMode: deleteMode,
    canRemove: canRemove,
    canEdit: canEdit
    //cancelAddRow={cancelAddRow}
    ,
    cancelDeleteMode: cancelDeleteMode
    //addRow={addRow}
    //submitAddRow={submitAddRow}
    ,
    startDeleteMode: deleteMode,
    submitDeleteMode: handleConfirmRemove,
    toggleDialog: toggleDialog,
    toggleEditTitle: toggleEditTitle,
    handleSaveNewTitle: handleSaveNewTitle,
    handleCancelRename: handleCancelRename,
    listStyle: listStyle,
    editTitle: editTitle,
    removing: removing,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.Table, {
    columns: _lodash["default"].orderBy(list.columns, ["order"]),
    listPaginationOptions: listPaginationOptions,
    defaultListPagination: defaultListPagination,
    rows: list.rows,
    noPagination: list.noPagination,
    canViewNotes: canEdit,
    classes: {
      tableWrapper: "list-body-wrapper"
    },
    removing: removing,
    removals: removals,
    handleChange: handleNotesChange,
    toggleRemove: handleToggleRemove,
    selectKey: canEdit ? "required" : null,
    selectAction: function selectAction(e, row) {
      return handleRowEdit(e, row, list);
    },
    setNowAction: function setNowAction(column, row) {
      return handleSetNowDateTime(column, row, list);
    },
    handleCheckboxToggle: handleCheckboxToggle,
    hasAttachments: hasAttachments,
    attachmentAction: function attachmentAction(e, row) {
      return handleViewAttachments(e, row, list);
    },
    disableCheckbox: !canEdit,
    dir: dir
  }))), dialog && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: dialog === "deleteList" + list.id,
    confirm: {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.list.listCard.delete"),
      action: deleteList
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.list.listCard.cancel"),
      action: function action() {
        return toggleDialog("deleteList" + list.id);
      }
    },
    options: {
      onClose: function onClose() {
        return toggleDialog("deleteList" + list.id);
      },
      maxWidth: "md"
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement("p", {
    className: "dialog-text"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.list.listCard.confirmationText"
  })), showLoading ? /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, {
    size: 60,
    thickness: 5
  }) : null), /*#__PURE__*/_react["default"].createElement(_SharedComponents.RowEdit, {
    key: list.id + "-add-row",
    list: list,
    dialogRef: "rowAdd" + list.id,
    adding: true,
    lookupData: lookupData,
    user: user,
    handleCloseDialog: toggleDialog,
    dialog: dialog,
    updateList: handleUpdateList,
    dir: dir,
    locale: locale
  }), /*#__PURE__*/_react["default"].createElement(_SharedComponents.RowEdit, {
    key: list.id + "-edit-row",
    list: list,
    lookupData: lookupData,
    user: user,
    dialogRef: "rowEdit" + list.id,
    row: selectedRow,
    adding: false,
    handleCloseDialog: toggleDialog,
    dialog: dialog,
    updateList: handleUpdateList,
    dir: dir,
    locale: locale
  }), /*#__PURE__*/_react["default"].createElement(_SharedComponents.AttachmentDialog, {
    key: list.id + "-attachments",
    list: list,
    dialogRef: "attachmentDialog" + list.id,
    row: selectedRow,
    handleCloseDialog: toggleDialog,
    dialog: dialog,
    dir: dir
  }))) : /*#__PURE__*/_react["default"].createElement("div", null);
};
var _default = (0, _styles.withStyles)(styles)(ListCard);
exports["default"] = _default;