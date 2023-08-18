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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _colors = require("@mui/material/colors");
var _styles = require("@mui/styles");
var _i18n = require("orion-components/i18n");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var materialStyles = function materialStyles(theme) {
  return {
    stepper: {
      padding: 10,
      paddingBottom: 57
    },
    icon: {
      backgroundColor: "white",
      color: "white !important",
      borderRadius: 12
    },
    label: {
      color: "white !important"
    },
    labelContainer: {
      position: "absolute",
      top: -25
    },
    iconContainer: {
      zIndex: 1,
      position: "absolute",
      top: 20
    },
    iconCompleted: {
      backgroundColor: "".concat(_colors.teal["A400"]),
      color: "".concat(_colors.teal["A400"], " !important")
    },
    iconActive: {
      backgroundColor: "".concat(_colors.teal["A400"]),
      color: "".concat(_colors.teal["A400"], " !important")
    },
    text: {
      display: "none"
    },
    connector: {
      top: 29,
      left: "-50%",
      right: "50%",
      "& $connectorLine": {
        borderColor: "white !important"
      }
    },
    lineHorizontal: {
      borderTopWidth: 6
    },
    connectorActive: {
      "& $connectorLine": {
        borderColor: "".concat(_colors.teal["A400"], " !important")
      }
    },
    connectorCompleted: {
      "& $connectorLine": {
        borderColor: "".concat(_colors.teal["A400"], " !important")
      }
    },
    connectorLine: {
      transition: theme.transitions.create("border-color")
    }
  };
};
var CADDetailsWidget = function CADDetailsWidget(_ref) {
  var address = _ref.address,
    activeStep = _ref.activeStep,
    order = _ref.order,
    steps = _ref.steps,
    classes = _ref.classes,
    dir = _ref.dir;
  var connector = /*#__PURE__*/_react["default"].createElement(_material.StepConnector, {
    classes: {
      root: classes.connector,
      lineHorizontal: classes.lineHorizontal,
      active: classes.connectorActive,
      completed: classes.connectorCompleted,
      line: classes.connectorLine
    }
  });
  var styles = {
    div: _objectSpread(_objectSpread({
      display: "flex",
      fontSize: 13,
      fontColor: "white",
      paddingTop: 5,
      justifyContent: "space-between"
    }, dir === "ltr" && {
      paddingLeft: "3%",
      paddingRight: "7%"
    }), dir === "rtl" && {
      paddingRight: "3%",
      paddingLeft: "7%"
    }),
    addressLabel: {
      color: "white"
    },
    addressContent: {
      textAlign: "center",
      color: "white"
    }
  };
  return /*#__PURE__*/_react["default"].createElement("section", {
    className: "widget-wrapper cad-details-widget ".concat("index-" + order)
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.CADDetails.title"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, steps && /*#__PURE__*/_react["default"].createElement(_material.Stepper, {
    classes: {
      root: classes.stepper
    },
    activeStep: activeStep,
    connector: connector,
    alternativeLabel: true
  }, (0, _map["default"])(steps).call(steps, function (label, index) {
    var completed = false;
    var active = false;
    if (index + 1 <= steps.length - 1) {
      completed = index + 1 <= activeStep ? true : false;
    } else if (index === steps.length - 1) {
      completed = index === activeStep ? true : false;
    }
    if (!completed) {
      active = index === activeStep ? true : false;
    }
    return /*#__PURE__*/_react["default"].createElement(_material.Step, {
      completed: completed,
      active: active,
      key: label
    }, /*#__PURE__*/_react["default"].createElement(_material.StepLabel, {
      classes: {
        iconContainer: classes.iconContainer,
        label: classes.label,
        labelContainer: classes.labelContainer
      },
      StepIconProps: {
        classes: {
          root: classes.icon,
          completed: classes.iconCompleted,
          active: classes.iconActive,
          text: classes.text
        }
      }
    }, label));
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.div
  }, /*#__PURE__*/_react["default"].createElement("span", {
    style: styles.addressLabel
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.CADDetails.address"
  })), address && /*#__PURE__*/_react["default"].createElement("span", {
    style: styles.addressContent
  }, address))));
};
var _default = (0, _styles.withStyles)(materialStyles)(CADDetailsWidget);
exports["default"] = _default;