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
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var useStyles = (0, _styles.makeStyles)({
  underline: {
    "&:before": {
      borderBottom: "1px solid rgb(181, 185, 190)!important"
    },
    "&:after": {
      borderBottom: "1px solid #1688bd"
    }
  },
  input: {
    "&::placeholder": {
      color: "#fff",
      fontSize: "14px",
      fontWeight: "normal",
      opacity: 0.5
    }
  }
});
var SearchField = function SearchField(_ref) {
  var handleClear = _ref.handleClear,
    updateSearch = _ref.updateSearch,
    width = _ref.width,
    placeholder = _ref.placeholder,
    autoFocus = _ref.autoFocus;
  var classes = useStyles();
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  (0, _react.useEffect)(function () {
    return function () {
      handleClearEvent();
    };
  }, []);
  var handleClearEvent = function handleClearEvent() {
    handleClear();
    setValue("");
  };
  var handleSearch = function handleSearch(value) {
    updateSearch(value);
    setValue(value);
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "search-field",
    style: {
      marginTop: "15px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "search-field",
    placeholder: placeholder,
    onChange: function onChange(e) {
      handleSearch(e.target.value);
    },
    variant: "standard",
    value: value,
    style: {
      backgroundColor: "transparent",
      width: width
    },
    autoFocus: autoFocus,
    InputProps: {
      classes: {
        input: classes.input,
        underline: classes.underline
      }
    }
  }), value !== "" ? /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: {
      color: "white"
    },
    onClick: handleClearEvent
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons"
  }, "cancel")) : /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons"
  }, "search"));
};
var _default = SearchField;
exports["default"] = _default;