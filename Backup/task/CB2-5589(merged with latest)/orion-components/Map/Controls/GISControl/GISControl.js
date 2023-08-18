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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _components = require("./components");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _classnames = _interopRequireDefault(require("classnames"));
var _map = _interopRequireDefault(require("lodash/map"));
var _size = _interopRequireDefault(require("lodash/size"));
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var styles = {
  text: {
    textTransform: "none",
    color: "#35b7f3",
    padding: 0,
    textAlign: "left",
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  label: {
    textTransform: "none"
  },
  textRTL: {
    textTransform: "none",
    color: "#35b7f3",
    padding: 0,
    textAlign: "right",
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
};
var propTypes = {
  classes: _propTypes["default"].object.isRequired,
  app: _propTypes["default"].string.isRequired,
  gisData: _propTypes["default"].object.isRequired,
  gisState: _propTypes["default"].object,
  turnOffLayer: _propTypes["default"].func,
  createService: _propTypes["default"].func.isRequired,
  getLayers: _propTypes["default"].func.isRequired,
  resetRequest: _propTypes["default"].func.isRequired,
  updateVisibleGIS: _propTypes["default"].func.isRequired,
  updateGISService: _propTypes["default"].func.isRequired,
  deleteGISService: _propTypes["default"].func.isRequired,
  dir: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool
};
var defaultProps = {
  gisState: {},
  dir: "ltr",
  readOnly: false
};
var GISControl = function GISControl(_ref) {
  var gisData = _ref.gisData,
    getLayers = _ref.getLayers,
    app = _ref.app,
    updateVisibleGIS = _ref.updateVisibleGIS,
    gisState = _ref.gisState,
    turnOffLayer = _ref.turnOffLayer,
    classes = _ref.classes,
    createService = _ref.createService,
    resetRequest = _ref.resetRequest,
    updateGISService = _ref.updateGISService,
    deleteGISService = _ref.deleteGISService,
    dir = _ref.dir,
    readOnly = _ref.readOnly;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var handleOpen = function handleOpen() {
    setOpen(true);
  };
  var handleClose = function handleClose() {
    setOpen(false);
  };
  var handleLayerToggle = function handleLayerToggle(serviceId, layerId, checked) {
    var _context;
    dispatch(updateVisibleGIS(app, serviceId, (0, _defineProperty2["default"])({}, (0, _concat["default"])(_context = "".concat(serviceId, "-")).call(_context, layerId), checked)));
    if (checked) {
      dispatch(getLayers(serviceId, layerId));
    } else {
      turnOffLayer(serviceId, layerId);
    }
  };
  var services = gisData.services,
    error = gisData.error,
    isFetching = gisData.isFetching,
    success = gisData.success;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "subtitle1"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.main.title"
  })), !readOnly && /*#__PURE__*/_react["default"].createElement(_material.Button, {
    onClick: handleOpen,
    variant: "text",
    className: (0, _classnames["default"])(classes.label, dir == "rtl" ? classes.textRTL : classes.text),
    color: "primary"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.main.addNewService"
  }))), (0, _size["default"])(services) ? /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(services, function (service) {
    return /*#__PURE__*/_react["default"].createElement(_components.GISCollection, {
      key: service.id,
      service: service,
      handleToggle: handleLayerToggle,
      serviceState: gisState[service.id],
      updateGISService: updateGISService,
      deleteGISService: deleteGISService,
      dir: dir
    });
  })) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      color: "#828283",
      padding: 6
    },
    align: "center"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.controls.gisControl.main.gisServices"
  })), /*#__PURE__*/_react["default"].createElement(_components.GISDialog, {
    open: open,
    error: error,
    success: success,
    isFetching: isFetching,
    createService: createService,
    resetRequest: resetRequest,
    handleClose: handleClose
  }));
};
GISControl.propTypes = propTypes;
GISControl.defaultProps = defaultProps;
var _default = (0, _styles.withStyles)(styles)(GISControl);
exports["default"] = _default;