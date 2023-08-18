"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _CBComponents = require("orion-components/CBComponents");
var _clientAppCore = require("client-app-core");
var _ColorTiles = _interopRequireDefault(require("./ColorTiles"));
var _TransparencySlider = _interopRequireDefault(require("./TransparencySlider"));
var _StrokeProperties = _interopRequireDefault(require("./StrokeProperties"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _styles = require("@mui/styles");
var styles = {
  root: {
    "&.Mui-focused": {
      backgroundColor: "rgb(31, 31, 33)"
    }
  },
  input: {
    "&::placeholder": {
      fontSize: 14
    },
    height: "unset!important",
    color: "#fff"
  }
};
var ProximityDialog = function ProximityDialog(_ref) {
  var closeDialog = _ref.closeDialog,
    strokeType = _ref.strokeType,
    strokeThickness = _ref.strokeThickness,
    name = _ref.name,
    fillColor = _ref.fillColor,
    transparency = _ref.transparency,
    strokeColor = _ref.strokeColor,
    radius = _ref.radius,
    distanceUnits = _ref.distanceUnits,
    contextId = _ref.contextId,
    proximityId = _ref.proximityId,
    dialog = _ref.dialog,
    isEditing = _ref.isEditing,
    handleChangeName = _ref.handleChangeName,
    handleChangeRadius = _ref.handleChangeRadius,
    handleChangeDistanceUnits = _ref.handleChangeDistanceUnits,
    handleChangeLineType = _ref.handleChangeLineType,
    handleChangeLineWidth = _ref.handleChangeLineWidth,
    handleChangePolyFill = _ref.handleChangePolyFill,
    handleChangePolyFillOpacity = _ref.handleChangePolyFillOpacity,
    handleChangePolyStroke = _ref.handleChangePolyStroke,
    dir = _ref.dir,
    classes = _ref.classes;
  var dispatch = (0, _reactRedux.useDispatch)();
  var handleCloseProximityDialog = function handleCloseProximityDialog() {
    dispatch(closeDialog("proximityDialog"));
  };
  var createProximity = function createProximity() {
    var proximity = {
      id: +new Date(),
      lineType: strokeType,
      lineWidth: strokeThickness,
      name: name,
      polyFill: fillColor,
      polyFillOpacity: transparency / 100,
      polyStroke: strokeColor,
      radius: radius,
      distanceUnits: distanceUnits
    };
    _clientAppCore.eventService.addProximity(contextId, proximity, function (err, response) {
      if (err) console.log(err, response);
    });
    handleCloseProximityDialog();
  };
  var updateProximity = function updateProximity() {
    var proximity = {
      id: proximityId,
      lineType: strokeType,
      lineWidth: strokeThickness,
      name: name,
      polyFill: fillColor,
      polyFillOpacity: transparency / 100,
      polyStroke: strokeColor,
      radius: radius,
      distanceUnits: distanceUnits
    };
    _clientAppCore.eventService.updateProximity(contextId, proximityId, proximity, function (err, response) {
      if (err) console.log(err, response);
    });
    handleCloseProximityDialog();
  };
  var styles = {
    listStyles: {
      backgroundColor: "#41454A",
      marginBottom: ".75rem"
    },
    error: {
      textAlign: "center",
      padding: "10px"
    },
    progress: {
      textAlign: "center",
      padding: "15px 0"
    },
    input: {
      padding: "12px 10px"
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: dialog === "proximityDialog",
    confirm: isEditing ? {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityDialog.update"),
      action: updateProximity,
      disabled: name === "" || radius === "" || radius === "."
    } : {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityDialog.create"),
      action: createProximity,
      disabled: name === "" || radius === ""
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityDialog.cancel"),
      action: handleCloseProximityDialog
    },
    options: {
      onClose: handleCloseProximityDialog,
      maxWidth: "sm"
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      color: "white"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.proximity.proximityDialog.name"
  }))), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "name",
    onChange: handleChangeName,
    value: name,
    variant: "filled",
    autoFocus: true,
    style: {
      borderRadius: 5,
      padding: "10px 0 0 0"
    },
    InputProps: {
      classes: {
        root: classes.root,
        input: classes.input
      },
      style: {
        lineHeight: "unset"
      }
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles,
    className: "radius"
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      color: "white"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.proximity.proximityDialog.radius"
  }))), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "proximity-radius",
    onChange: handleChangeRadius,
    value: radius,
    variant: "filled",
    style: {
      borderRadius: 5
    },
    InputProps: {
      classes: {
        root: classes.root,
        input: classes.input
      },
      style: {
        lineHeight: "unset"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    className: "selectDistanceUnit",
    id: "distance-unit",
    label: (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityDialog.unit"),
    handleChange: handleChangeDistanceUnits,
    value: distanceUnits,
    underlineShow: false,
    style: {
      width: "100px"
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "km",
    value: "km"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.proximity.proximityDialog.kilometers"
  })), /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    key: "mi",
    value: "mi"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.proximity.proximityDialog.miles"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "12px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_ColorTiles["default"], {
    selectedColor: fillColor,
    title: (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityDialog.fillColor"),
    setData: handleChangePolyFill
  })), /*#__PURE__*/_react["default"].createElement(_TransparencySlider["default"], {
    transparency: transparency,
    setData: handleChangePolyFillOpacity,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "0px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_ColorTiles["default"], {
    selectedColor: strokeColor,
    title: (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityDialog.strokeColor"),
    setData: handleChangePolyStroke
  }), /*#__PURE__*/_react["default"].createElement(_StrokeProperties["default"], {
    thickness: strokeThickness,
    type: strokeType,
    titleNoun: (0, _i18n.getTranslation)("global.profiles.widgets.proximity.proximityDialog.stroke"),
    setThickness: handleChangeLineWidth,
    setType: handleChangeLineType,
    dir: dir
  })));
};
var _default = (0, _styles.withStyles)(styles)(ProximityDialog);
exports["default"] = _default;