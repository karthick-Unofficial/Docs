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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _SharedComponents = require("orion-components/SharedComponents");
var _iconsMaterial = require("@mui/icons-material");
var _size = _interopRequireDefault(require("lodash/size"));
var _i18n = require("orion-components/i18n");
var _moment = _interopRequireDefault(require("moment"));
var _js = require("@mdi/js");
var _reactRedux = require("react-redux");
var _Icons = require("../Icons");
var _UnitCard = _interopRequireDefault(require("./UnitCard"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context6, _context7; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context6 = ownKeys(Object(source), !0)).call(_context6, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context7 = ownKeys(Object(source))).call(_context7, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var TimelineCard = function TimelineCard(_ref) {
  var _context3, _context4, _context5;
  var captured = _ref.captured,
    geometry = _ref.geometry,
    dir = _ref.dir,
    timeline = _ref.timeline,
    open = _ref.open,
    attachments = _ref.attachments,
    units = _ref.units,
    feedSettings = _ref.feedSettings,
    initialActivityDate = _ref.initialActivityDate,
    handleNotify = _ref.handleNotify,
    handleCardExpand = _ref.handleCardExpand,
    handleCardCollapse = _ref.handleCardCollapse;
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    carImage = _useState2[0],
    setCarImage = _useState2[1];
  var backgroundColor = open ? "#464A50" : "#333639";
  var recommendationsIds = units && (0, _map["default"])(units).call(units, function (unit) {
    return unit.recommendationId;
  });
  var unitsUnNotified = units && (0, _filter["default"])(units).call(units, function (unit) {
    return !unit.notified && unit;
  });
  var locale = (0, _reactRedux.useSelector)(function (state) {
    return state.i18n.locale;
  });
  (0, _react.useEffect)(function () {
    if (attachments) {
      var _context;
      var filteredImage = (0, _map["default"])(_context = (0, _filter["default"])(attachments).call(attachments, function (attachment) {
        var _context2;
        return (0, _includes["default"])(_context2 = attachment.filename).call(_context2, "car");
      })).call(_context, function (filteredAttachment) {
        return filteredAttachment.handle;
      });
      if (filteredImage && filteredImage.length === 1) {
        setCarImage("/_download?handle=".concat(filteredImage));
      }
    }
  }, [attachments]);
  var styles = {
    marginAuto: _objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: "auto"
    }), dir === "rtl" && {
      marginRight: "auto"
    }),
    card: {
      backgroundColor: backgroundColor,
      borderRadius: 8,
      marginBottom: 12,
      boxShadow: "unset"
    },
    cardExpand: _objectSpread({
      padding: "0px 6px",
      minHeight: 48
    }, dir === "rtl" && {
      direction: "rtl"
    }),
    listItemText: _objectSpread({
      padding: 0,
      direction: "ltr",
      fontSize: 14
    }, dir === "rtl" && {
      textAlign: "right"
    }),
    indicator: {
      width: "25px",
      height: "25px",
      border: "1.5px solid #fff",
      background: "#D3615C",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 10px",
      fontSize: 16,
      color: "#fff"
    },
    img: {
      width: "280px",
      height: "160px"
    },
    collapse: {
      paddingBottom: 15
    },
    divider: _objectSpread(_objectSpread({
      borderColor: "rgb(70, 74, 80, 0.7"
    }, dir === "rtl" && {
      margin: "0 50px 0 15px"
    }), dir === "ltr" && {
      margin: "0 15px 0 50px"
    }),
    recommendations: {
      border: "1px solid rgba(255, 255, 255, 0.3)",
      minHeight: "130px",
      borderRadius: "6px",
      margin: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    detectionIcon: _objectSpread(_objectSpread({
      height: 24
    }, dir === "rtl" && {
      marginLeft: 25
    }), dir === "ltr" && {
      marginRight: 25
    }),
    detectionStatus: {
      fontSize: 11,
      color: "rgba(255, 255, 255, 0.7)",
      padding: 5,
      border: "1px solid",
      margin: 15,
      borderRadius: "5px",
      background: "rgb(51, 54, 57)",
      borderColor: "rgba(255, 255, 255, 0.5)",
      height: "60px",
      direction: dir
    }
  };
  _moment["default"].locale(locale);
  var startDateTime = (0, _moment["default"])(initialActivityDate).format("YYYY/MM/DD HH:mm:ss");
  var activityDateTime = (0, _moment["default"])(timeline.activityDate).format("YYYY/MM/DD HH:mm:ss");
  var timediff = (0, _moment["default"])(activityDateTime, "YYYY/MM/DD HH:mm:ss").diff((0, _moment["default"])(startDateTime, "YYYY/MM/DD HH:mm:ss"));
  var minutesPassed = _moment["default"].utc(timediff).format("m");
  var secondsPassed = _moment["default"].utc(timediff).format("s");
  var hoursPassed = (0, _moment["default"])(activityDateTime).diff(initialActivityDate, "hours");
  var getDetectionIcon = function getDetectionIcon() {
    switch (timeline.type) {
      case "camera-detection":
        return /*#__PURE__*/_react["default"].createElement(_Icons.CameraDetection, null);
      case "manual-location":
        return /*#__PURE__*/_react["default"].createElement(_Icons.TargetObserved, null);
      case "unit-status-change":
        return /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
          style: {
            width: "24px",
            height: "24px",
            color: "#FFFFFF"
          }
        }, /*#__PURE__*/_react["default"].createElement("path", {
          d: _js.mdiShieldAlert
        }));
      default:
        break;
    }
  };
  var generateUnitList = (0, _size["default"])(units) && (0, _map["default"])(units).call(units, function (unit, index) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_UnitCard["default"], {
      key: "unit-card-".concat(unit.id),
      unit: unit,
      unitDataId: unit.id,
      dir: dir,
      feedSettings: feedSettings,
      handleNotify: handleNotify
    }), index !== units.length - 1 ? /*#__PURE__*/_react["default"].createElement(_material.Divider, {
      style: styles.divider
    }) : null);
  });
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Card, {
    style: styles.card
  }, /*#__PURE__*/_react["default"].createElement(_material.ListItem, {
    button: !open,
    onClick: function onClick() {
      return !open && handleCardExpand(timeline.id);
    },
    style: styles.cardExpand
  }, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    geometry: geometry,
    id: timeline.id
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.indicator
  }, captured), /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.detectionIcon
  }, getDetectionIcon()), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
    style: styles.listItemText,
    primary: hoursPassed > 0 ? (0, _concat["default"])(_context3 = (0, _concat["default"])(_context4 = "+ ".concat(hoursPassed, "h ")).call(_context4, minutesPassed, "m ")).call(_context3, secondsPassed, "s") : Number(minutesPassed) > 0 ? (0, _concat["default"])(_context5 = "+ ".concat(minutesPassed, "m ")).call(_context5, secondsPassed, "s") : "+ ".concat(secondsPassed, "s"),
    primaryTypographyProps: {
      noWrap: true,
      variant: "body1"
    }
  }), open && /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    onClick: function onClick() {
      return handleCardCollapse();
    }
  }, /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Cancel, null))), /*#__PURE__*/_react["default"].createElement(_material.Collapse, {
    unmountOnExit: true,
    "in": open,
    style: styles.collapse
  }, /*#__PURE__*/_react["default"].createElement(_material.CardContent, {
    style: {
      padding: 0
    }
  }, timeline.type === "camera-detection" ? /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: "0 15px"
    }
  }, /*#__PURE__*/_react["default"].createElement("img", {
    alt: "Gate Runner Vehicle",
    style: styles.img,
    src: carImage
  })) : timeline.type === "manual-location" ? /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.detectionStatus
  }, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
    geometry: geometry,
    id: timeline.id
  }), /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.timelineCard.targetObserved"
  })) : timeline.type === "unit-status-change" ? /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread({}, styles.detectionStatus), {}, {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    })
  }, timeline.summary) : /*#__PURE__*/_react["default"].createElement("div", null)), units && (0, _size["default"])(units) ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.CardActions, {
    style: {
      backgroundColor: backgroundColor,
      padding: "0px"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.marginAuto
  }, (0, _size["default"])(unitsUnNotified) ? /*#__PURE__*/_react["default"].createElement(_material.Button, {
    color: "primary",
    style: {
      textTransform: "none",
      fontSize: 12,
      minWidth: "unset",
      padding: "6px 15px",
      color: "#4BAEE8"
    },
    onClick: function onClick() {
      return handleNotify(recommendationsIds);
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.timelineCard.notifyAll"
  })) : /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
    style: {
      width: "24px",
      height: "24px",
      color: "#378ABC",
      margin: "6px 10px"
    }
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: _js.mdiCheckCircle
  })))), generateUnitList) : /*#__PURE__*/_react["default"].createElement("div", {
    style: styles.recommendations
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    style: {
      color: "#fff",
      fontSize: 12
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.gateRunnerWidget.timelineCard.generatingRec"
  }))))));
};
var _default = TimelineCard;
exports["default"] = _default;