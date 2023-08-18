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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _styles = require("@mui/styles");
var _GISManagement = _interopRequireDefault(require("./GISManagement"));
var _i18n = require("orion-components/i18n");
var _includes = _interopRequireDefault(require("lodash/includes"));
var _flattenDeep = _interopRequireDefault(require("lodash/flattenDeep"));
var _map = _interopRequireDefault(require("lodash/map"));
var _size = _interopRequireDefault(require("lodash/size"));
var _filter = _interopRequireDefault(require("lodash/filter"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context7, _context8; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context7 = ownKeys(Object(source), !0)).call(_context7, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context8 = ownKeys(Object(source))).call(_context8, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  root: {
    color: "#FFF",
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  text: {
    "&:hover": {
      backgroundColor: "transparent"
    },
    textTransform: "none",
    padding: 0,
    justifyContent: "flex-start"
  },
  thumbOff: {
    backgroundColor: "#bdbdbd"
  },
  trackOff: {
    backgroundColor: "#fff",
    opacity: "0.3"
  }
};
var propTypes = {
  classes: _propTypes["default"].object,
  service: _propTypes["default"].object.isRequired,
  handleToggle: _propTypes["default"].func.isRequired,
  serviceState: _propTypes["default"].object,
  updateGISService: _propTypes["default"].func.isRequired,
  deleteGISService: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var defaultProps = {
  serviceState: {},
  dir: "ltr"
};
var GISCollection = function GISCollection(_ref) {
  var classes = _ref.classes,
    service = _ref.service,
    handleToggle = _ref.handleToggle,
    serviceState = _ref.serviceState,
    updateGISService = _ref.updateGISService,
    deleteGISService = _ref.deleteGISService,
    dir = _ref.dir;
  var inlineStyles = {
    listItemText: _objectSpread(_objectSpread({}, dir === "ltr" && {
      paddingLeft: 12
    }), dir === "rtl" && {
      paddingRight: 12,
      textAlign: "right"
    }),
    listItemSecondaryAction: _objectSpread({}, dir === "rtl" && {
      right: "unset",
      left: 16
    }),
    textAlignRight: _objectSpread({}, dir === "rtl" && {
      textAlign: "right"
    })
  };
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    open = _useState4[0],
    setOpen = _useState4[1];
  var renderListItem = function renderListItem(layer) {
    var layers = service.layers;
    var subLayerIds = layer.subLayerIds,
      id = layer.id,
      name = layer.name;
    var listItem;
    var isSubLayer = (0, _includes["default"])((0, _flattenDeep["default"])((0, _map["default"])(layers, function (layer) {
      return layer.subLayerIds;
    })), id);
    if (subLayerIds) {
      listItem = /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
        key: id
      }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
        disableGutters: true
      }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
        style: inlineStyles.listItemText,
        primary: name,
        secondary: (0, _size["default"])(subLayerIds) === 1 ? (0, _i18n.getTranslation)("global.map.controls.gisControl.gisCollection.layer", (0, _size["default"])(subLayerIds)) : (0, _i18n.getTranslation)("global.map.controls.gisControl.gisCollection.layers", (0, _size["default"])(subLayerIds)),
        primaryTypographyProps: {
          noWrap: true
        },
        secondaryTypographyProps: {
          noWrap: true
        }
      }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
        style: inlineStyles.listItemSecondaryAction
      }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
        className: classes.root,
        disableRipple: true,
        onClick: function onClick() {
          return handleExpand(id);
        }
      }, expanded[id] ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)))), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
        "in": expanded[id]
      }, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])((0, _filter["default"])(layers, function (layer) {
        return (0, _includes["default"])(subLayerIds, layer.id);
      }), function (layer) {
        var _context, _context2, _context3;
        return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
          key: layer.id
        }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
          primary: layer.name,
          primaryTypographyProps: {
            noWrap: true
          },
          secondaryTypographyProps: {
            noWrap: true
          },
          style: inlineStyles.textAlignRight
        }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
          style: inlineStyles.listItemSecondaryAction
        }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
          color: "primary",
          checked: !!serviceState[(0, _concat["default"])(_context = "".concat(service.id, "-")).call(_context, layer.id)] // Layers are stored in state with a unique ID from service and layer ID
          ,
          onChange: function onChange(e) {
            return handleToggle(service.id, layer.id, e.target.checked);
          },
          classes: {
            thumb: !serviceState[(0, _concat["default"])(_context2 = "".concat(service.id, "-")).call(_context2, layer.id)] && classes.thumbOff,
            track: !serviceState[(0, _concat["default"])(_context3 = "".concat(service.id, "-")).call(_context3, layer.id)] && classes.trackOff
          }
        })));
      }))));
    } else if (!isSubLayer) {
      var _context4, _context5, _context6;
      listItem = /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
        key: id,
        disableGutters: true
      }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
        style: inlineStyles.listItemText,
        primary: name,
        primaryTypographyProps: {
          noWrap: true
        },
        secondaryTypographyProps: {
          noWrap: true
        }
      }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
        style: inlineStyles.listItemSecondaryAction
      }, /*#__PURE__*/_react["default"].createElement(_material.Switch, {
        color: "primary",
        checked: !!serviceState[(0, _concat["default"])(_context4 = "".concat(service.id, "-")).call(_context4, id)],
        onChange: function onChange(e) {
          return handleToggle(service.id, id, e.target.checked);
        },
        classes: {
          thumb: !serviceState[(0, _concat["default"])(_context5 = "".concat(service.id, "-")).call(_context5, id)] && classes.thumbOff,
          track: !serviceState[(0, _concat["default"])(_context6 = "".concat(service.id, "-")).call(_context6, id)] && classes.trackOff
        }
      })));
    }
    return listItem;
  };
  var handleExpand = function handleExpand(id) {
    expanded[id] ? setExpanded(_objectSpread(_objectSpread({}, expanded), {}, (0, _defineProperty2["default"])({}, id, false))) : setExpanded(_objectSpread(_objectSpread({}, expanded), {}, (0, _defineProperty2["default"])({}, id, true)));
  };
  var handleOpen = function handleOpen() {
    setOpen(true);
  };
  var handleClose = function handleClose() {
    setOpen(false);
  };
  var layers = service.layers,
    properties = service.properties,
    id = service.id,
    authentication = service.authentication;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    disableGutters: true
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: properties.name,
    secondary: /*#__PURE__*/_react["default"].createElement(_material.Button, {
      onClick: handleOpen,
      size: "small",
      variant: "text",
      color: "primary",
      className: classes.text,
      disableRipple: true
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.map.controls.gisControl.gisCollection.manage"
    })),
    primaryTypographyProps: {
      noWrap: true
    },
    secondaryTypographyProps: {
      noWrap: true
    },
    style: inlineStyles.textAlignRight
  }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
    style: inlineStyles.listItemSecondaryAction
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    className: classes.root,
    disableRipple: true,
    onClick: function onClick() {
      return handleExpand(id);
    }
  }, expanded[id] ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandLess, null) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null)))), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": expanded[id]
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(layers, function (layer) {
    return renderListItem(layer);
  }))), /*#__PURE__*/_react["default"].createElement(_GISManagement["default"], {
    open: open,
    handleClose: handleClose,
    serviceId: id,
    properties: properties,
    authentication: authentication,
    name: properties.name,
    updateGISService: updateGISService,
    deleteGISService: deleteGISService,
    dir: dir
  }));
};
GISCollection.propTypes = propTypes;
GISCollection.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(GISCollection);
exports["default"] = _default;