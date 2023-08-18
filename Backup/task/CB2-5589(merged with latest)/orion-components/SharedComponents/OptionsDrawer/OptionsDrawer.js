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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _CBComponents = require("orion-components/CBComponents");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/AppState/Selectors");
var _selector = require("orion-components/i18n/Config/selector");
var _size = _interopRequireDefault(require("lodash/size"));
var _styles = require("@mui/styles");
var _Actions = require("orion-components/AppState/Actions");
var _TileOptions = _interopRequireDefault(require("./components/TileOptions"));
var _SpotlightProximity = _interopRequireDefault(require("./components/SpotlightProximity"));
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var useStyles = (0, _styles.makeStyles)({
  thumbOff: {
    backgroundColor: "#ffffff"
  },
  trackOff: {
    backgroundColor: "#828283",
    opacity: 1
  },
  thumbSwitched: {
    backgroundColor: "#29B6F6"
  },
  trackSwitched: {
    backgroundColor: "#bee1f1!important",
    opacity: "1!important"
  }
});
var OptionsDrawer = function OptionsDrawer(_ref) {
  var open = _ref.open,
    toggleClosed = _ref.toggleClosed,
    spotlightProximity = _ref.spotlightProximity,
    children = _ref.children,
    disableSliders = _ref.disableSliders;
  var dispatch = (0, _reactRedux.useDispatch)();
  var classes = useStyles();
  var settings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapSettingsSelector)(state);
  });
  var globalState = (0, _reactRedux.useSelector)(function (state) {
    return state.appState.global;
  });
  var clientConfig = (0, _reactRedux.useSelector)(function (state) {
    return state.clientConfig;
  });
  var _ref2 = (0, _size["default"])(clientConfig) && clientConfig.mapSettings,
    nauticalChartsEnabled = _ref2.nauticalChartsEnabled,
    weatherEnabled = _ref2.weatherEnabled;
  var entityLabelsVisible = settings.entityLabelsVisible || false;
  var nauticalChartsVisible = settings.nauticalChartsVisible || false;
  var roadsVisible = settings.roadsVisible || false;
  var weatherVisible = settings.weatherVisible || false;
  var mapLabel = settings.mapStyle;
  var mapName = settings.mapStyle;
  var nauticalChartLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.nauticalChartLayerOpacitySelector)(state);
  });
  var roadAndLabelLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.roadAndLabelLayerOpacitySelector)(state);
  });
  var weatherRadarLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.weatherRadarLayerOpacitySelector)(state);
  });
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return state.application.appId;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var handleSettingsUpdate = function handleSettingsUpdate(keyVal) {
    dispatch((0, _Actions.updatePersistedState)(appId, "mapSettings", keyVal));
  };
  var handleSliderChange = function handleSliderChange(event, value, layer) {
    if (layer === "nauticalCharts") {
      dispatch((0, _Actions.updatePersistedState)(appId, "nauticalChartLayerOpacity", {
        nauticalChartLayerOpacity: value
      }));
    } else if (layer === "roadAndLabels") {
      dispatch((0, _Actions.updatePersistedState)(appId, "roadAndLabelLayerOpacity", {
        roadAndLabelLayerOpacity: value
      }));
    } else if (layer === "weatherRadar") {
      dispatch((0, _Actions.updatePersistedState)(appId, "weatherRadarLayerOpacity", {
        weatherRadarLayerOpacity: value
      }));
    }
  };
  var styles = {
    listItem: _objectSpread({
      padding: "4px 16px"
    }, dir === "rtl" && {
      textAlign: "right"
    }),
    drawer: _objectSpread({}, dir === "rtl" ? {
      background: "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)"
    } : {
      background: "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)"
    }),
    typography: _objectSpread({}, dir === "rtl" ? {
      marginRight: 16
    } : {
      marginLeft: 16
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Drawer, {
    className: "options-drawer",
    docked: false,
    width: 300,
    open: open,
    onClose: toggleClosed,
    style: styles.drawer,
    anchor: dir === "rtl" ? "right" : "left",
    PaperProps: {
      style: {
        width: 300,
        backgroundColor: "#1F1F21"
      }
    },
    BackdropProps: {
      invisible: true
    }
  }, /*#__PURE__*/_react["default"].createElement("section", {
    style: {
      margin: 16,
      padding: 0
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "subtitle1",
    style: {
      paddingBottom: 16
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.optionsDrawer.baseMap"
  })), /*#__PURE__*/_react["default"].createElement(_TileOptions["default"], null)), /*#__PURE__*/_react["default"].createElement(_material.Divider, null), /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.sharedComponents.optionsDrawer.mapLabels"),
    primaryTypographyProps: {
      style: {
        fontSize: 16
      },
      className: "option-label ".concat(entityLabelsVisible ? "toggle-on" : "toggle-off")
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    edge: "end",
    onChange: function onChange() {
      return handleSettingsUpdate({
        entityLabelsVisible: !entityLabelsVisible
      });
    },
    checked: entityLabelsVisible,
    classes: {
      thumb: entityLabelsVisible ? classes.thumbSwitched : classes.thumbOff,
      track: entityLabelsVisible ? classes.trackSwitched : classes.trackOff
    }
  }))), /*#__PURE__*/_react["default"].createElement(_material.Divider, null), /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.typography,
    variant: "subtitle1"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.optionsDrawer.mapOverlays"
  })), !nauticalChartsEnabled ? null : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.sharedComponents.optionsDrawer.nauticalCharts"),
    primaryTypographyProps: {
      style: {
        fontSize: 16
      },
      className: "option-label ".concat(nauticalChartsVisible ? "toggle-on" : "toggle-off")
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    edge: "end",
    onChange: function onChange() {
      return handleSettingsUpdate({
        nauticalChartsVisible: !nauticalChartsVisible
      });
    },
    checked: nauticalChartsVisible,
    classes: {
      thumb: nauticalChartsVisible ? classes.thumbSwitched : classes.thumbOff,
      track: nauticalChartsVisible ? classes.trackSwitched : classes.trackOff
    }
  })), disableSliders ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null) : /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    style: {
      padding: "0px 16px"
    },
    "in": nauticalChartsVisible
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.CBSlider, {
    value: nauticalChartLayerOpacity,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: function onChange(e, value) {
      return handleSliderChange(e, value, "nauticalCharts");
    }
  }))), /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.sharedComponents.optionsDrawer.roadsLabels"),
    primaryTypographyProps: {
      style: {
        fontSize: 16
      },
      className: "option-label ".concat(roadsVisible ? "toggle-on" : "toggle-off")
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    edge: "end",
    onChange: function onChange() {
      return handleSettingsUpdate({
        roadsVisible: !roadsVisible
      });
    },
    checked: roadsVisible,
    classes: {
      thumb: roadsVisible ? classes.thumbSwitched : classes.thumbOff,
      track: roadsVisible ? classes.trackSwitched : classes.trackOff
    }
  })), disableSliders ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null) : /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    style: {
      padding: "0px 16px"
    },
    "in": roadsVisible
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.CBSlider, {
    value: roadAndLabelLayerOpacity,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: function onChange(e, v) {
      return handleSliderChange(e, v, "roadAndLabels");
    }
  })), !weatherEnabled ? null : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.sharedComponents.optionsDrawer.weatherRadar"),
    primaryTypographyProps: {
      style: {
        fontSize: 16
      },
      className: "option-label ".concat(weatherVisible ? "toggle-on" : "toggle-off")
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    edge: "end",
    onChange: function onChange() {
      return handleSettingsUpdate({
        weatherVisible: !weatherVisible
      });
    },
    checked: weatherVisible,
    classes: {
      thumb: weatherVisible ? classes.thumbSwitched : classes.thumbOff,
      track: weatherVisible ? classes.trackSwitched : classes.trackOff
    }
  })), disableSliders ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null) : /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    style: {
      padding: "0px 16px"
    },
    "in": weatherVisible
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.CBSlider, {
    value: weatherRadarLayerOpacity,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: function onChange(e, value) {
      return handleSliderChange(e, value, "weatherRadar");
    }
  })))), /*#__PURE__*/_react["default"].createElement(_material.Divider, null), children, spotlightProximity && /*#__PURE__*/_react["default"].createElement(_SpotlightProximity["default"], {
    globalState: globalState,
    updateGlobalSettings: _Actions.updateGlobalUserAppSettings,
    dir: dir
  }));
};
var _default = OptionsDrawer;
exports["default"] = _default;