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
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _CBComponents = require("orion-components/CBComponents");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
var _styles = require("@mui/styles");
var _Actions = require("orion-components/AppState/Actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context, _context2; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  label: _propTypes["default"].string.isRequired,
  updateKey: _propTypes["default"].string.isRequired,
  withOpacity: _propTypes["default"].bool,
  setLayerState: _propTypes["default"].func
};
var defaultProps = {
  withOpacity: false
};
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
var LayerToggle = function LayerToggle(props) {
  var classes = useStyles();
  var label = props.label,
    withOpacity = props.withOpacity,
    updateKey = props.updateKey,
    setLayerState = props.setLayerState;
  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
      return state.appState.persisted;
    }),
    mapSettings = _useSelector.mapSettings;
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var opacity;
  var visible;
  if (mapSettings && mapSettings[updateKey]) {
    opacity = mapSettings[updateKey].opacity;
    visible = mapSettings[updateKey].visible;
  }
  var dispatch = (0, _reactRedux.useDispatch)();
  var handleVisibleChange = (0, _react.useCallback)(function (e) {
    dispatch(setLayerState((0, _defineProperty2["default"])({}, updateKey, {
      visible: e.target.checked,
      opacity: opacity
    })));
  }, [opacity, setLayerState, updateKey]);
  var handleOpacityChange = function handleOpacityChange(e, v) {
    var value = (0, _defineProperty2["default"])({}, updateKey, {
      visible: visible,
      opacity: v
    });
    var update = _objectSpread(_objectSpread({}, mapSettings), value);
    dispatch((0, _Actions.setLocalAppState)("mapSettings", update));
  };
  var handleOpacityChangeCommitted = (0, _react.useCallback)(function (e, v) {
    dispatch(setLayerState((0, _defineProperty2["default"])({}, updateKey, {
      visible: visible,
      opacity: v
    })));
  }, [setLayerState, updateKey, visible]);
  var styles = {
    listItem: _objectSpread({
      padding: "4px 16px"
    }, dir === "rtl" && {
      textAlign: "right"
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    key: updateKey,
    disableGutters: true,
    style: styles.listItem
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    primary: label,
    primaryTypographyProps: {
      variant: "h6",
      style: {
        color: visible ? "#fff" : "#B5B9BE"
      }
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Switch, {
    onChange: handleVisibleChange,
    checked: visible,
    edge: "end",
    color: "primary",
    classes: {
      thumb: visible ? classes.thumbSwitched : classes.thumbOff,
      track: visible ? classes.trackSwitched : classes.trackOff
    }
  })), withOpacity && /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    "in": visible,
    style: {
      padding: "0px 16px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.CBSlider, {
    value: opacity,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: handleOpacityChange,
    onChangeCommitted: handleOpacityChangeCommitted
  })));
};
LayerToggle.propTypes = propTypes;
LayerToggle.defaultProps = defaultProps;
var _default = LayerToggle;
exports["default"] = _default;