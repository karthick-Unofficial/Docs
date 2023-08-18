"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _i18n = require("orion-components/i18n");
var getButtons = function getButtons(user, context, appId, actions, readOnly) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8;
  var applications = user.applications;
  var entity = context.entity,
    trackHistory = context.trackHistory;
  var isPublic = entity.isPublic,
    entityType = entity.entityType,
    fov = entity.fov,
    activeFOV = entity.activeFOV,
    entityData = entity.entityData,
    sharedWith = entity.sharedWith;
  var hasReports = (0, _find["default"])(applications).call(applications, function (app) {
    return app.appId === "reports-app";
  });
  switch (entityType) {
    case "track":
      return [{
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.trackHistory"),
        icon: "history",
        toggled: !!trackHistory,
        viewable: true
      }, {
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.tetraRadioCall"),
        // "Zetron Call"
        icon: "phone",
        toggled: false,
        viewable: user.zetronSystemAvailable || false
      }, {
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.pinTo"),
        icon: "star",
        toggled: false,
        viewable: !readOnly
      }, {
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.hide"),
        icon: "delete",
        toggled: false,
        viewable: !readOnly
      }];
    case "shapes":
      return [{
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.pinTo"),
        icon: "star",
        toggled: false,
        viewable: !readOnly
      }, {
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.edit"),
        icon: "edit",
        toggled: false,
        viewable: !readOnly && appId !== "cameras-app" && user.integrations && (0, _find["default"])(_context = user.integrations).call(_context, function (_int) {
          return _int.intId === entity.feedId;
        }) && (0, _find["default"])(_context2 = user.integrations).call(_context2, function (_int2) {
          return _int2.intId === entity.feedId;
        }).permissions && (0, _includes["default"])(_context3 = (0, _find["default"])(_context4 = user.integrations).call(_context4, function (_int3) {
          return _int3.intId === entity.feedId;
        }).permissions).call(_context3, "manage")
      }, {
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.delete"),
        icon: "delete",
        toggled: false,
        viewable: !readOnly && user.integrations && (0, _find["default"])(_context5 = user.integrations).call(_context5, function (_int4) {
          return _int4.intId === entity.feedId;
        }) && (0, _find["default"])(_context6 = user.integrations).call(_context6, function (_int5) {
          return _int5.intId === entity.feedId;
        }).permissions && (0, _includes["default"])(_context7 = (0, _find["default"])(_context8 = user.integrations).call(_context8, function (_int6) {
          return _int6.intId === entity.feedId;
        }).permissions).call(_context7, "manage")
      }, {
        name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.hide"),
        icon: "delete",
        toggled: false,
        viewable: !readOnly && isPublic
      }];
    case "camera":
      {
        var _context9, _context10, _context11, _context12, _context13;
        var buttons = [];
        if (appId && appId.toLowerCase() === "cameras-app") {
          var facilityHidden = true;
          (0, _some["default"])(actions).call(actions, function (action) {
            if (action.nameText.toLowerCase() === "facility") {
              facilityHidden = false;
              return true;
            } else {
              return false;
            }
          });
          buttons.push({
            name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.facility"),
            viewable: !readOnly && entityData.displayType && entityData.displayType.toLowerCase() === "facility" && entityData.displayTargetId,
            icon: "homework",
            disabled: facilityHidden
          });
        }
        return (0, _concat["default"])(_context9 = []).call(_context9, buttons, [{
          name: activeFOV ? (0, _i18n.getTranslation)("global.profiles.cameraProfile.hideFOV") : (0, _i18n.getTranslation)("global.profiles.cameraProfile.showFOV"),
          icon: "network_wifi",
          toggled: activeFOV,
          viewable: fov && activeFOV !== undefined
        }, {
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.pinTo"),
          icon: "star",
          toggled: false,
          viewable: !readOnly
        }, {
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.edit"),
          icon: "edit",
          toggled: false,
          viewable: !readOnly && user.integrations && (0, _find["default"])(_context10 = user.integrations).call(_context10, function (_int7) {
            return _int7.intId === entity.feedId;
          }) && (0, _find["default"])(_context11 = user.integrations).call(_context11, function (_int8) {
            return _int8.intId === entity.feedId;
          }).permissions && (0, _includes["default"])(_context12 = (0, _find["default"])(_context13 = user.integrations).call(_context13, function (_int9) {
            return _int9.intId === entity.feedId;
          }).permissions).call(_context12, "manage")
        }, {
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.hide"),
          icon: "delete",
          toggled: false,
          viewable: !readOnly
        }]);
      }
    case "accessPoint":
    case "Access Point":
    case "AccessPoint":
      {
        var _context14, _context15, _context16, _context17, _context18;
        var _buttons = [];
        if (appId && appId.toLowerCase() === "cameras-app") {
          var _facilityHidden = true;
          (0, _some["default"])(actions).call(actions, function (action) {
            if (action.nameText.toLowerCase() === "facility") {
              _facilityHidden = false;
              return true;
            } else {
              return false;
            }
          });
          _buttons.push({
            name: (0, _i18n.getTranslation)("global.profiles.cameraProfile.facility"),
            viewable: !readOnly && entityData.displayType && entityData.displayType.toLowerCase() === "facility" && entityData.displayTargetId,
            icon: "homework",
            disabled: _facilityHidden
          });
        }
        return (0, _concat["default"])(_context14 = []).call(_context14, _buttons, [{
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.pinTo"),
          icon: "star",
          toggled: false,
          viewable: !readOnly
        }, {
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.edit"),
          icon: "edit",
          toggled: false,
          viewable: !readOnly && user.integrations && (0, _find["default"])(_context15 = user.integrations).call(_context15, function (_int10) {
            return _int10.intId === entity.feedId;
          }) && (0, _find["default"])(_context16 = user.integrations).call(_context16, function (_int11) {
            return _int11.intId === entity.feedId;
          }).permissions && (0, _includes["default"])(_context17 = (0, _find["default"])(_context18 = user.integrations).call(_context18, function (_int12) {
            return _int12.intId === entity.feedId;
          }).permissions).call(_context17, "manage")
        }, {
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.hide"),
          icon: "delete",
          toggled: false,
          viewable: !readOnly
        }]);
      }
    case "event":
      {
        var _context19, _context20, _context21, _context22, _context23, _context24, _context25, _context26;
        var canManageEvents = user.applications && (0, _find["default"])(_context19 = user.applications).call(_context19, function (app) {
          return app.appId === "events-app";
        }) && (0, _find["default"])(_context20 = user.applications).call(_context20, function (app) {
          return app.appId === "events-app";
        }).permissions && (0, _includes["default"])(_context21 = (0, _find["default"])(_context22 = user.applications).call(_context22, function (app) {
          return app.appId === "events-app";
        }).permissions).call(_context21, "manage");
        var canShareEvents = user.applications && (0, _find["default"])(_context23 = user.applications).call(_context23, function (app) {
          return app.appId === "events-app";
        }) && (0, _find["default"])(_context24 = user.applications).call(_context24, function (app) {
          return app.appId === "events-app";
        }).permissions && (0, _includes["default"])(_context25 = (0, _find["default"])(_context26 = user.applications).call(_context26, function (app) {
          return app.appId === "events-app";
        }).permissions).call(_context25, "share");
        return [{
          name: (0, _i18n.getTranslation)("global.profiles.eventProfile.main.report"),
          icon: "description",
          toggled: false,
          viewable: !readOnly && hasReports
        }, {
          name: isPublic && !canShareEvents ? (0, _i18n.getTranslation)("global.profiles.eventProfile.main.shared") : (0, _i18n.getTranslation)("global.profiles.eventProfile.main.share"),
          icon: "share",
          toggled: sharedWith.length > 0,
          disabled: isPublic && !canShareEvents,
          viewable: !readOnly && canShareEvents
        }, {
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.edit"),
          icon: "edit",
          toggled: false,
          viewable: !readOnly && canManageEvents
        }, {
          name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.delete"),
          icon: "delete",
          toggled: false,
          viewable: !readOnly && entity.ownerOrg === user.orgId && canManageEvents
        }];
      }
    case "facility":
      {
        var _buttons2 = (0, _map["default"])(actions).call(actions, function (action) {
          var _context27, _context28, _context29, _context30;
          switch (action.nameText.toLowerCase()) {
            case "edit":
              return {
                name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.edit"),
                icon: "edit",
                toggled: false,
                viewable: !readOnly && user.integrations && (0, _find["default"])(_context27 = user.integrations).call(_context27, function (_int13) {
                  return _int13.intId === entity.feedId;
                }) && (0, _find["default"])(_context28 = user.integrations).call(_context28, function (_int14) {
                  return _int14.intId === entity.feedId;
                }).permissions && (0, _includes["default"])(_context29 = (0, _find["default"])(_context30 = user.integrations).call(_context30, function (_int15) {
                  return _int15.intId === entity.feedId;
                }).permissions).call(_context29, "manage")
              };
            case "hide":
              return {
                name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.hide"),
                icon: "delete",
                toggled: false,
                viewable: !readOnly
              };
            case "pin to":
              {
                return {
                  name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.pinTo"),
                  icon: "star",
                  toggled: false,
                  viewable: !readOnly
                };
              }
            case "delete":
              {
                return {
                  name: (0, _i18n.getTranslation)("global.profiles.entityProfile.main.delete"),
                  icon: "delete",
                  toggled: false,
                  viewable: !readOnly
                };
              }
            default:
              break;
          }
        });
        return _buttons2;
      }
    default:
      break;
  }
};
var _default = getButtons;
exports["default"] = _default;