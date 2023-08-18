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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var EditableText = function EditableText(_ref) {
  var row = _ref.row,
    item = _ref.item,
    type = _ref.type,
    dataType = _ref.dataType,
    handleSaveUpdatedText = _ref.handleSaveUpdatedText,
    index = _ref.index,
    expanded = _ref.expanded,
    color = _ref.color;
  var data = row[item];
  var _useState = (0, _react.useState)(data),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    textValue = _useState2[0],
    setTextValue = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    editing = _useState4[0],
    setEditing = _useState4[1];
  (0, _react.useEffect)(function () {
    setTextValue(row[item]);
  }, []);
  (0, _react.useEffect)(function () {
    if (textValue !== row[item] && !editing) {
      setTextValue(row[item]);
    }
  }, [textValue, row]);
  var handleUpdate = function handleUpdate(e) {
    e.preventDefault();
    setTextValue(e.target.value);
  };
  var handleEditMode = function handleEditMode() {
    setEditing(true);
  };
  var handleSave = function handleSave() {
    setEditing(false);
    var data;
    if (type === "text-header") {
      data = {
        label: textValue,
        property: row.property,
        type: dataType
      };
    } else {
      data = textValue;
    }
    handleSaveUpdatedText(data, item, index);
  };
  var style = {
    widget: {
      fontSize: "15px",
      backgroundColor: "#2c2d2f",
      color: color || "white",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
      // For whatever reason, inputs are shortened when deleting a row, this solves the issue for now
    },

    // Also causes slight style issue on bottom border
    expanded: {
      fontSize: "15px",
      backgroundColor: "#35383C",
      color: color || "white",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "testing",
    value: textValue,
    onChange: function onChange(e) {
      return handleUpdate(e);
    },
    onFocus: handleEditMode,
    fullWidth: true // sets to column width
    ,
    onBlur: handleSave // on mouse leave
    ,
    underlineShow: editing ? true : false,
    inputStyle: expanded ? style.expanded : style.widget
  });
};
var _default = EditableText;
exports["default"] = _default;