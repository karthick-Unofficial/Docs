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
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _index = require("../index");
var _classnames = _interopRequireDefault(require("classnames"));
var _lodash = _interopRequireDefault(require("lodash"));
var _clientAppCore = require("client-app-core");
var _i18n = require("orion-components/i18n");
var _moment = _interopRequireDefault(require("moment"));
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var headStyles = {
  head: {
    color: "#828283",
    border: "none",
    lineHeight: 1,
    padding: "8px 16px",
    whiteSpace: "nowrap"
  },
  headRTL: {
    color: "#828283",
    border: "none",
    lineHeight: 1,
    padding: "8px 16px",
    whiteSpace: "nowrap",
    textAlign: "right"
  },
  paddingCheckbox: {
    padding: "0 0 0 4px"
  },
  paddingCheckboxRLT: {
    padding: "0 4px 0 0"
  },
  tableCellRoot: {
    padding: 8
  }
};
var headPropTypes = {
  classes: _propTypes["default"].object.isRequired,
  columns: _propTypes["default"].array.isRequired,
  removing: _propTypes["default"].bool,
  hasAttachments: _propTypes["default"].bool
};
var headDefaultProps = {
  removing: false,
  hasAttachments: false
};
var CBTableHead = function CBTableHead(_ref) {
  var classes = _ref.classes,
    columns = _ref.columns,
    removing = _ref.removing,
    hasAttachments = _ref.hasAttachments,
    dir = _ref.dir;
  var tableHeadStyles = {
    tableCell: _objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.TableHead, null, /*#__PURE__*/_react["default"].createElement(_material.TableRow, null, removing && /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
    className: classes.head,
    variant: "head",
    padding: "none",
    style: tableHeadStyles.tableCell
  }), (0, _map["default"])(_lodash["default"]).call(_lodash["default"], columns, function (column) {
    return /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      variant: "head",
      key: column.id,
      classes: {
        head: dir === "rtl" ? classes.headRTL : classes.head,
        paddingCheckbox: dir === "rtl" ? classes.paddingCheckboxRLT : classes.paddingCheckbox
      },
      padding: column.type === "checkbox" ? "checkbox" : "normal"
    }, column.name);
  }), hasAttachments && /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
    variant: "head",
    id: "attachments",
    classes: {
      head: dir === "rtl" ? classes.headRTL : classes.head
    },
    padding: "normal"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBTable.attachments"
  }))));
};
CBTableHead.propTypes = headPropTypes;
CBTableHead.defaultProps = headDefaultProps;
CBTableHead = (0, _styles.withStyles)(headStyles)(CBTableHead);
var tableRowStyles = {
  body: {
    color: "#FFFFFF",
    padding: "8px 16px",
    whiteSpace: "nowrap"
  },
  bodyRTL: {
    color: "#FFFFFF",
    padding: "8px 16px",
    whiteSpace: "nowrap",
    textAlign: "right"
  },
  root: {
    color: "#828283",
    "&$checked": {
      color: "#35b7f3"
    }
  },
  checked: {},
  text: {
    textTransform: "none",
    color: "#35b7f3",
    padding: 0,
    textAlign: "left",
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  label: {
    justifyContent: "flex-start"
  },
  textRTL: {
    textTransform: "none",
    color: "#35b7f3",
    padding: 0,
    textAlign: "right",
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  paddingCheckbox: {
    padding: "0 0 0 4px"
  },
  paddingCheckboxRTL: {
    padding: "0 4px 0 0"
  }
};
var tableRowPropTypes = {
  classes: _propTypes["default"].object.isRequired,
  columns: _propTypes["default"].array.isRequired,
  row: _propTypes["default"].object.isRequired,
  removing: _propTypes["default"].bool,
  selectKey: _propTypes["default"].string,
  selectAction: _propTypes["default"].func,
  handleCheckboxToggle: _propTypes["default"].func,
  handleLookupQuery: _propTypes["default"].func,
  toggleRemove: _propTypes["default"].func,
  removals: _propTypes["default"].array,
  attachmentAction: _propTypes["default"].func,
  hasAttachments: _propTypes["default"].bool,
  disableCheckbox: _propTypes["default"].bool,
  timeFormatPreference: _propTypes["default"].string,
  locale: _propTypes["default"].string
};
var tableRowDefaultProps = {
  removing: false,
  selectKey: "",
  selectAction: function selectAction() {},
  handleCheckboxToggle: function handleCheckboxToggle() {},
  toggleRemove: function toggleRemove() {},
  removals: [],
  attachmentAction: function attachmentAction() {},
  hasAttachments: false,
  disableCheckbox: false,
  timeFormatPreference: "12-hour",
  locale: "en"
};
var CBTableRow = function CBTableRow(_ref2) {
  var canViewNotes = _ref2.canViewNotes,
    classes = _ref2.classes,
    columns = _ref2.columns,
    row = _ref2.row,
    handleChange = _ref2.handleChange,
    removing = _ref2.removing,
    selectKey = _ref2.selectKey,
    selectAction = _ref2.selectAction,
    setNowAction = _ref2.setNowAction,
    handleCheckboxToggle = _ref2.handleCheckboxToggle,
    toggleRemove = _ref2.toggleRemove,
    removals = _ref2.removals,
    attachmentAction = _ref2.attachmentAction,
    hasAttachments = _ref2.hasAttachments,
    disableCheckbox = _ref2.disableCheckbox,
    timeFormatPreference = _ref2.timeFormatPreference,
    dir = _ref2.dir,
    locale = _ref2.locale;
  var CBTableRowStyles = {
    tableCell: _objectSpread({
      padding: 0,
      width: 42
    }, dir === "rtl" && {
      textAlign: "right"
    }),
    textAlignRight: _objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.TableRow, null, removing && /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
    className: classes.body,
    padding: "none",
    style: CBTableRowStyles.tableCell
  }, /*#__PURE__*/_react["default"].createElement(_material.Checkbox, {
    color: "primary",
    classes: {
      root: classes.root,
      checked: classes.checked
    },
    checked: (0, _includes["default"])(_lodash["default"]).call(_lodash["default"], removals, row.order),
    onChange: function onChange() {
      return toggleRemove(row.order);
    }
  })), (0, _map["default"])(_lodash["default"]).call(_lodash["default"], columns, function (column) {
    var selectable = column[selectKey];
    // TODO: Add a time display config or a format prop on column
    var value = null;
    switch (column.type) {
      case "date-time":
        if (!row.data[column.id]) value = "";else if (column.includeTime) {
          value = _clientAppCore.timeConversion.convertToUserTime((0, _moment["default"])(row.data[column.id]).locale(locale), "full_".concat(timeFormatPreference));
          if (timeFormatPreference === "12-hour") {
            var _context, _context2;
            value = (0, _i18n.getLocalize)((0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "".concat(value.split(" ")[0], " ")).call(_context2, value.split(" ")[1], " ")).call(_context, value.split(" ")[2]), "global.date.full") + value.split(" ")[3];
          } else {
            var _context3;
            value = (0, _i18n.getLocalize)((0, _concat["default"])(_context3 = "".concat(value.split(" ")[0], " ")).call(_context3, value.split(" ")[1]), "global.date.full24-hour") + value.split(" ")[2];
          }
        } else if (!column.includeTime) {
          value = _clientAppCore.timeConversion.convertToUserTime((0, _moment["default"])(row.data[column.id]).locale(locale), "MM/DD/YYYY");
          value = (0, _i18n.getLocalize)(value, "global.date.mid");
        }
        break;
      case "choice":
        {
          var selectedOption = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], column.options, function (option) {
            return option.id === row.data[column.id];
          });
          value = selectedOption ? selectedOption.value : "";
        }
        break;
      case "notes":
        value = row.data[column.id] || "";
        break;
      case "lookup":
        value = row.data[column.id] ? row.data[column.id].name : "";
        break;
      default:
        value = row.data[column.id];
        break;
    }
    var tableCellStyle = {
      textAlign: column.type === "checkbox" ? "center" : dir && dir === "rtl" ? "right" : undefined
    };
    return /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
      variant: "body",
      color: "primary",
      classes: {
        body: dir === "rtl" ? classes.bodyRTL : classes.body,
        paddingCheckbox: dir === "rtl" ? classes.paddingCheckboxRTL : classes.paddingCheckbox
      },
      key: column.id,
      padding: _lodash["default"].isBoolean(value) ? "checkbox" : "normal",
      style: tableCellStyle
    }, _lodash["default"].isBoolean(value) ? /*#__PURE__*/_react["default"].createElement(_index.CBCheckbox, {
      checked: value,
      handleChange: function handleChange() {
        return handleCheckboxToggle(row.order, column.id);
      },
      disableCheckbox: disableCheckbox
    }) : selectable ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: function onClick(e) {
        return selectAction(e, row);
      },
      variant: "text",
      className: (0, _classnames["default"])(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label),
      disableFocusRipple: true,
      disableRipple: true
    }, value) : column.type === "notes" ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: function onClick(e) {
        return selectAction(e, row);
      },
      variant: "text",
      disabled: !canViewNotes,
      className: (0, _classnames["default"])(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label),
      disableFocusRipple: true,
      disableRipple: true
    }, (0, _i18n.getTranslation)("global.CBComponents.CBTable.viewNotes")) : column.type === "date-time" && !column.forCheckBox && !value ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: function onClick() {
        return setNowAction(column, row);
      },
      variant: "text",
      disabled: !canViewNotes,
      className: (0, _classnames["default"])(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label),
      disableFocusRipple: true,
      disableRipple: true
    }, (0, _i18n.getTranslation)("global.CBComponents.CBTable.setNow")) : value);
  }), _lodash["default"].size(row.attachments) > 0 ? /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
    variant: "body",
    color: "primary",
    className: classes.body,
    key: "attachments",
    padding: "normal",
    style: CBTableRowStyles.textAlignRight
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: function onClick(e) {
      return attachmentAction(e, row);
    },
    variant: "text",
    className: (0, _classnames["default"])(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label),
    disableFocusRipple: true,
    disableRipple: true
  }, "Attachments")) : hasAttachments && _lodash["default"].size(row.attachments) === 0 ? /*#__PURE__*/_react["default"].createElement(_material.TableCell, {
    variant: "body",
    color: "primary",
    className: classes.body,
    key: "attachments",
    padding: "normal",
    style: CBTableRowStyles.textAlignRight
  }) : null);
};
CBTableRow.propTypes = tableRowPropTypes;
CBTableRow.defaultProps = tableRowDefaultProps;
CBTableRow = (0, _styles.withStyles)(tableRowStyles)(CBTableRow);
var paginationStyles = {
  root: {
    width: "100%"
  }
};
var paginationPropTypes = {
  classes: _propTypes["default"].object.isRequired,
  count: _propTypes["default"].number.isRequired,
  rowsPerPage: _propTypes["default"].number.isRequired,
  page: _propTypes["default"].number.isRequired,
  handleChangePage: _propTypes["default"].func.isRequired,
  handleChangeRowsPerPage: _propTypes["default"].func.isRequired
};
var CBTablePagination = function CBTablePagination(_ref3) {
  var classes = _ref3.classes,
    count = _ref3.count,
    rowsPerPage = _ref3.rowsPerPage,
    rowsPerPageOptions = _ref3.rowsPerPageOptions,
    page = _ref3.page,
    handleChangePage = _ref3.handleChangePage,
    handleChangeRowsPerPage = _ref3.handleChangeRowsPerPage;
  return /*#__PURE__*/_react["default"].createElement(_material.TablePagination, (0, _extends2["default"])({
    className: (0, _classnames["default"])(classes.root, "cb-table-pagination"),
    count: count,
    rowsPerPage: rowsPerPage,
    page: page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage
  }, rowsPerPageOptions && rowsPerPageOptions.length ? {
    rowsPerPageOptions: rowsPerPageOptions
  } : {}, {
    style: {
      direction: "ltr"
    }
  }));
};
CBTablePagination.propTypes = paginationPropTypes;
CBTablePagination = (0, _styles.withStyles)(paginationStyles)(CBTablePagination);
var tableStyles = {
  root: {
    width: "100%"
  },
  body: {
    borderBottom: "1px solid #515151"
  },
  tableWrapper: {
    width: "100%",
    overflowX: "scroll",
    borderLeft: "1px solid #515151",
    borderRight: "1px solid #515151"
  }
};
var tablePropTypes = {
  classes: _propTypes["default"].object.isRequired,
  rows: _propTypes["default"].array,
  columns: _propTypes["default"].array.isRequired,
  removing: _propTypes["default"].bool,
  selectKey: _propTypes["default"].string,
  selectAction: _propTypes["default"].func,
  setNowAction: _propTypes["default"].func,
  handleCheckboxToggle: _propTypes["default"].func,
  toggleRemove: _propTypes["default"].func,
  removals: _propTypes["default"].array,
  attachmentAction: _propTypes["default"].func,
  hasAttachments: _propTypes["default"].bool,
  disableCheckbox: _propTypes["default"].bool,
  timeFormatPreference: _propTypes["default"].string
};
var tableDefaultProps = {
  rows: [],
  removing: false,
  selectKey: "",
  selectAction: function selectAction() {},
  setNowAction: function setNowAction() {},
  handleCheckboxToggle: function handleCheckboxToggle() {},
  toggleRemove: function toggleRemove() {},
  removals: [],
  attachmentAction: function attachmentAction() {},
  hasAttachments: false,
  disableCheckbox: false,
  timeFormatPreference: "12-hour"
};
var CBTable = function CBTable(_ref4) {
  var listPaginationOptions = _ref4.listPaginationOptions,
    defaultListPagination = _ref4.defaultListPagination,
    canViewNotes = _ref4.canViewNotes,
    classes = _ref4.classes,
    rows = _ref4.rows,
    columns = _ref4.columns,
    handleChange = _ref4.handleChange,
    removing = _ref4.removing,
    selectKey = _ref4.selectKey,
    setNowAction = _ref4.setNowAction,
    selectAction = _ref4.selectAction,
    noPagination = _ref4.noPagination,
    handleCheckboxToggle = _ref4.handleCheckboxToggle,
    handleLookupQuery = _ref4.handleLookupQuery,
    toggleRemove = _ref4.toggleRemove,
    removals = _ref4.removals,
    hasAttachments = _ref4.hasAttachments,
    attachmentAction = _ref4.attachmentAction,
    disableCheckbox = _ref4.disableCheckbox,
    timeFormatPreference = _ref4.timeFormatPreference,
    dir = _ref4.dir;
  var _useState = (0, _react.useState)(0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    page = _useState2[0],
    setPage = _useState2[1];
  var _useState3 = (0, _react.useState)(listPaginationOptions),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    rowsPerPageOptions = _useState4[0],
    setRowsPerPageOptions = _useState4[1];
  var _useState5 = (0, _react.useState)((defaultListPagination || defaultListPagination === 0) && listPaginationOptions && (0, _includes["default"])(listPaginationOptions).call(listPaginationOptions, defaultListPagination) ? defaultListPagination : listPaginationOptions && listPaginationOptions.length ? listPaginationOptions[0] : 10),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    rowsPerPage = _useState6[0],
    setRowsPerPage = _useState6[1];
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var handleChangePage = function handleChangePage(event, page) {
    setPage(page);
  };
  var handleChangeRowsPerPage = function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: classes.tableWrapper
  }, /*#__PURE__*/_react["default"].createElement(_material.Table, {
    className: classes.root
  }, /*#__PURE__*/_react["default"].createElement(CBTableHead, {
    columns: columns,
    removing: removing,
    hasAttachments: hasAttachments,
    dir: dir
  }), _lodash["default"].size(rows) ? /*#__PURE__*/_react["default"].createElement(_material.TableBody, null, (0, _map["default"])(_lodash["default"]).call(_lodash["default"], noPagination ? rows : (0, _slice["default"])(_lodash["default"]).call(_lodash["default"], rows, page * rowsPerPage, page * rowsPerPage + rowsPerPage), function (row, index) {
    return /*#__PURE__*/_react["default"].createElement(CBTableRow, {
      key: index,
      columns: columns,
      row: row,
      canViewNotes: canViewNotes,
      handleChange: handleChange,
      handleLookupQuery: handleLookupQuery,
      removing: removing,
      selectKey: selectKey,
      setNowAction: setNowAction,
      selectAction: selectAction,
      handleCheckboxToggle: handleCheckboxToggle,
      toggleRemove: toggleRemove,
      removals: removals,
      attachmentAction: attachmentAction,
      hasAttachments: hasAttachments,
      disableCheckbox: disableCheckbox,
      timeFormatPreference: timeFormatPreference,
      dir: dir,
      locale: locale
    });
  })) : null, !noPagination && /*#__PURE__*/_react["default"].createElement(_material.TableFooter, null, /*#__PURE__*/_react["default"].createElement(_material.TableRow, null, /*#__PURE__*/_react["default"].createElement(CBTablePagination, {
    count: rows ? rows.length : 0,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: rowsPerPageOptions,
    page: page,
    handleChangePage: handleChangePage,
    handleChangeRowsPerPage: handleChangeRowsPerPage
  })))));
};
CBTable.propTypes = tablePropTypes;
CBTable.defaultProps = tableDefaultProps;
var _default = (0, _styles.withStyles)(tableStyles)(CBTable);
exports["default"] = _default;