"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.toTitleCase = exports.getIconByTemplate = exports.getIcon = void 0;
var _react = _interopRequireDefault(require("react"));
var _mdiMaterialUi = require("mdi-material-ui");
var _Icons = require("orion-components/CBComponents/Icons");
var _js = require("@mdi/js");
var _material = require("@mui/material");
var jsonata = require("jsonata");
var toTitleCase = function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
exports.toTitleCase = toTitleCase;
var getIcon = function getIcon(type) {
  var fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "2rem";
  var icon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (!icon) {
    switch (type) {
      case "Track":
        icon = "directions_boat";
        break;
      case "Point":
        icon = "place";
        break;
      case "Polygon":
        icon = "layers";
        break;
      case "Line":
        icon = "timeline";
        break;
      case "Vehicle":
        icon = "directions_car";
        break;
      case "Person":
        icon = "person";
        break;
      case "Camera":
        icon = "videocam";
        break;
      case "Planned":
      case "Event":
        icon = "event";
        break;
      case "Emergent":
        icon = "report_problem";
        break;
      case "external_link":
        icon = "language";
        break;
      case "Collection":
        icon = /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.RhombusSplit, {
          fontSize: "large"
        });
        break;
      case "Facility":
        icon = /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.HomeCity, {
          fontSize: "large"
        });
        break;
      case "Access Point":
      case "AccessPoint":
      case "Door":
      case "accessPoint":
        icon = /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
          style: {
            width: 34,
            height: 34
          }
        }, /*#__PURE__*/_react["default"].createElement("path", {
          d: _js.mdiAccessPoint
        }));
        break;
      case "Zetron":
        icon = /*#__PURE__*/_react["default"].createElement(_mdiMaterialUi.Phone, {
          style: {
            width: "24px",
            height: "24px",
            color: "#FFFFFF"
          }
        });
        break;
      case "Robot Track":
      case "Ghost Robotics Dog":
        icon = /*#__PURE__*/_react["default"].createElement(_Icons.RobotDogIcon, null);
        break;
      case "drone":
        icon = /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
          style: {
            width: 34,
            height: 34
          }
        }, /*#__PURE__*/_react["default"].createElement("path", {
          d: _js.mdiQuadcopter
        }));
        break;
      case "drone-controller":
        icon = /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
          style: {
            width: 44,
            height: 44
          }
        }, /*#__PURE__*/_react["default"].createElement("path", {
          d: _js.mdiGoogleController
        }));
        break;
      case "drone-home":
        icon = /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
          style: {
            width: 34,
            height: 34
          }
        }, /*#__PURE__*/_react["default"].createElement("path", {
          d: _js.mdiHome
        }));
        break;
      default:
        break;
    }
  }
  if (typeof icon === "string") {
    return /*#__PURE__*/_react["default"].createElement("i", {
      className: "material-icons",
      style: {
        fontSize: fontSize,
        color: "#B5B9BE"
      }
    }, icon);
  } else {
    return icon;
  }
};
exports.getIcon = getIcon;
var getIconByTemplate = function getIconByTemplate(type, entity) {
  var fontSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "2rem";
  var profileIconTemplate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var icon = null;
  if (profileIconTemplate && entity.entityData) {
    var expression = jsonata(profileIconTemplate);
    icon = expression.evaluate(entity.entityData);
  }
  return getIcon(type, fontSize, icon);
};
exports.getIconByTemplate = getIconByTemplate;