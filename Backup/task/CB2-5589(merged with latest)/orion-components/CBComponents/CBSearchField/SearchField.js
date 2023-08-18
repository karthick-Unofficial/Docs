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
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  id: _propTypes["default"].string,
  value: _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  handleChange: _propTypes["default"].func.isRequired,
  handleClear: _propTypes["default"].func.isRequired,
  filters: _propTypes["default"].number,
  handleClearFilters: _propTypes["default"].func,
  label: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  autoFocus: _propTypes["default"].bool,
  dir: _propTypes["default"].string,
  inputStyle: _propTypes["default"].object,
  adornmentStyle: _propTypes["default"].object,
  formControlStyle: _propTypes["default"].object
};
var defaultProps = {
  id: "search-field",
  filters: 0,
  handleClearFilters: null,
  placeholder: "",
  label: "",
  disabled: false,
  autoFocus: false,
  inputStyle: {},
  adornmentStyle: {},
  formControlStyle: {}
};
var handleSearch = function handleSearch(e, handleChange, setValue) {
  e.persist();
  handleChange(e);
  if (setValue) {
    setValue(e.target.value);
  }
};
var useStyles = (0, _styles.makeStyles)({
  underline: {
    "&:before": {
      borderBottom: "1px solid rgb(181, 185, 190)!important"
    },
    "&:after": {
      borderBottom: "2px solid rgb(22, 136, 189)"
    }
  }
});
var SearchField = function SearchField(_ref) {
  var id = _ref.id,
    placeholder = _ref.placeholder,
    handleChange = _ref.handleChange,
    handleClear = _ref.handleClear,
    filters = _ref.filters,
    value = _ref.value,
    handleClearFilters = _ref.handleClearFilters,
    label = _ref.label,
    disabled = _ref.disabled,
    autoFocus = _ref.autoFocus,
    dir = _ref.dir,
    inputStyle = _ref.inputStyle,
    adornmentStyle = _ref.adornmentStyle,
    formControlStyle = _ref.formControlStyle;
  var dispatch = (0, _reactRedux.useDispatch)();
  var classes = useStyles();
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    ownValue = _useState2[0],
    setValue = _useState2[1];
  (0, _react.useEffect)(function () {
    if (value !== ownValue) {
      setValue(value);
    }
  }, [value]);
  var styles = {
    input: _objectSpread(_objectSpread({}, dir === "rtl" ? {
      marginLeft: 48
    } : {
      marginRight: 48
    }), {}, {
      width: "100%",
      color: "#fff",
      fontSize: 14
    }),
    icon: _objectSpread({
      position: "relative",
      right: -48
    }, dir === "rtl" && {
      marginRight: 8,
      marginLeft: 0
    }),
    filter: _objectSpread(_objectSpread({
      minWidth: "auto",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "transparent"
      }
    }, dir === "rtl" && {
      paddingRight: 0
    }), dir === "ltr" && {
      paddingLeft: 0
    }),
    visibility: _objectSpread(_objectSpread({}, dir === "rtl" && {
      paddingLeft: 6
    }), dir === "ltr" && {
      paddingRight: 6
    })
  };
  var filtered = Boolean(filters);
  return /*#__PURE__*/_react["default"].createElement(_material.FormControl, {
    sx: _objectSpread({
      flexDirection: "row",
      maxHeight: 32
    }, formControlStyle),
    margin: "normal",
    fullWidth: !filtered,
    disabled: disabled
  }, label && /*#__PURE__*/_react["default"].createElement(_material.InputLabel, null, label), /*#__PURE__*/_react["default"].createElement(_material.Input, {
    id: id,
    style: _objectSpread(_objectSpread({}, styles.input), inputStyle),
    value: ownValue,
    placeholder: placeholder,
    onChange: function onChange(e) {
      handleSearch(e, handleChange, setValue);
    },
    endAdornment: /*#__PURE__*/_react["default"].createElement(_material.InputAdornment, {
      style: styles.icon,
      position: "end"
    }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      disabled: !ownValue,
      onClick: function onClick() {
        setValue("");
        handleClear();
      },
      sx: {
        padding: "12px"
      }
    }, ownValue ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, {
      sx: _objectSpread({
        color: "rgba(255, 255, 255, 0.3)"
      }, adornmentStyle)
    }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Search, {
      sx: _objectSpread({
        color: "rgba(255, 255, 255, 0.3)"
      }, adornmentStyle)
    }))),
    autoComplete: "off",
    autoFocus: autoFocus,
    classes: {
      underline: classes.underline
    }
  }), filtered && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    style: (0, _filter["default"])(styles),
    onClick: function onClick() {
      return dispatch(handleClearFilters());
    },
    color: "primary",
    disableFocusRipple: true
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Visibility, {
    style: styles.visibility
  }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    color: "inherit",
    noWrap: true
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBSearchField.searchField.clear",
    count: filters
  }))));
};
SearchField.propTypes = propTypes;
SearchField.defaultProps = defaultProps;
var _default = SearchField;
exports["default"] = _default;