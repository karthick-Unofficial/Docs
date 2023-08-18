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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));
var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _reactQuill = _interopRequireDefault(require("react-quill"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _reactDropzone = _interopRequireDefault(require("react-dropzone"));
var _lodash = _interopRequireDefault(require("lodash"));
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context13, _context14; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context13 = ownKeys(Object(source), !0)).call(_context13, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context14 = ownKeys(Object(source))).call(_context14, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var styles = {
  text: {
    textTransform: "none",
    color: "#35b7f3",
    padding: 0,
    textAlign: "left",
    "&:hover": {
      backgroundColor: "transparent"
    },
    justifyContent: "flex-start"
  },
  textRTL: {
    textTransform: "none",
    color: "#35b7f3",
    padding: 0,
    textAlign: "right",
    "&:hover": {
      backgroundColor: "transparent"
    },
    justifyContent: "flex-start"
  }
};
var modules = {
  toolbar: [[{
    header: "1"
  }, {
    header: "2"
  }], ["bold", "italic", "underline", "strike"], [{
    list: "ordered"
  }, {
    list: "bullet"
  }, {
    indent: "-1"
  }, {
    indent: "+1"
  }], ["link"], ["clean"]]
};
var RowEdit = function RowEdit(_ref) {
  var _context11, _context12;
  var row = _ref.row,
    list = _ref.list,
    adding = _ref.adding,
    lookupData = _ref.lookupData,
    handleCloseDialog = _ref.handleCloseDialog,
    dialogRef = _ref.dialogRef,
    updateList = _ref.updateList,
    user = _ref.user,
    timeFormatPreference = _ref.timeFormatPreference,
    dir = _ref.dir,
    classes = _ref.classes,
    dialog = _ref.dialog;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    attachments = _useState2[0],
    setAttachments = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    newFiles = _useState4[0],
    setNewFiles = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    deleted = _useState6[0],
    setDeleted = _useState6[1];
  var _useState7 = (0, _react.useState)({}),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    state = _useState8[0],
    setState = _useState8[1];
  var dropzone = (0, _react.useRef)(null);
  var attachmentRef = (0, _react.useRef)([]);
  var theme = (0, _styles.useTheme)();
  var isXS = (0, _material.useMediaQuery)(theme.breakpoints.only("xs"));
  (0, _react.useEffect)(function () {
    if (row && !adding) {
      _lodash["default"].each(row.data, function (item, key) {
        return setState(function (initialState) {
          return _objectSpread(_objectSpread({}, initialState), {}, (0, _defineProperty2["default"])({}, key, item));
        });
      });
    }
    // Set default value in dialog if adding
    else {
      _lodash["default"].each(list.columns, function (column) {
        setState(function (initialState) {
          return _objectSpread(_objectSpread({}, initialState), {}, (0, _defineProperty2["default"])({}, column.id, column.defaultValue));
        });
        if (column.type === "date-time") {
          setState(function (initialState) {
            return _objectSpread(_objectSpread({}, initialState), {}, (0, _defineProperty2["default"])({}, column.id, new Date()));
          });
        }
      });
    }
    if (row || adding) {
      // Pull all attachments from list
      _clientAppCore.attachmentService.subscribeByTarget(list.id, function (err, response) {
        var _context, _context2;
        if (err) console.log(err);
        if (response) {
          switch (response.type) {
            case "initial":
            case "add":
              attachmentRef.current = _lodash["default"].uniqBy(_lodash["default"].compact((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(attachmentRef.current), [response.new_val])), "id");
              setAttachments(_lodash["default"].uniqBy(_lodash["default"].compact((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(attachments), [response.new_val])), "id"));
              break;
            case "remove":
              attachmentRef.current = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], attachmentRef.current, function (attachment) {
                return attachment.fileId !== response.old_val.fileId;
              });
              setAttachments((0, _filter["default"])(_lodash["default"]).call(_lodash["default"], attachments, function (attachment) {
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
  var handleChange = function handleChange(name) {
    return function (event) {
      var _context3;
      var lookupName = "";
      var lookupType = (0, _find["default"])(_context3 = list.columns).call(_context3, function (column) {
        return column.id === name;
      }).lookupType;
      if (lookupType && lookupData[lookupType] && event && event.target && hasOwn(event.target, "value")) {
        var _context4;
        lookupName = (0, _find["default"])(_context4 = lookupData[lookupType]).call(_context4, function (data) {
          return data.id === event.target.value;
        });
      }
      /**
       * Date Picker event does not have target prop, returns a moment date object
       * Checkbox event target uses checked prop instead of value
       */

      var value = lookupName ? {
        id: lookupName.id,
        name: lookupName.name
      } : event && event.target && hasOwn(event.target, "value") ? event.target.value : event && event.target && _lodash["default"].isBoolean(event.target.checked) ? event.target.checked : event;
      setState(function (prevState) {
        return _objectSpread(_objectSpread({}, prevState), {}, (0, _defineProperty2["default"])({}, name, value));
      });
    };
  };
  var handleNotesChange = function handleNotesChange(column, text) {
    setState(function (prevState) {
      return _objectSpread(_objectSpread({}, prevState), {}, (0, _defineProperty2["default"])({}, column, text));
    });
  };
  var handleClose = function handleClose() {
    handleCloseDialog(dialogRef);
  };

  /**
   * Remove files that have been added in this instance of the dialog being open
   * Files must be attached in order to receive the correct data for rendering FileLink
   */
  var handleCancel = function handleCancel() {
    if (_lodash["default"].size(newFiles) > 0) {
      var removals = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], attachmentRef.current, function (attachment) {
        return (0, _includes["default"])(_lodash["default"]).call(_lodash["default"], newFiles, attachment.fileId);
      });
      _lodash["default"].each(removals, function (file) {
        return handleDeleteFile(file.handle, file.fileId);
      });
    }
    handleClose();
  };
  var handleConfirm = function handleConfirm() {
    var update;
    var newRow = {};
    var rows = list.rows ? (0, _toConsumableArray2["default"])(list.rows) : [];

    // Confirm deletion of files that have been staged
    if (_lodash["default"].size(deleted) > 0) {
      var removals = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], attachmentRef.current, function (attachment) {
        return (0, _includes["default"])(_lodash["default"]).call(_lodash["default"], deleted, attachment.fileId);
      });
      _lodash["default"].each(removals, function (file) {
        return handleDeleteFile(file.handle, file.fileId);
      });
    }
    _lodash["default"].each(list.columns, function (column) {
      var _context5, _context6;
      // Pull correct value from choice, checkbox, and date columns
      if (!(0, _includes["default"])(_context5 = column.id).call(_context5, "_user-completed") && !(0, _includes["default"])(_context6 = column.id).call(_context6, "_show-time")) {
        var value;
        switch (column.type) {
          case "choice":
            {
              var option = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], column.options, function (option) {
                return option.id === state[column.id] || option.value === state[column.id];
              });
              value = option ? option.id : "";
            }
            break;
          case "checkbox":
            {
              var toggled = state[column.id];
              if (row && "".concat(column.id, "_user-completed") in row.data) {
                if (!toggled) {
                  newRow[column.id + "_user-completed"] = "";
                } else {
                  newRow[column.id + "_user-completed"] = user.name;
                }
              }
              if (row && "".concat(column.id, "_show-time") in row.data) {
                if (!toggled) {
                  newRow[column.id + "_show-time"] = "";
                } else {
                  newRow[column.id + "_show-time"] = (0, _momentTimezone["default"])();
                }
              }
              if (!row) {
                if (!toggled) {
                  newRow[column.id + "_show-time"] = "";
                  newRow[column.id + "_user-completed"] = "";
                } else {
                  newRow[column.id + "_user-completed"] = user.name;
                  newRow[column.id + "_show-time"] = (0, _momentTimezone["default"])();
                }
              }
              value = state[column.id];
            }
            break;
          default:
            value = state[column.id];
            break;
        }
        newRow[column.id] = value;
      }
      if (column.type === "date-time" && !column.forCheckBox) {
        setState(function (prevState) {
          return _objectSpread(_objectSpread({}, prevState), {}, (0, _defineProperty2["default"])({}, column.id, (0, _momentTimezone["default"])(state[column.id])));
        });
        newRow[column.id] = (0, _momentTimezone["default"])(state[column.id]);
      }
    });
    if (adding) {
      var _context7;
      var rowOrders = (0, _map["default"])(_lodash["default"]).call(_lodash["default"], rows, function (row) {
        return row.order;
      });
      update = (0, _concat["default"])(_context7 = []).call(_context7, (0, _toConsumableArray2["default"])(rows), [{
        data: newRow,
        order: _lodash["default"].size(rowOrders) ? Math.max.apply(Math, (0, _toConsumableArray2["default"])(rowOrders)) + 1 : 0,
        attachments: newFiles
      }]);
    } else {
      var updateRow = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], rows, function (updateRow) {
        return updateRow.order === row.order;
      });
      updateRow.data = newRow;
      update = rows;
    }
    updateList(list.id, {
      rows: update
    });
    handleClose();
  };
  var onDrop = function onDrop(acceptedFiles) {
    (0, _map["default"])(acceptedFiles).call(acceptedFiles, function (file) {
      return (0, _assign["default"])(file, {
        preview: _url["default"].createObjectURL(file)
      });
    });
    _clientAppCore.attachmentService.uploadFiles(list.id, "list", acceptedFiles).then(function (result) {
      var _context9;
      var fileIds = [result.result.attachmentId];
      if (!adding) {
        var _context8;
        var newRows = list.rows;
        var updateRow = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (updateRow) {
          return updateRow.order === row.order;
        });
        updateRow.attachments = updateRow.attachments ? (0, _concat["default"])(_context8 = []).call(_context8, (0, _toConsumableArray2["default"])(updateRow.attachments), fileIds) : fileIds;
        updateList(list.id, {
          rows: newRows
        });
      }
      setNewFiles((0, _concat["default"])(_context9 = []).call(_context9, (0, _toConsumableArray2["default"])(newFiles), fileIds));
    }, function (err) {
      return console.log(err);
    });
  };
  var handleAttachFile = function handleAttachFile() {
    dropzone.current.open();
  };
  var getRowFields = function getRowFields() {
    var fields = null;
    var columns = list.columns;
    var filteredColumns = (0, _filter["default"])(columns).call(columns, function (column) {
      return !column.forCheckBox;
    });
    fields = filteredColumns ? (0, _map["default"])(_lodash["default"]).call(_lodash["default"], filteredColumns, function (column) {
      var type = column.type;
      var options = column.options;
      var label = column.name;
      var value = state[column.id];
      var includeTime = column.includeTime;
      /**
       * Values may be empty strings and potentially false
       * Empty time values are null
       */
      if (value !== undefined) {
        switch (type) {
          case "lookup":
            return /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
              id: column.id,
              key: column.id,
              label: label,
              handleChange: handleChange(column.id),
              value: value && value.id ? value.id : "",
              items: lookupData[column.lookupType],
              dir: dir
            });
          case "text":
            return /*#__PURE__*/_react["default"].createElement(_CBComponents.TextField, {
              id: column.id,
              key: column.id,
              label: label,
              value: value,
              handleChange: handleChange(column.id),
              required: column.required,
              autoFocus: label === "Item",
              dir: dir
            });
          case "choice":
            {
              var choice = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], options, function (option) {
                return option.value === value;
              });
              return /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
                id: column.id,
                key: column.id,
                label: label,
                value: choice ? choice.id : value,
                items: options,
                handleChange: handleChange(column.id),
                dir: dir
              }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
                value: ""
              }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
                value: "global.sharedComponents.rowEdit.none"
              })));
            }
          case "checkbox":
            return (
              /*#__PURE__*/
              // Mimic other field margins
              _react["default"].createElement("div", {
                id: column.id,
                key: column.id,
                style: {
                  marginTop: 16,
                  marginBottom: 8
                }
              }, /*#__PURE__*/_react["default"].createElement(_CBComponents.CBCheckbox, {
                label: column.name,
                checked: value,
                handleChange: handleChange(column.id)
              }))
            );
          // TODO: Add date format config
          case "date-time":
            {
              value = value === false ? new Date() : value;
              var format = timeFormatPreference ? "full_".concat(timeFormatPreference) : "full_12-hour";
              return !includeTime ? /*#__PURE__*/_react["default"].createElement(_CBComponents.DatePicker, {
                id: column.id,
                key: column.id,
                label: label,
                value: value,
                handleChange: handleChange(column.id),
                dir: dir
              }) : /*#__PURE__*/_react["default"].createElement(_CBComponents.DateTimePicker, {
                id: column.id,
                key: column.id,
                label: label,
                value: value,
                handleChange: handleChange(column.id),
                format: format,
                dir: dir
              });
            }
          case "notes":
            return /*#__PURE__*/_react["default"].createElement("div", {
              style: {
                marginTop: 32,
                marginBottom: 8,
                position: "relative"
              }
            }, /*#__PURE__*/_react["default"].createElement(_material.FormLabel, {
              style: {
                top: 0,
                left: 0,
                position: "absolute",
                transform: "translate(0, -20.5px) scale(0.75)",
                transformOrigin: "top left",
                transition: "color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms"
              }
            }, label), /*#__PURE__*/_react["default"].createElement(_reactQuill["default"], {
              id: "".concat(column.id, "-notes-row"),
              value: value,
              theme: "snow",
              style: {
                width: 700,
                overflowY: "scroll"
              },
              formats: ["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link"],
              modules: modules,
              onChange: function onChange(content, delta, source, editor) {
                handleNotesChange(column.id, editor.getHTML());
              }
            }));
          default:
            break;
        }
      }
    }) : null;
    if (fields) return fields;
  };

  // Soft delete files (add to an array in component state) and wait for confirmation
  var handleSoftDelete = function handleSoftDelete(id) {
    var _context10;
    setDeleted((0, _concat["default"])(_context10 = []).call(_context10, (0, _toConsumableArray2["default"])(deleted), [id]));
    setNewFiles((0, _toConsumableArray2["default"])(_lodash["default"].pull(newFiles, id)));
  };
  var handleDeleteFile = function handleDeleteFile(handle, fileId) {
    _clientAppCore.attachmentService.removeAttachment(list.id, "list", fileId, function (err, response) {
      if (err) console.log(err, response);else if (!adding) {
        var newRows = list.rows;
        var updateRow = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], newRows, function (updateRow) {
          return updateRow.order === row.order;
        });
        updateRow.attachments = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], updateRow.attachments, function (attachmentId) {
          return attachmentId !== fileId;
        });
        updateList(list.id, {
          rows: newRows
        });
      }
    });
  };
  var hasNotes = (0, _some["default"])(_context11 = list.columns).call(_context11, function (column) {
    return column.type === "notes";
  });
  var rCId = (0, _find["default"])(_lodash["default"]).call(_lodash["default"], list.columns, function (column) {
    return column.required;
  }).id;
  var disabled = !state[rCId];
  var rowFileIds = row && row.attachments ? (0, _concat["default"])(_context12 = []).call(_context12, (0, _toConsumableArray2["default"])(row.attachments), (0, _toConsumableArray2["default"])(newFiles)) : (0, _toConsumableArray2["default"])(newFiles);
  var rowAttachments = (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], attachmentRef.current, function (attachment) {
    return (0, _includes["default"])(_lodash["default"]).call(_lodash["default"], rowFileIds, attachment.fileId);
  });

  // Prevent Edit and Add dialog from rendering simultaneously
  return dialog === dialogRef ? /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    key: "list-manager",
    open: dialog === dialogRef,
    paperPropStyles: hasNotes ? {
      height: 650,
      maxWidth: 750,
      width: 750
    } : {},
    confirm: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.rowEdit.save"),
      action: handleConfirm,
      disabled: disabled
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.sharedComponents.rowEdit.cancel"),
      action: handleCancel
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: isXS ? "auto" : 350
    }
  }, getRowFields(), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactDropzone["default"], {
    ref: dropzone,
    onDrop: onDrop,
    style: {
      display: "none"
    },
    multiple: false
  }, function (_ref2) {
    var getRootProps = _ref2.getRootProps,
      getInputProps = _ref2.getInputProps;
    return /*#__PURE__*/_react["default"].createElement("div", getRootProps(), /*#__PURE__*/_react["default"].createElement("input", getInputProps()));
  }), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    className: dir == "rtl" ? classes.textRTL : classes.text,
    style: {
      paddingBottom: 24
    },
    variant: "text",
    onClick: handleAttachFile,
    disableFocusRipple: true,
    disableRipple: true
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.rowEdit.addAttachments"
  })), (0, _map["default"])(_lodash["default"]).call(_lodash["default"], (0, _filter["default"])(_lodash["default"]).call(_lodash["default"], rowAttachments, function (attachment) {
    return !(0, _includes["default"])(_lodash["default"]).call(_lodash["default"], deleted, attachment.fileId);
  }), function (attachment) {
    return /*#__PURE__*/_react["default"].createElement(_CBComponents.FileLink, {
      key: attachment.fileId,
      attachment: attachment,
      handleDeleteFile: handleSoftDelete,
      canEdit: true,
      dir: dir
    });
  })))) : null;
};
var _default = (0, _styles.withStyles)(styles)(RowEdit);
exports["default"] = _default;