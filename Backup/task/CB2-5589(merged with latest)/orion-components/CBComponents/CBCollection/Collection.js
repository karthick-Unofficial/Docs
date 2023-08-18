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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _Icons = require("orion-components/CBComponents/Icons");
var _SharedComponents = require("orion-components/SharedComponents");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  root: {
    color: "#fff",
    backgroundColor: "#494D53",
    "&:hover": {
      backgroundColor: "#494D53"
    },
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 12,
    minHeight: 70
  },
  selected: {
    backgroundColor: "#494D53",
    borderRight: "3px solid #35b7f3"
  },
  container: {
    paddingLeft: 30
  },
  nested: {
    marginBottom: 8,
    paddingLeft: 60
  },
  containerRTL: {
    paddingRight: 30
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  primaryText: _propTypes["default"].string.isRequired,
  secondaryText: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  selected: _propTypes["default"].bool,
  childSelected: _propTypes["default"].bool,
  children: _propTypes["default"].array,
  alerts: _propTypes["default"].bool,
  icon: _propTypes["default"].element,
  handleSelect: _propTypes["default"].func,
  commentCount: _propTypes["default"].number,
  filterButton: _propTypes["default"].element,
  open: _propTypes["default"].bool,
  dir: _propTypes["default"].string,
  filterType: _propTypes["default"].string,
  geometry: _propTypes["default"].object,
  feedId: _propTypes["default"].string,
  id: _propTypes["default"].string,
  sharedBy: _propTypes["default"].string,
  targetingEnabled: _propTypes["default"].bool,
  iconStyles: _propTypes["default"].object
};
var defaultProps = {
  secondaryText: "",
  selected: false,
  childSelected: false,
  children: [],
  alerts: false,
  filtered: false,
  handleFilter: null,
  icon: null,
  handleSelect: null,
  commentCount: 0,
  filterButton: null,
  targetingEnabled: true
};
var Collection = function Collection(_ref) {
  var open = _ref.open,
    classes = _ref.classes,
    primaryText = _ref.primaryText,
    secondaryText = _ref.secondaryText,
    selected = _ref.selected,
    childSelected = _ref.childSelected,
    children = _ref.children,
    alerts = _ref.alerts,
    filterButton = _ref.filterButton,
    icon = _ref.icon,
    handleSelect = _ref.handleSelect,
    commentCount = _ref.commentCount,
    dir = _ref.dir,
    filterType = _ref.filterType,
    geometry = _ref.geometry,
    feedId = _ref.feedId,
    id = _ref.id,
    sharedBy = _ref.sharedBy,
    targetingEnabled = _ref.targetingEnabled,
    iconStyles = _ref.iconStyles;
  var _useState = (0, _react.useState)(open ? true : false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    stateOpen = _useState2[0],
    setStateOpen = _useState2[1];
  var handleExpand = function handleExpand(e) {
    e.preventDefault();
    e.stopPropagation();
    setStateOpen(!stateOpen);
  };
  var styles = {
    primary: {
      color: "#fff"
    },
    secondary: {
      color: "#B5B9BE"
    },
    icon: _objectSpread(_objectSpread({}, dir === "ltr" && {
      marginRight: 0
    }), dir === "rtl" && {
      marginLeft: 0
    }),
    commentIcon: _objectSpread(_objectSpread(_objectSpread({}, dir === "ltr" && {
      marginRight: 0
    }), dir === "rtl" && {
      marginLeft: 0
    }), {}, {
      minWidth: "35px"
    }),
    layered: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "35px"
    },
    selected: {
      backgroundColor: "#383D48"
    },
    childSelected: {
      borderWidth: dir === "rtl" ? "0 0 0 3px" : "0 3px 0 0",
      borderColor: "#383D48",
      borderStyle: "solid"
    },
    textRightAlign: _objectSpread(_objectSpread({}, sharedBy && {
      margin: 0
    }), dir === "rtl" && {
      textAlign: "right"
    }),
    targetingIcon: _objectSpread(_objectSpread({}, dir === "ltr" && {
      paddingLeft: 0
    }), dir === "rtl" && {
      paddingRight: 0
    }),
    shareIcon: _objectSpread(_objectSpread({
      fontSize: 14,
      color: "rgb(181, 185, 190)"
    }, dir === "ltr" && {
      marginRight: 5
    }), dir === "rtl" && {
      marginLeft: 5
    })
  };
  var getSecondaryText = function getSecondaryText() {
    if (sharedBy) {
      var _context;
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, secondaryText, /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          display: "flex"
        }
      }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Share, {
        style: styles.shareIcon
      }), (0, _concat["default"])(_context = "".concat((0, _i18n.getTranslation)("global.CBComponents.CBCollection.sharedBy"), " ")).call(_context, sharedBy)));
    } else {
      return secondaryText || null;
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: Boolean(handleSelect),
    onClick: handleSelect ? handleSelect : null,
    style: selected ? styles.selected : childSelected ? styles.childSelected : {},
    className: (0, _classnames["default"])(classes.root)
  }, !filterType && children.length > 0 && /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
    style: {
      minWidth: "auto"
    }
  }, stateOpen ? /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null)) : /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null))), filterType && targetingEnabled && (id && feedId || geometry) && /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    feedId: feedId,
    id: id,
    geometry: geometry,
    iconContainerStyle: styles.targetingIcon
  }), children.length > 0 && Boolean(filterButton) && /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, null, filterButton), icon && /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
    style: iconStyles || styles.icon
  }, icon, filterType && /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.CBComponents.CBCollection.".concat(filterType),
    style: {
      fontSize: 9,
      marginTop: 5
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: primaryText,
    secondary: getSecondaryText(),
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1",
      component: "p"
    },
    secondaryTypographyProps: {
      style: styles.secondary,
      noWrap: true,
      variant: "body2"
    },
    style: styles.textRightAlign
  }), alerts && /*#__PURE__*/_react["default"].createElement(_Icons.Alert, {
    fontSize: "large"
  }), Boolean(commentCount) && /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.layered
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
    style: styles.commentIcon
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ChatBubble, {
    style: styles.secondary,
    fontSize: "large"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      position: "absolute",
      bottom: 26,
      color: "#000"
    }
  }, commentCount < 1000 ? commentCount : "1k+"))), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    className: dir && dir == "rtl" ? classes.containerRTL : classes.container,
    "in": stateOpen,
    timeout: "auto",
    unmountOnExit: true
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, children)));
};
Collection.propTypes = propTypes;
Collection.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(Collection);
exports["default"] = _default;