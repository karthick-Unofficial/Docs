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
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _size = _interopRequireDefault(require("lodash/size"));
var _includes2 = _interopRequireDefault(require("lodash/includes"));
var _map = _interopRequireDefault(require("lodash/map"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  closeOnSelect: _propTypes["default"].bool,
  id: _propTypes["default"].string.isRequired,
  items: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object]),
  placeholder: _propTypes["default"].string,
  selected: _propTypes["default"].array,
  handleSelect: _propTypes["default"].func.isRequired,
  maxResults: _propTypes["default"].number,
  dir: _propTypes["default"].string,
  noResultString: _propTypes["default"].string
};
var defaultProps = {
  closeOnSelect: false,
  items: [],
  placeholder: "",
  selected: [],
  maxResults: 5
};
var SearchSelectField = function SearchSelectField(_ref) {
  var _context;
  var id = _ref.id,
    closeOnSelect = _ref.closeOnSelect,
    handleSelect = _ref.handleSelect,
    items = _ref.items,
    placeholder = _ref.placeholder,
    selected = _ref.selected,
    maxResults = _ref.maxResults,
    dir = _ref.dir,
    noResultString = _ref.noResultString;
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    anchorEl = _useState4[0],
    setAnchorEl = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    open = _useState6[0],
    setOpen = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    width = _useState8[0],
    setWidth = _useState8[1];
  var handleChange = function handleChange(event) {
    var value = event.target.value;
    var field = document.getElementById(id).parentElement;
    setValue(value);
    setAnchorEl(field);
    setOpen(true);
    setWidth(field.offsetWidth);
    if (!(0, _size["default"])(value)) handleClose();
  };
  var handleClose = function handleClose() {
    setValue("");
    setAnchorEl(null);
    setOpen(false);
  };
  var handleSelectItem = function handleSelectItem(id) {
    handleSelect(id);
    if (closeOnSelect) {
      handleClose();
    }
  };
  var results = [];
  (0, _some["default"])(_context = (0, _keys["default"])(items)).call(_context, function (key) {
    var _context2;
    if (!(0, _includes2["default"])(selected, key) && (0, _includes["default"])(_context2 = items[key].searchString.toLowerCase()).call(_context2, value.toLowerCase())) {
      results.push({
        id: key,
        label: items[key].label
      });
    }
    return results.length >= maxResults;
  });
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_CBComponents.SearchField, {
    id: id,
    placeholder: placeholder,
    value: value,
    handleChange: handleChange,
    handleClear: handleClose,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(_material.Popper, {
    id: "".concat(id, "-results"),
    disablePortal: true,
    open: open,
    anchorEl: anchorEl,
    style: {
      width: width,
      zIndex: 99
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ClickAwayListener, {
    onClickAway: handleClose
  }, /*#__PURE__*/_react["default"].createElement(_material.Paper, null, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _size["default"])(results) ? (0, _map["default"])(results, function (result) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      onClick: function onClick() {
        return handleSelectItem(result.id);
      },
      key: result.id
    }, /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
      }
    }, result.label));
  }) : /*#__PURE__*/_react["default"].createElement(_material.MenuItem, null, /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      margin: "auto"
    }
  }, noResultString ? noResultString : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBSearchField.searchSelectField.noResults"
  }))))))));
};
SearchSelectField.propTypes = propTypes;
SearchSelectField.defaultProps = defaultProps;
var _default = SearchSelectField;
exports["default"] = _default;