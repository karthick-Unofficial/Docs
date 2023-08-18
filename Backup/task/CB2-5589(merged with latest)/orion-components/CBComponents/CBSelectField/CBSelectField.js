"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _map = _interopRequireDefault(require("lodash/map"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  root: {
    backgroundColor: "#2c2d2f"
  },
  icon: {
    right: "unset!important",
    left: "0!important",
    background: "transparent"
  },
  select: {
    paddingRight: "0!important",
    textAlign: "right"
  },
  underline: {
    "&:before": {
      borderBottom: "1px solid rgb(181, 185, 190)!important"
    },
    "&:after": {
      borderBottom: "2px solid rgb(22, 136, 189)"
    }
  },
  selectBackground: {
    background: "transparent!important"
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  formControlProps: _propTypes["default"].object,
  id: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].array, _propTypes["default"].number, _propTypes["default"].object]).isRequired,
  inputProps: _propTypes["default"].object,
  items: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  children: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  handleChange: _propTypes["default"].func.isRequired,
  open: _propTypes["default"].bool,
  handleOpen: _propTypes["default"].func,
  controlled: _propTypes["default"].bool,
  multiple: _propTypes["default"].bool,
  maxHeight: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  error: _propTypes["default"].bool,
  helperText: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  disabled: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  label: "",
  items: [],
  children: [],
  open: false,
  handleOpen: function handleOpen() {},
  controlled: false,
  multiple: false,
  maxHeight: "auto",
  helperText: "",
  disabled: false
};
var CBSelectField = function CBSelectField(_ref) {
  var classes = _ref.classes,
    formControlProps = _ref.formControlProps,
    id = _ref.id,
    label = _ref.label,
    value = _ref.value,
    inputProps = _ref.inputProps,
    items = _ref.items,
    handleChange = _ref.handleChange,
    children = _ref.children,
    open = _ref.open,
    handleOpen = _ref.handleOpen,
    controlled = _ref.controlled,
    multiple = _ref.multiple,
    error = _ref.error,
    helperText = _ref.helperText,
    disabled = _ref.disabled,
    dir = _ref.dir;
  var inlineStyles = {
    menuProps: _objectSpread(_objectSpread({}, dir === "rtl" && {
      width: "unset"
    }), dir === "ltr" && {
      width: 0
    }),
    inputLabelProps: _objectSpread(_objectSpread(_objectSpread({
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    }, dir === "rtl" && {
      width: "100%",
      transformOrigin: "top right",
      textAlign: "right"
    }), dir === "ltr" && {
      width: "90%",
      transformOrigin: "top left",
      textAlign: "left"
    }), {}, {
      color: "#B5B9BE",
      fontSize: 14
    }),
    formHelperTextProps: _objectSpread({}, dir === "rtl" && {
      position: "unset !important",
      textAlign: "right",
      opacity: "1 !important"
    }),
    menuItem: _objectSpread(_objectSpread({
      display: "block",
      textOverflow: "ellipsis"
    }, dir === "ltr" && {
      textAlign: "left"
    }), dir === "rtl" && {
      textAlign: "rightF"
    })
  };
  /**
   * If Select Field is set to controlled, add necessary additional props
   * onClose is mocked in order to control open state with passed handleChange function
   */
  var controlProps = controlled ? {
    open: open,
    onOpen: handleOpen,
    onClose: function onClose() {}
  } : {};
  return (
    /*#__PURE__*/
    // TODO: Potentially update to use FormControl and Select components
    _react["default"].createElement(_material.TextField, (0, _extends2["default"])({}, formControlProps, {
      id: id,
      select: true,
      disabled: disabled,
      variant: "standard",
      label: label,
      error: error,
      onChange: handleChange,
      SelectProps: _objectSpread({
        classes: dir && dir == "rtl" ? {
          icon: classes.icon,
          select: classes.select
        } : {
          select: classes.selectBackground
        },
        multiple: multiple,
        MenuProps: {
          style: inlineStyles.menuProps,
          // Setting width to 0 prevents menu from expanding beyond TextField
          // Setting width to "unset" prevents dropdown position issues in RTL styling.
          anchorOrigin: {
            vertical: "top",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
          getContentAnchorEl: null,
          MenuListProps: {
            className: (0, _classnames["default"])(classes.root, "cb-select-field-list")
          }
        }
      }, controlProps),
      InputProps: _objectSpread(_objectSpread({}, inputProps), {}, {
        classes: {
          underline: classes.underline
        }
      }),
      InputLabelProps: {
        style: inlineStyles.inputLabelProps
      },
      margin: "normal",
      fullWidth: true,
      value: value,
      helperText: helperText,
      FormHelperTextProps: {
        style: inlineStyles.formHelperTextProps
      }
    }), children, (0, _map["default"])(items, function (item) {
      return (
        /*#__PURE__*/
        // display: "block" solves text-overflow: "ellipsis" conflict with flex (https://github.com/mui-org/material-ui/issues/11380)
        _react["default"].createElement(_material.MenuItem, {
          key: item.id,
          value: item.id,
          style: inlineStyles.menuItem
        }, item.name || item.value)
      );
    }))
  );
};
CBSelectField.propTypes = propTypes;
CBSelectField.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(CBSelectField);
exports["default"] = _default;