"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireDefault(require("react"));
var _clientAppCore = require("client-app-core");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _PTZControls = _interopRequireDefault(require("../../../Profiles/Widgets/PTZControls/PTZ-controls"));
var _LradControls = _interopRequireDefault(require("../../../Profiles/Widgets/LradControls/LradControls"));
var _reactRedux = require("react-redux");
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context2, _context3; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(source), !0)).call(_context2, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
// const CBSwitch = withStyles({
// 	switchBase: {
// 	  "&$checked": {
// 			color: "#29B6F6"
// 	  },
// 	  "&$checked + $track": {
// 			backgroundColor: "#84D5FA"
// 	  }
// 	},
// 	checked: {},
// 	track: {}
// })(Switch);

var propTypes = {
  camera: _propTypes["default"].shape({
    id: _propTypes["default"].string.isRequired,
    player: _propTypes["default"].shape({
      type: _propTypes["default"].string.isRequired,
      url: _propTypes["default"].string
    })
  }).isRequired,
  dialogKey: _propTypes["default"].string,
  canControl: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var defaultProps = {
  camera: {
    player: {
      url: null
    }
  },
  dialogKey: "",
  canControl: false,
  dir: "ltr"
};
var FullscreenVideoModal = function FullscreenVideoModal(_ref) {
  var closeDialog = _ref.closeDialog,
    dialogKey = _ref.dialogKey,
    setCameraPriority = _ref.setCameraPriority,
    camera = _ref.camera,
    dialog = _ref.dialog,
    canControl = _ref.canControl,
    children = _ref.children,
    dir = _ref.dir;
  var dispatch = (0, _reactRedux.useDispatch)();
  var closeFullscreen = function closeFullscreen() {
    dispatch(setCameraPriority(null, false));
    dispatch(closeDialog(dialogKey));
  };
  var execFeatureCommand = function execFeatureCommand(cmd) {
    _clientAppCore.cameraService.sendAuxCmd(camera.id, cmd);
  };
  var hasCapability = function hasCapability(capability) {
    var _context;
    return camera.entityData.properties.features && (0, _includes["default"])(_context = camera.entityData.properties.features).call(_context, capability);
  };

  // handleToggle = (e, name) => {
  // 	this.setState({ [name]: e.target.checked });
  // };

  var cameraFeatures = camera.entityData.properties.features || null;
  var buttonFeatures = cameraFeatures ? (0, _filter["default"])(cameraFeatures).call(cameraFeatures, function (feat) {
    return (0, _typeof2["default"])(feat) === "object" && feat.type === "button";
  }) : null;
  var styles = {
    dialog: {
      backgroundColor: "rgb(44, 45, 47)"
    },
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgb(44, 45, 47)"
    },
    typography: _objectSpread(_objectSpread({
      color: "#fff"
    }, dir === "ltr" && {
      paddingLeft: 12
    }), dir === "rtl" && {
      paddingRight: 12
    }),
    buttonFeatures: _objectSpread(_objectSpread({
      width: 240,
      height: "100%",
      position: "relative"
    }, dir === "ltr" && {
      marginLeft: 90
    }), dir === "rtl" && {
      marginRight: 90
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_material.Dialog, {
    fullScreen: true,
    key: dialogKey,
    open: dialog === dialogKey,
    PaperProps: {
      style: styles.dialog
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.header
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.typography,
    color: "textPrimary",
    variant: "subtitle1"
  }, camera.entityData.properties.name), /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: closeFullscreen
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Close, {
    style: {
      color: "#FFF"
    }
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: "calc(100vh - 48px)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, children, canControl && hasCapability("control") && !hasCapability("ribbon") && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flexGrow: 1,
      width: "100%",
      height: "clamp(30%, 35%, 40%)"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "expanded-camera-ptz-wrapper"
  }, buttonFeatures && buttonFeatures.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.buttonFeatures
  }, /*#__PURE__*/_react["default"].createElement(_material.List, {
    style: {
      width: "100%",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)"
    }
  }, (0, _map["default"])(buttonFeatures).call(buttonFeatures, function (feat, index) {
    return /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
      button: true,
      style: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16
      },
      key: "button-features-".concat(index)
    }, /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
      primary: feat.label
    }), /*#__PURE__*/_react["default"].createElement(_material.ListItemSecondaryAction, {
      onClick: function onClick() {
        return execFeatureCommand(feat.auxCmd);
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      size: "small",
      style: {
        height: "22px",
        backgroundColor: "#4DB5F4",
        color: "#FFF"
      }
    }, feat.buttonLabel || " ")));
  }))), hasCapability("lrad") && /*#__PURE__*/_react["default"].createElement(_LradControls["default"], {
    camera: camera,
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_PTZControls["default"], {
    dock: true,
    camera: camera
  }))))));
};
FullscreenVideoModal.propTypes = propTypes;
FullscreenVideoModal.defaultProps = defaultProps;
var _default = FullscreenVideoModal;
exports["default"] = _default;