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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _SymbolCollection = _interopRequireDefault(require("./components/SymbolCollection"));
var _ColorTiles = _interopRequireDefault(require("./components/ColorTiles"));
var _TransparencySlider = _interopRequireDefault(require("./components/TransparencySlider"));
var _StrokeProperties = _interopRequireDefault(require("./components/StrokeProperties"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _utils = require("./utils");
var _map2 = _interopRequireDefault(require("lodash/map"));
var _helpers = require("orion-components/Map/helpers");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var styles = {
  root: {
    "&.Mui-focused": {
      backgroundColor: "rgb(31, 31, 33)"
    }
  },
  paper: {
    top: 48,
    width: 350,
    height: "calc(100% - 48px)"
  },
  input: {
    "&::placeholder": {
      fontSize: 14,
      color: "#828283"
    },
    height: "unset!important",
    color: "#fff"
  },
  disabled: {
    color: "#fff!important",
    opacity: "0.3"
  },
  selected: {
    backgroundColor: "rgba(255, 255, 255, 0.16)!important"
  }
};
var propTypes = {
  map: _propTypes["default"].object.isRequired,
  entity: _propTypes["default"].object,
  handleSave: _propTypes["default"].func.isRequired,
  app: _propTypes["default"].string,
  dir: _propTypes["default"].string
};
var ShapeEdit = function ShapeEdit(_ref) {
  var app = _ref.app,
    mapTools = _ref.mapTools,
    map = (0, _map["default"])(_ref),
    setMapTools = _ref.setMapTools,
    handleSave = _ref.handleSave,
    classes = _ref.classes,
    open = _ref.open,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    collections = _useState4[0],
    setCollections = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    search = _useState6[0],
    setSearch = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    name = _useState8[0],
    setName = _useState8[1];
  var _useState9 = (0, _react.useState)(""),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    description = _useState10[0],
    setDescription = _useState10[1];
  var _useState11 = (0, _react.useState)(app === "events-app" ? true : false),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    displayOnEventActive = _useState12[0],
    setDisplayOnEventActive = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    symbol = _useState14[0],
    setSymbol = _useState14[1];
  var _useState15 = (0, _react.useState)("0073c8"),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    fillColor = _useState16[0],
    setFillColor = _useState16[1];
  var _useState17 = (0, _react.useState)("2face8"),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    strokeColor = _useState18[0],
    setStrokeColor = _useState18[1];
  var _useState19 = (0, _react.useState)(3),
    _useState20 = (0, _slicedToArray2["default"])(_useState19, 2),
    strokeThickness = _useState20[0],
    setStrokeThickness = _useState20[1];
  var _useState21 = (0, _react.useState)("Solid"),
    _useState22 = (0, _slicedToArray2["default"])(_useState21, 2),
    strokeType = _useState22[0],
    setStrokeType = _useState22[1];
  var _useState23 = (0, _react.useState)(20),
    _useState24 = (0, _slicedToArray2["default"])(_useState23, 2),
    transparency = _useState24[0],
    setTransparency = _useState24[1];
  var _useState25 = (0, _react.useState)(mapTools.feature ? true : false),
    _useState26 = (0, _slicedToArray2["default"])(_useState25, 2),
    valid = _useState26[0],
    setValid = _useState26[1];
  var _useState27 = (0, _react.useState)(null),
    _useState28 = (0, _slicedToArray2["default"])(_useState27, 2),
    error = _useState28[0],
    setError = _useState28[1];
  (0, _react.useEffect)(function () {
    var mode = mapTools.mode,
      feature = mapTools.feature;
    var icons = require.context("./icons", true);
    if (mode === "draw_point" || feature && feature.geometry.type === "Point") {
      var _collections = (0, _utils.getSymbols)(map, icons);
      setCollections(_collections);
      setSymbol("Marker_blue");
    }
    if (feature) {
      var properties = feature.properties;
      var _name = properties.name,
        _description = properties.description,
        _properties$displayOn = properties.displayOnEventActive,
        _displayOnEventActive = _properties$displayOn === void 0 ? false : _properties$displayOn,
        _symbol = properties.symbol,
        polyFill = properties.polyFill,
        polyStroke = properties.polyStroke,
        polyFillOpacity = properties.polyFillOpacity,
        lineWidth = properties.lineWidth,
        lineType = properties.lineType;
      setName(_name);
      setDescription(_description);
      setDisplayOnEventActive(_displayOnEventActive);
      setSymbol(_symbol);
      setFillColor(polyFill);
      setStrokeColor(polyStroke);
      setTransparency(polyFillOpacity * 100);
      setStrokeThickness(lineWidth);
      setStrokeType(lineType);
    }
    map.on("draw.create", function () {
      setValid(true);
    });
    map.on("draw.delete", function () {
      setValid(false);
    });
  }, []);
  (0, _react.useEffect)(function () {
    document.addEventListener("keydown", handleKeydown);
    return function () {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);
  var handleKeydown = function handleKeydown(e) {
    if (e.key === "Escape") {
      handleClose();
    }
  };
  var handleClearSearch = function handleClearSearch() {
    setSearch("");
  };
  var handleChange = function handleChange(field) {
    return function (event) {
      var value = event.target.value;
      // Switch case using for updating state values dynamically depends on our changes.
      switch (field) {
        case "name":
          {
            setName(value);
            break;
          }
        case "description":
          {
            setDescription(value);
            break;
          }
        case "displayOnEventActive":
          {
            setDisplayOnEventActive(value);
            break;
          }
        case "search":
          setSearch(value);
          break;
      }
    };
  };

  // Sets data in parent component when data in child component updates for ease of access
  var setData = function setData(field) {
    return function (value) {
      //Switch case using for updating state values dynamically depends on our changes.
      switch (field) {
        case "fillColor":
          {
            setFillColor(value);
            break;
          }
        case "transparency":
          {
            setTransparency(value);
            break;
          }
        case "strokeColor":
          {
            setStrokeColor(value);
            break;
          }
        case "strokeThickness":
          {
            setStrokeThickness(value);
            break;
          }
        case "strokeType":
          {
            setStrokeType(value);
            break;
          }
      }
    };
  };
  var handleExpand = function handleExpand(key) {
    return function (event, expanded) {
      setExpanded(expanded ? key : false);
    };
  };
  var handleSelectSymbol = function handleSelectSymbol(symbol) {
    setSymbol(symbol);
  };
  var handleClose = function handleClose() {
    dispatch(setMapTools({
      type: null
    }));
  };
  var handleSaveEvent = function handleSaveEvent() {
    var feature = mapTools.feature;
    var geometry = feature.geometry;
    var type = geometry.type;
    setError(null);
    var properties = {
      name: name,
      description: description,
      displayOnEventActive: displayOnEventActive,
      symbol: symbol,
      type: type
    };
    if (type === "Polygon") {
      properties = _objectSpread(_objectSpread({}, properties), {}, {
        polyFill: fillColor,
        polyStroke: strokeColor,
        polyFillOpacity: transparency / 100,
        lineWidth: strokeThickness,
        lineType: strokeType
      });
    } else if (type === "LineString") {
      properties = _objectSpread(_objectSpread({}, properties), {}, {
        polyStroke: strokeColor,
        lineWidth: strokeThickness,
        lineType: strokeType
      });
    }
    if (!(0, _helpers.validateShape)(geometry)) {
      setError((0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.errorText.shapesErr"));
      return;
    }
    handleSave(properties);
    handleClose();
  };
  var mode = mapTools.mode,
    feature = mapTools.feature;
  var featureType = feature && feature.geometry ? feature.geometry.type : null;
  return /*#__PURE__*/_react["default"].createElement(_material.Drawer, {
    classes: {
      paper: classes.paper
    },
    open: open,
    anchor: dir == "rtl" ? "right" : "left",
    variant: "persistent"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "12px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-around"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "39%",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "h6"
  }, featureType === "Point" || mode === "draw_point" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.createPoint"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.createShape"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "60%",
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: handleClose,
    style: {
      color: "#828283"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.cancel"
  })), /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: handleSaveEvent,
    color: "primary",
    disabled: !name || !valid,
    classes: {
      disabled: classes.disabled
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.save"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex"
    }
  }, (featureType === "Point" || mode === "draw_point") && !!symbol && /*#__PURE__*/_react["default"].createElement("img", {
    alt: "selected-symbol",
    style: _objectSpread(_objectSpread({
      width: 60,
      alignSelf: "flex-start",
      marginTop: 16
    }, dir === "rtl" && {
      marginLeft: 12
    }), dir === "ltr" && {
      marginRight: 12
    }),
    src: require("./icons/".concat(symbol, ".png"))
  }), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "shape-name",
    value: name,
    onChange: handleChange("name"),
    placeholder: (0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.name"),
    required: true,
    variant: "filled",
    fullWidth: true,
    margin: "normal",
    autoFocus: true,
    InputProps: {
      classes: {
        root: classes.root,
        input: classes.input
      },
      style: {
        lineHeight: "unset"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "shape-description",
    value: description,
    onChange: handleChange("description"),
    placeholder: (0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.description"),
    multiline: true,
    rows: 3,
    rowsMax: 6,
    variant: "filled",
    InputProps: {
      classes: {
        root: classes.root,
        input: classes.input
      },
      style: {
        padding: 0,
        lineHeight: "unset"
      }
    },
    fullWidth: true
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 1,
      width: "100%",
      marginBottom: 10,
      backgroundColor: "#424549"
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      overflowY: "scroll"
    }
  }, app === "events-app" && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 4,
      padding: "0px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SelectField, {
    id: "map-app-display-options",
    value: displayOnEventActive,
    handleChange: handleChange("displayOnEventActive"),
    label: (0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.mapApp"),
    inputProps: {
      style: {
        fontSize: 14
      }
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    style: {
      fontSize: 14
    },
    value: true,
    classes: {
      selected: classes.selected
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.showWhenActive"
  })), /*#__PURE__*/_react["default"].createElement(_material.MenuItem, {
    style: {
      fontSize: 14
    },
    value: false,
    classes: {
      selected: classes.selected
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.alwaysShow"
  })))), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: "38px 20px 0px 20px"
    },
    variant: "h6"
  }, featureType === "Point" || mode === "draw_point" ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.chooseSymbol"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.sharedComponents.shapeEdit.chooseStyles"
  })), (featureType === "Point" || mode === "draw_point") && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: -6,
      padding: "0px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_CBComponents.SearchField, {
    id: "symbol-search",
    handleChange: handleChange("search"),
    handleClear: handleClearSearch,
    value: search,
    placeholder: (0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.searchLib"),
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      paddingTop: 20
    }
  }, !!collections && (0, _map2["default"])(collections, function (collection, key) {
    return /*#__PURE__*/_react["default"].createElement(_SymbolCollection["default"], {
      key: key,
      name: key,
      collection: collection,
      expanded: expanded === key,
      handleExpand: handleExpand(key),
      handleSelect: handleSelectSymbol,
      search: search.toLowerCase()
    });
  })))), (featureType === "Polygon" || mode === "draw_polygon") && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 4,
      padding: "12px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_ColorTiles["default"], {
    selectedColor: fillColor,
    title: (0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.fillColor"),
    setData: setData("fillColor")
  })), /*#__PURE__*/_react["default"].createElement(_TransparencySlider["default"], {
    transparency: transparency,
    setData: setData("transparency"),
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "17px 20px 0px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_ColorTiles["default"], {
    selectedColor: strokeColor,
    title: (0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.strokeColor"),
    setData: setData("strokeColor")
  }), /*#__PURE__*/_react["default"].createElement(_StrokeProperties["default"], {
    thickness: strokeThickness,
    type: strokeType,
    titleNoun: "Stroke",
    setThickness: setData("strokeThickness"),
    setType: setData("strokeType"),
    dir: dir
  }))), (featureType === "LineString" || mode === "draw_line_string") && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 4,
      padding: "12px 20px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_ColorTiles["default"], {
    selectedColor: strokeColor,
    title: (0, _i18n.getTranslation)("global.sharedComponents.shapeEdit.lineColor"),
    setData: setData("strokeColor")
  }), /*#__PURE__*/_react["default"].createElement(_StrokeProperties["default"], {
    thickness: strokeThickness,
    type: strokeType,
    titleNoun: "Line",
    setThickness: setData("strokeThickness"),
    setType: setData("strokeType"),
    dir: dir
  }))), error && /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      padding: "0px 12px"
    },
    color: "error",
    variant: "caption"
  }, error)));
};
ShapeEdit.propTypes = propTypes;
var _default = (0, _styles.withStyles)(styles)(ShapeEdit);
exports["default"] = _default;