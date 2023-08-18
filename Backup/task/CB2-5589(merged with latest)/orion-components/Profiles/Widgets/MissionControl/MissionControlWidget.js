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
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _shared = require("../shared");
var _icons = require("./icons");
var _SharedComponents = require("orion-components/SharedComponents");
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _iconsMaterial = require("@mui/icons-material");
var _i18n = require("orion-components/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// -- components

// -- material-ui

var MCWAccordionSummary = (0, _styles.withStyles)({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(_material.AccordionSummary);
var MCWAccordionDetails = (0, _styles.withStyles)({
  root: {
    padding: 0
  }
})(_material.AccordionDetails);
var MCWListItem = (0, _styles.withStyles)({
  root: {
    padding: 0
  }
})(_material.ListItem);
var STATE_STRINGS = {
  charging: (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.charging"),
  stationary: (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.stationary"),
  standby: (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.standby"),
  "in-motion": (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.inMotion"),
  "on-mission": (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.onMission"),
  stopped: (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.stopped")
};
var STATE_COLORS = {
  charging: "#262729",
  stationary: "#5F6571",
  standby: "#5F6571",
  "in-motion": "#5C9CD3",
  "on-mission": "#67BE6F",
  stopped: "#D3615C"
};

// ***** TODO: setup propTypes correctly
var propTypes = {
  order: _propTypes["default"].number,
  enabled: _propTypes["default"].bool,
  details: _propTypes["default"].object.isRequired
};
var MissionControlWidget = function MissionControlWidget(_ref) {
  var order = _ref.order,
    enabled = _ref.enabled,
    details = _ref.details,
    dir = _ref.dir;
  (0, _react.useEffect)(function () {
    // ***** TODO: anything we want to hook into on loading?
  }, []);
  var getStatusPanel = (0, _react.useCallback)(function () {
    var speed = details.speed,
      grade = details.grade,
      battery = details.battery,
      batteryStatus = details.batteryStatus,
      assignedMission = details.assignedMission;
    var state = assignedMission && (0, _keys["default"])(assignedMission).length > 0 ? "on-mission" : batteryStatus === "charging" ? "charging" : "standby";
    // speed > 0 ? "in-motion" : "stationary";

    var stateString = STATE_STRINGS[state];
    var panelBackground = STATE_COLORS[state];

    // ***** TODO: need to figure out if a downhill grade with come through as negative or if we need to subtract 360
    var slopeIcon = grade >= 0 ? /*#__PURE__*/_react["default"].createElement(_icons.SlopeUphill, {
      className: "detail-icon"
    }) : /*#__PURE__*/_react["default"].createElement(_icons.SlopeDownhill, {
      className: "detail-icon"
    });
    var panelDetails = state !== "charging" ? /*#__PURE__*/_react["default"].createElement("div", {
      className: "details-container"
    }, grade && /*#__PURE__*/_react["default"].createElement("div", {
      className: "detail"
    }, slopeIcon, /*#__PURE__*/_react["default"].createElement("p", {
      style: {
        marginBottom: "-3px"
      }
    }, Math.abs(grade).toFixed(2), "\xB0")), /*#__PURE__*/_react["default"].createElement("div", {
      className: "detail"
    }, /*#__PURE__*/_react["default"].createElement(_icons.Speedometer, {
      className: "detail-icon"
    }), /*#__PURE__*/_react["default"].createElement("p", {
      className: "detail-content",
      style: {
        marginBottom: "-3px"
      }
    }, speed.toFixed(1)), /*#__PURE__*/_react["default"].createElement("p", {
      className: "detail-content attribute",
      style: {
        marginBottom: "-1px"
      }
    }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.missionControl.ftPerSec"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "detail"
    }, /*#__PURE__*/_react["default"].createElement(_icons.BatteryFull, {
      className: "detail-icon battery"
    }), /*#__PURE__*/_react["default"].createElement("p", {
      style: {
        marginBottom: "-3px"
      }
    }, battery, "%"))) : null;
    var panelButton = null;
    // -- Commenting out for now since we currently cant send robot commands through AAS - CD
    // if (state === "in-motion" || state === "on-mission") {
    // 	panelButton = (
    // 		<div className="status-panel-button" style={{ background: "#D58F8C" }} onClick={() => panelButtonClicked("stop")}>
    // 			<p>{"STOP"}</p>
    // 		</div>
    // 	);
    // }
    // else if (state === "stopped") {
    // 	panelButton = (
    // 		<div className="status-panel-button" style={{ background: "#41454B" }} onClick={() => panelButtonClicked("resume")}>
    // 			<p>{"RESUME"}</p>
    // 		</div>
    // 	);
    // }
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        marginTop: "22px"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "status-panel-container",
      style: {
        background: panelBackground
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "status-panel-header"
    }, state === "charging" && /*#__PURE__*/_react["default"].createElement(_iconsMaterial.BatteryCharging50, null), /*#__PURE__*/_react["default"].createElement("p", null, stateString)), panelDetails), panelButton);
  }, [details.speed, details.grade, details.battery, details.batteryStatus, details.assignedMission]);
  var getMissionData = (0, _react.useCallback)(function () {
    var _context;
    var assignedMission = details.assignedMission;
    return assignedMission ? /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        paddingTop: "10px"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Accordion, {
      style: {
        backgroundColor: "#34383C"
      }
    }, /*#__PURE__*/_react["default"].createElement(MCWAccordionSummary, {
      expandIcon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.ExpandMore, null),
      style: {
        width: "100%",
        padding: "0 10px",
        color: "#FFFFFF"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        alignItems: "center"
      }
    }, /*#__PURE__*/_react["default"].createElement(_icons.MissionObjective, {
      style: {
        marginRight: "12px"
      }
    }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
      style: {
        height: "fit-content"
      }
    }, assignedMission.name))), /*#__PURE__*/_react["default"].createElement(MCWAccordionDetails, null, /*#__PURE__*/_react["default"].createElement(_material.List, null, (0, _map["default"])(_context = assignedMission.waypoints).call(_context, function (waypoint, index) {
      var waypointIcon = waypoint.reached ? /*#__PURE__*/_react["default"].createElement(_icons.WaypointGreen, null) : /*#__PURE__*/_react["default"].createElement(_icons.WaypointGray, null);
      var nextWaypoint = assignedMission.waypoints[index + 1];
      var nextWaypointReached = nextWaypoint ? nextWaypoint.reached : false;
      var connectingLine = nextWaypoint ? nextWaypointReached ? "solid" : "dashed" : null;
      return /*#__PURE__*/_react["default"].createElement(MCWListItem, {
        key: index
      }, /*#__PURE__*/_react["default"].createElement(_SharedComponents.TargetingIcon, {
        geometry: waypoint.geometry
      }), /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "waypoint-icon"
      }, waypointIcon, connectingLine && /*#__PURE__*/_react["default"].createElement("div", {
        className: "vl ".concat(connectingLine)
      }))), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
        style: dir == "rtl" ? {
          textAlign: "right",
          padding: 0
        } : {
          padding: 0
        },
        primary: index === 0 ? (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.waypointStatic") : (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.waypointDynamic", index + 1)
      }));
    }))))) : null;
  }, [details.assignedMission.name, details.assignedMission.waypoints]);
  return /*#__PURE__*/_react["default"].createElement(_shared.BaseWidget, {
    enabled: enabled,
    order: order,
    title: (0, _i18n.getTranslation)("global.profiles.widgets.missionControl.missionControl"),
    dir: dir
  }, getStatusPanel(), getMissionData());
};
MissionControlWidget.propTypes = propTypes;
var _default = MissionControlWidget;
exports["default"] = _default;