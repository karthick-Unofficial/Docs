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
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _i18n = require("orion-components/i18n");
var _filter = _interopRequireDefault(require("lodash/filter"));
var _includes = _interopRequireDefault(require("lodash/includes"));
var _find = _interopRequireDefault(require("lodash/find"));
var _size = _interopRequireDefault(require("lodash/size"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  users: _propTypes["default"].array,
  locations: _propTypes["default"].array,
  groups: _propTypes["default"].array,
  departments: _propTypes["default"].array,
  districts: _propTypes["default"].array,
  settings: _propTypes["default"].object.isRequired,
  zones: _propTypes["default"].array
};
var defaultProps = {
  users: [],
  locations: [],
  groups: [],
  departments: [],
  districts: [],
  zones: []
};
var ProfileView = function ProfileView(_ref) {
  var users = _ref.users,
    locations = _ref.locations,
    groups = _ref.groups,
    departments = _ref.departments,
    districts = _ref.districts,
    settings = _ref.settings,
    zones = _ref.zones;
  var points_of_contact = settings.points_of_contact,
    location_id = settings.location_id,
    audience_individuals = settings.audience_individuals,
    audience_districts = settings.audience_districts,
    audience_departments = settings.audience_departments,
    audience_groups = settings.audience_groups,
    shareToCMS = settings.shareToCMS,
    limited_to_audience = settings.limited_to_audience,
    recurring_notification = settings.recurring_notification,
    push_disabled = settings.push_disabled,
    shape_id = settings.shape_id,
    threadId = settings.threadId;

  // Grab display info from data based on values from settings
  var pOContact = (0, _filter["default"])(users, function (contact) {
    return (0, _includes["default"])(points_of_contact, contact.id);
  });
  var pDLocation = (0, _find["default"])(locations, ["id", location_id]);
  var aIndividuals = (0, _filter["default"])(users, function (individual) {
    return (0, _includes["default"])(audience_individuals, individual.id);
  });
  var aDistricts = (0, _filter["default"])(districts, function (district) {
    return (0, _includes["default"])(audience_districts, district.id);
  });
  var aDepartments = (0, _filter["default"])(departments, function (department) {
    return (0, _includes["default"])(audience_departments, department.id);
  });
  var aGroups = (0, _filter["default"])(groups, function (group) {
    return (0, _includes["default"])(audience_groups, group.id);
  });
  var bZone = (0, _find["default"])(zones, ["id", shape_id]);
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    justify: "space-between",
    spacing: 16
  }, threadId && /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.threadId"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body1"
  }, threadId)), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.sharedToCMS"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body1"
  }, shareToCMS ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.yes"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.no"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 12
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.NestedList, {
    items: pOContact,
    header: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.profileView.pointsOfContact", (0, _size["default"])(pOContact)),
    dense: true,
    inset: false,
    headerStyle: {
      variant: "caption",
      color: "rgba(255,255,255, 0.7)"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 6
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.predefinedLocation"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body1"
  }, pDLocation ? pDLocation.name : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.none"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 6
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.bulletinZone"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body1"
  }, bZone ? bZone.name : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.none"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 6
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.visibleToAll"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body1"
  }, !limited_to_audience ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.yes"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.no"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 6
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.notifyOnEntry"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body1"
  }, recurring_notification ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.yes"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.no"
  }))), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 6
  }, /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "caption"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.disableNotifications"
  })), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body1"
  }, push_disabled ? /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.yes"
  }) : /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.no"
  })))), /*#__PURE__*/_react["default"].createElement(_material.Divider, {
    style: {
      margin: "6px 0"
    }
  }), /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "h6",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.shieldGroup.profileView.audiences"
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    container: true,
    justify: "space-between",
    spacing: 16
  }, /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 12
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.NestedList, {
    items: aGroups,
    header: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.profileView.groups", (0, _size["default"])(aGroups)),
    dense: true,
    inset: false,
    headerStyle: {
      variant: "caption",
      color: "rgba(255,255,255, 0.7)"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 12
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.NestedList, {
    items: aDistricts,
    header: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.profileView.districts", (0, _size["default"])(aDistricts)),
    dense: true,
    inset: false,
    headerStyle: {
      variant: "caption",
      color: "rgba(255,255,255, 0.7)"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 12
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.NestedList, {
    items: aDepartments,
    header: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.profileView.departments", (0, _size["default"])(aDepartments)),
    dense: true,
    inset: false,
    headerStyle: {
      variant: "caption",
      color: "rgba(255,255,255, 0.7)"
    }
  })), /*#__PURE__*/_react["default"].createElement(_material.Grid, {
    item: true,
    sm: 12
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.NestedList, {
    items: aIndividuals,
    header: (0, _i18n.getTranslation)("global.profiles.widgets.shieldGroup.profileView.individuals", (0, _size["default"])(aIndividuals)),
    dense: true,
    inset: false,
    headerStyle: {
      variant: "caption",
      color: "rgba(255,255,255, 0.7)"
    }
  }))));
};
ProfileView.propTypes = propTypes;
ProfileView.defaultProps = defaultProps;
var _default = ProfileView;
exports["default"] = _default;