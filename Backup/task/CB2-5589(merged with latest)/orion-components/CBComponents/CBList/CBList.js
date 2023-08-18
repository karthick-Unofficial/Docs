"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var propTypes = {
  classes: _propTypes["default"].object,
  listItems: _propTypes["default"].array.isRequired,
  listItemStyle: _propTypes["default"].object
};
var defaultProps = {
  listItemStyle: null
};
var styles = {
  root: {
    width: "100%"
  },
  primary: {
    color: "white",
    fontFamily: "Roboto",
    lineHeight: "20px",
    fontSize: "16px"
  },
  listItem: {
    backgroundColor: "#41454A",
    margin: "4px 0",
    height: "60px"
  },
  avatar: {
    backgroundColor: "#1f1f21",
    color: "white"
  },
  errorIcon: {
    color: "white"
  }
};

// Return correct avatar based on type
var avatar = function avatar(type) {
  switch (type) {
    case "user":
      return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Person, null);
    case "event":
      return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Event, null);
    case "track":
      return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.DirectionsBoat, null);
    case "camera":
      return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Videocam, null);
    case "polygon":
      return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Layers, null);
    case "line":
      return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Timeline, null);
    case "point":
      return /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Place, null);
    default:
      return type;
  }
};

/**
 * A pre-styled CB list
 * @param classes {object} -- MaterialUi class overwrites
 * @param listItems {array} -- Array of objects you want to display as list items (See below for example)
 * -- A helper method in /Helpers/transform can transform any CB data type (users, events, tracks, shapes, etc)
 * -- Into the correct input for this method
 * @param listItemStyle {object} -- Optional list style object to overwrite default list item styling
 */
var CBList = function CBList(_ref) {
  var classes = _ref.classes,
    listItems = _ref.listItems,
    listItemStyle = _ref.listItemStyle;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: classes.root
  }, /*#__PURE__*/_react["default"].createElement(_material.List, null, listItems && (0, _map["default"])(listItems).call(listItems, function (item) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      key: item.id,
      style: listItemStyle ? listItemStyle : styles.listItem,
      onClick: item.action ? item.action : null
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemAvatar, null, /*#__PURE__*/_react["default"].createElement(_material.Avatar, {
      className: classes.avatar
    }, item.avatar && avatar(item.avatar))), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: item.name,
      classes: {
        primary: classes.primary
      }
    }), (item.icon || item.errorMessage) && /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, null, item.errorMessage && /*#__PURE__*/_react["default"].createElement(_material.Tooltip, {
      title: item.errorMessage,
      placement: "left"
    }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      "aria-label": "Error",
      className: classes.errorIcon
    }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Error, null))), !item.errorMessage && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
      "aria-label": "Error",
      className: classes.errorIcon
    }, item.icon === "error" ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Error, null) : item.icon === "add" ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.AddCircle, null) : item.icon === "remove" ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.RemoveCircle, null) : null)));
  })));
};
CBList.propTypes = propTypes;
CBList.defaultProps = defaultProps;

/**
 * listItem example
 * {
 *      id: string,
 *      name: string,
 *      avatar: string (track, user, shape, line, point, camera, or event)
 * }
 */
var _default = (0, _styles.withStyles)(styles)(CBList);
exports["default"] = _default;