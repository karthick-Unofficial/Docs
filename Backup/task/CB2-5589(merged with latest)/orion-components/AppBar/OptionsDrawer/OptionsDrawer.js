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
var _LayerToggle = _interopRequireDefault(require("./components/LayerToggle"));
var _optionsDrawerActions = require("./optionsDrawerActions");
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
    disableSliders = _ref.disableSliders,
    settingsMenu = _ref.settingsMenu,
    cameraFeeds = _ref.cameraFeeds,
    cameraFOV = _ref.cameraFOV,
    ssrRadarOverlayEnabled = _ref.ssrRadarOverlayEnabled,
    toggleSsrRadarOverlay = _ref.toggleSsrRadarOverlay;
  var dispatch = (0, _reactRedux.useDispatch)();
  var classes = useStyles();
  var settings = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.mapSettingsSelector)(state);
  }, _reactRedux.shallowEqual);
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
  var ssrRadarVisible = settings.ssrRadarVisible || false;
  var roadsVisible = settings.roadsVisible || false;
  var weatherVisible = settings.weatherVisible || false;
  var coordsOnCursor = settings.coordsOnCursor || false;
  var nauticalChartLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.nauticalChartLayerOpacitySelector)(state);
  });
  var roadAndLabelLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.roadAndLabelLayerOpacitySelector)(state);
  });
  var weatherRadarLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.weatherRadarLayerOpacitySelector)(state);
  });
  var ssrRadarLayerOpacity = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.ssrRadarLayerOpacitySelector)(state);
  });
  var appId = (0, _reactRedux.useSelector)(function (state) {
    return state.application.appId;
  });
  var showAllFOVs = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.persistedState)(state).showAllFOVs || false;
  });
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var ssrRadarLayerOpacityVal = ssrRadarLayerOpacity || 1;
  var handleSettingsUpdate = function handleSettingsUpdate(keyVal) {
    dispatch((0, _Actions.updatePersistedState)(appId, "mapSettings", keyVal));
  };
  var handleSliderChange = function handleSliderChange(event, value, layer) {
    if (layer === "nauticalCharts") {
      dispatch((0, _Actions.setLocalAppState)("nauticalChartLayerOpacity", value));
    } else if (layer === "roadAndLabels") {
      dispatch((0, _Actions.setLocalAppState)("roadAndLabelLayerOpacity", value));
    } else if (layer === "weatherRadar") {
      dispatch((0, _Actions.setLocalAppState)("weatherRadarLayerOpacity", value));
    } else if (layer === "ssrRadar") {
      dispatch((0, _Actions.setLocalAppState)("ssrRadarLayerOpacity", value));
    }
  };
  var handleSliderChangeCommitted = function handleSliderChangeCommitted(event, value, layer) {
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
    } else if (layer === "ssrRadar") {
      dispatch((0, _Actions.updatePersistedState)("map-app", "ssrRadarLayerOpacity", {
        ssrRadarLayerOpacity: value
      }));
    }
  };
  var handleFOVToggle = function handleFOVToggle() {
    showAllFOVs ? dispatch((0, _optionsDrawerActions.hideFOVs)()) : dispatch((0, _optionsDrawerActions.showFOVs)(cameraFeeds));
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
    value: "global.appBar.optionsDrawer.baseMap"
  })), /*#__PURE__*/_react["default"].createElement(_TileOptions["default"], {
    setMapStyle: _optionsDrawerActions.setMapStyle
  })), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.List, null, settingsMenu ? /*#__PURE__*/_react["default"].createElement(_LayerToggle["default"], {
    label: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.mapLabels"),
    updateKey: "entityLabels",
    dir: dir,
    setLayerState: _optionsDrawerActions.setLayerState
  }) : /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.mapLabels"),
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
  })), cameraFOV && /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: styles.textAlignRight
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("mapAppBar.listItem.cameraFOV"),
    primaryTypographyProps: {
      style: {
        fontSize: 16
      },
      className: "option-label ".concat(showAllFOVs ? "toggle-on" : "toggle-off")
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    edge: "end",
    onChange: handleFOVToggle,
    checked: showAllFOVs,
    classes: {
      thumb: showAllFOVs ? classes.thumbSwitched : classes.thumbOff,
      track: showAllFOVs ? classes.trackSwitched : classes.trackOff
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.coordsOnCursor"),
    primaryTypographyProps: {
      style: {
        fontSize: 16
      },
      className: "option-label ".concat(coordsOnCursor ? "toggle-on" : "toggle-off")
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    edge: "end",
    onChange: function onChange() {
      return handleSettingsUpdate({
        coordsOnCursor: !coordsOnCursor
      });
    },
    checked: coordsOnCursor,
    classes: {
      thumb: coordsOnCursor ? classes.thumbSwitched : classes.thumbOff,
      track: coordsOnCursor ? classes.trackSwitched : classes.trackOff
    }
  }))), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.List, null, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.typography,
    variant: "subtitle1"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.appBar.optionsDrawer.mapOverlays"
  })), !nauticalChartsEnabled ? null : settingsMenu ? /*#__PURE__*/_react["default"].createElement(_LayerToggle["default"], {
    label: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.nauticalCharts"),
    updateKey: "nauticalCharts",
    withOpacity: true,
    dir: dir,
    setLayerState: _optionsDrawerActions.setLayerState
  }) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.nauticalCharts"),
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
    },
    onChangeCommitted: function onChangeCommitted(e, value) {
      return handleSliderChangeCommitted(e, value, "nauticalCharts");
    }
  }))), settingsMenu ? /*#__PURE__*/_react["default"].createElement(_LayerToggle["default"], {
    label: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.roadsLabels"),
    updateKey: "roadsAndLabels",
    withOpacity: true,
    dir: dir,
    setLayerState: _optionsDrawerActions.setLayerState
  }) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.roadsLabels"),
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
    onChange: function onChange(e, value) {
      return handleSliderChange(e, value, "roadAndLabels");
    },
    onChangeCommitted: function onChangeCommitted(e, value) {
      return handleSliderChangeCommitted(e, value, "roadAndLabels");
    }
  }))), !weatherEnabled ? null : settingsMenu ? /*#__PURE__*/_react["default"].createElement(_LayerToggle["default"], {
    label: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.weatherRadar"),
    updateKey: "weather",
    withOpacity: true,
    dir: dir,
    setLayerState: _optionsDrawerActions.setLayerState
  }) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    sx: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("global.appBar.optionsDrawer.weatherRadar"),
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
    },
    onChangeCommitted: function onChangeCommitted(e, value) {
      return handleSliderChangeCommitted(e, value, "weatherRadar");
    }
  }))), ssrRadarOverlayEnabled && /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: styles.textAlignRight
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: (0, _i18n.getTranslation)("mapAppBar.listItem.ssrRadar"),
    primaryTypographyProps: {
      style: {
        fontSize: 16
      },
      className: "option-label ".concat(ssrRadarVisible ? "toggle-on" : "toggle-off")
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    edge: "end",
    onChange: function onChange() {
      return toggleSsrRadarOverlay({
        ssrRadarVisible: !ssrRadarVisible
      });
    },
    checked: ssrRadarVisible,
    classes: {
      thumb: ssrRadarVisible ? classes.thumbSwitched : classes.thumbOff,
      track: ssrRadarVisible ? classes.trackSwitched : classes.trackOff
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    style: {
      padding: "0px 16px"
    },
    "in": ssrRadarVisible
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.CBSlider, {
    value: ssrRadarLayerOpacityVal,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: function onChange(e, value) {
      return handleSliderChange(e, value, "ssrRadar");
    },
    onChangeCommitted: function onChangeCommitted(e, value) {
      return handleSliderChangeCommitted(e, value, "ssrRadar");
    }
  }))), /*#__PURE__*/_react["default"].createElement(_material.Divider, null), children, spotlightProximity && /*#__PURE__*/_react["default"].createElement(_SpotlightProximity["default"], {
    globalState: globalState,
    updateGlobalSettings: _Actions.updateGlobalUserAppSettings,
    dir: dir
  }));
};
var _default = OptionsDrawer;
exports["default"] = _default;