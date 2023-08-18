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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _i18n = require("orion-components/i18n");
var _styles = require("@mui/styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  thickness: _propTypes["default"].number.isRequired,
  type: _propTypes["default"].string.isRequired,
  titleNoun: _propTypes["default"].string.isRequired,
  setThickness: _propTypes["default"].func.isRequired,
  setType: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string
};
var defaultProps = {
  thickness: 3,
  type: "solid",
  titleNoun: "Stroke",
  setThickness: function setThickness() {},
  setType: function setType() {},
  dir: "ltr"
};
var styles = {
  selected: {
    backgroundColor: "rgba(255, 255, 255, 0.16)!important"
  }
};
var StrokeProperties = function StrokeProperties(_ref) {
  var thickness = _ref.thickness,
    type = _ref.type,
    titleNoun = _ref.titleNoun,
    setThickness = _ref.setThickness,
    setType = _ref.setType,
    dir = _ref.dir,
    classes = _ref.classes;
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    thicknessTitle = _useState2[0],
    setThicknessTitle = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    typeTitle = _useState4[0],
    setTypeTitle = _useState4[1];
  (0, _react.useEffect)(function () {
    switch (titleNoun) {
      case "Stroke":
        setThicknessTitle((0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.strokeProps.strokeThickness"));
        setTypeTitle((0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.strokeProps.strokeType"));
        break;
      case "Line":
        setThicknessTitle((0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.strokeProps.lineThickness"));
        setTypeTitle((0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.strokeProps.lineType"));
        break;
      default:
        setThicknessTitle("".concat(titleNoun, " Thickness"));
        setTypeTitle("".concat(titleNoun, " Type"));
    }
  }, [titleNoun]);
  var handleThicknessChange = function handleThicknessChange(e) {
    var value = e.target.value;
    setThickness(value);
  };
  var handleTypeChange = function handleTypeChange(e) {
    var value = e.target.value;
    setType(value);
  };
  var thicknessOptions = [1, 2, 3, 4, 5, 6];
  var strokeTypeOptions = ["Solid", "Dashed", "Dotted"];
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "45%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "".concat(titleNoun, "-thickness"),
    label: thicknessTitle,
    handleChange: handleThicknessChange,
    value: thickness,
    inputProps: {
      style: {
        fontSize: 14
      }
    },
    dir: dir
  }, (0, _map["default"])(thicknessOptions).call(thicknessOptions, function (thickVal) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      key: thickVal,
      value: thickVal,
      style: {
        fontSize: 14
      },
      classes: {
        selected: classes.selected
      }
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.sharedComponents.shapeEdit.strokeProps.point",
      count: thickVal
    }));
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "45%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "".concat(titleNoun, "-type"),
    label: typeTitle,
    handleChange: handleTypeChange,
    value: type,
    inputProps: {
      style: {
        fontSize: 14
      }
    },
    dir: dir
  }, (0, _map["default"])(strokeTypeOptions).call(strokeTypeOptions, function (strokeVal) {
    return /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
      key: strokeVal,
      value: strokeVal,
      style: {
        fontSize: 14
      },
      classes: {
        selected: classes.selected
      }
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.sharedComponents.shapeEdit.strokeProps.".concat(strokeVal)
    }));
  })))));
};
StrokeProperties.propTypes = propTypes;
StrokeProperties.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(StrokeProperties);
exports["default"] = _default;