"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _moment = _interopRequireDefault(require("moment"));
var _reactRedux = require("react-redux");
var _Selectors = require("orion-components/ContextualData/Selectors");
var _ElapsedTimer = _interopRequireDefault(require("./ElapsedTimer"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context4, _context5; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context4 = ownKeys(Object(source), !0)).call(_context4, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context5 = ownKeys(Object(source))).call(_context5, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  dir: _propTypes["default"].string
};
var defaultProps = {
  dir: "ltr"
};
var useStyles = (0, _styles.makeStyles)({
  root: {
    "&:hover": {
      backgroundColor: "#464a50"
    }
  }
});
var ActivityCard = function ActivityCard(_ref) {
  var detection = _ref.detection,
    selectedDetection = _ref.selectedDetection,
    handleSelectDetection = _ref.handleSelectDetection,
    dir = _ref.dir,
    initialActivityDate = _ref.initialActivityDate,
    eventEndDate = _ref.eventEndDate;
  var classes = useStyles();
  var activity = selectedDetection && selectedDetection.object.entity;
  var activityId = selectedDetection && selectedDetection.id;
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  var context = (0, _reactRedux.useSelector)(function (state) {
    return (0, _Selectors.contextById)(activityId)(state);
  });
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    carImage = _useState2[0],
    setCarImage = _useState2[1];
  (0, _react.useEffect)(function () {
    if (context && context.attachments) {
      var _context, _context2;
      var filteredImage = (0, _map["default"])(_context = (0, _filter["default"])(_context2 = context.attachments).call(_context2, function (attachment) {
        var _context3;
        return (0, _includes["default"])(_context3 = attachment.filename).call(_context3, "plate");
      })).call(_context, function (filteredAttachment) {
        return filteredAttachment.handle;
      });
      if (filteredImage && filteredImage.length === 1) {
        setCarImage("/_download?handle=".concat(filteredImage));
      }
    }
  }, [context]);
  var styles = {
    activityCardWrapper: _objectSpread(_objectSpread({
      padding: "0px 6px"
    }, dir === "rtl" && {
      direction: "rtl"
    }), selectedDetection ? {
      padding: 0,
      marginBottom: 20
    } : {
      padding: "15px"
    }),
    lprCard: _objectSpread({
      textAlign: "center"
    }, selectedDetection ? {
      width: "55%",
      background: "#1f1f21",
      padding: "5px 15px"
    } : {
      width: "45%"
    }),
    gate: _objectSpread(_objectSpread({}, selectedDetection ? {
      fontSize: 14
    } : {
      fontSize: 12
    }), {}, {
      color: "#fff",
      lineHeight: "unset",
      textTransform: "uppercase"
    }),
    lprImageWrapper: _objectSpread({
      margin: "5px 0",
      border: "1px solid #fff"
    }, selectedDetection ? {
      height: "45px"
    } : {
      height: "40px"
    }),
    img: {
      height: "100%",
      width: "100%"
    },
    timeAgo: {
      fontSize: 10,
      color: "#fff",
      lineHeight: "unset"
    },
    vehicleImgWrapper: _objectSpread(_objectSpread({
      minHeight: "100%",
      width: "52%"
    }, dir === "rtl" && {
      margin: "5px 25px 5px 0px"
    }), dir === "ltr" && {
      margin: "5px 0 5px 25px"
    }),
    vehicleImgDiv: {
      height: "80px",
      display: "flex",
      justifyContent: "center"
    },
    selectedGateWrapper: _objectSpread(_objectSpread({
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }, dir === "rtl" && {
      paddingRight: "15px",
      textAlign: "right"
    }), dir === "ltr" && {
      paddingLeft: "15px"
    })
  };
  _moment["default"].relativeTimeThreshold("ss", 0);
  return activity ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    style: styles.activityCardWrapper
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.lprCard
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.lprImageWrapper
  }, /*#__PURE__*/_react["default"].createElement("img", {
    alt: "License Plate",
    style: styles.img,
    src: carImage
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.gate
  }, activity.CarNumber)), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.selectedGateWrapper
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      fontSize: "14px",
      color: "#fff",
      lineHeight: "unset",
      paddingBottom: "10px",
      textTransform: "uppercase"
    }
  }, activity.CameraName), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      color: "#B4B8BC",
      fontSize: 10,
      lineHeight: "unset"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.activityCard.elapsedTime"
  })), initialActivityDate ? /*#__PURE__*/_react["default"].createElement(_ElapsedTimer["default"], {
    initialActivityDate: initialActivityDate,
    eventEndDate: eventEndDate
  }) : /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      color: "#fff",
      fontSize: 22,
      lineHeight: "unset"
    }
  }, "0m 00s")))) : detection ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: true,
    onClick: function onClick() {
      return handleSelectDetection(detection);
    },
    style: styles.activityCardWrapper,
    classes: {
      root: classes.root
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.lprCard
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.gate
  }, detection.CameraName), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.lprImageWrapper
  }, /*#__PURE__*/_react["default"].createElement("img", {
    alt: "License Plate",
    style: styles.img,
    src: "data:image/jpeg;base64,".concat(detection.plateImage)
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.gate
  }, detection.CarNumber), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: styles.timeAgo
  }, (0, _moment["default"])(detection.CaptureDateTime).locale(locale).fromNow())), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.vehicleImgWrapper
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.vehicleImgDiv
  }, /*#__PURE__*/_react["default"].createElement("img", {
    alt: "Gate Runner Vehicle",
    style: styles.img,
    src: "data:image/jpeg;base64,".concat(detection.carImage)
  }))))) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null);
};
ActivityCard.propTypes = propTypes;
ActivityCard.defaultProps = defaultProps;
var _default = ActivityCard;
exports["default"] = _default;