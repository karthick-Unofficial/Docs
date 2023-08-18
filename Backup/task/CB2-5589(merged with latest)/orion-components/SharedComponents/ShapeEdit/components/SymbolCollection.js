"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _styles = require("@mui/styles");
var propTypes = {
  name: _propTypes["default"].string.isRequired,
  collection: _propTypes["default"].array.isRequired,
  expanded: _propTypes["default"].bool.isRequired,
  handleExpand: _propTypes["default"].func.isRequired,
  handleSelect: _propTypes["default"].func.isRequired,
  search: _propTypes["default"].string
};
var defaultProps = {
  search: ""
};
var styles = {
  expandIconWrapper: {
    color: "#fff",
    opacity: 0.3
  },
  expanded: {
    minHeight: "unset!important",
    margin: "12px 0!important"
  }
};
var SymbolCollection = function SymbolCollection(_ref) {
  var _context;
  var name = _ref.name,
    collection = _ref.collection,
    expanded = _ref.expanded,
    handleSelect = _ref.handleSelect,
    handleExpand = _ref.handleExpand,
    search = _ref.search,
    classes = _ref.classes;
  return /*#__PURE__*/_react["default"].createElement(_material.Accordion, {
    expanded: expanded,
    onChange: handleExpand,
    sx: {
      margin: "0 0 8px 0",
      boxShadow: "none"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null),
    sx: {
      background: "#41454a",
      padding: "0px 16px"
    },
    classes: {
      expandIconWrapper: classes.expandIconWrapper,
      expanded: classes.expanded
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, null, name)), /*#__PURE__*/_react["default"].createElement(_material.AccordionDetails, {
    sx: {
      padding: "8px 16px 16px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    spacing: 2
  }, (0, _map["default"])(_context = (0, _filter["default"])(collection).call(collection, function (symbol) {
    var _context2;
    var name = symbol.name,
      keywords = symbol.keywords;
    var filtered = (0, _includes["default"])(_context2 = name.toLowerCase()).call(_context2, search) || !!(0, _filter["default"])(keywords).call(keywords, function (keyword) {
      var _context3;
      return (0, _includes["default"])(_context3 = keyword.toLowerCase()).call(_context3, search);
    }).length > 0;
    return filtered;
  })).call(_context, function (symbol) {
    var name = symbol.name,
      path = symbol.path;
    return /*#__PURE__*/_react["default"].createElement(_material.Grid, {
      item: true,
      key: name,
      xs: 2.4,
      onClick: function onClick() {
        return handleSelect(name);
      }
    }, /*#__PURE__*/_react["default"].createElement("img", {
      style: {
        width: 50,
        height: 50,
        marginTop: 7.5,
        cursor: "pointer"
      },
      alt: name,
      src: require("../icons".concat(path))
    }));
  }))));
};
SymbolCollection.propTypes = propTypes;
SymbolCollection.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(SymbolCollection);
exports["default"] = _default;